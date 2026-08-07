export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const key = config.steamApiKey;
  const steamid = config.steamId;

  if (!key || !steamid || key === "твой_ключ_здесь") {
    return {
      personaname: "nio.",
      profileurl: "https://steamcommunity.com/",
      avatar:
        "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
      state: "В игре",
      isPlaying: true,
      gameName: "Cyberpunk 2077",
      gameArt:
        "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
      level: 42,
      recentGame: "Counter-Strike 2",
      recentGameArt:
        "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
      recentHours: 14.5,
      totalRecentHours: 32.4,
      totalGames: 128,
    };
  }

  return cachedFetch("steam", 120_000, async () => {
    try {
      const [summaryRes, levelRes, recentRes, ownedRes]: any = await Promise.all([
      $fetch(
        `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`,
      ).catch(() => null),
      $fetch(
        `http://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${key}&steamid=${steamid}`,
      ).catch(() => null),
      $fetch(
        `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${steamid}&format=json`,
      ).catch(() => null),
      $fetch(
        `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamid}&format=json`,
      ).catch(() => null),
    ]);

    const player = summaryRes?.response?.players?.[0] || {};
    let isPlaying = false;
    let gameName = "";
    let gameArt = "";

    // Проверяем, играет ли прямо сейчас
    if (player.gameextrainfo) {
      isPlaying = true;
      gameName = player.gameextrainfo;
      // Если это официальная игра из Steam (есть gameid)
      if (player.gameid) {
        gameArt = `https://cdn.akamai.steamstatic.com/steam/apps/${player.gameid}/header.jpg`;
      }
    }

    let recentGame = "Ничего";
    let recentGameArt = "";
    let recentHours = 0;
    let totalRecentHours = 0;

    if (recentRes?.response?.games?.length > 0) {
      const games = recentRes.response.games;
      const topGame = games[0];
      recentGame = topGame.name;
      recentGameArt = `https://cdn.akamai.steamstatic.com/steam/apps/${topGame.appid}/header.jpg`;
      recentHours = Number((topGame.playtime_2weeks / 60).toFixed(1));

      const totalMins = games.reduce(
        (acc: number, curr: any) => acc + curr.playtime_2weeks,
        0,
      );
      totalRecentHours = Number((totalMins / 60).toFixed(1));
    }

    const states = [
      "Не в сети",
      "В сети",
      "Занят",
      "Нет на месте",
      "Спит",
      "Готов играть",
      "Готов обмениваться",
    ];
    const stateText = isPlaying
      ? "В игре"
      : states[player.personastate] || "Скрыт";

    return {
      personaname: player.personaname || "Неизвестно",
      profileurl: player.profileurl || "#",
      avatar: player.avatarfull || "",
      state: stateText,
      isPlaying,
      gameName,
      gameArt,
      level: levelRes?.response?.player_level || 0,
      recentGame,
      recentGameArt,
      recentHours,
      totalRecentHours,
      totalGames: ownedRes?.response?.game_count || 0,
    };
  } catch (error) {
    return null;
  }
});
});
