<script>
  import { onMount } from "svelte";

  let canvas, ctx, img, imgData;
  let width = 0,
    height = 0;
  let animationId;
  let coverColor = "#000000"; // chosen from input

  const speed = 30;
  const fadeDuration = 100;
  const mode = "scanline"; // "scanline" | "random"

  let revealOrder = [],
    progress = 0,
    fadingPixels = [];
  let { image_urls } = $props();

  function prepareReveal() {
    revealOrder = [];
    if (!imgData) return;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) revealOrder.push({ x, y });
    }
    if (mode === "random") {
      for (let i = revealOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [revealOrder[i], revealOrder[j]] = [revealOrder[j], revealOrder[i]];
      }
    }
    progress = 0;
    fadingPixels = [];
  }

  function revealStep() {
    const frame = ctx.getImageData(0, 0, width, height);

    if (mode === "scanline") {
      for (let i = 0; i < speed && progress < revealOrder.length; i++) {
        const { x, y } = revealOrder[progress++];
        const idx = (y * width + x) * 4;
        frame.data.set(imgData.data.slice(idx, idx + 4), idx);
      }
    } else {
      let started = 0;
      while (progress < revealOrder.length && started++ < speed) {
        const { x, y } = revealOrder[progress++];
        fadingPixels.push({ x, y, start: performance.now() });
      }
      fadingPixels = fadingPixels.filter(({ x, y, start }) => {
        const alpha = Math.min(1, (performance.now() - start) / fadeDuration);
        const idx = (y * width + x) * 4;
        frame.data[idx] = imgData.data[idx] * alpha;
        frame.data[idx + 1] = imgData.data[idx + 1] * alpha;
        frame.data[idx + 2] = imgData.data[idx + 2] * alpha;
        frame.data[idx + 3] = imgData.data[idx + 3];
        return alpha < 1;
      });
    }

    ctx.putImageData(frame, 0, 0);
    if (progress < revealOrder.length || fadingPixels.length)
      animationId = requestAnimationFrame(revealStep);
  }

  function startReveal() {
    if (animationId) cancelAnimationFrame(animationId);
    ctx.fillStyle = coverColor;
    ctx.fillRect(0, 0, width, height);
    prepareReveal();
    animationId = requestAnimationFrame(revealStep);
  }

  function loadImage() {
    img = new Image();
    img.src = image_urls[Math.floor(Math.random() * image_urls.length)];
    img.onload = () => {
      width = img.width;
      height = img.height;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      imgData = ctx.getImageData(0, 0, width, height);
      startReveal();
    };
  }

  onMount(() => {
    canvas = document.getElementById("revealCanvas");
    ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.imageSmoothingEnabled = false;
  });
</script>

<div class="flex flex-col gap-2 h-full w-full items-center">
  <input type="color" bind:value={coverColor} on:input={loadImage} />
  <canvas
    id="revealCanvas"
    class="border rounded shadow h-full max-w-full"
    style="image-rendering: pixelated;"
  />
</div>
