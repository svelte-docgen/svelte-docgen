import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig((env) => {
	return {
		assetsInclude: ["../../assets/**/*"],

		resolve: {
			alias: {
				// Because `svelte2tsx` relies on "node:path", we need to polyfill `node:path` with `pathe`.
				//
				// TODO: Remove this alias when we transition away from `svelte2tsx`.
				// Discussion: https://github.com/svelte-docgen/svelte-docgen/pull/45/files#r1894924147
				path: env.isSsrBuild ? "node:path" : "pathe",
			},
		},

		test: {
			include: ["src/**/*.{test,spec}.{js,ts}"],
		},
	};
});
