<script lang="ts">
  import {
    Monitor,
    Zap,
    Palette,
    Wrench,
    Headset,
    FileCheck,
  } from "lucide-svelte";

  import { currentLang, translations } from "$lib/i18n";
  import FeatureCard from "./FeatureCard.svelte";

  let features = $derived([
    {
      title: translations[$currentLang.code].grid_feat_1_title,
      description: translations[$currentLang.code].grid_feat_1_desc,
      icon: Monitor,
    },
    {
      title: translations[$currentLang.code].grid_feat_2_title,
      description: translations[$currentLang.code].grid_feat_2_desc,
      icon: Zap,
    },
    {
      title: translations[$currentLang.code].grid_feat_3_title,
      description: translations[$currentLang.code].grid_feat_3_desc,
      icon: Palette,
    },
    {
      title: translations[$currentLang.code].grid_feat_4_title,
      description: translations[$currentLang.code].grid_feat_4_desc,
      icon: Wrench,
    },
    {
      title: translations[$currentLang.code].grid_feat_5_title,
      description: translations[$currentLang.code].grid_feat_5_desc,
      icon: Headset,
    },
    {
      title: translations[$currentLang.code].grid_feat_6_title,
      description: translations[$currentLang.code].grid_feat_6_desc,
      icon: FileCheck,
    },
  ]);
</script>

<section class="py-24">
  <div class="mx-auto max-w-screen-xl px-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each features as feature}
        <FeatureCard
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
        />
      {/each}
    </div>
  </div>
</section>
