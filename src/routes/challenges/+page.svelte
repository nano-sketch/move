<script lang="ts">
    import {Code2, CheckIcon} from "lucide-svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Particles from "$lib/components/misc/Particles.svelte";
    import challenges from "$lib/challenges/challenges.json";
    
    let {data}: {data: {user: {username: string; completed_challenges: number[]};}} = $props();
    const completed_challenges = data.user.completed_challenges;
    
    let search_query = $state("");
    let selected_topic = $state("all");
    let selected_diff = $state("all");
    let sort_option = $state("difficulty-easy");
    
    let filtered_challenges = $derived.by(() => {
        let filtered = challenges.filter(challenge => {
            const matches_srch = challenge.title.toLowerCase().includes(search_query.toLowerCase()) || 
                                challenge.description.toLowerCase().includes(search_query.toLowerCase());
            const matches_topic = selected_topic === "all" || challenge.topic === selected_topic;
            const matches_diff = selected_diff === "all" || challenge.difficulty === selected_diff;
            return matches_srch && matches_topic && matches_diff;
        });
        
        if (sort_option === "difficulty-easy") {
            const order: Record<string, number> = {Easy: 1, Medium: 2, Hard: 3};
            filtered.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
        } else if (sort_option === "difficulty-hard") {
            const order: Record<string, number> = {Easy: 1, Medium: 2, Hard: 3};
            filtered.sort((a, b) => order[b.difficulty] - order[a.difficulty]);
        } else if (sort_option === "newest") {
            filtered.sort((a, b) => b.id - a.id);
        } else if (sort_option === "oldest") {
            filtered.sort((a, b) => a.id - b.id);
        }
        
        return filtered;
    });
    
    function get_diff_clr(d: string) {
        const colors: Record<string, string> = {
            "Easy": "bg-green-500/10 text-green-500 border-green-500/20",
            "Medium": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
            "Hard": "bg-red-500/10 text-red-500 border-red-500/20"
        };
        return colors[d] || "bg-muted text-muted-foreground";
    }
    
    function get_topic_clr(t: string) {
        const colors: Record<string, string> = {
            "Basics": "bg-blue-500/10 text-blue-400 border-blue-500/20",
            "Strings": "bg-purple-500/10 text-purple-400 border-purple-500/20",
            "Lists": "bg-pink-500/10 text-pink-400 border-pink-500/20",
            "Control Flow": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            "Functions": "bg-orange-500/10 text-orange-400 border-orange-500/20"
        };
        return colors[t] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
</script>

<svelte:head>
    <title>Challenges - GetGodly</title>
    <meta name="description" content="Python coding challenges - Test your skills with interactive programming exercises" />
</svelte:head>

<div class="relative min-h-screen select-none">
    <Particles className="absolute inset-0" refresh={true} />
    
    <header class="relative z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div class="flex items-center gap-6">
                <a href="/" class="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/40 transition-all duration-300 cursor-default">getgodly</a>
                <nav class="flex items-center gap-4">
                    <a href="/start" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Lessons</a>
                    <a href="/challenges" class="text-sm font-medium text-foreground">Challenges</a>
                    <a href="/resources" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Resources</a>
                    <a href="/playground" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Playground</a>
                </nav>
            </div>
            <Button variant="outline" size="sm" href="/account">Account</Button>
        </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div class="mb-8">
            <h1 class="text-3xl font-bold mb-6">Challenges</h1>
            
            <div class="flex flex-col lg:flex-row gap-4 mb-6">
                <div class="flex-1">
                    <label for="search" class="text-sm font-medium mb-2 block">Search</label>
                    <div class="relative">
                        <input 
                            id="search" 
                            type="text" 
                            placeholder="Search challenges..." 
                            bind:value={search_query} 
                            class="w-full bg-card border border-border rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-0 focus:border-primary" 
                            style="outline: none !important; box-shadow: none !important;"
                        />
                        <svg class="w-4 h-4 absolute left-3 top-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>
                </div>
                
                <div>
                    <label for="topic" class="text-sm font-medium mb-2 block">Topic</label>
                    <select 
                        id="topic" 
                        bind:value={selected_topic} 
                        class="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-primary min-w-[160px]" 
                        style="outline: none !important; box-shadow: none !important;"
                    >
                        <option value="all">All Topics</option>
                        <option value="Basics">Basics</option>
                        <option value="Strings">Strings</option>
                        <option value="Lists">Lists</option>
                        <option value="Control Flow">Control Flow</option>
                        <option value="Functions">Functions</option>
                    </select>
                </div>
                
                <div>
                    <label for="difficulty" class="text-sm font-medium mb-2 block">Difficulty</label>
                    <select 
                        id="difficulty" 
                        bind:value={selected_diff} 
                        class="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-primary min-w-[160px]" 
                        style="outline: none !important; box-shadow: none !important;"
                    >
                        <option value="all">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                
                <div>
                    <label for="sort" class="text-sm font-medium mb-2 block">Sort By</label>
                    <select 
                        bind:value={sort_option} 
                        class="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-primary min-w-[180px]" 
                        style="outline: none !important; box-shadow: none !important;"
                    >
                        <option value="difficulty-easy">Difficulty: Easy First</option>
                        <option value="difficulty-hard">Difficulty: Hard First</option>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="bg-card border border-border rounded-lg overflow-hidden">
            <table class="w-full">
                <thead class="bg-muted/50 border-b border-border">
                    <tr>
                        <th class="text-left px-6 py-3 text-sm font-semibold">Title</th>
                        <th class="text-left px-6 py-3 text-sm font-semibold">Topic</th>
                        <th class="text-left px-6 py-3 text-sm font-semibold">Success Rate</th>
                        <th class="text-left px-6 py-3 text-sm font-semibold">Difficulty</th>
                        <th class="text-right px-6 py-3 text-sm font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filtered_challenges as challenge (challenge.id)}
                        <tr class="border-b border-border transition-colors hover:bg-muted/30 cursor-pointer">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div>
                                        <div class="font-medium flex items-center gap-2">
                                            {challenge.title}
                                            {#if completed_challenges.includes(challenge.id)}
                                                <CheckIcon class="text-green-500"/>
                                            {/if}
                                        </div>
                                        <div class="text-sm text-muted-foreground mt-1">
                                            {challenge.description.split('\n\n')[0]}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-xs px-3 py-1 rounded-full border {get_topic_clr(challenge.topic)}">
                                    {challenge.topic}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <div class="text-sm font-medium">
                                        {completed_challenges.includes(challenge.id) ? "100" : "0"}%
                                    </div>
                                    <div class="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div 
                                            class="h-full bg-primary rounded-full" 
                                            style="width: {completed_challenges.includes(challenge.id) ? '100' : '0'}%"
                                        ></div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-xs px-3 py-1 rounded-full border {get_diff_clr(challenge.difficulty)}">
                                    {challenge.difficulty}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <a href="/challenge/{challenge.id}" data-sveltekit-preload-data="hover">
                                    <Button size="sm" class="cursor-pointer">
                                        Start Challenge
                                    </Button>
                                </a>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            
            {#if filtered_challenges.length === 0}
                <div class="py-12 text-center text-muted-foreground">
                    No challenges found matching your criteria
                </div>
            {/if}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div class="bg-card border border-border rounded-lg p-6">
                <div class="text-sm text-muted-foreground mb-1">Total Challenges</div>
                <div class="text-2xl font-bold">{challenges.length}</div>
            </div>
            <div class="bg-card border border-border rounded-lg p-6">
                <div class="text-sm text-muted-foreground mb-1">Completed</div>
                <div class="text-2xl font-bold">{completed_challenges.length} / {challenges.length}</div>
            </div>
            <div class="bg-card border border-border rounded-lg p-6">
                <div class="text-sm text-muted-foreground mb-1">Average Success Rate</div>
                <div class="text-2xl font-bold">
                    {((completed_challenges.length / challenges.length) * 100).toFixed(1)}%
                </div>
            </div>
        </div>
    </div>
</div>
