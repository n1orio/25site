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
        { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
        { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        { rel: "preload", href: "/fonts/MonaspaceArgon-Regular.woff2", as: "font", type: "font/woff2", crossorigin: "" },
        { rel: "preload", href: "/fonts/MonaspaceArgon-Bold.woff2", as: "font", type: "font/woff2", crossorigin: "" },
        { rel: "preload", href: "/fonts/inter-cyr.woff2", as: "font", type: "font/woff2", crossorigin: "" },
        { rel: "preload", href: "/fonts/inter-latin.woff2", as: "font", type: "font/woff2", crossorigin: "" },
      ],
    },
  },
  runtimeConfig: {
    // Ключи задаются переменными окружения NUXT_* — иначе они запекаются
    // в образ на этапе сборки и не подхватывают изменения без пересборки.
    steamApiKey: "",
    steamId: "",
    // без токена GitHub API даёт 60 запросов в час, с токеном — 5000
    githubToken: "",
    lastfmApiKey: "",
    lastfmUsername: "",
  },
})
