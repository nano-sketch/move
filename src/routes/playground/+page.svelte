<script lang="ts">
    import { onMount } from "svelte";
    import {
        Play,
        Download,
        Copy,
        RotateCcw,
        Code2,
        FileText,
        Loader2,
    } from "lucide-svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Particles from "$lib/components/misc/Particles.svelte";
    let mounted = $state(false);
    let editor: any = null;
    let editorContainer: HTMLElement;
    let output = $state("");
    let isRunning = $state(false);
    let code = $state("");
    let pyodide: any = null;
    let pythonReady = $state(false);
    const defaultCode = `# welcome...to...the...python..playground..
# this is your interactive python environment
# write python code and see it run instantly

# try this example:
name = "World"
print(f"Hello, {name}! Welcome to Python!")

# click the snippets for more examples..
# use the run button to execute your code
# happy coding! `;
    const snippets = [
        {
            name: "variables & maths",
            code: `# Variables and Basic Math
x = 10
y = 5
result = x + y
print(f"{x} + {y} = {result}")

# Different operations
print(f"Multiplication: {x * y}")
print(f"Division: {x / y}")`,
        },
        {
            name: "lists & loops",
            code: `# Working with Lists and Loops
fruits = ["apple", "banana", "orange", "grape"]
print("My favorite fruits:")

for fruit in fruits:
    print(f"- {fruit}")

print(f"Total fruits: {len(fruits)}")`,
        },
        {
            name: "functions",
            code: `# Creating and Using Functions
def greet(name):
    return f"Hello, {name}! Nice to meet you!"

def calculate_area(length, width):
    return length * width

# Using the functions
message = greet("Alice")
print(message)

area = calculate_area(5, 3)
print(f"Rectangle area: {area}")`,
        },
    ];
    code = defaultCode;

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
                setTimeout(() => reject(new Error("loading timeout")), 10000);
            });
            (window as any).require.config({
                paths: {
                    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
                },
            });
            (window as any).require(["vs/editor/editor.main"], createEditor);
        } catch (error) {
            showFallbackEditor();
        }
    }

    function showFallbackEditor() {
        if (editorContainer) {
            editorContainer.innerHTML = `<textarea class="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 resize-none border-none outline-none" placeholder="monaco editor failed to load, using fallback editor">${defaultCode}</textarea>`;
            const textarea = editorContainer.querySelector("textarea");
            if (textarea) {
                textarea.addEventListener("input", (e) => {
                    code = (e.target as HTMLTextAreaElement).value;
                });
            }
        }
    }

    function createEditor() {
        if (!editorContainer) return;
        editor = (window as any).monaco.editor.create(editorContainer, {
            value: defaultCode,
            language: "python",
            theme: "vs-dark",
            fontSize: 14,
            fontFamily: "Consolas, 'Courier New', monospace",
            minimap: { enabled: false },
            automaticLayout: false,
            lineNumbers: "on",
            renderLineHighlight: "line",
            padding: { top: 16, bottom: 16 },
            scrollbar: {
                vertical: "visible",
                horizontal: "visible",
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
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
            scrollBeyondLastLine: false,
            smoothScrolling: false,
            cursorSmoothCaretAnimation: false,
            renderLineHighlightOnlyWhenFocus: true,
        });
        let changeTimeout: ReturnType<typeof setTimeout>;
        editor.onDidChangeModelContent(() => {
            clearTimeout(changeTimeout);
            changeTimeout = setTimeout(() => {
                code = editor.getValue();
            }, 150);
        });
        editor.layout({
            width: editorContainer.clientWidth,
            height: editorContainer.clientHeight,
        });
    }

    let pyodideLoading = false;

    async function loadPyodide() {
        if (pyodideLoading) return;
        pyodideLoading = true;
        try {
            if ((window as any).pyodideInstance) {
                pyodide = (window as any).pyodideInstance;
                pythonReady = true;
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
                    if (!text.endsWith("\n")) {
                        output += "\n";
                    }
                },
                stderr: (text: string) => {
                    output += text;
                },
            });
            (window as any).pyodideInstance = pyodide;
            pythonReady = true;
        } catch (error) {
            output =
                "error loading py env" +
                (error as Error).message +
                "\n\ntry reloading page or close other tabs to free up mem";
        } finally {
            pyodideLoading = false;
        }
    }

    onMount(async () => {
        mounted = true;
        await loadMonaco();
    });

    async function runCode() {
        if (!pyodide && !pyodideLoading) {
            output = "loading py env...";
            await loadPyodide();
        }
        if (!pyodide) {
            output = "env not ready yet";
            return;
        }
        isRunning = true;
        output = "";
        try {
            const currentCode = editor ? editor.getValue() : code;
            await pyodide.runPythonAsync(currentCode);
            if (!output.trim()) {
                output = "code ran successfully, no output)";
            }
        } catch (error) {
            output = `Error: ${error}`;
        } finally {
            isRunning = false;
        }
    }

    function insertSnippet(snippet: { name: string; code: string }) {
        if (editor) {
            editor.setValue(snippet.code);
            editor.focus();
        } else {
            code = snippet.code;
            const textarea = editorContainer?.querySelector("textarea");
            if (textarea) {
                textarea.value = snippet.code;
            }
        }
    }

    function downloadCode() {
        let codeToDownload = code;
        if (editor) {
            codeToDownload = editor.getValue();
        } else {
            const textarea = editorContainer?.querySelector("textarea");
            if (textarea) {
                codeToDownload = textarea.value;
            }
        }
        const blob = new Blob([codeToDownload], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "PlayGroundCode.py";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function copyCode() {
        let codeToCopy = code;
        if (editor) {
            codeToCopy = editor.getValue();
        } else {
            const textarea = editorContainer?.querySelector("textarea");
            if (textarea) {
                codeToCopy = textarea.value;
            }
        }
        navigator.clipboard.writeText(codeToCopy);
    }

    function resetCode() {
        if (editor) {
            editor.setValue(defaultCode);
        } else {
            code = defaultCode;
            const textarea = editorContainer?.querySelector("textarea");
            if (textarea) {
                textarea.value = defaultCode;
            }
        }
        output = "";
    }

    function formatCode() {
        if (editor) {
            editor.getAction("editor.action.formatDocument").run();
        } else {
            const lines = code.split("\n");
            let indentLevel = 0;
            const formatted = lines.map((line: string) => {
                const trimmed = line.trim();
                if (trimmed === "") return "";
                if (
                    trimmed.startsWith("except") ||
                    trimmed.startsWith("elif") ||
                    trimmed.startsWith("else") ||
                    trimmed.startsWith("finally")
                ) {
                    indentLevel = Math.max(0, indentLevel - 1);
                }
                const result = "    ".repeat(indentLevel) + trimmed;
                if (trimmed.endsWith(":")) {
                    indentLevel++;
                }
                return result;
            });
            code = formatted.join("\n");
        }
    }
</script>

<svelte:head>
    <title>Playground - GetGodly</title>
    <meta name="description" content="python playground - write and run code" />
</svelte:head>

<div class="min-h-screen bg-background playground-page">
    <Particles className="absolute inset-0" refresh={true} />

    <main class="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div class="mb-6">
            <h1 class="text-3xl font-bold mb-2">Python Playground</h1>
            <p class="text-muted-foreground">
                Interactive Python coding environment
            </p>
        </div>

        <div class="grid lg:grid-cols-4 gap-6">
            <div class="lg:col-span-3 space-y-4">
                <div
                    class="flex items-center gap-2 p-3 bg-card border border-border rounded-lg"
                >
                    <button
                        onclick={runCode}
                        disabled={isRunning}
                        class="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/30 rounded-md text-sm font-medium transition-all duration-75 ease-out disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                    >
                        {#if isRunning}
                            <Loader2 class="h-3 w-3 animate-spin" />
                            Running...
                        {:else}
                            <Play class="h-3 w-3 fill-current" />
                            Run
                        {/if}
                    </button>
                    <Button variant="outline" onclick={formatCode} size="sm"
                        ><Code2 class="h-4 w-4 mr-2" />Format</Button
                    >
                    <Button variant="outline" onclick={copyCode} size="sm"
                        ><Copy class="h-4 w-4 mr-2" />Copy</Button
                    >
                    <Button variant="outline" onclick={downloadCode} size="sm"
                        ><Download class="h-4 w-4 mr-2" />Download</Button
                    >
                    <Button variant="outline" onclick={resetCode} size="sm"
                        ><RotateCcw class="h-4 w-4 mr-2" />Reset</Button
                    >
                </div>

                <div
                    class="bg-card border border-border rounded-lg overflow-hidden"
                    style="height: 384px;"
                >
                    <div
                        bind:this={editorContainer}
                        class="w-full h-full"
                    ></div>
                </div>

                <div class="bg-card border border-border rounded-lg">
                    <div
                        class="flex items-center gap-2 p-3 border-b border-border"
                    >
                        <FileText class="h-4 w-4 text-primary" />
                        <span class="font-medium">Output</span>
                    </div>
                    <div class="p-4">
                        <pre
                            class="text-sm font-mono whitespace-pre-wrap max-h-64 overflow-y-auto {isRunning
                                ? 'pulse'
                                : ''}">{output ||
                                "click run code to output"}</pre>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <div class="bg-card border border-border rounded-lg p-4">
                    <h3 class="font-semibold mb-3">Ccde snippets</h3>
                    <div class="space-y-2">
                        {#each snippets as snippet}
                            <button
                                class="w-full text-left p-2 rounded border hover:bg-muted/50 transition-all duration-75 ease-out"
                                onclick={() =>
                                    insertSnippet(
                                        snippet as {
                                            name: string;
                                            code: string;
                                        },
                                    )}
                            >
                                <div class="font-medium text-sm">
                                    {snippet.name}
                                </div>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<style>
    :global(.playground-page) {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    :global(.playground-page .monaco-editor),
    :global(.playground-page .monaco-editor *),
    :global(.playground-page pre),
    :global(.playground-page textarea) {
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
    }
    :global(.monaco-editor) {
        position: relative !important;
    }
    .pulse {
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
