import { defineConfig } from "vite"
import path from "path"

export default defineConfig({
  resolve: {
    alias: {
      "framer": path.resolve(process.cwd(), "./src/framer-mock.ts"),
    },
  },
})
