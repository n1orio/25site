export interface Social {
  name: string
  desc: string
  icon: string
  url: string
  color: string
}

export interface Project {
  icon: string
  title: string
  desc: string
  tags: string[]
  noHover?: boolean
  links: { label: string; icon: string; url: string }[]
}

export interface WorkstationItem {
  name: string
  value: string
  comment?: string
  link?: string
}

export interface Anime {
  title: string
  desc?: string
}

// === Личность ===
export const logo = "nio"
export const username = "@Niorio"
export const bioTitle = "Привки 👋"
export const bio = [
  "Меня зовут Максим, мне 16 лет, живу в Армавире",
  "Веду разные соцсети и делаю проекты в свободное время",
  "Имею опыт работы с Java, Kotlin, Python, Vue/Nuxt, React, TypeScript, JavaScript, Denizen, Figma, Blockbench, Aseprite.",
]

// === Навигация ===
export const navTabs: { label: string; to: string }[] = [
  { label: "Соцсети", to: "/" },
  { label: "Проекты", to: "/projects" },
  { label: "Мой Сетап", to: "/uses" },
  { label: "Топ Аниме", to: "/now" },
]

// === Соцсети ===
export const socials: Social[] = [
  {
    name: "Telegram",
    desc: "Мой личный канал",
    icon: "ic:baseline-telegram",
    url: "https://t.me/niori0",
    color: "#2AABEE",
  },
  {
    name: "Discord",
    desc: "Мой сервер / Комьюнити",
    icon: "ic:baseline-discord",
    url: "https://discord.gg/scn2dg5H93",
    color: "#5865F2",
  },
  {
    name: "Twitch",
    desc: "Стримы время от времени",
    icon: "mdi:twitch",
    url: "https://www.twitch.tv/n1orio",
    color: "#9146FF",
  },
  {
    name: "TikTok",
    desc: "Видео и клипы",
    icon: "ic:baseline-tiktok",
    url: "https://www.tiktok.com/@nior1o?_r=1&_t=ZS-97S6oDerpIq",
    color: "#ff0050",
  },
  {
    name: "Modrinth",
    desc: "Мои моды",
    icon: "simple-icons:modrinth",
    url: "https://modrinth.com/user/fYUc8RDk",
    color: "#1BD96A",
  },
  {
    name: "GitHub",
    desc: "Исходный код моих проектов",
    icon: "mdi:github",
    url: "https://github.com/n1orio/",
    color: "#24292F",
  },
  {
    name: "YouTube",
    desc: "Я не снимаю контент на ютубе",
    icon: "mdi:youtube",
    url: "https://www.youtube.com/@socka_normis",
    color: "#FF0000",
  },
  {
    name: "Roblox",
    desc: "Пупу",
    icon: "simple-icons:roblox",
    url: "https://www.roblox.com/users/4229230681/profile",
    color: "#F54927",
  },
]

// === Проекты ===
export const projects: Project[] = [
  {
    icon: "lucide:bot",
    title: "25bot",
    desc: "Открытый Discord бот — бесплатная альтернатива MEE6. Тикеты, экономика, временные голосовые каналы, модерация, игры, TikTok постинг.",
    tags: ["Python", "discord.py", "MongoDB"],
    links: [
      { label: "GitHub", icon: "mdi:github", url: "https://github.com/n1orio/25bot" },
    ],
  },
  {
    icon: "lucide:globe",
    title: "Личный Сайт v2",
    desc: "Этот самый сайт, с современным дизайном, плавной анимацией и кучей пасхалок.",
    tags: ["Nuxt 4", "Tailwind", "Bun", "TypeScript"],
    noHover: true,
    links: [],
  },
  {
    icon: "lucide:zap",
    title: "TFMG Energy Connector",
    desc: "Мод для Minecraft, который конвертирует энергию из Create: TFMG в Fe",
    tags: ["Minecraft", "NeoForge", "Kotilin"],
    links: [
      { label: "GitHub", icon: "mdi:github", url: "https://github.com/n1orio/TFMG-Energy-Connector" },
      { label: "Modrinth", icon: "simple-icons:modrinth", url: "https://modrinth.com/mod/tfmg-energy-converter" },
    ],
  },
  {
    icon: "lucide:wind",
    title: "Breeze Site",
    desc: "Сайт для невышедшего майнкрафт сервера Breeze",
    tags: ["Next.js", "TypeScript", "Prisma", "Bun"],
    links: [
      { label: "GitHub", icon: "mdi:github", url: "https://github.com/n1orio/breeze-site" },
    ],
  },
  {
    icon: "lucide:languages",
    title: "Auto Mod Translator",
    desc: "Скрипт на Python, который автоматически переводит моды Minecraft на русский через Google Translate.",
    tags: ["Python", "Minecraft"],
    links: [
      { label: "GitHub", icon: "mdi:github", url: "https://github.com/n1orio/Minecraft-Auto-Mod-Translator" },
    ],
  },
]

// === Сетап ===
export const workstationItems: WorkstationItem[] = [
  { name: "Телефон", value: "iPhone 16 Pro", comment: "Дермоед" },
  { name: "PC", value: "RTX 5070TI | Ryzen 5 7500F | 32gb RAM", comment: "Собирал сам, тянет всё на максималках" },
  { name: "Monitor 1", value: "Ardor Infinity Pro 27'' 2K", comment: "Нечего сказать, все отлично", link: "https://www.dns-shop.ru/product/7b1f39f10b79ce2e/27-monitor-ardor-gaming-infinity-pro-aq27h1-cernyj/" },
  { name: "Monitor 2", value: "MI 27'' HFGL FullHD", comment: "Под дискорд и тд, не очень советую к покупке" },
  { name: "Keyboard", value: "Dark Project KD83A", comment: "Купить магнитку было лучшим решением", link: "https://www.dns-shop.ru/product/d5516ec1cf9fed20/klaviatura-provodnaa-dark-prodzekt-kd83a/" },
  { name: "Mouse", value: "ARDOR GAMING Ulta", comment: "Сменные свитчи имба. Пару раз кидал в стену, выдержала", link: "https://www.dns-shop.ru/product/84d1774bcf7ced20/mys-besprovodnaaprovodnaa-ardor-gaming-ulta-cernyj/" },
  { name: "Headset", value: "Dark Project HS5", comment: "Отличные уши", link: "https://www.dns-shop.ru/product/a54441621c01d582/besprovodnye-nausniki-dark-prodzekt-hs5-wireless-v2-cernyj-2023/" },
  { name: "Earbuds", value: "AirPods Pro 2", comment: "40% дня в них" },
  { name: "Microphone", value: "Fifine AM8", comment: "Недавно сломался, сейчас использую встроеный с HS5" },
  { name: "Webcam", value: "Ardor Oracle", comment: "Не очень советую, появились пятна" },
  { name: "Smartwatch", value: "Apple Watch SE3", comment: "Меньше достаю телефон из-за уведомлений" },
]

export const baseItems: WorkstationItem[] = [
  { name: "Height", value: "185 см", comment: "Ощущается как 150 см" },
  { name: "Penis size", value: "20 cm", comment: "👀" },
  { name: "Тряпочка", value: "50x90 см", comment: "Огромная, чтобы протирать сразу всё" },
  { name: "Зубочистка", value: "Пластиковая", comment: "Экологично и практично" },
]

// === Топ аниме ===
export const topAnime: Anime[] = [
  { title: "Ре: Зеро", desc: "Лучший исекай, который я смотрел." },
  { title: "Магическая битва", desc: "Ну прекл вроде." },
  { title: "Евангелион (ребилды тоже)", desc: "Море борща." },
  { title: "Невероятные приключения ДжоДжо" },
  { title: "Звездное дитя" },
  { title: "Дандадан" },
  { title: "Реинкарнация безработного" },
  { title: "Киберпанк: Бегущие по краю" },
  { title: "Токийский гуль" },
  { title: "Тетрадь смерти" },
  { title: "Атака титанов", desc: "Я так и не смог досмотреть." },
  { title: "Моб психо 100" },
  { title: "Милый во Франксе" },
  { title: "Паразит", desc: "Классика." },
  { title: "Моя геройская академия", desc: "Я не собираюсь это досматривать." },
]

// === Аниме-дисклеймер ===
export const animeDisclaimer = "Все аниме в топе очень хорошие, их места — это лишь мое мнение. Некоторые просмотренные тайтлы сюда не попали."
