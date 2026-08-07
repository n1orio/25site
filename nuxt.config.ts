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
        { rel: "preload", href: "/fonts/MonaspaceArgon-Regular.woff2", as: "font", type: "font/woff2", crossorigin: "" },
        { rel: "preload", href: "/fonts/MonaspaceArgon-Bold.woff2", as: "font", type: "font/woff2", crossorigin: "" },
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
