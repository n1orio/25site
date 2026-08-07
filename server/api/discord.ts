export default defineEventHandler(async () => {
  return cachedFetch("discord", 90_000, async () => {
    const discordUserId = "1411345352875053208";
    try {
      const response = await $fetch(
        `https://api.lanyard.rest/v1/users/${discordUserId}`,
      );
      return response;
    } catch (error) {
      return { success: false, error: "Failed to fetch Discord data" };
    }
  });
});