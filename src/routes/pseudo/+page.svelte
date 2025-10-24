<script lang="ts">
    import { onMount, tick } from "svelte";
    import { BookOpen, ArrowRight, CheckCircle } from "lucide-svelte";
    import Particles from "$lib/components/misc/Particles.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    let mounted = $state(false);
    let currentExample = $state(0);
    const examples = [
        {
            title: "number comparison",
            problem: "Compare two numbers and output all numbers between them",
            filename: "compare.py",
            pseudocode: [
                "PSUEDO CODE FOR compare.py",
                "",
                "START",
                '    INPUT firstNum ("enter first number: ")',
                '    INPUT secondNum ("enter second number: ")',
                "",
                "    IF firstNum = secondNum THEN",
                '        OUTPUT "numbers are equal"',
                "    ELSE IF firstNum < secondNum THEN",
                "        FOR i FROM firstNum TO secondNum",
                "            OUTPUT i",
                "        END FOR",
                "    ELSE",
                "        FOR i FROM firstNum DOWNTO secondNum",
                "            OUTPUT i",
                "        END FOR",
                "    END IF",
                "END",
            ],
        },
        {
            title: "grade calculator",
            problem: "Calculate final grade based on test scores",
            filename: "grades.py",
            pseudocode: [
                "PSUEDO CODE FOR grades.py",
                "",
                "START",
                '    INPUT numTests ("how many tests: ")',
                "    SET total = 0",
                "",
                "    FOR i FROM 1 TO numTests",
                '        INPUT score ("enter test " + i + " score: ")',
                "        SET total = total + score",
                "    END FOR",
                "",
                "    SET average = total / numTests",
                "",
                "    IF average >= 90 THEN",
                '        OUTPUT "Grade: A"',
                "    ELSE IF average >= 80 THEN",
                '        OUTPUT "Grade: B"',
                "    ELSE IF average >= 70 THEN",
                '        OUTPUT "Grade: C"',
                "    ELSE",
                '        OUTPUT "Grade: F"',
                "    END IF",
                "END",
            ],
        },
        {
            title: "password validator",
            problem: "Check if password meets security requirements",
            filename: "password.py",
            pseudocode: [
                "PSUEDO CODE FOR password.py",
                "",
                "START",
                '    INPUT password ("enter password: ")',
                "    SET isValid = true",
                '    SET errorMessage = ""',
                "",
                "    IF LENGTH(password) < 8 THEN",
                "        SET isValid = false",
                '        SET errorMessage = "too short"',
                "    END IF",
                "",
                "    IF NOT CONTAINS_UPPERCASE(password) THEN",
                "        SET isValid = false",
                '        SET errorMessage = errorMessage + " needs uppercase"',
                "    END IF",
                "",
                "    IF NOT CONTAINS_NUMBER(password) THEN",
                "        SET isValid = false",
                '        SET errorMessage = errorMessage + " needs number"',
                "    END IF",
                "",
                "    IF isValid = true THEN",
                '        OUTPUT "password accepted"',
                "    ELSE",
                '        OUTPUT "password rejected: " + errorMessage',
                "    END IF",
                "END",
            ],
        },
    ];
    const buildingBlocks = [
        {
            name: "START/END",
            desc: "mark the beginning and end",
            example: "START ... END",
        },
        {
            name: "INPUT/OUTPUT",
            desc: "get data or show results",
            example: "INPUT name, DISPLAY message",
        },
        {
            name: "SET/ASSIGN",
            desc: "store values in variables",
            example: "SET count = 0",
        },
        {
            name: "IF/THEN/ELSE",
            desc: "make decisions",
            example: "IF age >= 18 THEN ... ELSE ...",
        },
        {
            name: "WHILE/FOR",
            desc: "repeat actions",
            example: "WHILE count < 10 ... END WHILE",
        },
        {
            name: "FUNCTION",
            desc: "reusable code blocks",
            example: "FUNCTION calculateArea(width, height)",
        },
    ];
    function nextExample() {
        currentExample = (currentExample + 1) % examples.length;
    }
    function prevExample() {
        currentExample =
            currentExample === 0 ? examples.length - 1 : currentExample - 1;
    }
    onMount(async () => {
        await tick();
        mounted = true;
    });
</script>

<svelte:head>
    <title>Pseudocode Basics - Learn Step by Step</title>
    <meta
        name="description"
        content="Learn pseudocode with simple examples and building blocks"
    />
</svelte:head>

<div class="min-h-screen bg-background select-none">
    <Particles className="absolute inset-0" refresh={true} />
    <main class="relative z-10 max-w-7xl px-6 py-8 mx-auto">
        <div class="mb-8 text-left">
            <div class="flex items-center gap-3 mb-4">
                <BookOpen class="h-8 w-8 text-primary" />
                <h1 class="text-3xl font-bold">Pseudocode Basics</h1>
            </div>
            <p class="text-muted-foreground text-lg">
                Learn to plan your code before you write it
            </p>
            <p class="text-sm text-muted-foreground mt-2">
                Simple steps to solve problems using plain language
            </p>
        </div>
        <div class="grid lg:grid-cols-2 gap-8">
            <div class="space-y-6">
                <div class="bg-card border rounded-lg p-6 text-left">
                    <h2 class="text-xl font-semibold mb-4">
                        what is pseudocode?
                    </h2>
                    <div class="space-y-4 text-sm text-muted-foreground">
                        <p>
                            pseudocode is like writing a recipe for your
                            computer program. it uses simple english words to
                            describe what your program should do, step by step.
                        </p>
                        <div class="bg-muted/30 p-4 rounded-lg">
                            <p class="font-medium text-foreground mb-2">
                                think of it like this:
                            </p>
                            <p>
                                • <strong>recipe:</strong> "mix flour and eggs, then
                                bake for 20 minutes"
                            </p>
                            <p>
                                • <strong>pseudocode:</strong> "get user input, then
                                calculate the result"
                            </p>
                        </div>
                        <p>
                            no fancy syntax, no confusing symbols - just clear,
                            logical steps that anyone can understand.
                        </p>
                    </div>
                </div>
                <div class="bg-card border rounded-lg p-6 text-left">
                    <h2 class="text-xl font-semibold mb-4">building blocks</h2>
                    <div class="space-y-3">
                        {#if mounted}{#each buildingBlocks as block}<div
                                    class="p-3 bg-muted/20 rounded-lg border border-muted/30"
                                >
                                    <div
                                        class="flex items-start justify-between"
                                    >
                                        <div class="flex-1">
                                            <h3
                                                class="font-medium text-sm mb-1 text-primary"
                                            >
                                                {block.name}
                                            </h3>
                                            <p
                                                class="text-xs text-muted-foreground mb-2"
                                            >
                                                {block.desc}
                                            </p>
                                            <code
                                                class="text-xs bg-muted/50 px-2 py-1 rounded text-foreground"
                                                >{block.example}</code
                                            >
                                        </div>
                                    </div>
                                </div>{/each}{/if}
                    </div>
                </div>
            </div>
            <div class="bg-card border rounded-lg p-6 text-left">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold">examples</h2>
                    <div class="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onclick={prevExample}
                            class="h-8 w-8 p-0"
                            ><ArrowRight class="h-4 w-4 rotate-180" /></Button
                        ><Button
                            variant="outline"
                            size="sm"
                            onclick={nextExample}
                            class="h-8 w-8 p-0"
                            ><ArrowRight class="h-4 w-4" /></Button
                        >
                    </div>
                </div>
                {#if mounted}<div class="space-y-4">
                        <div
                            class="p-4 bg-primary/5 border border-primary/20 rounded-lg"
                        >
                            <h3 class="font-semibold text-primary mb-2">
                                {examples[currentExample].title}
                            </h3>
                            <p class="text-sm text-muted-foreground">
                                {examples[currentExample].problem}
                            </p>
                            <p class="text-xs text-muted-foreground mt-2">
                                file: {examples[currentExample].filename}
                            </p>
                        </div>
                        <div class="bg-muted/20 rounded-lg p-4 overflow-x-auto">
                            <div class="space-y-1 min-w-0">
                                {#each examples[currentExample].pseudocode as line, i}<div
                                        class="flex items-start gap-3 min-w-0"
                                    >
                                        {#if line.trim() === ""}<span
                                                class="text-xs text-muted-foreground w-6 text-right flex-shrink-0"
                                                >{i + 1}</span
                                            ><code
                                                class="text-sm font-mono text-foreground"
                                                >&nbsp;</code
                                            >{:else if line.startsWith("PSUEDO CODE FOR")}<span
                                                class="text-xs text-muted-foreground w-6 text-right flex-shrink-0"
                                                >{i + 1}</span
                                            ><code
                                                class="text-sm font-mono text-primary font-semibold whitespace-pre overflow-x-auto"
                                                >{line}</code
                                            >{:else}<span
                                                class="text-xs text-muted-foreground w-6 text-right flex-shrink-0"
                                                >{i + 1}</span
                                            ><code
                                                class="text-sm font-mono text-foreground whitespace-pre overflow-x-auto"
                                                >{line}</code
                                            >{/if}
                                    </div>{/each}
                            </div>
                        </div>
                    </div>{/if}
            </div>
        </div>
        <div class="mt-8 bg-card border rounded-lg p-6 text-left">
            <h2 class="text-xl font-semibold mb-4">pseudocode writing rules</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                <div>
                    <h3 class="font-semibold mb-2 text-primary">structure</h3>
                    <ul class="text-muted-foreground space-y-1">
                        <li>• always start with START and end with END</li>
                        <li>• use proper indentation for nested blocks</li>
                        <li>• include filename header at the top</li>
                        <li>• add blank lines for readability</li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-semibold mb-2 text-primary">keywords</h3>
                    <ul class="text-muted-foreground space-y-1">
                        <li>• INPUT for getting user data</li>
                        <li>• OUTPUT for displaying results</li>
                        <li>• SET for variable assignment</li>
                        <li>• IF/THEN/ELSE for decisions</li>
                        <li>• FOR/WHILE for loops</li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-semibold mb-2 text-primary">
                        best practices
                    </h3>
                    <ul class="text-muted-foreground space-y-1">
                        <li>• use meaningful variable names</li>
                        <li>• be consistent with formatting</li>
                        <li>• write clear condition statements</li>
                        <li>• plan before you code</li>
                    </ul>
                </div>
            </div>
        </div>
    </main>
</div>
