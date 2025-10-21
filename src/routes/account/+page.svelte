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
    }: {
        data: {
            user: {
                username: string;
                progress: number;
                completed: number[];
                completed_challenges: number[];
            };
        };
    } = $props();
    const { username, progress, completed, completed_challenges } = data.user;

    onMount(() => document.documentElement.classList.add("dark"));
</script>

<main class="min-h-screen bg-background relative">
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
                    <CardContent class="space-y-4">
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
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Progress</CardTitle>
                        <CardDescription>Your learning journey</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div>
                            <p
                                class="text-sm font-medium text-muted-foreground"
                            >
                                Lessons Completed
                            </p>
                            <p class="text-4xl font-bold mt-1 text-primary">
                                {completed.length}
                            </p>
                        </div>
                        <div>
                            <p
                                class="text-sm font-medium text-muted-foreground"
                            >
                                Challenges Completed
                            </p>
                            <p class="text-4xl font-bold mt-1 text-green-500">
                                {completed_challenges.length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</main>
