import type { Dictionary } from "./types";

export const tr: Dictionary = {
  heroKicker: "NASA EONET · Canlı akış",
  heroTitle: "BurnMap",
  heroStatsTemplate:
    "Son {days} günde <<COUNT>> açık orman yangını (küresel, EONET v3).",
  heroStatsSingular:
    "Son {days} günde <<COUNT>> açık orman yangını (küresel, EONET v3).",
  eonetUnavailable:
    "NASA EONET'e ulaşılamadı. Hizmet yeniden gelene kadar boş olay listesi gösteriliyor.",
  emptyList: "Bu pencere için açık orman yangını bulunamadı.",
  incidentsListLabel: "Orman yangını olayları",
  areaMultiPoint: "Alan / çoklu nokta",
  mapAria:
    "Yangın konumları haritası. Yakınlaştırmak için sıkıştırın veya kaydırın; kaydırmak için sürükleyin.",
  mapLoading: "Harita yükleniyor",
  mapTokenMissingTitle: "Mapbox anahtarı yok",
  mapTokenMissingBody:
    ".env.local dosyasına NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ekleyin, sunucuyu yeniden başlatın — veya aşağıdan ücretsiz OpenFreeMap katmanına geçin.",
  mapSwitchToFree: "Ücretsiz haritayı kullan (OpenFreeMap)",
  themeLight: "Açık",
  themeDark: "Koyu",
  langEnglish: "İngilizce",
  langTurkish: "Türkçe",
  providerMapbox: "Mapbox",
  providerOpenFreeMap: "OpenFreeMap (ücretsiz)",
  disclaimerTitle: "Ücretsiz harita katmanı bilgisi",
  disclaimerIntro:
    "OpenFreeMap, API anahtarı gerektirmeyen topluluk tabanlı bir alternatiftir. Devam etmeden önce:",
  disclaimerBullet1:
    "Kesintisiz çalışma veya performans garantisi yok — kesinti veya yavaşlama olabilir.",
  disclaimerBullet2: "Yoğun trafikte karo yükleme süreleri uzayabilir.",
  disclaimerBullet3:
    "Üçüncü taraf bir hizmete güveniyorsunuz; koşullarını ve gizlilik uygulamalarını kendiniz değerlendirin.",
  disclaimerBullet4:
    "OpenStreetMap ve stil sağlayıcıları görünür atıf ister (varsayılan olarak açıktır).",
  disclaimerConfirm: "Anladım",
  disclaimerCancel: "Vazgeç",
};
