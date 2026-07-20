<template>
  <div class="flex flex-col gap-3">
    <a
      v-for="social in socials"
      :key="social.name"
      :href="social.url"
      target="_blank"
      class="group p-4 rounded-[24px] flex items-center gap-4 cursor-pointer transition-all duration-300 theme-card"
      :style="{ '--brand': social.color }"
    >
      <Icon
        :name="social.icon"
        size="28"
        class="social-icon flex-shrink-0 transition-colors duration-300"
      />
      <div class="min-w-0 flex-1">
        <h3
          class="font-heading font-bold text-base text-zinc-900 dark:text-white transition-colors duration-300 social-text truncate"
        >
          {{ social.name }}
        </h3>
        <p
          class="text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-300 social-subtext truncate"
        >
          {{ social.desc }}
        </p>
      </div>
    </a>
  </div>
</template>

<script setup>
// Соцсети: иконка + название + описание
const socials = [
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
];
</script>

<style scoped>
/* Иконка в фирменный цвет */
.social-icon {
  color: var(--brand);
}

/* Ховер для светлой */
a:hover {
  background: rgba(0, 0, 0, 0.02);
}

/* Ховер для тёмной */
.dark a:hover {
  background: rgba(255, 255, 255, 0.04);
}
</style>
