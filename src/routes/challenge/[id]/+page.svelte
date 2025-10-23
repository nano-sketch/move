<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/button/button.svelte";
    import challenges from "$lib/challenges/challenges.json";
    import {
        Play,
        RotateCcw,
        CheckCircle,
        XCircle,
        Loader2,
        CheckCircle2,
    } from "lucide-svelte";
    import { enhance } from "$app/forms";
    import { run_code } from "$lib/py/index.js";
    const challenge_id = parseInt($page.params.id || "0");
    const challenge = challenges.find((c) => c.id === challenge_id);
    let code = $state(challenge?.starter_code || "");
    let output = $state("");
    let test_results = $state<any[]>([]);
    let is_running = $state(false);
    let pyodide: any = null;
    let editor: any = null;
    let editorContainer: HTMLElement | undefined;
    let all_tests_passed = $state(false);
    let submitting = $state(false);
    let completed = $state(false);
    let activeTab = $state("description");
    let tooltip = $state({ show: false, text: "", x: 0, y: 0 });
    let highlightCache = new Map<string, string>();
    let tooltipTimeout: ReturnType<typeof setTimeout>;
    let { form, data } = $props();
    $effect(() => {
        if (data?.is_completed) completed = true;
        if (form?.success && !form?.already_completed) completed = true;
    });

    onMount(async () => {
        document.documentElement.classList.add("dark");
        await loadMonaco();
    });
    async function loadMonaco() {
        try {
            if ((window as any).monaco) {
                createEditor();
                return;
            }

            const preloadLink = document.createElement("link");
            preloadLink.rel = "preload";
            preloadLink.href =
                "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js";
            preloadLink.as = "script";
            document.head.appendChild(preloadLink);

            const script = document.createElement("script");
            script.src =
                "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js";
            script.async = true;
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
                setTimeout(
                    () => reject(new Error("monaco loading timeout")),
                    10000,
                );
            });

            (window as any).require.config({
                paths: {
                    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
                },
            });
            (window as any).require(["vs/editor/editor.main"], createEditor);
        } catch (error) {
            console.error("monaco loading failed:", error);
        }
    }

    function createEditor() {
        if (!editorContainer) return;
        editor = (window as any).monaco.editor.create(editorContainer, {
            value: code,
            language: "python",
            theme: "vs-dark",
            fontSize: 14,
            fontFamily: "Consolas, 'Courier New', monospace",
            lineNumbers: "on",
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderWhitespace: "none",
            folding: false,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 4,
            glyphMargin: false,
            scrollbar: {
                vertical: "auto",
                horizontal: "auto",
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
                useShadows: false,
            },
            wordWrap: "off",
            tabSize: 4,
            insertSpaces: true,
            selectOnLineNumbers: true,
            selectionHighlight: false,
            occurrencesHighlight: false,
            renderValidationDecorations: "off",
            quickSuggestions: false,
            parameterHints: { enabled: false },
            hover: { enabled: false },
            contextmenu: false,
        });

        let changeTimeout: ReturnType<typeof setTimeout>;
        editor.onDidChangeModelContent(() => {
            clearTimeout(changeTimeout);
            changeTimeout = setTimeout(() => {
                code = editor.getValue();
            }, 150);
        });
    }
    let pyodideLoading = false;
    async function loadPyodide() {
        if (pyodideLoading) return;
        pyodideLoading = true;
        try {
            if ((window as any).pyodideInstance) {
                pyodide = (window as any).pyodideInstance;
                output = "✓ python environment ready!";
                return;
            }

            const preloadLink = document.createElement("link");
            preloadLink.rel = "preload";
            preloadLink.href =
                "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
            preloadLink.as = "script";
            preloadLink.crossOrigin = "anonymous";
            document.head.appendChild(preloadLink);

            const script = document.createElement("script");
            script.src =
                "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
            script.async = true;
            script.crossOrigin = "anonymous";
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });

            pyodide = await (window as any).loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
                fullStdLib: false,
                stdin: () => "",
                stdout: (text: string) => {
                    output += text;
                },
                stderr: (text: string) => {
                    output += text;
                },
            });

            (window as any).pyodideInstance = pyodide;
            output = "✓ Python environment ready!";
        } catch (error: any) {
            output =
                "Error loading Python environment: " +
                error.message +
                "\n\nTry refreshing the page or closing other browser tabs to free up memory.";
        } finally {
            pyodideLoading = false;
        }
    }

    async function runCode() {
        is_running = true;
        output = "";
        test_results = [];

        try {
            await run_code(code);

            const func_name = code.match(/def\s+(\w+)/)?.[1];
            if (!func_name) {
                output = "could not find function definition";
                is_running = false;
                return;
            }

            const results = [];
            for (const test of challenge?.test_cases || []) {
                try {
                    const args = JSON.stringify(test.input);
                    const result = await pyodide.runPythonAsync(
                        `${func_name}(*${args})`,
                    );
                    const passed =
                        JSON.stringify(result) ===
                        JSON.stringify(test.expected);
                    results.push({
                        input: test.input,
                        expected: test.expected,
                        actual: result,
                        passed,
                    });
                } catch (err: any) {
                    results.push({
                        input: test.input,
                        expected: test.expected,
                        actual: err.message,
                        passed: false,
                    });
                }
            }

            test_results = results;
            const passed_count = results.filter((r) => r.passed).length;
            output = `Passed ${passed_count}/${results.length} test cases`;
            all_tests_passed = passed_count === results.length;
            activeTab = "testcases";
        } catch (error: any) {
            output = "Error: " + error.message;
            all_tests_passed = false;
        }

        is_running = false;
    }

    const programmingTerms: Record<string, string> = {
        function: "A reusable block of code that performs a specific task",
        variable: "A named storage location that holds data",
        string: "A sequence of characters, like text or words",
        integer: "A whole number without decimal points",
        loop: "A programming construct that repeats code multiple times",
        array: "A collection of items stored in a single variable",
        list: "A collection of ordered items that can be changed",
        parameter:
            "A variable used in a function to refer to one of the pieces of data provided as input",
        return: "A statement that ends function execution and specifies a value to be returned",
        condition: "An expression that evaluates to true or false",
        algorithm: "A step-by-step procedure for solving a problem",
        iteration: "The repetition of a process or set of instructions",
        recursion: "A programming technique where a function calls itself",
        syntax: "The set of rules that defines valid constructs in a programming language",
        debugging: "The process of finding and fixing errors in code",
        boolean: "A data type that can only be true or false",
        object: "A collection of related data and functions",
        method: "A function that belongs to an object",
        class: "A blueprint for creating objects",
        index: "The position of an element in a list or array",
    };

    function showTooltip(event: MouseEvent | FocusEvent, word: string) {
        clearTimeout(tooltipTimeout);
        const term = word.toLowerCase().replace(/[^a-z]/g, "");
        if (programmingTerms[term]) {
            const rect = (event.target as HTMLElement).getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const tooltipHeight = 60;
            let yPosition = rect.top - tooltipHeight - 10;
            if (yPosition < 0) {
                yPosition = rect.bottom + 10;
            }
            tooltip = {
                show: true,
                text: programmingTerms[term],
                x: rect.left + rect.width / 2,
                y: yPosition,
            };
        }
    }

    function hideTooltip() {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            tooltip = { show: false, text: "", x: 0, y: 0 };
        }, 150);
    }

    function hideTooltipImmediate() {
        clearTimeout(tooltipTimeout);
        tooltip = { show: false, text: "", x: 0, y: 0 };
    }

    function createHighlightedText(text: string) {
        const parts: Array<{ text: string; isTerm: boolean; term?: string }> =
            [];
        let lastIndex = 0;
        const termMatches: Array<{
            term: string;
            index: number;
            length: number;
        }> = [];

        Object.keys(programmingTerms).forEach((term) => {
            const regex = new RegExp(`\\b${term}\\b`, "gi");
            let match;
            while ((match = regex.exec(text)) !== null) {
                termMatches.push({
                    term: match[0],
                    index: match.index,
                    length: match[0].length,
                });
            }
        });

        termMatches.sort((a, b) => a.index - b.index);

        termMatches.forEach((match) => {
            if (match.index > lastIndex) {
                parts.push({
                    text: text.slice(lastIndex, match.index),
                    isTerm: false,
                });
            }
            parts.push({
                text: match.term,
                isTerm: true,
                term: match.term.toLowerCase(),
            });
            lastIndex = match.index + match.length;
        });

        if (lastIndex < text.length) {
            parts.push({
                text: text.slice(lastIndex),
                isTerm: false,
            });
        }

        return parts;
    }

    function handleMouseEnter(event: Event) {
        const target = event.target as HTMLElement;
        if (target.classList.contains("programming-term")) {
            const term = target.dataset.term;
            if (term) {
                showTooltip(event as MouseEvent, term);
            }
        }
    }

    function handleMouseLeave(event: Event) {
        const target = event.target as HTMLElement;
        if (target.classList.contains("programming-term")) {
            hideTooltip();
        }
    }

    function resetCode() {
        code = challenge?.starter_code || "";
        if (editor) {
            editor.setValue(code);
        }
        output = "";
        test_results = [];
        all_tests_passed = false;
    }

    function downloadCode() {
        const filename = `${challenge?.title?.replace(/[^a-zA-Z0-9]/g, "_") || "challenge"}.py`;
        const blob = new Blob([code], { type: "text/python" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function get_diff_clr(difficulty: string) {
        switch (difficulty) {
            case "Easy":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Medium":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "Hard":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-muted text-muted-foreground";
        }
    }
</script>

<svelte:head>
    <title>{challenge?.title} - Challenge</title>
    <meta
        name="description"
        content="Solve coding challenge: {challenge?.title}"
    />
</svelte:head>

<div class="min-h-screen bg-background">
    <!-- <header class="border-b border-border bg-card/80 backdrop-blur-sm">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div class="flex items-center gap-6">
          <a href="/" class="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/40 transition-all duration-300 cursor-default">getgodly</a>
          <nav class="flex items-center gap-4">
            <a href="/start" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Lessons</a>
            <a href="/challenges" class="text-sm font-medium text-foreground">Challenges</a>
          </nav>
          <div class="h-6 w-px bg-border"></div>
          <div class="flex items-center gap-3">
            <h1 class="text-lg font-semibold">{challenge?.title}</h1>
            <span class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium {get_diff_clr(challenge?.difficulty || '')}">{challenge?.difficulty}</span>
            <span class="text-sm text-muted-foreground">{challenge?.topic}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" href="/account">Account</Button>
      </div>
    </header> -->

    <div
        class="mx-auto grid max-w-7xl grid-cols-2 gap-4 p-6 h-[calc(100vh-120px)]"
    >
        <div class="flex flex-col overflow-hidden">
            <div
                class="rounded-lg border border-border bg-card overflow-hidden flex-1 flex flex-col"
            >
                <div class="border-b border-border bg-muted/30">
                    <div class="flex">
                        <button
                            onclick={() => (activeTab = "description")}
                            class="px-4 py-3 text-sm font-medium border-b-2 {activeTab ===
                            'description'
                                ? 'border-primary text-primary bg-card'
                                : 'border-transparent text-muted-foreground hover:text-foreground'}"
                            >Description</button
                        >
                        <button
                            onclick={() => (activeTab = "testcases")}
                            class="px-4 py-3 text-sm font-medium border-b-2 {activeTab ===
                            'testcases'
                                ? 'border-primary text-primary bg-card'
                                : 'border-transparent text-muted-foreground hover:text-foreground'}"
                            >Test Cases</button
                        >
                    </div>
                </div>

                <div
                    class="p-6 flex-1 overflow-y-auto"
                    role="region"
                    aria-label="Challenge description content"
                    onmouseover={handleMouseEnter}
                    onmouseout={handleMouseLeave}
                    onfocus={handleMouseEnter}
                    onblur={handleMouseLeave}
                >
                    {#if activeTab === "description"}
                        <div class="space-y-6">
                            <div class="space-y-4">
                                <div
                                    class="text-muted-foreground leading-relaxed"
                                >
                                    <div class="flex items-center gap-3 mb-5">
                                        <h1 class="text-xl font-semibold">
                                            {challenge?.title}
                                        </h1>
                                        <span
                                            class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium {get_diff_clr(
                                                challenge?.difficulty || '',
                                            )}">{challenge?.difficulty}</span
                                        >
                                        <span
                                            class="text-sm text-muted-foreground"
                                            >{challenge?.topic}</span
                                        >
                                    </div>

                                    {#each createHighlightedText(challenge?.detailed_description || challenge?.description || "") as part}
                                        {#if part.isTerm}
                                            <span
                                                class="programming-term cursor-help text-primary hover:text-primary/80 transition-colors duration-200 border-b border-dotted border-primary/30"
                                                role="button"
                                                tabindex="0"
                                                aria-label="Programming term: {part.text}. Hover for definition."
                                                data-term={part.term}
                                                onmouseenter={(e) =>
                                                    showTooltip(
                                                        e,
                                                        part.term || "",
                                                    )}
                                                onmouseleave={hideTooltip}
                                                onfocus={(e) =>
                                                    showTooltip(
                                                        e,
                                                        part.term || "",
                                                    )}
                                                onblur={hideTooltipImmediate}
                                                >{part.text}</span
                                            >
                                        {:else}
                                            {part.text}
                                        {/if}
                                    {/each}
                                </div>
                            </div>

                            {#if challenge?.example}
                                <div class="space-y-3">
                                    <h3 class="font-semibold text-lg">
                                        Example:
                                    </h3>
                                    <div
                                        class="bg-muted/50 p-4 rounded-lg border"
                                    >
                                        <pre
                                            class="text-sm font-mono whitespace-pre-wrap text-foreground">{challenge.example}</pre>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {:else if activeTab === "testcases"}
                        <div class="space-y-4">
                            <h2 class="text-xl font-semibold">Test Results</h2>
                            {#if test_results.length > 0}
                                <div class="space-y-3">
                                    {#each test_results as result, i}
                                        <div
                                            class="flex items-start gap-3 rounded-lg border p-4 {result.passed
                                                ? 'border-green-500/20 bg-green-500/5'
                                                : 'border-red-500/20 bg-red-500/5'}"
                                        >
                                            {#if result.passed}
                                                <CheckCircle
                                                    class="h-5 w-5 text-green-500 mt-0.5"
                                                />
                                            {:else}
                                                <XCircle
                                                    class="h-5 w-5 text-red-500 mt-0.5"
                                                />
                                            {/if}
                                            <div class="flex-1 space-y-2">
                                                <div
                                                    class="font-mono text-sm text-muted-foreground"
                                                >
                                                    <span class="font-semibold"
                                                        >Input:</span
                                                    >
                                                    {JSON.stringify(
                                                        result.input,
                                                    )}
                                                </div>
                                                <div
                                                    class="font-mono text-sm text-muted-foreground"
                                                >
                                                    <span class="font-semibold"
                                                        >Expected:</span
                                                    >
                                                    {JSON.stringify(
                                                        result.expected,
                                                    )}
                                                </div>
                                                <div
                                                    class="font-mono text-sm {result.passed
                                                        ? 'text-green-500'
                                                        : 'text-red-500'}"
                                                >
                                                    <span class="font-semibold"
                                                        >Got:</span
                                                    >
                                                    {JSON.stringify(
                                                        result.actual,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {:else}
                                <div
                                    class="text-center py-8 text-muted-foreground"
                                >
                                    <p>run code to see test results here</p>
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <div class="flex flex-col space-y-4 overflow-hidden">
            <div
                class="rounded-lg border border-border bg-card overflow-hidden flex-1 flex flex-col"
            >
                <div class="border-b border-border bg-muted/30">
                    <div class="flex items-center justify-between px-4 py-3">
                        <div
                            class="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                            {#if all_tests_passed && !completed}
                                <div
                                    class="w-2 h-2 bg-green-500 rounded-full"
                                ></div>
                                <span class="font-medium"
                                    >All tests passed!</span
                                >
                            {/if}
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                onclick={downloadCode}
                                class="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
                                title="Download Code"
                            >
                                <svg
                                    class="h-4 w-4 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    ></path></svg
                                >
                            </button>
                            <button
                                onclick={resetCode}
                                class="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
                                title="Reset Code"
                            >
                                <RotateCcw
                                    class="h-4 w-4 text-muted-foreground"
                                />
                            </button>
                            <button
                                onclick={runCode}
                                disabled={is_running}
                                class="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/30 rounded-lg text-sm font-medium transition-all duration-75 ease-out disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                            >
                                {#if is_running}
                                    <Loader2 class="h-3 w-3 animate-spin" />
                                    Running...
                                {:else}
                                    <Play class="h-3 w-3 fill-current" />
                                    Run
                                {/if}
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    bind:this={editorContainer}
                    class="flex-1 w-full bg-[#1e1e1e]"
                ></div>

                <div class="border-t border-border bg-muted/30 px-4 py-2">
                    <div class="flex items-center justify-between">
                        <div class="text-xs text-muted-foreground">python</div>
                        <div class="text-xs text-muted-foreground">saved</div>
                    </div>
                </div>
            </div>

            {#if output}
                <div
                    class="rounded-lg border border-border bg-card max-h-32 overflow-y-auto"
                >
                    <div class="border-b border-border px-4 py-2 bg-muted/50">
                        <span class="text-sm font-medium">Output</span>
                    </div>
                    <div class="p-4 font-mono text-sm text-muted-foreground">
                        {output}
                    </div>
                </div>
            {/if}

            {#if all_tests_passed && !completed}
                <form
                    method="POST"
                    action="?/complete"
                    use:enhance={() => {
                        submitting = true;
                        return async ({ update }) => {
                            await update();
                            submitting = false;
                        };
                    }}
                >
                    <input
                        type="hidden"
                        name="challenge_id"
                        value={challenge_id}
                    />
                    <Button type="submit" disabled={submitting} class="w-full">
                        {#if submitting}
                            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        {:else}
                            <CheckCircle2 class="mr-2 h-4 w-4" />
                            Mark as Complete
                        {/if}
                    </Button>
                </form>
            {:else if completed}
                <div
                    class="rounded-lg border border-green-500/20 bg-green-500/10 p-4"
                >
                    <div
                        class="flex items-center gap-2 justify-center text-green-500"
                    >
                        <CheckCircle2 class="h-5 w-5" />
                        <span class="font-medium"
                            >Challenge completed! Great work!</span
                        >
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

{#if tooltip.show}
    <div
        class="fixed z-50 px-3 py-2 text-sm bg-popover border border-border rounded-md shadow-lg max-w-xs pointer-events-none"
        style="left: {tooltip.x}px; top: {tooltip.y}px; transform: translateX(-50%);"
    >
        {tooltip.text}
        <div
            class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"
        ></div>
    </div>
{/if}

<style>
    :global(.programming-term) {
        position: relative;
        padding: 0 2px;
        border-radius: 2px;
        transition: background-color 0.2s ease;
        display: inline;
    }
    :global(.programming-term:hover) {
        background-color: rgba(var(--primary), 0.1);
    }
</style>
