<script lang="ts">
  import { decode, type ProfilePointer } from 'nostr-tools/nip19';
  import { queryProfile } from 'nostr-tools/nip05';
  import ZapPage from '../../components/ZapPage.svelte';
	import { onMount } from 'svelte';

  export let data;

  const REGEX_BECH32 = /\b(bc|tb|ltc|bcrt|bc1|tb1|ltc1|bcrt1)[02-9ac-hj-z]{6,}\b/;
  const slug = data.slug;
  let noteId: string | undefined = undefined;
  let relays: string = 'wss://nostr.mutinywallet.com';
  let buttonColor: string = '#7f00ff';
  let anon: boolean = false;

  let pubkey: string = '';

  const getPubkey = async () => {
    if(slug.startsWith('nprofile') || slug.startsWith('npub')) {
      
      const { type, data } = decode(slug)
      console.log(type, data)
      const pointer = data as ProfilePointer
      console.log(pointer)
      pubkey = pointer.pubkey;
      console.log(pubkey)
    } 
    else if(slug.includes('@')) {
      const data = await queryProfile(slug);
      const pointer = data as ProfilePointer
      pubkey = pointer?.pubkey;
    } 
    else {
      pubkey = slug
    }
  }

  const validatePubkey = (pubkey: string) => {
    if (REGEX_BECH32.test(pubkey)) {
      console.log("Valid Bech32 address");
    } else {
        console.log("Invalid Bech32 address");
    }
  }

  onMount(async () => {
    await getPubkey();
    validatePubkey(pubkey);
  });

</script>

{#if pubkey}
  <ZapPage
    {pubkey}
    {noteId}
    {relays}
    {buttonColor}
    {anon}
  />
{:else}
  <p>loading</p>
{/if}
<style>
  /* Page-specific styles */
</style>
