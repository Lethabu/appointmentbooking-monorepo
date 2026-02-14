export default {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",  // Fixed: Changed from "node" to "edge" for cloudflare-node compatibility
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "direct",
      // Fix esbuild ES2024 target error - use ES2022 instead
      esbuildOptions: {
        target: 'es2022',
      },
    },
  },
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "direct",
    },
  },
};