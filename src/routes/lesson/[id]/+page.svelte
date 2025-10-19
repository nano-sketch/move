<script lang="ts">
    import Particles from "$lib/components/misc/Particles.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { goto } from "$app/navigation";
    import { CheckCircle2, XCircle, ChevronRight } from "lucide-svelte";

    let { data } = $props();
    let Content = data.content;

    let quizAnswers = $state<(number | null)[]>(
        data.metadata?.quizzes?.map(() => null) || [],
    );
    let showResults = $state<boolean[]>(
        data.metadata?.quizzes?.map(() => false) || [],
    );
    let allCorrect = $derived(
        data.metadata?.quizzes?.every(
            (quiz: any, i: number) => quizAnswers[i] === quiz.correct,
        ) || false,
    );

    function checkAnswer(quizIndex: number) {
        showResults[quizIndex] = true;
    }

    function selectOption(quizIndex: number, optionIndex: number) {
        quizAnswers[quizIndex] = optionIndex;
        showResults[quizIndex] = false;
    }

    function isCorrect(quizIndex: number, optionIndex: number): boolean {
        return data.metadata?.quizzes?.[quizIndex]?.correct === optionIndex;
    }

    function isSelected(quizIndex: number, optionIndex: number): boolean {
        return quizAnswers[quizIndex] === optionIndex;
    }

    function nextLesson() {
        const currentId = data.metadata?.lesson || 1;
        goto(`/lesson/${currentId + 1}`);
    }
</script>

<main class="min-h-screen bg-background relative overflow-hidden">
    <Particles className="absolute inset-0" refresh={true} />

    <header
        class="h-16 bg-card/80 backdrop-blur-xl w-full flex items-center justify-between px-6 border-b border-border/50 sticky top-0 z-50"
    >
        <button
            onclick={() => goto("/")}
            class="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/40 transition-all duration-300"
        >
            getgodly
        </button>
        <div class="flex items-center gap-6">
            <a
                href="/help"
                class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
                Help
            </a>
            <Button
                variant="outline"
                size="sm"
                class="cursor-pointer hover:bg-primary/10 transition-all duration-200"
            >
                Account
            </Button>
        </div>
    </header>

    <div class="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <div class="prose prose-lg">
            <Content />
        </div>

        {#if data.metadata?.quizzes && data.metadata.quizzes.length > 0}
            <div class="space-y-8 my-16">
                <div class="flex items-center gap-3 mb-8">
                    <div class="h-px flex-1 bg-border"></div>
                    <h2 class="text-2xl font-bold text-foreground">
                        Test Your Knowledge
                    </h2>
                    <div class="h-px flex-1 bg-border"></div>
                </div>

                {#each data.metadata.quizzes as quiz, quizIndex}
                    <div
                        class="bg-card border border-border rounded-lg p-6 space-y-4"
                    >
                        <h3 class="text-lg font-semibold text-foreground mb-4">
                            Question {quizIndex + 1}: {quiz.question}
                        </h3>

                        <div class="space-y-3">
                            {#each quiz.options as option, optionIndex}
                                {@const selected = isSelected(
                                    quizIndex,
                                    optionIndex,
                                )}
                                {@const correct = isCorrect(
                                    quizIndex,
                                    optionIndex,
                                )}
                                {@const showResult = showResults[quizIndex]}

                                <button
                                    onclick={() =>
                                        selectOption(quizIndex, optionIndex)}
                                    disabled={showResult}
                                    class="w-full text-left p-4 rounded-lg border-2 transition-all duration-200 {showResult &&
                                    correct
                                        ? 'border-green-500 bg-green-500/10'
                                        : showResult && selected && !correct
                                          ? 'border-red-500 bg-red-500/10'
                                          : selected
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'} {showResult
                                        ? 'cursor-not-allowed'
                                        : 'cursor-pointer'}"
                                >
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <span
                                            class="text-foreground font-medium"
                                        >
                                            {String.fromCharCode(
                                                65 + optionIndex,
                                            )}. {option}
                                        </span>
                                        {#if showResult}
                                            {#if correct}
                                                <CheckCircle2
                                                    class="w-5 h-5 text-green-500"
                                                />
                                            {:else if selected}
                                                <XCircle
                                                    class="w-5 h-5 text-red-500"
                                                />
                                            {/if}
                                        {/if}
                                    </div>
                                </button>
                            {/each}
                        </div>

                        {#if !showResults[quizIndex]}
                            <Button
                                onclick={() => checkAnswer(quizIndex)}
                                disabled={quizAnswers[quizIndex] === null}
                                class="w-full mt-4"
                            >
                                Check Answer
                            </Button>
                        {:else if isCorrect(quizIndex, quizAnswers[quizIndex] || 0)}
                            <div
                                class="flex items-center gap-2 text-green-600 dark:text-green-400 mt-4 p-3 bg-green-500/10 rounded-lg"
                            >
                                <CheckCircle2 class="w-5 h-5" />
                                <span class="font-medium"
                                    >Correct! Well done!</span
                                >
                            </div>
                        {:else}
                            <div
                                class="flex items-center gap-2 text-red-600 dark:text-red-400 mt-4 p-3 bg-red-500/10 rounded-lg"
                            >
                                <XCircle class="w-5 h-5" />
                                <span class="font-medium"
                                    >Not quite. Try again!</span
                                >
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>

            {#if allCorrect}
                <div class="flex justify-center pb-12">
                    <Button onclick={nextLesson} size="lg" class="group">
                        Continue to Next Lesson
                        <ChevronRight
                            class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                        />
                    </Button>
                </div>
            {/if}
        {/if}
    </div>
</main>
