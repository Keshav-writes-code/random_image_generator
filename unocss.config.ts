// uno.config.ts
import { defineConfig } from "unocss";
import { transformerVariantGroup } from "unocss";
import { presetIcons } from "unocss";
import { presetMini } from "unocss";
import { presetWebFonts } from "unocss";
import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import { presetDaisyui } from "@0x-jerry/unocss-preset-daisyui";

export default defineConfig({
  rules: [
    ["capitalize", { "text-transform": "capitalize" }],
    ["isolate", { isolation: "isolate" }],
  ],
  presets: [
    presetMini(),
    presetDaisyui(),
    presetIcons(),
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
