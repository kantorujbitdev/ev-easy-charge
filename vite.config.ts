
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add a reference to the extended tsconfig if needed
  // Using extended config instead of trying to modify the base tsconfig
  build: {
    // Reference the extended config file if needed for build
    // typescript: {
    //   tsconfig: "./tsconfig.extend.json"
    // }
  }
}));
