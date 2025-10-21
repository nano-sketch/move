<script>
    import Features from "$lib/components/misc/Features.svelte";
    import Particles from "$lib/components/misc/Particles.svelte";
    import {
        Brain,
        Eye,
        PackageSearch,
        Settings,
        Smile,
        Star,
    } from "lucide-svelte";
    import FeatureOne from "$lib/assets/Feature1.png";
    import FeatureTwo from "$lib/assets/Feature2.png";
    import FeatureThree from "$lib/assets/Feature3.png";
    import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/button/button.svelte";
    import { onMount } from "svelte";

    let { data } = $props();
    const isLoggedIn = data.isLoggedIn;

    onMount(() => {
        document.documentElement.classList.add("dark");
    });

    let features_data = [
        {
            id: 1,
            title: "1. Choose your experience level.",
            content:
                "Choose the level you think you're at, and the tasks supplied to you will fit your expertise.",
            image: FeatureOne,
            icon: Star,
        },
        {
            id: 2,
            title: "2. Levels system",
            content:
                "Always aim to level up to make learning exciting, and rise to the top of the leaderboard!",
            image: FeatureTwo,
            icon: Smile,
        },
        {
            id: 3,
            title: "3. Test, fail, repeat.",
            content:
                "Always test your knowledge with a quiz, this will keep the information you just learnt active in your brain! Keep doing these to memorise.",
            image: FeatureThree,
            icon: Brain,
        },
    ];
</script>

<svelte:head>
    <title>GetGodly - Learn Python Programming</title>
    <meta name="description" content="Master Python programming with interactive lessons, challenges, and coding playground. Perfect for beginners and advanced learners." />
</svelte:head>

<main class="select-none">
    <Particles className="absolute inset-0" refresh={true} />
    <header class="relative z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div class="flex items-center gap-6">
                <a href="/" class="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/40 transition-all duration-300 cursor-default">
                    getgodly
                </a>
                <nav class="flex items-center gap-4">
                    <a href="/start" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Lessons
                    </a>
                    <a href="/challenges" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Challenges
                    </a>
                    <a href="/resources" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Resources
                    </a>
                    <a href="/playground" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Playground
                    </a>
                </nav>
            </div>
            <Button variant="outline" size="sm" href="/account">Account</Button>
        </div>
    </header>

    <div>
        <div class="relative min-h-screen overflow-hidden pt-24">
            <div class="relative lg:min-h-screen">
                <div class="relative z-10 justify-center">
                    <div class="mx-auto w-full max-w-screen-xl px-3">
                        <div class="max-w-4xl">
                            <span
                                class="text-balance font-medium text-4xl/[1.1] tracking-tight sm:text-5xl lg:text-6xl"
                            >
                                Learn Python the easy way and become godly.
                            </span>
                            <p
                                class="mt-4 max-w-2xl text-balance text-sm sm:mt-6 sm:text-base text-muted-foreground"
                            >
                                Engage in bite-sized lessions and quizes to test
                                your knowledge on the Python programming
                                language, securing your knowledge of the
                                language and ensuring a strong knowledge base
                                for any language in the future.
                            </p>
                            <div
                                class="mt-6 flex items-start gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4"
                            >
                                <Button href="/start">Start Lessons</Button>

                                <Button variant="outline" href="/challenges"
                                    >Challenges</Button
                                >

                                {#if !isLoggedIn}
                                    <Button variant="secondary" href="/login"
                                        >Login</Button
                                    >
                                {/if}
                            </div>
                        </div>
                    </div>

                    <div class="mx-auto w-full max-w-screen-xl pt-24">
                        <Features data={features_data} />
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
