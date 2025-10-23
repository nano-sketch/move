<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
    import { beforeNavigate, goto, afterNavigate } from "$app/navigation";
    import challengesData from "./challenges.json";
    import type { PageData } from "./$types";
    let { data }: { data: PageData } = $props();
    let editor: any;
    let monaco: any;
    let editorContainer: HTMLElement;
    let currentChallenge = $state(0);
    let attempts = $state(0);
    let showHint = $state(false);
    let isLocked = $state(false);
    let timeLeft = $state(120);
    let timerStarted = $state(false);
    let timer: any;
    let focusLost = $state(false);
    let debugMode = $state(false);
    let debugAttempts = $state(0);
    let debugOutput = $state("");
    let consoleOutput = $state("");
    let isRunning = $state(false);
    let hallSolutions = $state(data.hallSolutions);
    let showInstructionModal = $state(true);
    let blurHandler: ((e: Event) => void) | null = null;
    let activeTimeouts: any[] = [];
    const challenges = challengesData;

    function closeInstructionModal() {
        showInstructionModal = false;
        goto("/");
    }
    function startHall() {
        showInstructionModal = false;
        timerStarted = true;
        startTimer();
        setTimeout(() => {
            if (editor && monaco) {
                editor.setValue(challenges[currentChallenge].code);
                editor.focus();
                editor.layout();
            }
        }, 100);
    }
    function startTimer() {
        if (timer) clearInterval(timer);
        timeLeft = 120;
        timer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(timer);
                timer = null;
                exitChallenge();
            }
        }, 1000);
    }
    function exitChallenge() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        goto("/");
    }
    function resetChallenge() {
        if (debugMode) {
            debugAttempts++;
            debugOutput = `reset #${debugAttempts} - challenge randomized due to suspicious activity`;
        } else {
            attempts++;
        }
        currentChallenge = Math.floor(Math.random() * challenges.length);
        showHint = false;
        focusLost = false;
        consoleOutput = "";
        if (editor && monaco) {
            editor.setValue(challenges[currentChallenge].code);
            editor.focus();
        }
        if (!debugMode) {
            lockInterface();
        }
        if (timerStarted) {
            startTimer();
        }
    }

    function toggleDebugMode() {
        debugMode = !debugMode;
        debugAttempts = 0;
        debugOutput = debugMode
            ? "debug mode enabled - unlimited tries but strict monitoring"
            : "";
        consoleOutput = "";
        resetChallenge();
    }

    async function runCode() {
        if (!editor || isRunning) return;
        isRunning = true;
        const code = editor.getValue();
        consoleOutput = "running the code...\n";

        setTimeout(() => {
            consoleOutput = simulatePythonExecution(code);
            isRunning = false;
        }, 800);
    }

    function lockInterface() {
        isLocked = true;
        setTimeout(() => {
            isLocked = false;
        }, 3000);
    }

    async function submitToDatabase(challengeId: number) {
        try {
            const formData = new FormData();
            formData.append("challenge_id", challengeId.toString());

            const response = await fetch("?/complete", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                hallSolutions++;
            }
        } catch (error) {
            console.error("failed to submit to the database:", error);
        }
    }

    async function checkSolution() {
        if (!editor) return;
        const userCode = editor.getValue().trim();
        const correctSolution = challenges[currentChallenge].solution.trim();

        if (userCode === correctSolution) {
            await submitToDatabase(currentChallenge);

            if (debugMode) {
                debugOutput = `correct! solved in ${debugAttempts + 1} attempts. total solutions: ${hallSolutions}`;
                setTimeout(() => resetChallenge(), 2000);
            } else {
                alert(
                    `correct! challenge completed! total solutions: ${hallSolutions}`,
                );
                resetChallenge();
            }
        } else {
            if (debugMode) {
                debugOutput = `attempt ${debugAttempts + 1}: incorrect - keep trying`;
                showHint = true;
            } else {
                alert("incorrect solution. try again!");
                showHint = true;
            }
        }
    }

    function handleVisibilityChange() {
        if (document.hidden && !isLocked && timerStarted) {
            const timeoutId = setTimeout(() => {
                if (document.hidden && timerStarted) {
                    if (browser) localStorage.setItem("hallLeftPage", "true");
                    focusLost = true;
                    resetChallenge();
                }
            }, 2000);
            activeTimeouts.push(timeoutId);
        }
    }

    function handleBeforeUnload(e: BeforeUnloadEvent) {
        if (browser) localStorage.setItem("hallLeftPage", "true");
    }
    // focus handler to make sure user is not leaving the page and resetting the timer as well (uses localstorage)
    function handleFocus() {
        if (browser && localStorage.getItem("hallLeftPage") === "true") {
            localStorage.removeItem("hallLeftPage");
            resetChallenge();
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (
            e.key === "Escape" ||
            e.key === "F12" ||
            (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "a")) ||
            (e.ctrlKey && e.shiftKey && e.key === "I")
        ) {
            e.preventDefault();
            resetChallenge();
        }
    }

    function handleContextMenu(e: MouseEvent) {
        e.preventDefault();
        resetChallenge();
    }

    // so when user leaves the hall page it resets the timer, focus ect
    function cleanupHall() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        activeTimeouts.forEach((id) => clearTimeout(id));
        activeTimeouts = [];
        timerStarted = false;
        focusLost = false;
        if (browser) {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("contextmenu", handleContextMenu);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("focus", handleFocus);
            if (blurHandler) {
                window.removeEventListener("blur", blurHandler);
                blurHandler = null;
            }
        }
    }

    beforeNavigate(() => {
        cleanupHall();
        if (browser) localStorage.setItem("hallLeftPage", "true");
    });

    onMount(async () => {
        if (browser) {
            // Check if user has returned after leaving
            if (localStorage.getItem("hallLeftPage") === "true") {
                localStorage.removeItem("hallLeftPage");
                resetChallenge();
            }

            // Configure Monaco Environment - disable workers for simplicity
            (window as any).MonacoEnvironment = {
                getWorker: () => null,
            };

            const monacoEditor = await import("monaco-editor");
            monaco = monacoEditor;

            editor = monaco.editor.create(editorContainer, {
                value: challenges[currentChallenge].code,
                language: "python",
                theme: "vs-dark",
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                contextmenu: false,
                selectOnLineNumbers: false,
            });

            document.addEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("contextmenu", handleContextMenu);
            window.addEventListener("beforeunload", handleBeforeUnload);
            window.addEventListener("focus", handleFocus);
            blurHandler = () => {
                if (!isLocked && timerStarted) {
                    const timeoutId = setTimeout(() => {
                        if (
                            (document.hidden || !document.hasFocus()) &&
                            timerStarted
                        ) {
                            if (browser)
                                localStorage.setItem("hallLeftPage", "true");
                            focusLost = true;
                            resetChallenge();
                        }
                    }, 1500);
                    activeTimeouts.push(timeoutId);
                }
            };
            window.addEventListener("blur", blurHandler);

            editor.onDidFocusEditorText(() => {
                if (focusLost && !isLocked) {
                    resetChallenge();
                }
            });
        }
    });

    onDestroy(() => {
        cleanupHall();
        if (editor && typeof editor.dispose === "function") {
            setTimeout(() => {
                try {
                    if (editor && !editor._isDisposed) {
                        editor.dispose();
                    }
                } catch (e) {
                    // Silently ignore disposal errors during navigation
                }
            }, 0);
        }
    });
</script>

<main class="relative min-h-screen bg-background select-none">
    <div
        class="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5"
    >
        <div
            class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background/50 to-background"
        ></div>
        <div class="stars absolute inset-0 opacity-60"></div>
    </div>

    <div class="relative z-10 container mx-auto px-6 py-12">
        <div class="max-w-7xl mx-auto">
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h1 class="text-2xl font-semibold">hall of focus</h1>
                        <p class="text-sm text-muted-foreground">
                            fix python errors under pressure
                        </p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                            <span>challenge #{currentChallenge + 1}</span>
                            <span>•</span>
                            <span
                                >attempts: {debugMode
                                    ? debugAttempts
                                    : attempts}</span
                            >
                            <span>•</span>
                            <span>hall solutions: {hallSolutions}</span>
                            {#if debugMode}
                                <span>•</span>
                                <span class="text-primary">debug mode</span>
                            {/if}
                            {#if timerStarted}
                                <span>•</span>
                                <span
                                    >timer: {Math.floor(timeLeft / 60)}:{(
                                        timeLeft % 60
                                    )
                                        .toString()
                                        .padStart(2, "0")}</span
                                >
                                <span>•</span>
                            {/if}
                            <button
                                onclick={exitChallenge}
                                class="text-destructive hover:text-destructive/80 transition-colors"
                            >
                                exit challenge
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid gap-6 lg:grid-cols-4">
                <div class="lg:col-span-3">
                    <div
                        class="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden"
                    >
                        <div
                            class="bg-muted/50 px-4 py-2 border-b border-border"
                        >
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium"
                                    >python editor</span
                                >
                            </div>
                        </div>
                        <div
                            bind:this={editorContainer}
                            class="h-80 {isLocked
                                ? 'pointer-events-none opacity-50'
                                : ''}"
                        ></div>
                        <div class="border-t border-border">
                            <div
                                class="bg-muted/50 px-4 py-2 border-b border-border"
                            >
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium"
                                        >console output</span
                                    >
                                    <div class="flex items-center gap-2">
                                        <button
                                            onclick={runCode}
                                            disabled={isRunning ||
                                                (isLocked && !debugMode)}
                                            class="text-xs px-3 py-1 border border-border/50 hover:border-border hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-sm"
                                        >
                                            {isRunning
                                                ? "running..."
                                                : "run code"}
                                        </button>
                                        <button
                                            onclick={checkSolution}
                                            disabled={isLocked && !debugMode}
                                            class="text-xs px-3 py-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-sm"
                                        >
                                            submit solution
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="h-32 p-4 bg-muted/20 border border-border/50 mx-4 mb-4 rounded-md overflow-y-auto"
                            >
                                {#if consoleOutput}
                                    <pre
                                        class="text-xs font-mono text-foreground whitespace-pre-wrap leading-relaxed">{consoleOutput}</pre>
                                {:else}
                                    <span
                                        class="text-xs text-muted-foreground font-mono"
                                        >click "run code" to see output and
                                        errors...</span
                                    >
                                {/if}
                            </div>
                        </div>
                        {#if debugMode && debugOutput}
                            <div class="p-4 border-t border-border">
                                <span class="text-xs text-muted-foreground"
                                    >{debugOutput}</span
                                >
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="space-y-6">
                    <div
                        class="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6"
                    >
                        <h3 class="font-semibold mb-3">rules</h3>
                        <ul class="text-sm text-muted-foreground space-y-2">
                            <li>• fix the python error in the code</li>
                            <li>• no tab switching allowed</li>
                            <li>• no copy/paste or shortcuts</li>
                            <li>• no right-click menu</li>
                            <li>• no developer tools</li>
                            <li class="text-destructive">
                                • breaking rules resets challenge
                            </li>
                            {#if debugMode}
                                <li class="text-primary">
                                    • debug: unlimited tries enabled
                                </li>
                            {/if}
                        </ul>
                    </div>

                    {#if showHint}
                        <div
                            class="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6"
                        >
                            <h3 class="font-semibold mb-3 text-primary">
                                hint
                            </h3>
                            <p class="text-sm text-muted-foreground">
                                {challenges[currentChallenge].hint}
                            </p>
                        </div>
                    {/if}

                    <div
                        class="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6"
                    >
                        <h3 class="font-semibold mb-3">
                            {debugMode ? "debug monitor" : "focus mode"}
                        </h3>
                        <p class="text-sm text-muted-foreground mb-3">
                            {debugMode
                                ? "unlimited tries but all cheating attempts are detected and reset the challenge."
                                : "stay focused to solve the challenge. any distraction will reset your progress."}
                        </p>
                        <div class="text-xs text-muted-foreground">
                            <p>monitored events:</p>
                            <p>• window blur/focus</p>
                            <p>• tab visibility</p>
                            <p>• keyboard shortcuts</p>
                            <p>• context menu</p>
                        </div>
                        {#if debugMode && debugOutput}
                            <div class="mt-3 p-2 bg-muted/50 rounded text-xs">
                                <strong>debug output:</strong>
                                {debugOutput}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

{#if showInstructionModal}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
        <div
            class="relative mx-4 w-full max-w-md bg-card border border-border/30 rounded-lg shadow-lg select-none"
        >
            <div class="p-6">
                <button
                    onclick={closeInstructionModal}
                    class="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close modal"
                >
                    <svg
                        class="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        ></path>
                    </svg>
                </button>
                <div class="mb-6">
                    <h2 class="text-xl font-medium text-foreground mb-2">
                        hall of focus
                    </h2>
                    <p class="text-sm text-muted-foreground">
                        debug python errors under time pressure
                    </p>
                </div>
                <div class="mb-6">
                    <p
                        class="text-sm text-muted-foreground leading-relaxed mb-4"
                    >
                        a stress test environment with broken python code. fix
                        all errors to pass each challenge.
                    </p>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <h3 class="font-medium text-foreground mb-2">
                                rules
                            </h3>
                            <ul class="text-muted-foreground space-y-1 text-sm">
                                <li>fix all syntax errors</li>
                                <li>2 minute timer per challenge</li>
                                <li>limited attempts per level</li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="font-medium text-foreground mb-2">
                                tips
                            </h3>
                            <ul class="text-muted-foreground space-y-1 text-sm">
                                <li>read error messages</li>
                                <li>check indentation first</li>
                                <li>stay focused</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="flex gap-3">
                    <button
                        onclick={closeInstructionModal}
                        class="flex-1 px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted/50 transition-none"
                    >
                        cancel
                    </button>
                    <button
                        onclick={startHall}
                        class="flex-1 px-4 py-2 text-sm text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-none"
                    >
                        start challenge
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .stars {
        background-image:
            radial-gradient(2px 2px at 20px 30px, #eee, transparent),
            radial-gradient(
                2px 2px at 40px 70px,
                rgba(255, 255, 255, 0.8),
                transparent
            ),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(
                1px 1px at 130px 80px,
                rgba(255, 255, 255, 0.6),
                transparent
            ),
            radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
        background-repeat: repeat;
        background-size: 200px 100px;
        animation: sparkle 20s linear infinite;
    }

    @keyframes sparkle {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(200px);
        }
    }
</style>
