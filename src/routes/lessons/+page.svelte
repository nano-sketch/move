<script lang="ts">
    import Particles from "$lib/components/misc/Particles.svelte";
    import { onMount } from "svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import lessons from "$lib/lessons/lessons.json";
    import { goto } from "$app/navigation";
    import { Check, CheckCheck, CheckCircle, CheckIcon } from "lucide-svelte";

    onMount(() => {
        document.documentElement.classList.add("dark");
        if (!localStorage.getItem("username")) {
            goto("/login");
        }
    });

    let {
        data,
    }: {
        data: {
            user: { username: string; progress: number; completed: number[] };
        };
    } = $props();

    const progress = data.user.progress;
    const completed = data.user.completed;

    let search_query = $state("");
    let selected_topic = $state("all");
    let selected_diff = $state("all");
    let sort_option = $state("difficulty-easy");

    let filtered_lessons = $derived.by(() => {
        let filtered = lessons.filter((lesson) => {
            const matches_srch =
                lesson.title
                    .toLowerCase()
                    .includes(search_query.toLowerCase()) ||
                lesson.description
                    .toLowerCase()
                    .includes(search_query.toLowerCase());
            const matches_topic =
                selected_topic === "all" || lesson.topic === selected_topic;
            const matches_diff =
                selected_diff === "all" || lesson.difficulty === selected_diff;
            return matches_srch && matches_topic && matches_diff;
        });
        if (sort_option === "success-high") {
            filtered.sort((a, b) => b.success_rate - a.success_rate);
        } else if (sort_option === "success-low") {
            filtered.sort((a, b) => a.success_rate - b.success_rate);
        } else if (sort_option === "difficulty-easy") {
            const diff_order = { Easy: 1, Medium: 2, Hard: 3 };
            filtered.sort(
                (a, b) =>
                    diff_order[a.difficulty as keyof typeof diff_order] -
                    diff_order[b.difficulty as keyof typeof diff_order],
            );
        } else if (sort_option === "difficulty-hard") {
            const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
            filtered.sort(
                (a, b) =>
                    difficultyOrder[
                        b.difficulty as keyof typeof difficultyOrder
                    ] -
                    difficultyOrder[
                        a.difficulty as keyof typeof difficultyOrder
                    ],
            );
        } else if (sort_option === "newest") {
            filtered.sort((a, b) => b.id - a.id);
        } else if (sort_option === "oldest") {
            filtered.sort((a, b) => a.id - b.id);
        }
        return filtered;
    });

    function get_diff_clr(difficulty: string) {
        switch (difficulty) {
            case "Easy":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Medium":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "Hard":
            default:
                return "bg-muted text-muted-foreground";
        }
    }
    function getTopicColor(topic: string): string {
        const colors = {
            Basics: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            "Data Structures":
                "bg-purple-500/10 text-purple-400 border-purple-500/20",
            "Control Flow": "bg-pink-500/10 text-pink-400 border-pink-500/20",
            Functions: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            Advanced: "bg-orange-500/10 text-orange-400 border-orange-500/20",
            OOP: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        };
        return (
            colors[topic as keyof typeof colors] ||
            "bg-muted text-muted-foreground"
        );
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
                        for="search-input"
                        class="text-sm font-medium mb-2 block">Search</label
                    >
                    <div class="relative">
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Search lessons..."
                            bind:value={search_query}
                            class="w-full bg-card border border-border rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-0 focus:border-primary"
                            style="outline: none !important; box-shadow: none !important;"
                        />
                        <svg
                            class="w-4 h-4 absolute left-3 top-3 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            /></svg
                        >
                    </div>
                </div>
                <div>
                    <label
                        for="topic-select"
                        class="text-sm font-medium mb-2 block">Topic</label
                    >
                    <select
                        id="topic-select"
                        bind:value={selected_topic}
                        class="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-primary min-w-[160px]"
                        style="outline: none !important; box-shadow: none !important;"
                    >
                        <option value="all">All Topics</option>
                        <option value="Basics">Basics</option>
                        <option value="Data Structures">Data Structures</option>
                        <option value="Control Flow">Control Flow</option>
                        <option value="Functions">Functions</option>
                        <option value="Advanced">Advanced</option>
                        <option value="OOP">OOP</option>
                    </select>
                </div>

                <div>
                    <label
                        for="difficulty-select"
                        class="text-sm font-medium mb-2 block">Difficulty</label
                    >
                    <select
                        id="difficulty-select"
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
                    <label
                        for="sort-select"
                        class="text-sm font-medium mb-2 block">Sort By</label
                    >
                    <select
                        id="sort-select"
                        bind:value={sort_option}
                        class="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-primary min-w-[180px]"
                        style="outline: none !important; box-shadow: none !important;"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="success-high">Success Rate (High)</option
                        >
                        <option value="success-low">Success Rate (Low)</option>
                        <option value="difficulty-easy"
                            >Difficulty (Easy)</option
                        >
                        <option value="difficulty-hard"
                            >Difficulty (Hard)</option
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
                            class={`border-b border-border transition-colors ${
                                lesson.disabled
                                    ? "opacity-50 cursor-not-allowed pointer-events-none select-none"
                                    : "hover:bg-muted/30 cursor-pointer"
                            }`}
                            aria-disabled={lesson.disabled}
                        >
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div>
                                        <div
                                            class="font-medium flex items-center gap-2"
                                        >
                                            {lesson.title}

                                            {#if completed.includes(lesson.id)}
                                                <CheckIcon
                                                    class="text-green-500"
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
                                    class="text-xs px-3 py-1 rounded-full border {getTopicColor(
                                        lesson.topic,
                                    )}"
                                >
                                    {lesson.topic}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <div class="text-sm font-medium">
                                        {completed.includes(lesson.id)
                                            ? "100"
                                            : "0"}%
                                    </div>
                                    <div
                                        class="w-16 h-1.5 bg-muted rounded-full overflow-hidden"
                                    >
                                        <div
                                            class="h-full bg-primary rounded-full"
                                            style="width: {completed.includes(
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
                                    class="text-xs px-3 py-1 rounded-full border {get_diff_clr(
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
                                    <Button size="sm" class="cursor-pointer">
                                        Start Lesson
                                    </Button>
                                </a>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>

            {#if filtered_lessons.length === 0}
                <div class="text-center py-12 text-muted-foreground">
                    <p class="text-lg mb-2">no lessons found</p>
                    <p class="text-sm">try adjusting your search or filters</p>
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
                    {progress} / {lessons.length}
                </div>
            </div>
            <div class="bg-card border border-border rounded-lg p-6">
                <div class="text-sm text-muted-foreground mb-1">
                    Average Success Rate
                </div>
                <div class="text-2xl font-bold">
                    {(
                        (lessons.filter((l) =>
                            data.user.completed.includes(l.id),
                        ).length /
                            lessons.length) *
                        100
                    ).toFixed(1)}%
                </div>
            </div>
        </div>
    </div>
</main>
