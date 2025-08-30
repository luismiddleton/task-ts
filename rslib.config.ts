import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "esm",
      dts: {
        bundle: true,
      },
      output: {
        minify: {
          js: true,
          jsOptions: {
            minimizerOptions: {
              mangle: true,
              minify: true,
              compress: {
                toplevel: true,
              },
            },
          },
        },
        distPath: {
          root: "./dist/esm",
        },
      },
    },
    {
      format: "cjs",
      dts: {
        bundle: true,
      },
      output: {
        minify: {
          js: true,
          jsOptions: {
            minimizerOptions: {
              mangle: true,
              minify: true,
              compress: {
                toplevel: true,
              },
            },
          },
        },
        distPath: {
          root: "./dist/cjs",
        },
      },
    },
  ],
});
