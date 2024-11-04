import { type NostrEvent, nip19, nip57, finalizeEvent, generateSecretKey, SimplePool, type EventTemplate, type Filter } from "nostr-tools";
import type { SubCloser } from "nostr-tools/abstract-pool";

export const decodeNpub = (npub: string): string => nip19.decode(npub).data;

const decodeNoteId = (noteId: string): string => nip19.decode(noteId).data;

interface ProfileMetadata {
  content: string;
  [key: string]: any;
}

const cachedProfileMetadata: Record<string, ProfileMetadata> = {};

export const getProfileMetadata = async (authorId: string): Promise<ProfileMetadata> => {
  if (cachedProfileMetadata[authorId]) {
    return cachedProfileMetadata[authorId];
  }

  const pool = new SimplePool();
  const relays = [
    "wss://relay.nostr.band",
    "wss://purplepag.es",
    "wss://user.kindpag.es",
    "wss://relay.damus.io",
    "wss://nostr.wine",
  ];

  try {
    const filter: Filter = {
      authors: [authorId],
      kinds: [0],
      limit: 1
    };
    console.log(`filter`, filter)
    const metadata = await pool.get(relays, filter);
    if(metadata){
      cachedProfileMetadata[authorId] = metadata;
    }
    return metadata as ProfileMetadata;
  } catch (error: any) {
    throw new Error("Failed to fetch user profile :(");
  } finally {
    pool.close(relays);
  }
};

export const extractProfileMetadataContent = (profileMetadata: ProfileMetadata): any =>
  JSON.parse(profileMetadata.content);

export const getZapEndpoint = async (profileMetadata: ProfileMetadata): Promise<string> => {
  const zapEndpoint = await nip57.getZapEndpoint(profileMetadata as NostrEvent);

  if (!zapEndpoint) {
    throw new Error("Failed to retrieve zap endpoint :(");
  }

  return zapEndpoint;
};

const signEvent = async (zapEvent: EventTemplate, anon: boolean): Promise<EventTemplate> => {
  if (isNipO7ExtAvailable() && !anon) {
    try {
      return await (window as any).nostr.signEvent(zapEvent);
    } catch (e) {
      console.warn("Failed to sign event with Nostr extension", e);
    }
  }

  return finalizeEvent(zapEvent, generateSecretKey());
};

interface MakeZapEventParams {
  profile: string;
  amount: number;
  relays: string[];
  anon: boolean;
  event: string | null;
  comment: string;
}

const makeZapEvent = async ({
  profile,
  event,
  amount,
  relays,
  comment,
  anon,
}: MakeZapEventParams): Promise<ZapEvent> => {
  const zapEvent: EventTemplate = nip57.makeZapRequest({
    profile,
    event,
    amount,
    relays,
    comment,
  });

  if (!isNipO7ExtAvailable() || anon) {
    zapEvent.tags.push(["anon"]);
  }

  return signEvent(zapEvent, anon);
};

interface FetchInvoiceParams {
  zapEndpoint: string;
  amount: number;
  comment?: string;
  authorId: string;
  noteId?: string;
  normalizedRelays: string[];
  anon: boolean;
}

export const fetchInvoice = async ({
  zapEndpoint,
  amount,
  comment,
  authorId,
  noteId,
  normalizedRelays,
  anon,
}: FetchInvoiceParams): Promise<string> => {
  const zapEvent = await makeZapEvent({
    profile: authorId,
    event: noteId ? decodeNoteId(noteId) : null,
    amount,
    relays: normalizedRelays,
    comment: '',
    anon,
  });
  
  let url = `${zapEndpoint}?amount=${amount}&nostr=${encodeURIComponent(JSON.stringify(zapEvent))}`;

  if (comment) {
    url = `${url}&comment=${encodeURIComponent(comment)}`;
  }

  const res = await fetch(url);

  const { pr: invoice, reason, status } = await res.json();

  if (invoice) {
    return invoice;
  } else if (status === "ERROR") {
    throw new Error(reason ?? "Unable to fetch invoice");
  } else {
    throw new Error("Unable to fetch invoice");
  }
  
};

export const isNipO7ExtAvailable = (): boolean => {
  return typeof window !== "undefined" && typeof (window as any).nostr !== "undefined";
};

interface ListenForZapReceiptParams {
  relays: string[];
  invoice: string;
  onSuccess: () => void;
}

export const listenForZapReceipt = ({ relays, invoice, onSuccess }: ListenForZapReceiptParams): () => void => {
  const pool = new SimplePool();
  const normalizedRelays = Array.from(new Set([...relays, "wss://relay.nostr.band"].map(relay => new URL(relay).toString())));

  const since = Math.round(Date.now() / 1000);

  const filters: Filter[] = [
    {
      kinds: [9735],
      since,
    }
  ]

  const handler: SubCloser = pool.subscribeMany(
    normalizedRelays, 
    filters,
    {
      onevent(event: NostrEvent){
        if (event.tags.find((t) => t[0] === "bolt11" && t[1] === invoice)) {
          onSuccess();
          handler.close()
        }
      }
    }
  );

  return () => {
    handler.close();
  };
};
