import { externalizeDeps } from 'vite-plugin-externalize-deps';
import { defineConfig } from 'vite-plus';

import { oxfmtConfig } from '@thaz/oxfmt-config';
import { nativeConfig, libraryCodeConfigRules } from '@thaz/oxlint-config';

export default defineConfig({
  staged: {
    '*.{js,ts,tsx}': 'vp check --fix',
  },
  run: {
    cache: {
      scripts: false,
      tasks: true,
    },
    tasks: {
      build: {
        command: 'vp pack',
      },
      check: {
        command: 'vp check',
      },
      fmt: {
        command: 'vp fmt',
      },
      lint: {
        command: 'vp lint',
      },
      typecheck: {
        command: 'vp check --no-fmt --no-lint',
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [externalizeDeps()],
  pack: {
    dts: {
      build: true,
    },
    outputOptions: {
      preserveModules: true,
    },
    entry: {
      index: './src/index.ts',
      valibot: './src/valibot/index.ts',
      formatter: './src/formatter/index.ts',
    },
    exports: {
      customExports: {
        '.': {
          types: './dist/index.d.mts',
          import: './dist/index.mjs',
        },
        './valibot': {
          types: './dist/valibot.d.mts',
          import: './dist/valibot.mjs',
        },
        './formatter': {
          types: './dist/formatter.d.mts',
          import: './dist/formatter.mjs',
        },
      },
    },
  },
  fmt: oxfmtConfig,
  lint: {
    extends: [nativeConfig],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      ...libraryCodeConfigRules.rules,
      'import/no-default-export': 'off',
    },
  },
});
