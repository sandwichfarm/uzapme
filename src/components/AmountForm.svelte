<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ProfileContent } from '../types';
	import { getContrastingTextColor } from '$lib/utils/helpers';

  export let pubkey: string;
  export let profileContent: ProfileContent | null = null;
  export let buttonColor: string = '#7f00ff';

  const dispatch = createEventDispatcher();
  let amount: number | null = null;
  let comment: string = '';

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (amount && amount > 0) {
      dispatch('submit', { amount, comment });
    }
  };
</script>

<div class="amount-form-container">
  {#if profileContent}
    <div class="profile-header">
      <img src="{profileContent.picture}" alt="Profile Picture" width="80" height="80" />
      <h2>{profileContent.display_name || profileContent.name}</h2>
      <p>{pubkey}</p>
    </div>
  {:else}
    <div class="profile-header skeleton">
      <!-- Skeleton placeholders -->
    </div>
  {/if}

  <div class="preset-zap-options-container">
    <button on:click={() => (amount = 21)}>21 ⚡️</button>
    <button on:click={() => (amount = 69)}>69 ⚡️</button>
    <button on:click={() => (amount = 420)}>420 ⚡️</button>
    <!-- Add more preset buttons as needed -->
  </div>

  <form on:submit={handleSubmit}>
    <input
      bind:value={amount}
      type="number"
      placeholder="Amount in sats"
      required
      min="1"
    />
    <input
      bind:value={comment}
      placeholder="Optional comment"
    />
    <button
      type="submit"
      class="cta-button"
      style="background-color: {buttonColor}; color: {getContrastingTextColor(buttonColor)}"
    >
      Zap
    </button>
  </form>
</div>

<style>
  /* Component-specific styles */
</style>
