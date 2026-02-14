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
      const response = await fetch("https://formspree.io/f/xbdaodov", {
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
        console.error("formspree error:", errorData);
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
      class="relative w-full max-w-lg my-auto rounded-3xl border border-border/50 bg-card p-4 shadow-2xl md:p-10"
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
        <div class="space-y-1 select-none md:space-y-2">
          <h2
            class="text-xl font-black tracking-tighter uppercase italic md:text-2xl"
          >
            {t.get_started_title}
          </h2>
          <p class="text-[13px] text-muted-foreground md:text-sm">
            {t.get_started_desc}
          </p>
        </div>

        <form
          class="mt-4 space-y-2.5 md:mt-8 md:space-y-4"
          onsubmit={handleSubmit}
        >
          <div class="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4">
            <div class="space-y-1.5 md:space-y-2">
              <Label for="name" class="select-none">{t.form_name}</Label>
              <Input
                id="name"
                bind:value={formData.name}
                placeholder={t.placeholder_name}
                required
              />
            </div>
            <div class="space-y-1.5 md:space-y-2">
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

          <div class="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4">
            <div class="space-y-1.5 md:space-y-2">
              <Label for="budget" class="select-none">{t.form_budget}</Label>
              <Input
                id="budget"
                bind:value={formData.budget}
                placeholder={t.placeholder_budget}
                required
              />
            </div>
            <div class="space-y-1.5 md:space-y-2">
              <Label for="phone" class="select-none">{t.form_phone}</Label>
              <Input
                id="phone"
                bind:value={formData.phone}
                placeholder={t.placeholder_phone}
                required
              />
            </div>
          </div>

          <div class="space-y-1.5 md:space-y-2">
            <Label for="email" class="select-none">{t.form_email}</Label>
            <Input
              id="email"
              type="email"
              bind:value={formData.email}
              placeholder={t.placeholder_email}
            />
          </div>

          <div class="space-y-1.5 md:space-y-2">
            <Label for="info" class="select-none">{t.form_info}</Label>
            <TextArea
              id="info"
              bind:value={formData.info}
              placeholder={t.placeholder_info}
              class="min-h-[80px] md:min-h-[100px]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            class="group/btn relative block h-11 w-full rounded-2xl bg-primary font-black text-primary-foreground shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs md:h-12"
          >
            {isSubmitting ? t.form_sending : t.form_submit}
            {@html isSubmitting ? "" : "&rarr;"}
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
          class="flex flex-col items-center justify-center py-16 text-center space-y-6"
          in:fade
        >
          <div class="checkmark-wrapper">
            <svg
              class="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                class="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                class="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
          <div class="space-y-2">
            <h2
              class="text-3xl font-black tracking-tighter uppercase underline decoration-primary underline-offset-8"
            >
              {translations[$currentLang.code].form_success_title}
            </h2>
            <p class="text-muted-foreground text-sm max-w-xs mx-auto">
              {translations[$currentLang.code].form_success_desc}
            </p>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .checkmark-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .checkmark {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: block;
    stroke-width: 3;
    stroke: #fff;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px var(--primary);
    animation:
      fill 0.4s ease-in-out 0.4s forwards,
      scale 0.3s ease-in-out 0.9s both;
  }

  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 3;
    stroke-miterlimit: 10;
    stroke: var(--primary);
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes scale {
    0%,
    100% {
      transform: none;
    }
    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }

  @keyframes fill {
    100% {
      box-shadow: inset 0px 0px 0px 40px var(--primary);
    }
  }
</style>
