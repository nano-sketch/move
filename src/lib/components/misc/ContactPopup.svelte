<script lang="ts">
  import { cn } from "$lib/utils";
  import { Input, Label, TextArea } from "$lib/components/ui/signup-form";
  import { X } from "lucide-svelte";
  import { fade, scale } from "svelte/transition";
  import { currentLang, translations } from "$lib/i18n";

  let { isOpen = $bindable(false) } = $props();

  let formData = $state({
    name: "",
    businessName: "",
    budget: "",
    email: "",
    phone: "",
    info: "",
  });

  let isSubmitting = $state(false);
  let isSuccess = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    isSubmitting = true;

    try {
      const response = await fetch("https://formspree.io/f/mvzbapad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          "CLIENT NAME": formData.name,
          COMPANY: formData.businessName,
          "PROJECT BUDGET": formData.budget,
          "CLIENT EMAIL": formData.email || "Not Provided",
          "CLIENT PHONE": formData.phone,
          "PROJECT DETAILS": formData.info,
        }),
      });

      if (response.ok) {
        isSubmitting = false;
        isSuccess = true;
        setTimeout(() => {
          if (isSuccess) {
            isOpen = false;
            isSuccess = false;
            formData = {
              name: "",
              businessName: "",
              budget: "",
              email: "",
              phone: "",
              info: "",
            };
          }
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error("Formspree error:", errorData);
        isSubmitting = false;
      }
    } catch (err) {
      console.error("Submission error:", err);
      isSubmitting = false;
    }
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-[300] grid place-items-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    transition:fade={{ duration: 200 }}
    onclick={() => (isOpen = false)}
  >
    <div
      class="relative w-full max-w-lg my-auto rounded-3xl border border-border/50 bg-card p-7 shadow-2xl md:p-10"
      transition:scale={{ duration: 300, start: 0.95 }}
      onclick={(e) => e.stopPropagation()}
    >
      <!-- close button -->
      <button
        class="absolute right-6 top-6 p-2 rounded-full hover:bg-muted transition-colors"
        onclick={() => (isOpen = false)}
      >
        <X class="size-5" />
      </button>

      {#if !isSuccess}
        {@const t = translations[$currentLang.code] || translations.en}
        <div class="space-y-2 select-none">
          <h2 class="text-2xl font-black tracking-tighter uppercase italic">
            {t.get_started_title}
          </h2>
          <p class="text-sm text-muted-foreground">
            {t.get_started_desc}
          </p>
        </div>

        <form class="mt-8 space-y-4" onsubmit={handleSubmit}>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="name" class="select-none">{t.form_name}</Label>
              <Input
                id="name"
                bind:value={formData.name}
                placeholder={t.placeholder_name}
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="business" class="select-none">{t.form_business}</Label
              >
              <Input
                id="business"
                bind:value={formData.businessName}
                placeholder={t.placeholder_business}
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="budget" class="select-none">{t.form_budget}</Label>
              <Input
                id="budget"
                bind:value={formData.budget}
                placeholder={t.placeholder_budget}
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="phone" class="select-none">{t.form_phone}</Label>
              <Input
                id="phone"
                bind:value={formData.phone}
                placeholder={t.placeholder_phone}
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="email" class="select-none">{t.form_email}</Label>
            <Input
              id="email"
              type="email"
              bind:value={formData.email}
              placeholder={t.placeholder_email}
            />
          </div>

          <div class="space-y-2">
            <Label for="info" class="select-none">{t.form_info}</Label>
            <TextArea
              id="info"
              bind:value={formData.info}
              placeholder={t.placeholder_info}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            class="group/btn relative block h-12 w-full rounded-2xl bg-primary font-black text-primary-foreground shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
          >
            {isSubmitting ? t.form_sending : t.form_submit + " &rarr;"}
            <span
              class="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100"
            ></span>
            <span
              class="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-primary-foreground/40 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100"
            ></span>
          </button>
        </form>
      {:else}
        <div
          class="flex flex-col items-center justify-center py-20 text-center space-y-4"
          in:fade
        >
          <div
            class="size-16 rounded-full bg-primary/20 flex items-center justify-center mb-4"
          >
            <div class="size-8 rounded-full bg-primary animate-pulse"></div>
          </div>
          <h2
            class="text-3xl font-black tracking-tighter uppercase underline decoration-primary underline-offset-8"
          >
            {translations[$currentLang.code].form_success_title}
          </h2>
          <p class="text-muted-foreground text-sm max-w-xs mx-auto">
            {translations[$currentLang.code].form_success_desc}
          </p>
        </div>
      {/if}
    </div>
  </div>
{/if}
