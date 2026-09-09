// Regression guard for alive-home/alive#13964 (observed in PR #13918): independently resolved React
// and React DOM versions crashed the first real preview before it rendered.
import { version as reactVersion } from "react";
import { version as reactDomVersion } from "react-dom";
import manifest from "../package.json";

const declaredReact = manifest.dependencies.react;
const declaredReactDom = manifest.dependencies["react-dom"];
if (declaredReact !== declaredReactDom || declaredReact !== reactVersion || declaredReactDom !== reactDomVersion) {
	throw new Error(
		`React must have one exact declared and installed version: declared react=${declaredReact}, react-dom=${declaredReactDom}; installed react=${reactVersion}, react-dom=${reactDomVersion}`,
	);
}

// Exercise the renderer's own compatibility assertion as well as package
// metadata. A nested or damaged install must fail before Vite serves a page.
await import("react-dom/client");
console.log(`React runtime verified: react=${reactVersion}, react-dom=${reactDomVersion}`);
