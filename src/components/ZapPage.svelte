<script lang="ts">
  import { onMount } from 'svelte';
  import AmountForm from './AmountForm.svelte';
  import InvoiceDisplay from './InvoiceDisplay.svelte';
  import ErrorDisplay from './ErrorDisplay.svelte';
  import { getProfileMetadata, extractProfileMetadataContent, getZapEndpoint, fetchInvoice } from '../lib/utils/nostr.js';
	import type { ProfileContent } from '../types';

  export let pubkey: string;
  export let noteId: string | undefined = undefined;
  export let relays: string = 'wss://nostr.mutinywallet.com';
  export let buttonColor: string = '#7f00ff';
  export let anon: boolean = false;

  let step: 'amount' | 'invoice' | 'error' = 'amount';
  let profileContent: ProfileContent;
  let invoice: string = '';
  let errorMessage: string = '';

  // Fetch profile metadata on mount
  onMount(async () => {
    try {
      const authorId = pubkey;
      const metadata = await getProfileMetadata(authorId);
      profileContent = extractProfileMetadataContent(metadata);
    } catch (error: any) {
      errorMessage = error?.message ?? 'Failed to load profile.';
      step = 'error';
    }
  });

  const handleAmountSubmit = async (event: CustomEvent<{ amount: number; comment: string }>) => {
    console.log(event)
    const { amount, comment } = event.detail;
    try {
      // Fetch the zap endpoint and invoice
      const authorId = pubkey;
      const metadata = await getProfileMetadata(authorId);
      const zapEndpoint = await getZapEndpoint(metadata);
      const normalizedRelays = relays ? relays.split(',') : ['wss://nostr.mutinywallet.com'];

      invoice = await fetchInvoice({
        zapEndpoint,
        amount: amount * 1000, // Convert sats to msats
        comment,
        authorId,
        noteId,
        normalizedRelays,
        anon,
      });

      if ((window as any).webln) {
        try {
          await (window as any).webln.enable();
          await (window as any).webln.sendPayment(invoice);
        } catch (e) {
          step = 'invoice';
        }
      } else {
        step = 'invoice';
      }
    } catch (error: any) {
      errorMessage = error.message || 'Failed to fetch invoice.';
      step = 'error';
    }
  };
</script>

{#if step === 'amount'}
  <AmountForm
    {profileContent}
    on:submit={handleAmountSubmit}
    {buttonColor}
    {pubkey}
  />
{:else if step === 'invoice'}
  <InvoiceDisplay
    {invoice}
    {profileContent}
    {buttonColor}
    {pubkey}
  />
{:else if step === 'error'}
  <ErrorDisplay {errorMessage} {pubkey} />
{/if}

<style>
  /* Component-specific styles */
</style>
