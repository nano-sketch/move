<script lang="ts">
    import Particles from "$lib/components/misc/Particles.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";

    let { form } = $props();
    let username = $state("");
    let password = $state("");
    let loading = $state(false);
</script>

<svelte:head>
    <style>
        html {
            overflow: hidden !important;
        }
    </style>
</svelte:head>

<main class="min-h-screen bg-background relative">
    <Particles className="absolute inset-0" refresh={true} />
    <div
        class="max-w-3xl mx-auto px-6 py-8 relative z-10 flex items-center justify-center min-h-[calc(100vh-3.5rem)]"
    >
        <div
            class="w-full max-w-md space-y-6 bg-card p-8 rounded-lg border border-border"
        >
            <div class="space-y-2 text-center">
                <h1 class="text-3xl font-bold tracking-tight">
                    Create an account
                </h1>
                <p class="text-muted-foreground">
                    Enter your username and password to continue
                </p>
            </div>

            {#if form?.error}
                <div
                    class="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded"
                >
                    {form.error}
                </div>
            {/if}

            <form method="POST" action="?/signup" class="space-y-4">
                <div class="space-y-2">
                    <Label for="username">Username</Label>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter your username"
                        bind:value={username}
                        required
                        disabled={loading}
                        class="w-full"
                    />
                </div>

                <div class="space-y-2">
                    <Label for="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        bind:value={password}
                        required
                        disabled={loading}
                        class="w-full"
                    />
                </div>

                <Button type="submit" class="w-full" disabled={loading}>
                    {loading ? "Processing..." : "Continue"}
                </Button>
            </form>

            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <span class="w-full border-t"></span>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                    <span class="bg-background text-muted-foreground px-2"
                        >or</span
                    >
                </div>
            </div>

            <Button
                href="/login"
                class="w-full"
                disabled={loading}
                variant={"outline"}
            >
                {loading ? "Processing..." : "Login"}
            </Button>
        </div>
    </div>
</main>
