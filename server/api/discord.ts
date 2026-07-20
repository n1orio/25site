export default defineEventHandler(async () => {
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
