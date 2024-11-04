<script lang="ts">
  export let errorMessage: string;
  export let pubkey: string;
</script>

<div class="error-display-container">
  <p class="error-message">{errorMessage}</p>
  <a href="https://nosta.me/{pubkey}" target="_blank">
    <button class="cta-button">View Nostr Profile</button>
  </a>
</div>

<style>
  .error-message {
    color: red;
  }
  /* Additional styles */
</style>
