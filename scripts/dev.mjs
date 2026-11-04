import { spawn } from "node:child_process";
import { createRequire } from "node:module";

// Compatibilité des lanceurs de prévisualisation qui utilisent --host / --strictPort.
// Les arguments Next.js habituels (--port, --hostname, etc.) restent acceptés.
const require = createRequire(import.meta.url);
const input = process.argv.slice(2);
const production = input.includes("--production");
const args = [];
for (const arg of input) {
  if (arg === "--strictPort" || arg === "--production") continue;
  args.push(arg === "--host" ? "--hostname" : arg);
}
const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), production ? "start" : "dev", ...args], { stdio: "inherit" });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 1));
