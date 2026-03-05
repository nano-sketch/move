<script lang="ts">
  /**
   * 1:1 framer background effect replicated
   * explicitly matching landin.framer.website moving blue glow
   */
</script>

<div class="bg-container">
  <div class="video-wrapper">
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
      src="https://framerusercontent.com/assets/x63grw3MJJK8pzlD0qnG8C0qVfs.mp4"
      loop
      autoplay
      muted
      playsinline
    ></video>
  </div>
  <div class="blur-overlay"></div>
  <div class="bottom-shadow"></div>
</div>

<style>
  .bg-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -999;
    overflow: hidden;
    pointer-events: none;
    background-color: #000000;
  }
  .video-wrapper {
    position: absolute;
    inset: 0;
    z-index: 1;
  }
  .video-wrapper video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .blur-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
  }
  .bottom-shadow {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 180px;
    z-index: 7;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #000000 100%);
  }
</style>
