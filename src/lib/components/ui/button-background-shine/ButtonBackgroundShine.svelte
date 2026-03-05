<script lang="ts">
  export let text: string = "Button";
</script>

<button
  class="inline-flex animate-shine items-center justify-center rounded-full text-sm border-2 border-primary bg-[linear-gradient(110deg,rgba(14,165,233,0.25),45%,rgba(14,165,233,0.45),55%,rgba(14,165,233,0.25))] bg-[length:200%_100%] px-6 py-2 font-semibold text-white transition-all hover:border-primary/80 hover:shadow-lg hover:shadow-primary/30"
  {...$$restProps}
>
  <slot>{text}</slot>
</button>



