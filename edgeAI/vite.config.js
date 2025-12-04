import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
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
