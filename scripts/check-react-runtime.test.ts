// Incident alive-home/alive#13964: a real preview loaded incompatible React versions.
import { afterEach, expect, test } from "bun:test";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import manifest from "../package.json";

const roots: string[] = [];
afterEach(() => {
	for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function checkDeclarations(react: string, reactDom: string) {
	const root = mkdtempSync(join(tmpdir(), "template-react-contract-"));
	roots.push(root);
	mkdirSync(join(root, "scripts"));
	copyFileSync(join(import.meta.dir, "check-react-runtime.ts"), join(root, "scripts/check-react-runtime.ts"));
	symlinkSync(join(import.meta.dir, "../node_modules"), join(root, "node_modules"), "dir");
	writeFileSync(
		join(root, "package.json"),
		JSON.stringify({
			...manifest,
			dependencies: { ...manifest.dependencies, react, "react-dom": reactDom },
		}),
	);
	return Bun.spawnSync([process.execPath, "scripts/check-react-runtime.ts"], { cwd: root });
}

test("the shipped dependency graph imports the React renderer", () => {
	const result = checkDeclarations(manifest.dependencies.react, manifest.dependencies["react-dom"]);
	expect(result.exitCode).toBe(0);
	expect(result.stdout.toString()).toContain("React runtime verified:");
});

test("independent caret ranges cannot silently resolve a new runtime", () => {
	const result = checkDeclarations(`^${manifest.dependencies.react}`, `^${manifest.dependencies.react}`);
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr.toString()).toContain("one exact declared and installed version");
});

test("a mismatched renderer declaration fails before preview startup", () => {
	const result = checkDeclarations(manifest.dependencies.react, "0.0.0");
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr.toString()).toContain("one exact declared and installed version");
});
