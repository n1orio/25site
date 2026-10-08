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
      title: "@Niorio — Максим, Армавир",
      htmlAttrs: { lang: "ru" },
      meta: [
        { name: "description", content: "Сайт Максима: проекты, статистика Deadlock, сетап, Steam и Discord в реальном времени." },
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },

        // Open Graph — превью при отправке ссылки в мессенджеры
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "nio." },
        { property: "og:title", content: "@Niorio — Максим, Армавир" },
        { property: "og:description", content: "Проекты, статистика Deadlock, сетап, Steam и Discord в реальном времени." },
        { property: "og:image", content: "/og.png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:locale", content: "ru_RU" },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "@Niorio — Максим, Армавир" },
        { name: "twitter:description", content: "Проекты, статистика Deadlock, сетап, Steam и Discord в реальном времени." },
        { name: "twitter:image", content: "/og.png" },
      ],
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
  // Хранилище для счётчика посетителей. В контейнере DATA_DIR=/data,
  // который смонтирован томом — иначе счётчик обнуляется на каждом деплое.
  nitro: {
    storage: {
      data: { driver: "fs", base: process.env.DATA_DIR || "./.data/kv" },
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
