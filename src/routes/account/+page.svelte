<script lang="ts">
    import Particles from "$lib/components/misc/Particles.svelte";
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { goto } from "$app/navigation";

    let {
        data,
        form,
    }: {
        form?: FormData;
        data: {
            user: {
                username: string;
                progress: number;
                completed: number[];
                experience: number;
                completed_challenges: number[];
            };
        };
    } = $props();

    const { username, progress, completed, experience, completed_challenges } =
        data.user;

    let level = $derived(Math.floor(experience / 100));
    let xp_in_level = $derived(experience % 100);
    let prog_percentage = $derived(xp_in_level);

    onMount(() => document.documentElement.classList.add("dark"));
</script>

<main class="min-h-screen bg-background relative select-none">
    <Particles className="absolute inset-0" refresh />

    <div class="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <div class="space-y-6">
            <div>
                <h1 class="text-4xl font-bold tracking-tight">Account</h1>
                <p class="text-muted-foreground mt-2">
                    Manage your account and view your progress
                </p>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription
                            >Your account information</CardDescription
                        >
                    </CardHeader>
                    <CardContent class="flex flex-col gap-4">
                        <div class="flex flex-col justify-evenly pb-20 gap-6">
                            <div>
                                <p
                                    class="text-sm font-medium text-muted-foreground"
                                >
                                    Username
                                </p>
                                <p class="text-2xl font-semibold mt-1">
                                    {username}
                                </p>
                            </div>

                            <div>
                                <p
                                    class="text-sm font-medium text-muted-foreground mb-2"
                                >
                                    Experience
                                </p>

                                <div class="space-y-3">
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <span
                                            class="text-sm font-medium text-foreground"
                                        >
                                            Level {level}
                                        </span>
                                        <span
                                            class="text-sm font-medium text-muted-foreground"
                                        >
                                            {xp_in_level} / 100 XP
                                        </span>
                                    </div>

                                    <div
                                        class="relative h-3 bg-muted rounded-full overflow-hidden border border-border"
                                    >
                                        <div
                                            class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
                                            style="width: {prog_percentage}%"
                                        >
                                            <div
                                                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                                            ></div>
                                        </div>
                                    </div>

                                    <p class="text-xs text-muted-foreground">
                                        {100 - xp_in_level} XP until Level {level +
                                            1}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <form method="POST" action="?/logout" use:enhance>
                            <Button
                                type="submit"
                                variant="destructive"
                                class="w-full">Logout</Button
                            >
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Progress</CardTitle>
                        <CardDescription>Your learning journey</CardDescription>
                    </CardHeader>
                    <CardContent class="flex flex-col grow gap-4">
                        <div class="flex flex-col grow pb-20 gap-6">
                            <div>
                                <p
                                    class="text-sm font-medium text-muted-foreground"
                                >
                                    Lessons Completed
                                </p>
                                <p
                                    class="text-4xl font-bold mt-1 text-accent-foreground"
                                >
                                    {completed.length}
                                </p>
                            </div>
                            <div>
                                <p
                                    class="text-sm font-medium text-muted-foreground"
                                >
                                    Challenges Completed
                                </p>
                                <p
                                    class="text-4xl font-bold mt-1 text-green-500"
                                >
                                    {completed_challenges.length}
                                </p>
                            </div>
                        </div>

                        {#if form?.success}
                            <div
                                class="p-3 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded"
                            >
                                Successfully reset your progress, log back in or
                                refresh the page.
                            </div>
                        {/if}

                        <form method="POST" action="?/reset" use:enhance>
                            <Button
                                type="submit"
                                variant="destructive"
                                class="w-full">Reset Progress</Button
                            >
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</main>
