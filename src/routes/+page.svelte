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
  } from "lucide-svelte";

  // internal components
  import Features from "$lib/components/misc/Features.svelte";
  import Particles from "$lib/components/misc/Particles.svelte";
  import Marquee from "$lib/components/misc/Marquee.svelte";
  import FeaturesGrid from "$lib/components/misc/FeaturesGrid.svelte";
  import Counter from "$lib/components/misc/Counter.svelte";
  import VideoText from "$lib/components/misc/VideoText.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  // state and logic
  import { currentLang, translations } from "$lib/i18n";
  import { selected_theme } from "$lib/helpers";
  import whatsappImg from "$lib/assets/whatsapp.png";
  import logo from "$lib/assets/logo-light.png";

  // project assets
  import ufoImg from "../sort/ufo.png";
  import zooImg from "../sort/zousz.png";
  import hotelImg from "../sort/hotel.png";
  import bartoImg from "../sort/brgr.png";
  import dccImg from "../sort/dcc.png";

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

<main class="select-none bg-background text-foreground scroll-smooth">
  <!-- hero landing section -->
  <section
    class="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden"
  >
    <Particles className="absolute inset-0 z-0" color="#888888" />

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
        <Button
          size="lg"
          class="rounded-full px-10 h-14 text-base font-bold tracking-tight premium-button"
          href="#projects"
        >
          {translations[$currentLang.code].view_projects}
        </Button>

        <!-- secondary roi stats -->
        <div class="flex flex-col items-center sm:items-start px-6">
          <div class="flex flex-col items-center sm:items-start">
            <span
              class="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/50"
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

  <!-- client testimonials carousel -->
  <section class="py-24 bg-card/30 border-y border-border">
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
          class="relative w-80 cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-6 hover:bg-accent transition-colors group"
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

  <!-- agency service details -->
  <section id="services" class="py-32 overflow-hidden">
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
            <span class="text-primary italic"
              >{translations[$currentLang.code].services_title_2}</span
            >
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
          <div
            class="relative border border-border/50 rounded-3xl p-6 sm:p-10 bg-card/30 backdrop-blur-sm"
          >
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

  <!-- comprehensive features grid -->
  <FeaturesGrid />

  <!-- portfolio showcase -->
  <section
    id="projects"
    class="relative py-24 bg-card/5 overflow-hidden border-t border-border/50"
  >
    <div class="absolute inset-0 z-0 opacity-50">
      <Particles className="size-full" color="#888888" quantity={80} />
    </div>

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
                  class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
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

  <!-- high conversion contact cta -->
  <section id="contact" class="py-32">
    <div class="mx-auto max-w-4xl px-6 text-center">
      <div
        class="bg-gradient-to-br from-card to-card/50 border border-border p-12 sm:p-20 rounded-[3rem] relative overflow-hidden"
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
              size="lg"
              class="rounded-full px-12 h-14 text-base font-bold tracking-tight premium-button"
              href="https://wa.me/+421944575007"
              target="_blank"
            >
              {translations[$currentLang.code].start_project}
            </Button>
            <Button
              variant="outline"
              size="lg"
              class="rounded-full px-12 h-14 text-base font-bold tracking-tight border-2 premium-button"
              href="mailto:agencymove.official@gmail.com"
            >
              {translations[$currentLang.code].email_us}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="py-20 border-t border-border mt-32 bg-card/10">
    <div class="mx-auto max-w-screen-xl px-6 space-y-16">
      <!-- top footer navigation -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex gap-10">
          {#each [{ label: translations[$currentLang.code].services, id: "services" }, { label: translations[$currentLang.code].projects, id: "projects" }, { label: translations[$currentLang.code].contact, id: "contact" }] as link}
            <a
              href="#{link.id}"
              class="text-xs font-black tracking-[0.2em] text-muted-foreground hover:text-primary transition-all uppercase"
            >
              {link.label}
            </a>
          {/each}
        </div>
      </div>

      <!-- divider -->
      <div class="h-px w-full bg-border/20"></div>

      <!-- bottom bar: logo, copyright & socials -->
      <div
        class="flex flex-col md:flex-row justify-between items-center gap-12"
      >
        <div class="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <img
            src={logo}
            alt="MOVE Logo"
            class="h-10 w-auto object-contain scale-[1.8] origin-center md:origin-left"
          />
          <p
            class="text-[10px] text-muted-foreground font-black tracking-widest uppercase opacity-40 md:pt-1"
          >
            © {new Date().getFullYear()} MOVE AGENCY. ALL RIGHTS RESERVED.
          </p>
        </div>

        <!-- socials -->
        <div class="flex items-center gap-4">
          <a
            href="https://www.instagram.com/agency.moveuk"
            target="_blank"
            rel="noopener noreferrer"
            class="p-3 rounded-full border border-border/50 bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 transition-all duration-300 group shadow-sm hover:shadow-md"
            aria-label="Instagram"
          >
            <Instagram class="size-5" />
          </a>
          <a
            href="mailto:agencymove.official@gmail.com"
            class="p-3 rounded-full border border-border/50 bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 transition-all duration-300 group shadow-sm hover:shadow-md"
            aria-label="Email"
          >
            <Mail class="size-5" />
          </a>
          <a
            href="tel:+421944575007"
            class="p-3 rounded-full border border-border/50 bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 transition-all duration-300 group shadow-sm hover:shadow-md"
            aria-label="Phone"
          >
            <Phone class="size-5" />
          </a>
          <a
            href="https://wa.me/+421944575007"
            target="_blank"
            rel="noopener noreferrer"
            class="p-3 rounded-full border border-border/50 bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 transition-all duration-300 group shadow-sm hover:shadow-md flex items-center justify-center"
            aria-label="WhatsApp"
          >
            <img
              src={whatsappImg}
              alt="WhatsApp"
              class="size-5 object-contain transition-all brightness-0 invert [.light_&]:invert-0 group-hover:!brightness-100 group-hover:!invert-0"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</main>

<style>
  /* ensuring fluid spacing on typography */
  .text-balance {
    text-wrap: balance;
  }
</style>
