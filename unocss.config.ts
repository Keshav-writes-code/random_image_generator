// uno.config.ts
import { defineConfig } from "unocss";
import { transformerVariantGroup } from "unocss";
import { presetIcons } from "unocss";
import { presetMini } from "unocss";
import { presetDaisy } from "unocss-preset-daisyui-next";
import { presetWebFonts } from "unocss";
import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
export default defineConfig({
  rules: [
    ["capitalize", { "text-transform": "capitalize" }],
    ["isolate", { isolation: "isolate" }],
  ],
  presets: [
    presetMini(),
    presetIcons(),
    presetDaisy(),
    presetWebFonts({
      provider: "bunny",
      fonts: {
        sans: "Atkinson Hyperlegible",
        sans2: "Alata",
        mono: "Fira Code",
      },
      processors: createLocalFontProcessor({
        cacheDir: "node_modules/.cache/unocss/fonts",
        fontAssetsDir: "public/assets/fonts",
        fontServeBaseUrl: "/assets/fonts",
      }),
    }),
  ],
  transformers: [transformerVariantGroup()],
});
