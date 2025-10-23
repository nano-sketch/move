let pyodide_loading = false;
let pyodide: any = null;
let output: string = "";

export const is_pyodide_loading = () => is_pyodide_loading;
export const get_output = () => output;

export async function load_pyodide() {
    if (pyodide_loading) return;
    pyodide_loading = true;
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
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
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
    } catch (error: any) {
        output =
            "Error loading Python environment: " +
            error.message +
            "\n\nTry refreshing the page or closing other browser tabs to free up memory.";
    } finally {
        pyodide_loading = false;
    }
}

export async function run_code(code: string) {
    if (!pyodide && !pyodide_loading) {
        await load_pyodide();
    }

    if (!pyodide) return;

    try {
        await pyodide.runPythonAsync(code);
    } catch (error: any) {
        output = "Error: " + error.message;
    }
}
