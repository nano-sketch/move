<script lang="ts">
    import { onMount, tick } from "svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import {
        Download,
        ExternalLink,
        FileText,
        Calendar,
        BookOpen,
    } from "lucide-svelte";
    import Particles from "$lib/components/misc/Particles.svelte";
    let mounted = $state(false);
    let searchDebounceTimer: ReturnType<typeof setTimeout>;

    const resources = [
        {
            id: 1,
            title: "Unit 4: Software Design and Development Project - Sample",
            description: "sample assessment for the exam",
            type: "Specification",
            year: "2016",
            downloadUrl:
                "https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/Sample-assessment-material-Unit-4-Software-Design-And-Development-Project.pdf",
            previewUrl:
                "https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/Sample-assessment-material-Unit-4-Software-Design-And-Development-Project.pdf",
            category: "Exam Sample",
            image: "/sort/unit4-software-design-and-development-project-sample.png",
        },
        {
            id: 2,
            title: "Python 3 Official Documentation",
            description:
                "complete python 3 documentation covering data structures, built-in functions, and programming paradigms",
            type: "Reference Guide",
            year: "2024",
            downloadUrl: "https://docs.python.org/3/",
            previewUrl: "https://docs.python.org/3/",
            category: "Programming",
            image: "/sort/python-official-documentation.png",
        },
        {
            id: 3,
            title: "W3Schools Python 3 Tutorial",
            description: "Intro to python 3",
            type: "Study Guide",
            year: "2025",
            downloadUrl: "https://www.w3schools.com/python/default.asp",
            previewUrl: "https://www.w3schools.com/python/default.asp",
            category: "Programming",
            image: "/sort/w3schools-python.png",
        },
        {
            id: 4,
            title: "Lucid chart Flowcharts Tutorial",
            description:
                "official British Computer Society flowchart symbols and conventions for system design",
            type: "Reference Guide",
            year: "2025",
            downloadUrl:
                "https://www.lucidchart.com/pages/what-is-a-flowchart-tutorial",
            previewUrl:
                "https://www.lucidchart.com/pages/what-is-a-flowchart-tutorial",
            category: "Flowcharts",
            image: "/sort/lucid-chart.png",
        },
        {
            id: 5,
            title: "Program testing",
            description:
                "testing methodologies, test case design, functionality testing, and validation techniques",
            type: "Guide",
            year: "2025",
            downloadUrl:
                "https://www.bbc.co.uk/bitesize/guides/zb33rwx/revision/8",
            previewUrl:
                "https://www.bbc.co.uk/bitesize/guides/zb33rwx/revision/8",
            category: "Testing",
            image: "/sort/program-testing.png",
        },
        {
            id: 6,
            title: "Writing Psuedo Code",
            description: "learn how to write psuedo code for your project",
            type: "Study Guide",
            year: "2025",
            downloadUrl:
                "https://www.bbc.co.uk/bitesize/guides/z3bq7ty/revision/2",
            previewUrl:
                "https://www.bbc.co.uk/bitesize/guides/z3bq7ty/revision/2",
            category: "Design Principles",
            image: "/sort/writing-pseudo-code.png",
        },
        {
            id: 7,
            title: "Specification doc",
            description: "specification document for the project(OLD)",
            type: "Reference Guide",
            year: "2016",
            downloadUrl:
                "https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/teaching-and-learning/BTECNational_Computing_Unit4.pdf",
            previewUrl:
                "https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/teaching-and-learning/BTECNational_Computing_Unit4.pdf",
            category: "Programming",
            image: "/sort/specification-doc.png",
        },
        {
            id: 8,
            title: "Revise btec national computing full guide",
            description: "the full complete guide for btec national computing",
            type: "Btec guide",
            year: "2025",
            downloadUrl:
                "https://archive.org/download/revise-btec-national-computing-revision-guide-mark-fishpool-christine-gate-steve/Revise%20BTEC%20national%20computing_%20Revision%20guide%20--%20Mark%20Fishpool%2C%20Christine%20Gate%2C%20Steve%20Farrell%2C%20Richard%20McGill%20--%202017%20--%20Harlow_%20Pearson%20Education%20--%209781292150208%20--%209ed30978abea27f6f7f877d473f2aaad%20--%20Anna%E2%80%99s%20Archive.pdf",
            previewUrl:
                "https://archive.org/details/revise-btec-national-computing-revision-guide-mark-fishpool-christine-gate-steve",
            category: "Programming",
            image: "/sort/btec-national-computing-full-guide.png",
        },
        {
            id: 9,
            title: "Algorithm design",
            description: "how to design an algorithm",
            type: "Programming guide",
            year: "2025",
            downloadUrl:
                "https://www.bbc.co.uk/bitesize/guides/z3bq7ty/revision/1",
            previewUrl:
                "https://www.bbc.co.uk/bitesize/guides/z3bq7ty/revision/1",
            category: "Programming",
            image: "/sort/algorithm-design.png",
        },
        {
            id: 10,
            title: "Marking Scheme for Flowchart, Pseudocode And Code",
            description:
                "the official marking scheme that will be used to mark your exam",
            type: "Reference Guide",
            year: "2025",
            downloadUrl:
                "https://wtcollege.sharepoint.com/:b:/s/Section_CDB-WTC-2025-CLASS-0062-24-GPA/ERbsn6ihteNBp_j3F-j5qHYBO9LDlHuuKmK-idok_IRuQA?e=gGIc40",
            previewUrl:
                "https://wtcollege.sharepoint.com/:b:/s/Section_CDB-WTC-2025-CLASS-0062-24-GPA/ERbsn6ihteNBp_j3F-j5qHYBO9LDlHuuKmK-idok_IRuQA?e=gGIc40",
            category: "Programming",
            image: "/sort/mark-scheme-for-flowchart-pseudocode-and-code.png",
        },
        {
            id: 11,
            title: "Data validation Doc",
            description: "a small and handy data validation guide",
            type: "Reference Guide",
            year: "2025",
            downloadUrl:
                "https://wtcollege.sharepoint.com/:b:/s/Section_CDB-WTC-2025-CLASS-0062-24-GPA/EaAQM0f90utBtGrBMVJUMqkB0Rp9nQes0R_UOiPz6PA6sg?e=7F85yv",
            previewUrl:
                "https://wtcollege.sharepoint.com/:b:/s/Section_CDB-WTC-2025-CLASS-0062-24-GPA/EaAQM0f90utBtGrBMVJUMqkB0Rp9nQes0R_UOiPz6PA6sg?e=7F85yv",
            category: "Programming",
            image: "/sort/data-validation.png",
        },
        {
            id: 12,
            title: "Python cheatsheet",
            description: "a cheatsheet for python",
            type: "Reference Guide",
            year: "2025",
            downloadUrl: "https://gto76.github.io/python-cheatsheet/",
            previewUrl: "https://gto76.github.io/python-cheatsheet/",
            category: "Programming",
            image: "/sort/pythonf.png",
        },
        {
            id: 13,
            title: "The best python guide/book",
            description:
                "this free online book will help you excel in python(also covers flowcharts)",
            type: "Reference Guide",
            year: "2025",
            downloadUrl: "https://automatetheboringstuff.com/",
            previewUrl: "https://automatetheboringstuff.com/",
            category: "Recommended",
            image: "/sort/loaf.png",
        },
        {
            id: 14,
            title: "Python snippets",
            description: "github python snippets",
            type: "Reference Guide",
            year: "2025",
            downloadUrl:
                "https://github.com/trekhleb/learn-python/tree/master/src",
            previewUrl:
                "https://github.com/trekhleb/learn-python/tree/master/src",
            category: "Programming",
            image: "/sort/py.png",
        },
    ];

    const categories = [
        "All",
        "Exam Sample",
        "Programming",
        "Recommended",
        "Testing",
        "Design Principles",
    ];
    let selectedCategory = $state("All");
    let searchTerm = $state("");
    let debouncedSearchTerm = $state("");
    function updateSearch(value: string) {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            debouncedSearchTerm = value;
        }, 150);
    }

    let filteredResources = $derived.by(() => {
        if (!mounted) return [];
        const categoryMatch = selectedCategory === "All";
        const searchLower = debouncedSearchTerm.toLowerCase();
        const hasSearch = searchLower.length > 0;
        return resources.filter((resource) => {
            const matchesCategory =
                categoryMatch || resource.category === selectedCategory;
            if (!hasSearch) return matchesCategory;
            const matchesSearch =
                resource.title.toLowerCase().includes(searchLower) ||
                resource.description.toLowerCase().includes(searchLower);
            return matchesCategory && matchesSearch;
        });
    });

    function getTypeColor(type: string) {
        switch (type) {
            case "Specification":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "Reference Guide":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "Study Guide":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Assessment Guide":
                return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "Btec guide":
                return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
            case "Programming guide":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "Guide":
                return "bg-teal-500/10 text-teal-500 border-teal-500/20";
            case "Recommended":
                return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            default:
                return "bg-muted text-muted-foreground";
        }
    }
    onMount(async () => {
        await tick();
        mounted = true;
    });
</script>

<svelte:head
    ><title>Resources - BTEC Computer Science Level 3</title><meta
        name="description"
        content="BTEC Computer Science Level 3 Year 2 resources, past papers, and study materials"
    /></svelte:head
>
<div class="min-h-screen bg-background">
    <Particles className="absolute inset-0" refresh={true} />
    <main class="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div class="mb-8">
            <div class="flex items-center gap-3 mb-4">
                <BookOpen class="h-8 w-8 text-primary" />
                <h1 class="text-3xl font-bold">Unit 4 Resources</h1>
            </div>
            <p class="text-muted-foreground text-lg">
                Software Design and Development Project - BTEC Level 3
                (External)
            </p>
            <p class="text-sm text-muted-foreground mt-2">
                Python 3.4+ and C family programming languages - Exam Papers and
                Study Materials
            </p>
        </div>
        <div class="mb-8 space-y-4">
            <div class="flex-1">
                <label for="search" class="text-sm font-medium mb-2 block"
                    >Search</label
                >
                <div class="relative">
                    <input
                        id="search"
                        type="text"
                        placeholder="Search resources..."
                        bind:value={searchTerm}
                        oninput={(e) =>
                            updateSearch(
                                (e.target as HTMLInputElement)?.value || "",
                            )}
                        class="w-full bg-card border border-border rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-0 focus:border-primary"
                        style="outline: none !important; box-shadow: none !important;"
                    /><svg
                        class="w-4 h-4 absolute left-3 top-3 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path></svg
                    >
                </div>
            </div>
            <div class="flex flex-wrap gap-2">
                {#each categories as category}<button
                        onclick={() => (selectedCategory = category)}
                        class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-75 ease-out {selectedCategory ===
                        category
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'}"
                        >{category}</button
                    >{/each}
            </div>
        </div>
        {#if mounted}<div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {#each filteredResources as resource (resource.id)}<div
                        class="bg-card border border-border rounded-lg p-6"
                    >
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center gap-2">
                                <FileText class="h-5 w-5 text-primary" /><span
                                    class="text-xs px-2 py-1 rounded-full border {getTypeColor(
                                        resource.type,
                                    )}">{resource.type}</span
                                >
                            </div>
                            <div
                                class="flex items-center gap-1 text-xs text-muted-foreground"
                            >
                                <Calendar class="h-3 w-3" />{resource.year}
                            </div>
                        </div>
                        <div class="mb-4 flex justify-end">
                            <div
                                class="w-16 h-12 rounded-md overflow-hidden bg-muted/20 border border-border/50 flex-shrink-0"
                            >
                                <img
                                    src={resource.image}
                                    alt="{resource.title} preview"
                                    class="w-full h-full object-fill"
                                    loading="lazy"
                                    draggable="false"
                                />
                            </div>
                        </div>
                        <div class="mb-4">
                            <h3 class="font-semibold text-lg mb-2">
                                {resource.title}
                            </h3>
                            <p class="text-sm text-muted-foreground mb-3">
                                {resource.description}
                            </p>
                            <span
                                class="inline-block px-2 py-1 bg-muted text-xs rounded-full"
                                >{resource.category}</span
                            >
                        </div>
                        <div class="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                class="flex-1"
                                onclick={() =>
                                    window.open(resource.previewUrl, "_blank")}
                                ><ExternalLink
                                    class="h-4 w-4 mr-2"
                                />Preview</Button
                            ><Button
                                size="sm"
                                class="flex-1"
                                onclick={() =>
                                    window.open(resource.downloadUrl, "_blank")}
                                ><Download
                                    class="h-4 w-4 mr-2"
                                />Download</Button
                            >
                        </div>
                    </div>{/each}
            </div>{:else}<div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <div class="col-span-full text-center py-8">
                    <div class="animate-pulse">Loading resources...</div>
                </div>
            </div>{/if}{#if filteredResources.length === 0}<div
                class="text-center py-12"
            >
                <FileText
                    class="h-12 w-12 text-muted-foreground mx-auto mb-4"
                />
                <h3 class="text-lg font-semibold mb-2">No resources found</h3>
                <p class="text-muted-foreground">
                    Try adjusting your search terms or category filter.
                </p>
            </div>{/if}

        <div
            class="mt-16 bg-gradient-to-br from-card to-muted/30 border border-border rounded-xl p-6 shadow-sm"
        >
            <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-primary/10 rounded-lg">
                    <BookOpen class="h-6 w-6 text-primary" />
                </div>
                <h2 class="text-xl font-bold font-mono">
                    about unit 4: software design and development project
                </h2>
            </div>

            <div class="grid lg:grid-cols-3 gap-6">
                <div class="bg-card/50 rounded-lg p-4 border border-border/50">
                    <h3
                        class="text-base font-semibold mb-3 text-primary font-mono"
                    >
                        unit overview
                    </h3>
                    <p
                        class="text-xs text-muted-foreground leading-relaxed mb-4"
                    >
                        external unit focusing on software development using <span
                            class="font-medium text-foreground"
                            >python 3.4+</span
                        >
                        or
                        <span class="font-medium text-foreground"
                            >c family languages</span
                        >. complete development lifecycle from conception to
                        evaluation.
                    </p>

                    <div class="pt-3 border-t border-border/50">
                        <h4
                            class="font-semibold text-orange-500 font-mono mb-2 text-sm"
                        >
                            • assessment
                        </h4>
                        <div class="space-y-2 text-xs">
                            <div class="flex items-start gap-2">
                                <span
                                    class="text-orange-500 font-mono text-xs mt-0.5"
                                    >•</span
                                >
                                <span
                                    ><span class="font-medium text-foreground"
                                        >task-based</span
                                    > by pearson, supervised conditions</span
                                >
                            </div>
                            <div class="flex items-start gap-2">
                                <span
                                    class="text-orange-500 font-mono text-xs mt-0.5"
                                    >•</span
                                >
                                <span
                                    >max <span
                                        class="font-semibold text-orange-500"
                                        >6hrs</span
                                    >
                                    over 1 week,
                                    <span class="font-semibold text-orange-500"
                                        >68 marks</span
                                    ></span
                                >
                            </div>
                            <div class="flex items-start gap-2">
                                <span
                                    class="text-orange-500 font-mono text-xs mt-0.5"
                                    >•</span
                                >
                                <span
                                    ><span class="font-medium">dec/jan</span> &
                                    <span class="font-medium">may/jun</span> windows</span
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-card/50 rounded-lg p-4 border border-border/50">
                    <h3
                        class="text-base font-semibold mb-3 text-primary font-mono"
                    >
                        assessment outcomes
                    </h3>
                    <div class="space-y-2 mb-4">
                        {#each ["demonstrate coding paradigms", "design software solutions", "analyse & optimise performance", "evaluate & make judgements", "develop with justification"] as outcome, i}
                            <div class="flex items-start gap-2">
                                <span
                                    class="inline-flex items-center justify-center w-4 h-4 bg-primary/10 text-primary text-xs font-bold rounded-full flex-shrink-0 mt-0.5"
                                    >{i + 1}</span
                                >
                                <span class="text-xs text-muted-foreground"
                                    >{outcome}</span
                                >
                            </div>
                        {/each}
                    </div>

                    <div class="pt-3 border-t border-border/50">
                        <h4
                            class="font-semibold text-primary font-mono mb-2 text-sm"
                        >
                            • key topics
                        </h4>
                        <div class="grid grid-cols-1 gap-3 text-xs">
                            <div>
                                <div class="flex items-center gap-1 mb-1">
                                    <div
                                        class="w-1.5 h-1.5 bg-blue-500 rounded-full"
                                    ></div>
                                    <span
                                        class="font-medium text-foreground font-mono"
                                        >development:</span
                                    >
                                </div>
                                <div class="text-muted-foreground ml-3">
                                    structured pseudocode
                                </div>
                            </div>
                            <div>
                                <div class="flex items-center gap-1 mb-1">
                                    <div
                                        class="w-1.5 h-1.5 bg-green-500 rounded-full"
                                    ></div>
                                    <span
                                        class="font-medium text-foreground font-mono"
                                        >programming:</span
                                    >
                                </div>
                                <div class="text-muted-foreground ml-3">
                                    data structures • built-ins • control flow
                                </div>
                            </div>
                            <div>
                                <div class="flex items-center gap-1 mb-1">
                                    <div
                                        class="w-1.5 h-1.5 bg-orange-500 rounded-full"
                                    ></div>
                                    <span
                                        class="font-medium text-foreground font-mono"
                                        >qa:</span
                                    >
                                </div>
                                <div class="text-muted-foreground ml-3">
                                    testing • validation • design principles
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-card/50 rounded-lg p-4 border border-border/50">
                    <h3
                        class="text-base font-semibold mb-3 text-emerald-500 font-mono"
                    >
                        • grade descriptors
                    </h3>

                    <div class="space-y-3">
                        <div
                            class="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg"
                        >
                            <div class="flex items-center gap-2 mb-2">
                                <span class="text-emerald-500 font-mono text-sm"
                                    >•</span
                                >
                                <h4
                                    class="font-semibold text-emerald-500 text-sm font-mono"
                                >
                                    principle
                                </h4>
                            </div>
                            <p class="text-xs text-muted-foreground">
                                <span class="font-medium text-foreground"
                                    >best fit</span
                                > approach across essential content areas.
                            </p>
                        </div>

                        <div class="space-y-3">
                            <div
                                class="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg"
                            >
                                <div class="flex items-center gap-2 mb-2">
                                    <span
                                        class="text-blue-500 font-mono text-sm"
                                        >•</span
                                    >
                                    <h4
                                        class="font-semibold text-blue-500 text-sm font-mono"
                                    >
                                        level 3 pass
                                    </h4>
                                </div>
                                <div
                                    class="space-y-1 text-xs text-muted-foreground"
                                >
                                    <div class="flex items-start gap-1">
                                        <span
                                            class="text-blue-500 font-mono text-xs mt-0.5"
                                            >•</span
                                        >
                                        <span
                                            ><span
                                                class="font-medium text-foreground"
                                                >design & build</span
                                            > software for client needs</span
                                        >
                                    </div>
                                    <div class="flex items-start gap-1">
                                        <span
                                            class="text-blue-500 font-mono text-xs mt-0.5"
                                            >•</span
                                        >
                                        <span
                                            ><span
                                                class="font-medium text-foreground"
                                                >standard constructs</span
                                            > with testing evidence</span
                                        >
                                    </div>
                                </div>
                            </div>

                            <div
                                class="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg"
                            >
                                <div class="flex items-center gap-2 mb-2">
                                    <span
                                        class="text-amber-500 font-mono text-sm"
                                        >•</span
                                    >
                                    <h4
                                        class="font-semibold text-amber-500 text-sm font-mono"
                                    >
                                        level 3 distinction
                                    </h4>
                                </div>
                                <div
                                    class="space-y-1 text-xs text-muted-foreground"
                                >
                                    <div class="flex items-start gap-1">
                                        <span
                                            class="text-amber-500 font-mono text-xs mt-0.5"
                                            >•</span
                                        >
                                        <span
                                            ><span
                                                class="font-medium text-foreground"
                                                >analyse & interpret</span
                                            > for detailed solutions</span
                                        >
                                    </div>
                                    <div class="flex items-start gap-1">
                                        <span
                                            class="text-amber-500 font-mono text-xs mt-0.5"
                                            >•</span
                                        >
                                        <span
                                            ><span
                                                class="font-medium text-foreground"
                                                >in-depth understanding</span
                                            > of data handling</span
                                        >
                                    </div>
                                    <div class="flex items-start gap-1">
                                        <span
                                            class="text-amber-500 font-mono text-xs mt-0.5"
                                            >•</span
                                        >
                                        <span
                                            ><span
                                                class="font-medium text-foreground"
                                                >optimised solutions</span
                                            > with justification</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<style>
    .w-1,
    .w-2,
    .h-1,
    .h-2,
    .rounded-full {
        user-select: none !important;
        pointer-events: none;
    }
    .font-mono {
        font-family:
            "Geist Mono", "Geist Mono Fallback", "JetBrains Mono", "Fira Code",
            "Cascadia Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono",
            "Source Code Pro", "Ubuntu Mono", monospace;
    }
    * {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
    }
    .grid {
        contain: layout style;
    }
    .bg-card {
        will-change: transform;
        transform: translateZ(0);
    }
    .hover\:shadow-lg {
        transition: box-shadow 0.15s ease-in-out;
    }
    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
</style>
