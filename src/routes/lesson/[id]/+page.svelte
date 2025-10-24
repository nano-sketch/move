<script lang="ts">
    import Particles from "$lib/components/misc/Particles.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { goto } from "$app/navigation";
    import { CheckCircle2, XCircle, ChevronRight } from "lucide-svelte";
    import { enhance } from "$app/forms";

    let { data, form }: { data: any; form: any } = $props();
    let Content = data.content;

    let submitting = $state(false);
    let completed = $state(false);

    let quiz_answers = $state<(number | null)[]>(
        data.metadata?.quizzes?.map(() => null) || [],
    );

    let show_results = $state<boolean[]>(
        data.metadata?.quizzes?.map(() => false) || [],
    );

    let all_correct = $derived(
        data.metadata?.quizzes?.every(
            (quiz: any, i: number) => quiz_answers[i] === quiz.correct,
        ) || false,
    );

    function check_answer(quizIndex: number) {
        show_results[quizIndex] = true;
    }

    function select_option(quizIndex: number, optionIndex: number) {
        quiz_answers[quizIndex] = optionIndex;
        show_results[quizIndex] = false;
    }

    function is_correct(quizIndex: number, optionIndex: number): boolean {
        return data.metadata?.quizzes?.[quizIndex]?.correct === optionIndex;
    }

    function is_selected(quizIndex: number, optionIndex: number): boolean {
        return quiz_answers[quizIndex] === optionIndex;
    }

    function next_lesson() {
        const cur_id = data.metadata?.lesson || 1;
        goto(`/lesson/${cur_id + 1}`);
    }

    $effect(() => {
        if (form?.success && !form?.already_completed) completed = true;
    });
</script>

<main class="min-h-screen bg-background relative overflow-hidden">
    <Particles className="absolute inset-0" refresh={true} />

    <div class="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <Button class="mb-8" href="/lessons" variant="outline">← Go Back</Button
        >
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
                                {@const selected = is_selected(
                                    quizIndex,
                                    optionIndex,
                                )}
                                {@const correct = is_correct(
                                    quizIndex,
                                    optionIndex,
                                )}
                                {@const showResult = show_results[quizIndex]}

                                <button
                                    onclick={() =>
                                        select_option(quizIndex, optionIndex)}
                                    disabled={showResult}
                                    class="w-full text-left p-4 rounded-lg border-2 transition-all duration-200 font-mono {showResult &&
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

                        {#if !show_results[quizIndex]}
                            <Button
                                onclick={() => check_answer(quizIndex)}
                                disabled={quiz_answers[quizIndex] === null}
                                class="w-full mt-4"
                            >
                                Check Answer
                            </Button>
                        {:else if is_correct(quizIndex, quiz_answers[quizIndex] || 0)}
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

            {#if all_correct && !completed}
                <!-- <div class="flex justify-center pb-12">
                    <Button onclick={next_lesson} size="lg" class="group">
                        Continue to Next Lesson
                        <ChevronRight
                            class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                        />
                    </Button>
                </div> -->
                <form
                    method="POST"
                    action="?/complete"
                    use:enhance={() => {
                        submitting = true;
                        return async ({ update }) => {
                            await update();
                            submitting = true;
                        };
                    }}
                    class="flex justify-items-center pb-12"
                >
                    <input
                        type="hidden"
                        name="type"
                        value={data.metadata?.type?.toLowerCase() || "basic"}
                    />
                    <Button
                        type="submit"
                        size="lg"
                        disabled={submitting}
                        class="group"
                    >
                        {submitting
                            ? "Saving..."
                            : "Complete Lesson & Continue"}
                        <ChevronRight
                            class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                        />
                    </Button>
                </form>
            {:else if completed || form?.already_completed}
                <div class="space-y-4 pb-12">
                    <div
                        class="flex items-center gap-2 justify-center text-green-600 dark:text-green-400 p-4 bg-green-500/10 rounded-lg"
                    >
                        <CheckCircle2 class="w-5 h-5" />
                        <span class="font-medium"
                            >Lesson completed! Great work!</span
                        >
                    </div>
                    <div class="flex justify-center">
                        <Button onclick={next_lesson} size="lg" class="group">
                            Continue to Next Lesson
                            <ChevronRight
                                class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                            />
                        </Button>
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</main>
