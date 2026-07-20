<template>
  <div class="flex flex-col gap-6">
    <div class="theme-card rounded-[32px] overflow-hidden flex flex-col p-2">
      <div class="px-5 pt-4 pb-2">
        <h3
          class="font-heading text-[10px] font-black tracking-widest uppercase text-zinc-500 transition-colors"

        >
          Основное железо
        </h3>
      </div>

      <ul class="flex flex-col">
        <li
          v-for="(item, index) in workstationItems"
          :key="index"
          class="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-3 px-5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="text-sm font-bold text-zinc-900 dark:text-white truncate transition-colors"

            >
              {{ item.name }}
            </span>
            <div
              v-if="item.comment"
              class="group/tooltip relative flex items-center justify-center cursor-help"
            >
              <Icon
                name="lucide:info"
                class="w-3.5 h-3.5 text-zinc-400 hover:text-[var(--accent)] transition-colors"
              />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold text-center rounded-xl opacity-0 translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all pointer-events-none z-50 shadow-xl"
              >
                <span>{{ item.comment }}</span>
                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-zinc-900 dark:border-t-white"
                ></div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 min-w-0">
            <a
              v-if="item.link"
              :href="item.link"
              target="_blank"
              class="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 hover:text-[var(--accent)] transition-colors truncate"
            >
              <span class="truncate">{{ item.value }}</span>
              <Icon name="lucide:external-link" class="w-3 h-3 flex-shrink-0" />
            </a>
            <span
              v-else
              class="text-xs sm:text-sm text-zinc-500 truncate transition-colors"
            >
              {{ item.value }}
            </span>
          </div>
        </li>
      </ul>
    </div>

    <div class="theme-card rounded-[32px] overflow-hidden flex flex-col p-2">
      <div class="px-5 pt-4 pb-2 flex justify-between items-center">
        <h3
          class="font-heading text-[10px] font-black tracking-widest uppercase text-zinc-500 transition-colors"
        >
          Дополнительно
        </h3>
        <span
          class="font-mono text-xs font-bold text-[var(--accent)] tracking-widest transition-colors"

        >
          {{ currentFrame }}
        </span>
      </div>

      <ul class="flex flex-col">
        <li
          v-for="(item, index) in baseItems"
          :key="index"
          class="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-3 px-5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="text-sm font-bold text-zinc-900 dark:text-white truncate transition-colors"

            >
              {{ item.name }}
            </span>
            <div
              v-if="item.comment"
              class="group/tooltip relative flex items-center justify-center cursor-help"
            >
              <Icon
                name="lucide:info"
                class="w-3.5 h-3.5 text-zinc-400 hover:text-[var(--accent)] transition-colors"
              />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold text-center rounded-xl opacity-0 translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all pointer-events-none z-50 shadow-xl"
              >
                <span>{{ item.comment }}</span>
                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-zinc-900 dark:border-t-white"
                ></div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="text-xs sm:text-sm text-zinc-500 truncate transition-colors"
            >
              {{ item.value }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const { accentColor } = useSecretTheme();

// Блок 1: основное железо
const workstationItems = [
  { name: "Телефон", value: "iPhone 16 Pro", comment: "Дермоед" },
  {
    name: "PC",
    value: "RTX 5070TI | Ryzen 5 7500F | 32gb RAM",
    comment: "Собирал сам, тянет всё на максималках",
  },
  {
    name: "Monitor 1",
    value: "Ardor Infinity Pro 27'' 2K",
    comment: "Нечего сказать, все отлично",
    link: "https://www.dns-shop.ru/product/7b1f39f10b79ce2e/27-monitor-ardor-gaming-infinity-pro-aq27h1-cernyj/",
  },
  {
    name: "Monitor 2",
    value: "MI 27'' HFGL FullHD",
    comment: "Под дискорд и тд, не очень советую к покупке",
  },
  {
    name: "Keyboard",
    value: "Dark Project KD83A",
    comment: "Купить магнитку было лучшим решением",
    link: "https://www.dns-shop.ru/product/d5516ec1cf9fed20/klaviatura-provodnaa-dark-prodzekt-kd83a/",
  },
  {
    name: "Mouse",
    value: "ARDOR GAMING Ulta",
    comment: "Сменные свитчи имба. Пару раз кидал в стену, выдержала",
    link: "https://www.dns-shop.ru/product/84d1774bcf7ced20/mys-besprovodnaaprovodnaa-ardor-gaming-ulta-cernyj/",
  },
  {
    name: "Headset",
    value: "Dark Project HS5",
    comment: "Отличные уши",
    link: "https://www.dns-shop.ru/product/a54441621c01d582/besprovodnye-nausniki-dark-prodzekt-hs5-wireless-v2-cernyj-2023/",
  },
  { name: "Earbuds", value: "AirPods Pro 2", comment: "40% дня в них" },
  {
    name: "Microphone",
    value: "Fifine AM8",
    comment: "Недавно сломался, сейчас использую встроеный с HS5",
  },
  {
    name: "Webcam",
    value: "Ardor Oracle",
    comment: "Не очень советую, появились пятна",
  },
  {
    name: "Smartwatch",
    value: "Apple Watch SE3",
    comment: "Меньше достаю телефон из-за уведомлений",
  },
];

// Блок 2: дополнительно
const baseItems = [
  { name: "Height", value: "185 см", comment: "Ощущается как 150 см" },
  { name: "Penis size", value: "20 cm", comment: "👀" },
  {
    name: "Тряпочка",
    value: "50x90 см",
    comment: "Огромная, чтобы протирать сразу всё",
  },
  {
    name: "Зубочистка",
    value: "Пластиковая",
    comment: "Экологично и практично",
  },
];

// ASCII-анимация
const frames = [" \\(°O°)/ ", " —(°O°)— ", " /(°O°)\\ ", " —(°O°)— "];
const currentFrame = ref(frames[0]);
let animationInterval = null;

onMounted(() => {
  let i = 0;
  animationInterval = setInterval(() => {
    i = (i + 1) % frames.length;
    currentFrame.value = frames[i];
  }, 400);
});

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval);
});
</script>
