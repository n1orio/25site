import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2026-07-20',
  sourcemap: {
    client: false,
    server: false,
  },
  modules: [
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxtjs/sitemap",
    "@nuxt/eslint",
  ],
  icon: {
    serverBundle: 'remote',
  },
  css: ["~/assets/css/main.css"],
  hooks: {
    "vite:extendConfig": (config: any) => {
      config.plugins?.push(tailwindcss())
    },
  },
  sitemap: {
    exclude: [],
  },
  app: {
    head: {
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
      ],
    },
  },
  runtimeConfig: {
    steamApiKey: process.env.STEAM_API_KEY,
    steamId: process.env.STEAM_ID,
    lastfmApiKey: "",
    lastfmUsername: "",
  },
})
