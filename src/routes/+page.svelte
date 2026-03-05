<script lang="ts">
  import {
    TrendingUp,
    Globe,
    Zap,
    Rocket,
    ShieldCheck,
    Quote,
    Instagram,
    Mail,
    Phone,
    ChevronRight,
    ChevronDown,
    ArrowUpRight,
  } from "lucide-svelte";

  // internal components
  import Separator from "$lib/components/misc/Separator.svelte";
  import Features from "$lib/components/misc/Features.svelte";
  import Marquee from "$lib/components/misc/Marquee.svelte";
  import FeaturesGrid from "$lib/components/misc/FeaturesGrid.svelte";
  import Counter from "$lib/components/misc/Counter.svelte";
  import VideoText from "$lib/components/misc/VideoText.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import ThreeCube from "$lib/components/misc/ThreeCube.svelte";
  import { LineShadowText } from "$lib/components/magic-ui/line-shadow-text";
  import { MorphingText } from "$lib/components/magic-ui/morphing-text";
  import { PulsatingButton } from "$lib/components/magic-ui/pulsating-button";

  // state and logic
  import { currentLang, translations } from "$lib/i18n";
  import { selected_theme, contact_popup_open } from "$lib/helpers";
  import whatsappImg from "$lib/assets/whatsapp.png";
  import logo from "$lib/assets/logo-light.png";

  // project assets
  import ufoImg from "../sort/ufo.png";
  import zooImg from "../sort/zousz.png";
  import hotelImg from "../sort/hotel.png";
  import bartoImg from "../sort/brgr.png";
  import dccImg from "../sort/dcc.png";

  let openFaq = $state<number | null>(null);
  const services = $derived([
    {
      title: translations[$currentLang.code].svc_1_title,
      desc: translations[$currentLang.code].svc_1_desc,
    },
    {
      title: translations[$currentLang.code].svc_2_title,
      desc: translations[$currentLang.code].svc_2_desc,
    },
    {
      title: translations[$currentLang.code].svc_3_title,
      desc: translations[$currentLang.code].svc_3_desc,
    },
    {
      title: translations[$currentLang.code].svc_4_title,
      desc: translations[$currentLang.code].svc_4_desc,
    },
    {
      title: translations[$currentLang.code].svc_5_title,
      desc: translations[$currentLang.code].svc_5_desc,
    },
    {
      title: translations[$currentLang.code].svc_6_title,
      desc: translations[$currentLang.code].svc_6_desc,
    },
  ]);
  let activeIndex = $state(0);
  let animating = $state(false);
  let moveOut = $state(-1);
  let moveIn = $state(-1);
  function cycleCards() {
    if (animating) return;
    animating = true;
    moveOut = activeIndex;
    moveIn = (activeIndex + 1) % services.length;
    setTimeout(() => {
      activeIndex = moveIn;
      moveOut = -1;
      moveIn = -1;
      animating = false;
    }, 220);
  }
  function toggleFaq(i: number) {
    openFaq = openFaq === i ? null : i;
  }

  /**
   * core business features data
   * synchronized with current language reactive state
   */
  const businessFeatures = $derived([
    {
      id: 1,
      title: translations[$currentLang.code].feat_1_title,
      content: translations[$currentLang.code].feat_1_content,
      icon: TrendingUp,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070",
    },
    {
      id: 2,
      title: translations[$currentLang.code].feat_2_title,
      content: translations[$currentLang.code].feat_2_content,
      icon: Globe,
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070",
    },
    {
      id: 3,
      title: translations[$currentLang.code].feat_3_title,
      content: translations[$currentLang.code].feat_3_content,
      icon: Zap,
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2070",
    },
  ]);

  /**
   * client testimonials
   * initials are derived from names in the ui layer
   */
  const clientReviews = $derived([
    {
      name: "Marcus Vörös",
      username: "@mvoros",
      body: translations[$currentLang.code].rev_1_body,
      initials: "MV",
    },
    {
      name: "Elena Rossi",
      username: "@elena_dev",
      body: translations[$currentLang.code].rev_2_body,
      initials: "ER",
    },
    {
      name: "Tomáš Kováč",
      username: "@tomas_k",
      body: translations[$currentLang.code].rev_3_body,
      initials: "TK",
    },
    {
      name: "Sophie Dubois",
      username: "@dubois_marketing",
      body: translations[$currentLang.code].rev_4_body,
      initials: "SD",
    },
    {
      name: "Viktor Nagy",
      username: "@viktornagy",
      body: translations[$currentLang.code].rev_5_body,
      initials: "VN",
    },
  ]);

  /**
   * agency portfolio data
   */
  const portfolioProjects = $derived([
    {
      title: translations[$currentLang.code].proj_4_title,
      category: translations[$currentLang.code].services,
      desc: translations[$currentLang.code].proj_4_desc,
      image: bartoImg,
      url: "https://brgr.sk/humenne",
    },
    {
      title: translations[$currentLang.code].proj_1_title,
      category: translations[$currentLang.code].services,
      desc: translations[$currentLang.code].proj_1_desc,
      image: ufoImg,
      url: "https://u-f-o.sk/",
    },
    {
      title: translations[$currentLang.code].proj_2_title,
      category: translations[$currentLang.code].services,
      desc: translations[$currentLang.code].proj_2_desc,
      image: zooImg,
      url: "https://zousz.com/",
    },
    {
      title: translations[$currentLang.code].proj_3_title,
      category: translations[$currentLang.code].services,
      desc: translations[$currentLang.code].proj_3_desc,
      image: hotelImg,
      url: "https://www.hotel-edelweiss.at/",
    },
    {
      title: translations[$currentLang.code].proj_5_title,
      category: translations[$currentLang.code].services,
      desc: translations[$currentLang.code].proj_5_desc,
      image: dccImg,
      url: "https://www.dcc-group.com/",
    },
  ]);
</script>

<svelte:head>
  <title>MOVE - Modern Marketing & Website Development</title>
  <meta
    name="description"
    content="MOVE is a premium agency specializing in modern marketing and high-performance website development. Achieve up to 283% ROI with our expert strategies."
  />
</svelte:head>

<main class="select-none bg-transparent text-foreground scroll-smooth">
  <!-- hero landing section -->
  <section
    class="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden"
  >
    <div
      class="relative z-10 w-full max-w-screen-xl px-6 text-center flex flex-col items-center gap-8"
    >
      <!-- agency status badge -->
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        <Rocket class="size-4" />
        <span class="text-xs font-bold tracking-widest uppercase"
          >{translations[$currentLang.code].hero_badge}</span
        >
      </div>

      <h1
        class="text-balance font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter leading-[0.9] sm:leading-[0.95] lg:leading-[1] pt-4 sm:pt-2 lg:pt-0"
      >
        {translations[$currentLang.code].hero_title_1} <br />
        <div
          class="h-[1.2em] sm:h-[1.3em] lg:h-[1.4em] w-full flex justify-center items-center overflow-hidden relative mt-[-0.1em] sm:mt-[-0.05em] lg:mt-0"
        >
          <VideoText
            src="https://cdn.magicui.design/ocean-small.webm"
            content={translations[$currentLang.code].hero_title_2}
            fontSize={12}
            fontWeight="900"
            className="flex items-center justify-center translate-y-[-0.1em] sm:translate-y-[-0.05em] lg:translate-y-0"
          />
        </div>
      </h1>

      <p
        class="mx-auto max-w-2xl text-balance text-lg sm:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100"
      >
        {translations[$currentLang.code].hero_desc}
      </p>

      <div
        class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200"
      >
        <a href="#projects">
          <PulsatingButton pulseColor="rgba(0, 85, 255, 0.5)">
            {translations[$currentLang.code].view_projects}
          </PulsatingButton>
        </a>

        <!-- secondary roi stats -->
        <div class="flex flex-col items-center sm:items-start px-6">
          <div class="flex flex-col items-center sm:items-start">
            <span
              class="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/50 pr-2"
            >
              <Counter
                value={translations[$currentLang.code].roi_value}
                suffix={translations[$currentLang.code].roi_suffix}
              />
            </span>
            <span
              class="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mt-1"
            >
              {translations[$currentLang.code].roi_label}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Separator gradient={true} />
  <section id="services" class="py-32">
    <div class="mx-auto max-w-screen-xl px-6">
      <div class="mb-16">
        <h2
          class="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4"
        >
          {translations[$currentLang.code].services_section_badge}
        </h2>
        <p
          class="text-4xl sm:text-5xl font-black tracking-tighter leading-none"
        >
          {translations[$currentLang.code].services_section_title}
        </p>
      </div>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="svc-wrap" onclick={cycleCards}>
        {#each services as svc, i}
          {@const pos = (i - activeIndex + services.length) % services.length}
          <div
            class="svc-card"
            class:svc-left={pos === 0 && moveOut !== i}
            class:svc-s1={pos === 1 && moveIn !== i}
            class:svc-s2={pos === 2}
            class:svc-s3={pos === 3}
            class:svc-s4={pos === 4}
            class:svc-s5={pos >= 5 && moveOut !== i}
            class:svc-move-out={moveOut === i}
            class:svc-move-in={moveIn === i}
          >
            <div class="flex items-start gap-3 sm:gap-5 sm:h-full w-full">
              <span
                class="text-5xl sm:text-6xl font-black text-primary/50 tabular-nums leading-none select-none"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div class="flex flex-col gap-1 sm:gap-4 pt-1 sm:pt-3">
                <span class="text-xl sm:text-2xl font-black text-foreground">
                  {svc.title}
                </span>
                <span
                  class="text-sm sm:text-base text-foreground/80 leading-relaxed max-w-[200px] sm:max-w-xs"
                >
                  {svc.desc}
                </span>
              </div>
            </div>
            <div class="svc-arrow">
              <ArrowUpRight class="size-5" />
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <Separator gradient={true} />
  <!-- client testimonials carousel -->
  <section id="reviews" class="py-24 bg-transparent">
    <div class="text-center mb-16 px-6">
      <h2
        class="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4"
      >
        {translations[$currentLang.code].client_badge}
      </h2>
      <p class="text-3xl font-bold tracking-tight">
        {translations[$currentLang.code].client_title}
      </p>
    </div>

    <Marquee pauseOnHover class="[--duration:30s] [--gap:2rem]">
      {#each clientReviews as review (review.username)}
        <div
          class="framer-card framer-card-hover group relative w-80 cursor-pointer overflow-hidden p-8 flex flex-col text-left gap-4"
        >
          <div class="flex flex-row items-center gap-3 mb-4">
            <div
              class="size-10 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center text-white font-bold"
            >
              {review.initials}
            </div>
            <div class="flex flex-col text-left">
              <span class="text-sm font-bold tracking-tight leading-none"
                >{review.name}</span
              >
              <span class="text-xs text-muted-foreground"
                >{review.username}</span
              >
            </div>
          </div>
          <blockquote
            class="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors italic"
          >
            "{review.body}"
          </blockquote>
          <div
            class="absolute top-4 right-6 opacity-10 group-hover:opacity-20 transition-opacity"
          >
            <Quote class="size-8" />
          </div>
        </div>
      {/each}
    </Marquee>
  </section>

  <Separator gradient={true} />
  <!-- agency service details -->
  <section id="about" class="py-32 overflow-hidden">
    <div class="mx-auto w-full max-w-screen-xl px-6">
      <div class="flex flex-col items-start text-left gap-20">
        <div class="space-y-8 max-w-2xl">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary"
          >
            <ShieldCheck class="size-4" />
            <span class="text-xs font-bold tracking-widest uppercase"
              >{translations[$currentLang.code].services_badge}</span
            >
          </div>
          <h2 class="text-4xl sm:text-6xl font-black tracking-tighter">
            {translations[$currentLang.code].services_title_1} <br />
            <span class="text-primary italic">
              <MorphingText
                texts={[
                  translations[$currentLang.code].services_title_2,
                  'INNOVATION.',
                  'EXCELLENCE.',
                ]}
              />
            </span>
          </h2>
          <p class="text-lg text-muted-foreground leading-relaxed">
            {translations[$currentLang.code].services_desc}
          </p>

          <!-- service performance metrics -->
          <div class="grid grid-cols-2 gap-12 pt-8 border-t border-border/50">
            <div class="space-y-2">
              <span class="text-5xl font-black tracking-tighter text-primary">
                <Counter
                  value={translations[$currentLang.code].stats_1_val}
                  suffix={translations[$currentLang.code].stats_1_suffix}
                />
              </span>
              <p
                class="text-xs font-bold tracking-widest uppercase text-muted-foreground leading-snug"
              >
                {translations[$currentLang.code].stats_1_label}
              </p>
            </div>
            <div class="space-y-2">
              <span
                class="text-5xl font-black tracking-tighter text-foreground"
              >
                {translations[$currentLang.code].stats_2_val}
              </span>
              <p
                class="text-xs font-bold tracking-widest uppercase text-muted-foreground leading-snug"
              >
                {translations[$currentLang.code].stats_2_label}
              </p>
            </div>
          </div>
        </div>

        <!-- specialized feature showcase -->
        <div class="relative group w-full">
          <div class="framer-card relative p-6 sm:p-10">
            <Features
              data={businessFeatures}
              linePosition="left"
              collapseDelay={4000}
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <Separator gradient={true} />
  <!-- comprehensive features grid -->
  <FeaturesGrid />

  <Separator gradient={true} />
  <!-- portfolio showcase -->
  <section id="projects" class="relative py-24 bg-card/5 overflow-hidden">
    <div class="absolute inset-0 z-0 opacity-50"></div>

    <div class="relative z-10 mx-auto max-w-screen-xl px-6">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20"
      >
        <div class="space-y-4">
          <h2 class="text-xs font-bold tracking-[0.3em] uppercase text-primary">
            {translations[$currentLang.code].portfolio_badge}
          </h2>
          <p
            class="text-5xl sm:text-7xl font-black tracking-tighter leading-none"
          >
            {translations[$currentLang.code].portfolio_title}
          </p>
        </div>
        <p
          class="text-muted-foreground max-w-md text-base sm:text-lg leading-relaxed"
        >
          {translations[$currentLang.code].portfolio_desc}
        </p>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-[1.14fr_1fr_1fr] md:grid-rows-2 gap-x-4 gap-y-12 lg:gap-x-6 lg:gap-y-16"
      >
        {#each portfolioProjects as project, i (project.title)}
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            class="group flex flex-col gap-6 {i === 0 ? 'md:row-span-2' : ''}"
          >
            <!-- card image container area -->
            <div
              class="relative flex-1 {i === 0
                ? 'aspect-[3/4.2]'
                : 'aspect-[1.6/1]'}"
            >
              <!-- actual image with strict clipping -->
              <div
                class="absolute inset-0 overflow-hidden rounded-[2rem] bg-transparent"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  class="size-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                  loading="lazy"
                  draggable="false"
                />

                <!-- subtle color wash on hover -->
                <div
                  class="absolute inset-0 bg-primary/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                ></div>
              </div>

              <!-- floating border (prevents clipping artifacts) -->
              <div
                class="absolute inset-0 rounded-[2rem] border border-foreground/10 group-hover:border-primary/40 transition-all duration-200 pointer-events-none"
              ></div>

              <!-- hover action button (centered on bottom edge) -->
              <div
                class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100 pointer-events-none"
              >
                <div
                  class="size-9 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20"
                >
                  <ChevronRight class="size-5" />
                </div>
              </div>
            </div>

            <!-- project text info underneath -->
            <div class="px-1 text-left">
              <span
                class="text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors duration-200"
              >
                {new URL(project.url).hostname.replace("www.", "")}
              </span>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <Separator gradient={true} />
  <!-- high conversion contact cta -->
  <section id="contact" class="py-32">
    <div class="mx-auto max-w-4xl px-6 text-center">
      <div
        class="framer-card p-12 sm:p-[60px] relative overflow-hidden flex flex-col items-center"
      >
        <div
          class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-96 bg-primary/10 blur-3xl rounded-full"
        ></div>

        <div class="relative z-10 space-y-8">
          <h2
            class="text-4xl sm:text-6xl font-black tracking-tighter leading-none"
          >
            {translations[$currentLang.code].contact_title_1} <br />
            <span class="text-primary italic"
              >{translations[$currentLang.code].contact_title_2}</span
            >
          </h2>
          <p class="text-lg text-muted-foreground max-w-xl mx-auto">
            {translations[$currentLang.code].contact_desc}
          </p>
          <div class="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              class="premium-button"
              onclick={() => ($contact_popup_open = true)}
            >
              {translations[$currentLang.code].start_project}
            </Button>
            <Button
              class="premium-button"
              style="background-color: rgba(255, 255, 255, 0.1) !important; color: white !important; box-shadow: none !important;"
              href="mailto:agencymove.official@gmail.com"
            >
              {translations[$currentLang.code].email_us}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Separator gradient={true} />
  <section id="faq" class="py-32">
    <div class="mx-auto max-w-screen-xl px-6">
      <div class="flex flex-col lg:flex-row gap-16 lg:gap-24">
        <div class="lg:w-[340px] shrink-0 lg:sticky lg:top-32 lg:self-start">
          <h2
            class="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4"
          >
            {translations[$currentLang.code].faq_badge}
          </h2>
          <p
            class="text-4xl sm:text-5xl font-black tracking-tighter leading-none mb-4"
          >
            Got <LineShadowText
              content="Questions?"
              class="italic"
              shadowColor={$selected_theme === "light" ? "black" : "white"}
            />
          </p>
          <p class="text-base text-muted-foreground leading-relaxed">
            {translations[$currentLang.code].faq_subtitle}
          </p>
        </div>
        <div class="flex-1 flex flex-col gap-3">
          {#each [{ q: translations[$currentLang.code].faq_q1, a: translations[$currentLang.code].faq_a1 }, { q: translations[$currentLang.code].faq_q2, a: translations[$currentLang.code].faq_a2 }, { q: translations[$currentLang.code].faq_q3, a: translations[$currentLang.code].faq_a3 }, { q: translations[$currentLang.code].faq_q4, a: translations[$currentLang.code].faq_a4 }, { q: translations[$currentLang.code].faq_q5, a: translations[$currentLang.code].faq_a5 }, { q: translations[$currentLang.code].faq_q6, a: translations[$currentLang.code].faq_a6 }] as item, i}
            <div
              class="framer-card transition-all duration-300 {openFaq === i
                ? '!bg-white/10 !border-white/20'
                : 'framer-card-hover'}"
            >
              <button
                onclick={() => toggleFaq(i)}
                class="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer select-none group"
              >
                <span
                  class="text-[15px] font-bold tracking-tight transition-colors duration-150 {openFaq ===
                  i
                    ? 'text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'}"
                >
                  {item.q}
                </span>
                <div
                  class="shrink-0 ml-6 size-7 rounded-lg flex items-center justify-center transition-all duration-200 {openFaq ===
                  i
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent/50 text-muted-foreground group-hover:bg-accent'}"
                >
                  <ChevronDown
                    class="size-3.5 transition-transform duration-200 {openFaq ===
                    i
                      ? 'rotate-180'
                      : ''}"
                  />
                </div>
              </button>
              <div class="faq-body {openFaq === i ? 'faq-open' : ''}">
                <div class="px-6 pb-5">
                  <div class="h-px w-full bg-border/30 mb-4"></div>
                  <p class="text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <Separator gradient={true} />
  <footer class="pt-16 pb-10 mt-32 bg-transparent">
    <div class="mx-auto max-w-screen-xl px-6 space-y-10">
      <!-- nav -->
      <div
        class="flex flex-col md:flex-row justify-between items-center gap-10"
      >
        <div
          class="flex flex-wrap justify-center md:justify-start gap-x-6 md:gap-x-10 gap-y-6"
        >
          {#each [{ label: translations[$currentLang.code].home, id: "" }, { label: translations[$currentLang.code].services, id: "services" }, { label: translations[$currentLang.code].reviews, id: "reviews" }, { label: translations[$currentLang.code].about, id: "about" }, { label: translations[$currentLang.code].why_us, id: "why-us" }, { label: translations[$currentLang.code].projects, id: "projects" }, { label: translations[$currentLang.code].contact, id: "contact" }, { label: translations[$currentLang.code].faq, id: "faq" }] as link}
            <a
              href={link.id === "" ? "/" : `/#${link.id}`}
              class="text-[11px] md:text-xs font-black tracking-widest md:tracking-[0.2em] text-muted-foreground hover:text-primary transition-all uppercase whitespace-nowrap select-none"
            >
              {link.label}
            </a>
          {/each}
        </div>

        <div class="flex items-center gap-5 md:gap-4 justify-center">
          <a
            href="https://www.instagram.com/agency.moveuk"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted-foreground hover:text-primary transition-colors duration-300"
            aria-label="Instagram"
          >
            <Instagram class="size-5" />
          </a>
          <a
            href="mailto:agencymove.official@gmail.com"
            class="text-muted-foreground hover:text-primary transition-colors duration-300"
            aria-label="Email"
          >
            <Mail class="size-5" />
          </a>
          <a
            href="tel:+421944575007"
            class="text-muted-foreground hover:text-primary transition-colors duration-300"
            aria-label="Phone"
          >
            <Phone class="size-5" />
          </a>
          <a
            href="https://wa.me/+421944575007"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center justify-center"
            aria-label="WhatsApp"
          >
            <img
              src={whatsappImg}
              alt="WhatsApp"
              class="size-5 object-contain transition-colors brightness-0 invert [.light_&]:invert-0 hover:brightness-100 hover:invert-0 select-none"
              draggable="false"
            />
          </a>
        </div>
      </div>

      <!-- divider -->
      <div class="h-px w-full bg-border/20"></div>

      <div class="flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <img
            src={logo}
            alt="MOVE Logo"
            class="h-10 w-auto object-contain scale-[1.5] md:scale-[1.8] origin-center md:origin-left select-none"
            draggable="false"
          />
          <p
            class="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase opacity-30 md:pt-1 text-center md:text-left select-none"
          >
            © {new Date().getFullYear()} MOVE AGENCY. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  </footer>

  <!-- 3D Cube Section -->
  <!-- <section class="relative w-full h-96 bg-black overflow-hidden">
    <ThreeCube />
  </section> -->
</main>

<style>
  .text-balance {
    text-wrap: balance;
  }
  .faq-body {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition:
      grid-template-rows 280ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 150ms ease;
  }
  .faq-body > div {
    overflow: hidden;
  }
  .faq-body.faq-open {
    grid-template-rows: 1fr;
    opacity: 1;
  }
  .svc-wrap {
    position: relative;
    width: 100%;
    height: 260px;
    cursor: pointer;
  }
  .svc-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 440px;
    height: 220px;
    border-radius: 12px;
    border: none;
    background-color: #111318;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
    padding: 2.25rem;
    overflow: visible;
    pointer-events: none;
    transition:
      transform 220ms cubic-bezier(0.2, 0.9, 0.2, 1),
      background-color 200ms ease;
  }
  .svc-arrow {
    position: absolute;
    right: -20px;
    top: 50%;
    translate: 0 -50%;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    scale: 0.7;
    transition:
      opacity 200ms ease,
      scale 200ms ease;
    box-shadow: none;
  }
  .svc-left:hover .svc-arrow {
    opacity: 1;
    scale: 1;
  }
  .svc-left {
    transform: translateX(0) translateY(0) scale(1) rotate(0deg);
    z-index: 5;
    pointer-events: auto;
  }
  .svc-left:hover {
    background-color: #14191f;
  }
  .svc-s1 {
    transform: translateX(480px) translateY(8px) scale(0.96) rotate(-1deg);
    z-index: 4;
  }
  .svc-s2 {
    transform: translateX(500px) translateY(16px) scale(0.92) rotate(-2deg);
    z-index: 3;
  }
  .svc-s3 {
    transform: translateX(520px) translateY(24px) scale(0.88) rotate(-3deg);
    z-index: 2;
  }
  .svc-s4 {
    transform: translateX(530px) translateY(30px) scale(0.85) rotate(-3.5deg);
    z-index: 1;
  }
  .svc-s5 {
    transform: translateX(530px) translateY(30px) scale(0.85) rotate(-3.5deg);
    z-index: 0;
  }
  .svc-move-out {
    transform: translateX(480px) translateY(8px) scale(0.96) rotate(-1deg);
    z-index: 6;
  }
  .svc-move-in {
    transform: translateX(0) translateY(0) scale(1) rotate(0deg);
    z-index: 7;
  }
  @media (max-width: 960px) {
    .svc-card {
      width: 100%;
      max-width: 340px;
      height: 180px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
    }
    .svc-left {
      transform: translateX(-50%) translateY(0) scale(1) rotate(0deg);
      left: 50%;
    }
    .svc-s1 {
      transform: translateX(-50%) translateY(220px) scale(0.96) rotate(-1deg);
      left: 50%;
    }
    .svc-s2 {
      transform: translateX(-50%) translateY(228px) scale(0.92) rotate(-2deg);
      left: 50%;
    }
    .svc-s3 {
      transform: translateX(-50%) translateY(236px) scale(0.88) rotate(-3deg);
      left: 50%;
    }
    .svc-s4 {
      transform: translateX(-50%) translateY(242px) scale(0.85) rotate(-3.5deg);
      left: 50%;
    }
    .svc-s5 {
      transform: translateX(-50%) translateY(242px) scale(0.85) rotate(-3.5deg);
      left: 50%;
    }
    .svc-move-out {
      transform: translateX(-50%) translateY(220px) scale(0.96) rotate(-1deg);
      left: 50%;
    }
    .svc-move-in {
      transform: translateX(-50%) translateY(0) scale(1) rotate(0deg);
      left: 50%;
    }
    .svc-wrap {
      height: 460px;
    }
  }
</style>
