import { location } from "~/config"

export interface WeatherData {
  city: string
  /** температура в °C */
  temp: number
  /** ощущается как, °C */
  feelsLike: number
  /** код состояния, нормализованный на наш */
  code: WeatherCode
  /** человекочитаемое описание на русском */
  label: string
  /** иконка lucide */
  icon: string
  isDay: boolean
  /** ветер, м/с */
  wind: number
  observedAt: string
}

export type WeatherCode =
  | "clear"
  | "partly"
  | "cloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "showers"
  | "thunder"

interface MeteoResponse {
  current?: {
    temperature_2m?: number
    apparent_temperature?: number
    weather_code?: number
    is_day?: number
    wind_speed_10m?: number
    time?: string
  }
}

const DAY_ICON = "lucide:sun"
const NIGHT_ICON = "lucide:moon"

/** WMO-коды Open-Meteo → наши состояния */
const decode = (code: number, isDay: boolean): { code: WeatherCode; label: string; icon: string } => {
  if (code === 0) {
    return { code: "clear", label: "Ясно", icon: isDay ? DAY_ICON : NIGHT_ICON }
  }
  if (code === 1) {
    return { code: "partly", label: "Преимущественно ясно", icon: isDay ? "lucide:cloud-sun" : "lucide:cloud-moon" }
  }
  if (code === 2) return { code: "partly", label: "Переменная облачность", icon: "lucide:cloud-sun" }
  if (code === 3) return { code: "overcast", label: "Пасмурно", icon: "lucide:cloud" }
  if (code === 45 || code === 48) return { code: "fog", label: "Туман", icon: "lucide:cloud-fog" }
  if (code >= 51 && code <= 57) return { code: "drizzle", label: "Морось", icon: "lucide:cloud-drizzle" }
  if (code >= 61 && code <= 67) return { code: "rain", label: "Дождь", icon: "lucide:cloud-rain" }
  if (code >= 71 && code <= 77) return { code: "snow", label: "Снег", icon: "lucide:cloud-snow" }
  if (code >= 80 && code <= 82) return { code: "showers", label: "Ливень", icon: "lucide:cloud-rain-wind" }
  if (code === 85 || code === 86) return { code: "snow", label: "Снегопад", icon: "lucide:cloud-snow" }
  if (code >= 95) return { code: "thunder", label: "Гроза", icon: "lucide:cloud-lightning" }
  return { code: "overcast", label: "Пасмурно", icon: "lucide:cloud" }
}

export default defineEventHandler(async (): Promise<WeatherData | null> => {
  // погода меняется быстрее статистики — 15 минут
  return cachedFetch<WeatherData | null>("weather", 15 * 60 * 1000, async () => {
    try {
      const res = await $fetch<MeteoResponse>(
        "https://api.open-meteo.com/v1/forecast",
        {
          query: {
            latitude: location.lat,
            longitude: location.lon,
            current: "temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m",
            timezone: "auto",
          },
        },
      )

      const cur = res?.current
      if (!cur) return null

      const isDay = (cur.is_day ?? 1) === 1
      const { code, label, icon } = decode(cur.weather_code ?? 0, isDay)

      return {
        city: location.city,
        temp: Math.round(cur.temperature_2m ?? 0),
        feelsLike: Math.round(cur.apparent_temperature ?? 0),
        code,
        label,
        icon,
        isDay,
        wind: Math.round((cur.wind_speed_10m ?? 0) * 10) / 10,
        observedAt: cur.time ?? "",
      }
    } catch {
      return null
    }
  })
})
