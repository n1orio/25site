<template>
  <div class="dl-bg-base fixed inset-0 z-0 pointer-events-none" />
  <!--
    Пятна были слоем в два вьюпорта с blur-[120px]: размытие на таком
    размере — самая дорогая часть компоновки, поэтому мягкость теперь
    даёт сам градиент (широкие прозрачные стопы), а не блюр.
  -->
  <div class="dl-bg-blobs fixed inset-0 z-0 pointer-events-none saturate-150 opacity-50 dark:opacity-[0.18]">
    <div class="absolute inset-0" :style="{ background: `radial-gradient(75% 70% at 30% 20%, var(--bg-1) 0%, transparent 72%)` }" />
    <div class="absolute inset-0" :style="{ background: `radial-gradient(75% 70% at 70% 80%, var(--bg-2) 0%, transparent 72%)` }" />
  </div>
</template>
