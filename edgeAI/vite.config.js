import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdxDeck from '@mdx-deck/vite'

export default defineConfig({
  plugins: [
    react(),
    mdxDeck(),
    {
      name: "ino-loader",
      transform(code, id) {
        if (id.endsWith(".ino")) {
          return `export default ${JSON.stringify(code)}`
        }
      }
    }
  ]
})
