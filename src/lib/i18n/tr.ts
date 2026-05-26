import type { Dictionary } from "./types";

export const tr: Dictionary = {
  heroKicker: "NASA FIRMS · VIIRS NOAA-20 NRT",
  heroTitle: "BurnMap",
  heroSubtitle:
    "Son 24 saate ait küresel aktif yangın tespitleri, hızlı operasyonel tarama için düzenlendi.",
  liveWindowLabel: "Pencere",
  sourceLabel: "Kaynak",
  sourceValue: "VIIRS NOAA-20 NRT",
  detectionsLabel: "Tespit",
  latestPassLabel: "Son geçiş",
  highConfidenceLabel: "Yüksek güven",
  frpLabel: "Toplam FRP",
  peakFrpLabel: "Tepe FRP",
  mapPanelTitle: "Aktif yangın alanı",
  mapPanelSubtitle: "Kümelenmiş tespitler güvene ve FRP'ye göre çizilir.",
  railTitle: "Tespit kuyruğu",
  railSubtitle: "Önce en yeni kayıtlar, sonra en güçlü FRP.",
  showingLimit: "Akış daha büyükse ilk 100 kayıt gösterilir.",
  firmsUnavailable:
    "NASA FIRMS'e ulaşılamadı. Hizmet yeniden gelene kadar boş tespit kümesi gösteriliyor.",
  firmsKeyMissing:
    "NASA_FIRMS_MAP_KEY yapılandırılmamış. Canlı tespitleri yüklemek için sunucuya FIRMS MAP_KEY ekleyin.",
  emptyList: "Bu pencere için FIRMS tespiti bulunamadı.",
  detectionsListLabel: "FIRMS yangın tespitleri",
  confidenceHigh: "Yüksek",
  confidenceNominal: "Nominal",
  confidenceLow: "Düşük",
  dayDetection: "Gündüz",
  nightDetection: "Gece",
  latestUnknown: "Henüz geçiş yok",
  mapAria:
    "Aktif yangın tespit haritası. Yakınlaştırmak için sıkıştırın veya kaydırın; kaydırmak için sürükleyin.",
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
