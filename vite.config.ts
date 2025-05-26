import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    include: [
      /\.jsx?$/, // .js and .jsx
      /\.tsx?$/, // .ts and .tsx
    ],

  }),

    visualizer({
      filename: 'build/stats.html', // Updated to match new build directory
      open: true, // automatically open the report in browser
      gzipSize: true,
      brotliSize: true,
    })


],
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'), // ✅ now you can use @/ everywhere
  },
},
  build: {
    outDir: 'build'  // Changes output from 'dist' to 'build'
  }
})