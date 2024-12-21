import mod from "node:module";

import { vi } from "vitest";

// FIXME: Ugly workaround for `import.meta.resolve` not working in Vitest: https://github.com/vitest-dev/vitest/issues/6953
vi.stubGlobal("createRequire", mod.createRequire);
