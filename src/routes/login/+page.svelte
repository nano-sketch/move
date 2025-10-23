<script lang="ts">
    import Particles from "$lib/components/misc/Particles.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";
    let { form, data } = $props();
    let username = $state("");
    let loading = $state(false);
</script>

<main class="min-h-screen bg-background relative">
    <Particles className="absolute inset-0" refresh={true} />
    <div
        class="max-w-3xl mx-auto px-6 py-8 relative z-10 flex items-center justify-center min-h-[calc(100vh-3.5rem)]"
    >
        <div
            class="w-full max-w-md space-y-6 bg-card p-8 rounded-lg border border-border"
        >
            <div class="space-y-2 text-center">
                <h1 class="text-3xl font-bold tracking-tight">Welcome back</h1>
                <p class="text-muted-foreground">
                    enter your new user to continue
                </p>
            </div>

            {#if form?.error}
                <div
                    class="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded"
                >
                    {form.error}
                </div>
            {/if}

            <form method="POST" action="?/login" use:enhance class="space-y-4">
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
                <Button type="submit" class="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Continue"}
                </Button>
            </form>
            <p class="text-xs text-center text-muted-foreground">
                no pass required, just your user.
            </p>
        </div>
    </div>
</main>
