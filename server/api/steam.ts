import type {
  SteamData, SteamGame, SteamPlayer,
  SteamPlayerSummaryResponse, SteamLevelResponse,
  SteamRecentGamesResponse, SteamOwnedGamesResponse,
} from "~/types/steam"

export default defineEventHandler(async (): Promise<SteamData> => {
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

  return cachedFetch<SteamData>("steam", 120_000, async () => {
    try {
      const [summaryRes, levelRes, recentRes, ownedRes] = await Promise.all([
      $fetch<SteamPlayerSummaryResponse>(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`,
      ).catch(() => null),
      $fetch<SteamLevelResponse>(
        `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${key}&steamid=${steamid}`,
      ).catch(() => null),
      $fetch<SteamRecentGamesResponse>(
        `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${steamid}&format=json`,
      ).catch(() => null),
      $fetch<SteamOwnedGamesResponse>(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamid}&format=json`,
      ).catch(() => null),
    ]);

    const player: SteamPlayer = summaryRes?.response?.players?.[0] ?? {};
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

    const games: SteamGame[] = recentRes?.response?.games ?? [];
    const topGame = games[0];
    if (topGame) {
      recentGame = topGame.name ?? "Ничего";
      recentGameArt = `https://cdn.akamai.steamstatic.com/steam/apps/${topGame.appid}/header.jpg`;
      // playtime_2weeks у Steam опционален: без него было
      // undefined / 60 → NaN, и в шапке вылезало «NaN ч.»
      recentHours = Number(((topGame.playtime_2weeks ?? 0) / 60).toFixed(1));

      const totalMins = games.reduce(
        (acc, curr) => acc + (curr.playtime_2weeks ?? 0),
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
    /**
     * personastate — индекс в states. Если Steam не ответил или
     * аккаунт приватный, поля нет: раньше states[undefined]
     * давало undefined → «Скрыт», и клиент показывал это как
     * «в сети». Отсутствие состояния — это оффлайн.
     */
    const stateText = isPlaying
      ? "В игре"
      : states[player.personastate ?? 0] ?? "Не в сети";

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
  } catch {
    // null здесь превращался на клиенте в state === undefined,
    // а проверка «всё, что не „Не в сети“ — онлайн» показывала
    // синюю точку. Отдаём явный оффлайн.
    return {
      personaname: "",
      profileurl: "",
      avatar: "",
      state: "Не в сети",
      isPlaying: false,
      gameName: "",
      gameArt: "",
      level: 0,
      recentGame: "",
      recentGameArt: "",
      recentHours: 0,
      totalRecentHours: 0,
      totalGames: 0,
    };
  }
});
});
