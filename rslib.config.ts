import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "esm",
      output: {
        minify: {
          js: true,
          jsOptions: {
            minimizerOptions: {
              mangle: false,
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
      output: {
        minify: {
          js: true,
          jsOptions: {
            minimizerOptions: {
              mangle: false,
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
  dts: {
    removeComments: false,
  },
});
