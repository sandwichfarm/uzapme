<script lang="ts">
  import { onMount } from 'svelte';
  import QRCode from 'easyqrcodejs';
  import { getContrastingTextColor } from '../lib/utils/helpers.js';

  export let invoice: string;
  export let profileContent: ProfileContent;
  export let buttonColor: string = '#7f00ff';
  export let pubkey: string;

  let selectedWallet = 'lightning:';
  let overlayVisible = false;

  const lightningWallets = [
    { label: "Default Wallet", value: "lightning:" },
    { label: "Zeus LN", value: "zeusln:lightning:" },
    { label: "Strike", value: "strike:lightning:" },
    { label: "Cash App", value: "https://cash.app/launch/lightning/" },
    { label: "Wallet of Satoshi", value: "walletofsatoshi:lightning:" },
    { label: "Muun", value: "muun:" },
    { label: "Blue Wallet", value: "bluewallet:lightning:" },
    { label: "Zebedee", value: "zebedee:lightning:" },
    { label: "Phoenix", value: "phoenix://" },
    { label: "Breez", value: "breez:" },
    { label: "Bitcoin Beach", value: "bitcoinbeach://" },
    { label: "Blixt", value: "blixtwallet:lightning:" },
    { label: "River", value: "river://" },
  ];

  let qrCodeEl: any;

  onMount(() => {
    new QRCode(qrCodeEl, { text: invoice });
  });

  const handleQRCodeClick = () => {
    navigator.clipboard.writeText(invoice);
    overlayVisible = true;
    setTimeout(() => (overlayVisible = false), 2000);
  };

  const handleOpenWallet = () => {
    window.location.href = `${selectedWallet}${invoice}`;
  };
</script>

<div class="invoice-display-container">
  <div class="profile-header">
    <img src="{profileContent.picture}" alt="Profile Picture" width="80" height="80" />
    <h2>{profileContent.display_name || profileContent.name}</h2>
    <p>{pubkey}</p>
  </div>

  <div class="qrcode-container" on:click={handleQRCodeClick}>
    <div bind:this={qrCodeEl}></div>
    {#if overlayVisible}
      <div class="overlay">Copied invoice to clipboard</div>
    {/if}
  </div>
  <p>Click QR code to copy invoice</p>

  <select bind:value={selectedWallet}>
    {#each lightningWallets as wallet}
      <option value="{wallet.value}">{wallet.label}</option>
    {/each}
  </select>

  <button
    class="cta-button"
    on:click={handleOpenWallet}
    style="background-color: {buttonColor}; color: {getContrastingTextColor(buttonColor)}"
  >
    Open Wallet
  </button>
</div>

<style>
  /* Component-specific styles */
</style>
