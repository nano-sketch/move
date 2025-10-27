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

    console.log(data);
    console.log("online_count:", data.online_count);
    console.log("is_logged_in:", data.is_logged_in);

    const is_logged_in = data.is_logged_in;
    const online_count = data.online_count;

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
    <meta
        name="description"
        content="Master Python programming with interactive lessons, challenges, and coding playground. Perfect for beginners and advanced learners."
    />
</svelte:head>

<main class="select-none">
    <Particles className="absolute inset-0" refresh={true} />

    <div>
        <div class="relative min-h-screen overflow-hidden pt-24">
            <div class="relative lg:min-h-screen">
                <div class="relative z-10 justify-center">
                    <div
                        class="mx-auto w-full max-w-screen-xl px-3 flex flex-col gap-8"
                    >
                        <div class="flex flex-row items-center gap-2">
                            <div
                                class={`size-3 ${(online_count ?? 0) === 0 ? "bg-muted" : "bg-green-600"} animate-pulse rounded-full`}
                            ></div>

                            <span
                                >{online_count ?? 0}
                                {(online_count ?? 0) === 1 ? "user" : "users"} online</span
                            >
                        </div>
                        <div class="max-w-4xl">
                            <span
                                class="text-balance font-medium text-4xl/[1.1] tracking-tight sm:text-5xl lg:text-6xl"
                            >
                                Learn Python the easy way, become godly.
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
                                <a href="/lessons">
                                    <Button>Start Lessons</Button>
                                </a>

                                {#if !is_logged_in}
                                    <Button variant="outline" href="/login"
                                        >Login</Button
                                    >
                                {:else}
                                    <Button variant="outline" href="/account"
                                        >Account</Button
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
