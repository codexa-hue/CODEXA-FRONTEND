import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Terminal, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

// Helper function to load Pyodide CDN script
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
};

export default function CodeEditor({ code, setCode, initialCode = "" }) {
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Initializing environment...");
  const [error, setError] = useState(null);

  const [consoleOutput, setConsoleOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Initialize Pyodide
  useEffect(() => {
    let active = true;

    // Load initial code if code is currently empty
    if (!code && initialCode) {
      setCode(initialCode);
    } else if (!code) {
      setCode("# Write your Python code here\n\ndef solve():\n    print(\"Hello CODEXA!\")\n    # return your answer\n\nsolve()\n");
    }

    const initPyodide = async () => {
      try {
        setLoading(true);
        setStatus("Downloading Python runtime...");
        
        // Load main pyodide script
        await loadScript("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");
        
        if (!window.loadPyodide) {
          throw new Error("Pyodide script was loaded but loadPyodide is not available.");
        }

        setStatus("Booting Python in WebAssembly...");
        
        // Initialize Pyodide (singleton to avoid reloading multiple times)
        if (!window.pyodideInstance) {
          window.pyodideInstance = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
          });
        }

        if (active) {
          setPyodide(window.pyodideInstance);
          setStatus("Ready");
          setLoading(false);
        }
      } catch (err) {
        console.error("Pyodide init error:", err);
        if (active) {
          setError("Failed to load Python compiler. Please check your network connection.");
          setLoading(false);
        }
      }
    };

    initPyodide();

    return () => {
      active = false;
    };
  }, [initialCode]);

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Support Tab key indentation inside textarea
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = e.target.value;
      const newValue = val.substring(0, start) + "    " + val.substring(end);
      setCode(newValue);

      // Force cursor reset position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // Run python code via Pyodide
  const handleRun = async () => {
    if (!pyodide || isRunning) return;
    setIsRunning(true);
    setConsoleOutput("Running script...\n");

    try {
      // Python wrapper to capture stdout/stderr safely
      const wrapperCode = `
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
try:
    code_to_run = ${JSON.stringify(code)}
    exec(code_to_run, {})
    stdout_val = sys.stdout.getvalue()
    stderr_val = sys.stderr.getvalue()
except Exception as e:
    import traceback
    stdout_val = sys.stdout.getvalue()
    stderr_val = sys.stderr.getvalue() + "\\n" + traceback.format_exc()
(stdout_val, stderr_val)
`;

      const result = await pyodide.runPythonAsync(wrapperCode);
      const stdout = result.get(0);
      const stderr = result.get(1);
      result.destroy(); // Free proxy

      let output = "";
      if (stdout) output += stdout;
      if (stderr) output += stderr;

      if (!output) {
        output = "[Code executed successfully with no print output]";
      }

      setConsoleOutput(output);
    } catch (err) {
      setConsoleOutput(`Execution Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the editor to default code?")) {
      setCode(initialCode || "# Write your Python code here\n\ndef solve():\n    print(\"Hello CODEXA!\")\n    # return your answer\n\nsolve()\n");
      setConsoleOutput("");
    }
  };

  // Generate line numbers
  const linesCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  return (
    <div className="w-full flex flex-col rounded-xl overflow-hidden border border-slate-700 bg-slate-900/90 shadow-2xl backdrop-blur-md">
      {/* Editor Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            Python 3 (WASM Compiler)
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-xs text-slate-400 font-mono">{status}</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-xs text-red-400 font-mono">Failed to load</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
              <span className="text-xs text-emerald-400 font-mono">Compiler Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex relative h-[350px] font-mono text-sm leading-relaxed overflow-hidden bg-slate-950/40">
        {/* Line Numbers Sidebar */}
        <div
          ref={lineNumbersRef}
          className="w-12 select-none py-3 text-right pr-3 border-r border-slate-800 text-slate-600 bg-slate-950/70 overflow-hidden"
        >
          {lineNumbers.map((num) => (
            <div key={num} className="h-6">
              {num}
            </div>
          ))}
        </div>

        {/* Text Area Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 resize-none bg-transparent py-3 px-4 border-none outline-none text-slate-100 placeholder-slate-600 font-mono select-text"
          style={{
            whiteSpace: "pre",
            overflowWrap: "normal",
            overflowX: "auto",
            lineHeight: "1.5rem",
          }}
          disabled={loading}
        />
      </div>

      {/* Action Controls Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-slate-950/90 border-t border-slate-800">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors bg-slate-900/60 hover:bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
          type="button"
          disabled={loading}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Editor
        </button>

        <button
          onClick={handleRun}
          disabled={loading || isRunning}
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 shadow-md bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-indigo-500/20"
          type="button"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      {/* Compiler Output Console */}
      <div className="flex flex-col bg-slate-950/95 border-t border-slate-800">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 border-b border-slate-900/50">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 font-mono">Output Terminal Console</span>
        </div>

        <div className="p-4 h-[120px] overflow-y-auto font-mono text-xs leading-relaxed select-text">
          {consoleOutput ? (
            <pre
              className={`whitespace-pre-wrap ${
                consoleOutput.includes("Error:") || consoleOutput.includes("Traceback")
                  ? "text-rose-400"
                  : "text-slate-200"
              }`}
            >
              {consoleOutput}
            </pre>
          ) : (
            <span className="text-slate-600 italic">Click "Run Code" to view program output console.</span>
          )}
        </div>
      </div>
    </div>
  );
}
