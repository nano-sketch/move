<script lang="ts">
    import Particles from "$lib/components/misc/Particles.svelte";
    import { onMount } from "svelte";
    import { Trophy, Medal, Award, Star } from "lucide-svelte";

    let { data } = $props();

    const leaderboard = data?.leaderboard ?? [];
    const current_user = data?.current_user ?? null;

    function get_rank_color(rank: number): string {
        if (rank === 1) return "text-yellow-500";
        if (rank === 2) return "text-gray-400";
        if (rank === 3) return "text-orange-600";
        return "text-muted-foreground";
    }

    function get_rank_icon(rank: number) {
        if (rank === 1) return Trophy;
        if (rank === 2) return Medal;
        if (rank === 3) return Award;
        return null;
    }

    function get_xp_color(xp: number): string {
        if (xp >= 10000) return "text-purple-500";
        if (xp >= 5000) return "text-blue-500";
        if (xp >= 1000) return "text-green-500";
        return "text-muted-foreground";
    }
</script>

<svelte:head>
    <title>Leaderboard - GetGodly</title>
    <meta
        name="description"
        content="View the top Python learners and see where you rank"
    />
</svelte:head>

<main class="min-h-screen bg-background relative select-none">
    <Particles className="absolute inset-0" refresh={true} />

    <div class="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div class="mb-8">
            <div class="flex items-center gap-3 mb-2">
                <Trophy class="w-8 h-8 text-primary" />
                <h1 class="text-3xl font-bold">Leaderboard</h1>
            </div>
            <p class="text-muted-foreground">
                Compete with other learners and climb to the top
            </p>
        </div>

        {#if leaderboard.length >= 3}
            <div class="grid grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                <div class="flex flex-col items-center pt-12">
                    <div
                        class="bg-card border-2 border-gray-400/30 rounded-lg p-6 w-full text-center hover:border-gray-400/50 transition-colors"
                    >
                        <div class="flex justify-center mb-3">
                            <Medal class="w-12 h-12 text-gray-400" />
                        </div>
                        <div class="text-2xl font-bold mb-1">2nd</div>
                        <div class="font-medium mb-2 truncate">
                            {leaderboard[1].username}
                        </div>
                        <div class="text-sm text-muted-foreground mb-2">
                            {leaderboard[1].level}
                        </div>
                        <div class="text-xl font-bold text-gray-400">
                            {leaderboard[1].xp.toLocaleString()} XP
                        </div>
                        <div class="text-xs text-muted-foreground mt-2">
                            {leaderboard[1].completed} lessons
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-center">
                    <div
                        class="bg-card border-2 border-yellow-500/30 rounded-lg p-6 w-full text-center hover:border-yellow-500/50 transition-colors relative"
                    >
                        <div
                            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black rounded-full px-3 py-1 text-xs font-bold"
                        >
                            GOD
                        </div>
                        <div class="flex justify-center mb-3">
                            <Trophy class="w-16 h-16 text-yellow-500" />
                        </div>
                        <div class="text-3xl font-bold mb-1">1st</div>
                        <div class="font-medium text-lg mb-2 truncate">
                            {leaderboard[0].username}
                        </div>
                        <div class="text-sm text-muted-foreground mb-2">
                            {leaderboard[0].level}
                        </div>
                        <div class="text-2xl font-bold text-yellow-500">
                            {leaderboard[0].xp.toLocaleString()} XP
                        </div>
                        <div class="text-xs text-muted-foreground mt-2">
                            {leaderboard[0].completed} lessons
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-center pt-16">
                    <div
                        class="bg-card border-2 border-orange-600/30 rounded-lg p-6 w-full text-center hover:border-orange-600/50 transition-colors"
                    >
                        <div class="flex justify-center mb-3">
                            <Award class="w-10 h-10 text-orange-600" />
                        </div>
                        <div class="text-xl font-bold mb-1">3rd</div>
                        <div class="font-medium mb-2 truncate">
                            {leaderboard[2].username}
                        </div>
                        <div class="text-sm text-muted-foreground mb-2">
                            {leaderboard[2].level}
                        </div>
                        <div class="text-lg font-bold text-orange-600">
                            {leaderboard[2].xp.toLocaleString()} XP
                        </div>
                        <div class="text-xs text-muted-foreground mt-2">
                            {leaderboard[2].completed} lessons
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <div class="bg-card border border-border rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-border bg-muted/50">
                <h2 class="text-lg font-semibold">All Rankings</h2>
            </div>

            <table class="w-full">
                <thead class="bg-muted/50 border-b border-border">
                    <tr>
                        <th
                            class="text-left px-6 py-3 text-sm font-semibold w-20"
                            >Rank</th
                        >
                        <th class="text-left px-6 py-3 text-sm font-semibold"
                            >User</th
                        >
                        <th class="text-left px-6 py-3 text-sm font-semibold"
                            >Level</th
                        >
                        <th class="text-left px-6 py-3 text-sm font-semibold"
                            >XP</th
                        >
                        <th class="text-left px-6 py-3 text-sm font-semibold"
                            >Completed</th
                        >
                    </tr>
                </thead>
                <tbody>
                    {#each leaderboard as user, index (user.username)}
                        {@const rank = index + 1}
                        {@const RankIcon = get_rank_icon(rank)}
                        {@const isCurrentUser =
                            current_user &&
                            user.username === current_user.username}
                        <tr
                            class="border-b border-border transition-colors hover:bg-muted/30 {isCurrentUser
                                ? 'bg-primary/10'
                                : ''}"
                        >
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    {#if RankIcon}
                                        <svelte:component
                                            this={RankIcon}
                                            class="w-5 h-5 {get_rank_color(
                                                rank,
                                            )}"
                                        />
                                    {:else}
                                        <span
                                            class="text-lg font-bold {get_rank_color(
                                                rank,
                                            )}"
                                        >
                                            #{rank}
                                        </span>
                                    {/if}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-sm font-bold"
                                    >
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div
                                            class="font-medium flex items-center gap-2"
                                        >
                                            {user.username}
                                            {#if isCurrentUser}
                                                <span
                                                    class="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30"
                                                >
                                                    You
                                                </span>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <Star class="w-4 h-4 text-primary" />
                                    <span class="font-medium">{user.level}</span
                                    >
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="font-bold {get_xp_color(user.xp)}">
                                    {user.xp.toLocaleString()}
                                </span>
                                <span class="text-xs text-muted-foreground ml-1"
                                    >XP</span
                                >
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-medium">
                                        {user.completed}
                                    </span>
                                    <span class="text-xs text-muted-foreground">
                                        lessons
                                    </span>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>

            {#if leaderboard.length === 0}
                <div class="text-center py-12 text-muted-foreground">
                    <Trophy class="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p class="text-lg mb-2">No rankings yet</p>
                    <p class="text-sm">
                        Be the first to complete lessons and claim the top spot!
                    </p>
                </div>
            {/if}
        </div>

        {#if current_user && !leaderboard
                .slice(0, 10)
                .find((u) => u.username === current_user.username)}
            <div class="mt-8 bg-card border border-primary/30 rounded-lg p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-muted-foreground mb-1">
                            Your Rank
                        </div>
                        <div class="text-2xl font-bold">
                            #{current_user.rank}
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-muted-foreground mb-1">
                            {current_user.level}
                        </div>
                        <div class="text-xl font-bold text-primary">
                            {current_user.xp.toLocaleString()} XP
                        </div>
                        <div class="text-xs text-muted-foreground mt-1">
                            {current_user.completed} lessons completed
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div class="bg-card border border-border rounded-lg p-6">
                <div class="flex items-center gap-3 mb-2">
                    <Trophy class="w-5 h-5 text-yellow-500" />
                    <div class="text-sm text-muted-foreground">
                        Total Learners
                    </div>
                </div>
                <div class="text-2xl font-bold">{leaderboard.length}</div>
            </div>
            <div class="bg-card border border-border rounded-lg p-6">
                <div class="flex items-center gap-3 mb-2">
                    <Star class="w-5 h-5 text-primary" />
                    <div class="text-sm text-muted-foreground">
                        Average Level
                    </div>
                </div>
                <div class="text-2xl font-bold">
                    {leaderboard.length > 0
                        ? Math.round(
                              leaderboard.reduce(
                                  (sum, u) =>
                                      sum + parseInt(u.level.split(" ")[1]),
                                  0,
                              ) / leaderboard.length,
                          )
                        : 0}
                </div>
            </div>
            <div class="bg-card border border-border rounded-lg p-6">
                <div class="flex items-center gap-3 mb-2">
                    <Award class="w-5 h-5 text-green-500" />
                    <div class="text-sm text-muted-foreground">
                        Total XP Earned
                    </div>
                </div>
                <div class="text-2xl font-bold">
                    {leaderboard
                        .reduce((sum, u) => sum + u.xp, 0)
                        .toLocaleString()}
                </div>
            </div>
        </div>
    </div>
</main>
