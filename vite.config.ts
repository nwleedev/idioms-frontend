import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

// https://vitejs.dev/config/
export default defineConfig(() => {
  const port = process.env.VITE_DEV_PORT;
  const host = process.env.VITE_DEV_HOST;
  return {
    plugins: [
      tsconfigPaths(),
      mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      }),
      remix({
        basename: "/",
        buildDirectory: "build",
        future: {
          /* any enabled future flags */
        },
        ignoredRouteFiles: ["**/*.css", "**/*.scss"],
        serverBuildFile: "index.js",
      }),
    ],
    define: {
      "process.env": process.env,
    },
    server: {
      host: host === "true" ? true : false,
      port: Number(port),
    },
  };
});
