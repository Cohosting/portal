import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    include: [
      /\.jsx?$/, // .js and .jsx
      /\.tsx?$/, // .ts and .tsx
    ],
  }),
  

],
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'), // ✅ now you can use @/ everywhere
  },
},
})
