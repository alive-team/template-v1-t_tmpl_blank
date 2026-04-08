import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { aliveTagger } from "@alive-game/alive-tagger"
import { defineConfig } from "vite"

const PORT = Number(process.env.PORT) || 3594
const API_PORT = PORT + 1000

export default defineConfig(({ mode }) => ({
	server: {
		host: "::",
		port: PORT,
		allowedHosts: ["blank.alive.best"],
		hmr: {
			protocol: "wss",
			clientPort: 443,
		},
		proxy: {
			"/api": {
				target: `http://localhost:${API_PORT}`,
				changeOrigin: true,
			},
		},
	},
	preview: {
		host: "::",
		port: PORT,
		allowedHosts: ["blank.alive.best"],
	},
	plugins: [
		react(),
		tailwindcss(),
		mode === "development" && aliveTagger(),
	].filter(Boolean),
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
}))
