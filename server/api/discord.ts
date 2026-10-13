import type { LanyardData } from "~/types/steam"

export default defineEventHandler(async (): Promise<LanyardData> => {
  return cachedFetch<LanyardData>("discord", 90_000, async () => {
    const discordUserId = "1411345352875053208";
    try {
      return await $fetch<LanyardData>(
        `https://api.lanyard.rest/v1/users/${discordUserId}`,
      );
    } catch {
      return { success: false, error: "Failed to fetch Discord data" };
    }
  });
});