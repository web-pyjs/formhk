import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

export default [
  // CommonJS
  {
    input: "src/index.js",
    output: {
      file: "lib/cjs.js",
      format: "cjs",
      indent: false
    },
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      resolve(),
      babel({
        exclude: "node_modules/**" // only transpile our source code
      })
    ]
  },
  // ES
  {
    input: "src/index.js",
    output: {
      file: "lib/es.js",
      format: "es",
      indent: false
    },
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      resolve(),
      babel({
        exclude: "node_modules/**" // only transpile our source code
      })
    ]
  }
];
