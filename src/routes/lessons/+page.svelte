<script lang="ts">
    import Particles from "$lib/components/misc/Particles.svelte";
    import { onMount } from "svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import lessons from "$lib/lessons/lessons.json";
    import { CheckIcon } from "lucide-svelte";

    onMount(() => {
        document.documentElement.classList.add("dark");
    });

    let { data } = $props();

    const user_progress = data?.user?.progress ?? 0;
    const user_completed = data?.user?.completed ?? [];

    let search_query = $state("");
    let selected_topic = $state("all");
    let selected_difficulty = $state("all");
    let sort_by = $state("newest");

    const filtered_lessons = $derived.by(() => {
        let filtered = lessons.filter((lesson) => {
            const matches_search =
                lesson.title
                    .toLowerCase()
                    .includes(search_query.toLowerCase()) ||
                lesson.description
                    .toLowerCase()
                    .includes(search_query.toLowerCase());

            const matches_topic =
                selected_topic === "all" || lesson.topic === selected_topic;

            const matches_difficulty =
                selected_difficulty === "all" ||
                lesson.difficulty === selected_difficulty;

            return matches_search && matches_topic && matches_difficulty;
        });

        if (sort_by === "difficultyEasy") {
            const order = { Easy: 1, Medium: 2, Hard: 3 };
            filtered.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
        } else if (sort_by === "difficultyHard") {
            const order = { Easy: 1, Medium: 2, Hard: 3 };
            filtered.sort((a, b) => order[b.difficulty] - order[a.difficulty]);
        } else if (sort_by === "newest") {
            filtered.sort((a, b) => a.id - b.id);
        } else if (sort_by === "oldest") {
            filtered.sort((a, b) => b.id - a.id);
        }

        return filtered;
    });

    function get_difficulty_color(difficulty: string): string {
        if (difficulty === "Easy")
            return "bg-green-500/10 text-green-500 border-green-500/20";
        if (difficulty === "Medium")
            return "bg-orange-500/10 text-orange-500 border-orange-500/20";
        return "bg-red-500/10 text-red-500 border-red-500/20";
    }

    function get_topic_color(topic: string): string {
        const colors: Record<string, string> = {
            Basics: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            Control: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            Data: "bg-orange-500/10 text-orange-400 border-orange-500/20",
            Functions: "bg-red-500/10 text-red-400 border-red-500/20",
            Errors: "bg-red-600/10 text-red-600 border-red-600/20",
            Text: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            System: "bg-green-500/10 text-green-400 border-green-500/20",
            Math: "bg-pink-500/10 text-pink-400 border-pink-500/20",
            OOP: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
            Design: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };

        return colors[topic] || "bg-muted text-muted-foreground";
    }
</script>

<svelte:head>
    <title>Lessons - GetGodly</title>
    <meta
        name="description"
        content="Python programming lessons - Learn Python step by step with interactive tutorials"
    />
</svelte:head>

<main class="min-h-screen bg-background relative select-none">
    <Particles className="absolute inset-0" refresh={true} />

    <div class="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div class="mb-8">
            <h1 class="text-3xl font-bold mb-6">Lessons</h1>

            <div class="flex flex-col lg:flex-row gap-4 mb-6">
                <div class="flex-1">
                    <label
                        for="searchInput"
                        class="text-sm font-medium mb-2 block">Search</label
                    >
                    <div class="relative">
                        <input
                            id="searchInput"
                            type="text"
                            placeholder="Search lessons..."
                            bind:value={search_query}
                            class="w-full bg-card border border-border rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-0 focus:border-primary"
                        />
                        <svg
                            class="w-4 h-4 absolute left-3 top-3 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                <div>
                    <label
                        for="topicSelect"
                        class="text-sm font-medium mb-2 block">Topic</label
                    >
                    <select
                        id="topicSelect"
                        bind:value={selected_topic}
                        class="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-primary min-w-[160px]"
                    >
                        <option value="all">All Topics</option>
                        <option value="Basics">Basics</option>
                        <option value="Control">Control</option>
                        <option value="Data">Data</option>
                        <option value="Functions">Functions</option>
                        <option value="Errors">Errors</option>
                        <option value="Text">Text</option>
                        <option value="System">System</option>
                        <option value="Math">Math</option>
                        <option value="OOP">OOP</option>
                        <option value="Design">Design</option>
                    </select>
                </div>

                <div>
                    <label
                        for="difficultySelect"
                        class="text-sm font-medium mb-2 block">Difficulty</label
                    >
                    <select
                        id="difficultySelect"
                        bind:value={selected_difficulty}
                        class="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-primary min-w-[160px]"
                    >
                        <option value="All">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                <div>
                    <label
                        for="sortSelect"
                        class="text-sm font-medium mb-2 block">Sort By</label
                    >
                    <select
                        id="sortSelect"
                        bind:value={sort_by}
                        class="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-primary min-w-[180px]"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="successHigh">Success Rate (High)</option>
                        <option value="successLow">Success Rate (Low)</option>
                        <option value="difficultyEasy">Difficulty (Easy)</option
                        >
                        <option value="difficultyHard">Difficulty (Hard)</option
                        >
                    </select>
                </div>
            </div>
        </div>

        <div class="bg-card border border-border rounded-lg overflow-hidden">
            <table class="w-full">
                <thead class="bg-muted/50 border-b border-border">
                    <tr>
                        <th class="text-left px-6 py-3 text-sm font-semibold"
                            >Title</th
                        >
                        <th class="text-left px-6 py-3 text-sm font-semibold"
                            >Topic</th
                        >
                        <th class="text-left px-6 py-3 text-sm font-semibold"
                            >Success Rate</th
                        >
                        <th class="text-left px-6 py-3 text-sm font-semibold"
                            >Difficulty</th
                        >
                        <th class="text-right px-6 py-3 text-sm font-semibold"
                            >Action</th
                        >
                    </tr>
                </thead>
                <tbody>
                    {#each filtered_lessons as lesson (lesson.id)}
                        <tr
                            class="border-b border-border transition-colors cursor-pointer {lesson.disabled
                                ? 'opacity-35 cursor-not-allowed pointer-events-none'
                                : 'hover:bg-muted/30'}"
                        >
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div>
                                        <div
                                            class="font-medium flex items-center gap-2"
                                        >
                                            {lesson.title}
                                            {#if user_completed.includes(lesson.id)}
                                                <CheckIcon
                                                    class="text-green-500 w-4 h-4"
                                                />
                                            {/if}
                                        </div>
                                        <div
                                            class="text-sm text-muted-foreground mt-1"
                                        >
                                            {lesson.description}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="text-xs px-3 py-1 rounded-full border {get_topic_color(
                                        lesson.topic,
                                    )}"
                                >
                                    {lesson.topic}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <div class="text-sm font-medium">
                                        {user_completed.includes(lesson.id)
                                            ? "100"
                                            : "0"}%
                                    </div>
                                    <div
                                        class="w-16 h-1.5 bg-muted rounded-full overflow-hidden"
                                    >
                                        <div
                                            class="h-full bg-primary rounded-full"
                                            style="width: {user_completed.includes(
                                                lesson.id,
                                            )
                                                ? '100'
                                                : '0'}%"
                                        ></div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="text-xs px-3 py-1 rounded-full border {get_difficulty_color(
                                        lesson.difficulty,
                                    )}"
                                >
                                    {lesson.difficulty}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <a
                                    href="/lesson/{lesson.id}"
                                    data-sveltekit-preload-data="hover"
                                >
                                    <Button size="sm" class="cursor-pointer"
                                        >Start Lesson</Button
                                    >
                                </a>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>

            {#if filtered_lessons.length === 0}
                <div class="text-center py-12 text-muted-foreground">
                    <p class="text-lg mb-2">No lessons found</p>
                    <p class="text-sm">Try adjusting your search or filters</p>
                </div>
            {/if}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div class="bg-card border border-border rounded-lg p-6">
                <div class="text-sm text-muted-foreground mb-1">
                    Total Lessons
                </div>
                <div class="text-2xl font-bold">{lessons.length}</div>
            </div>
            <div class="bg-card border border-border rounded-lg p-6">
                <div class="text-sm text-muted-foreground mb-1">Completed</div>
                <div class="text-2xl font-bold">
                    {user_progress} / {lessons.length}
                </div>
            </div>
            <div class="bg-card border border-border rounded-lg p-6">
                <div class="text-sm text-muted-foreground mb-1">
                    Average Success Rate
                </div>
                <div class="text-2xl font-bold">
                    {((user_completed.length / lessons.length) * 100).toFixed(
                        1,
                    )}%
                </div>
            </div>
        </div>
    </div>
</main>
