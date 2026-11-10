import { defineConfig } from 'vite';

// One ES module with three bundled in: sites load /foundry/scenes.js lazily and call what they need.
export default defineConfig({
  build: {
    lib: { entry: 'src/index.js', formats: ['es'], fileName: () => 'scenes.js' },
    outDir: 'dist',
    minify: 'esbuild',
    emptyOutDir: true,
  },
});
