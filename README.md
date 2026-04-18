# 🎥 SevenApps Video Diary App

[Turkish] Modern, hızlı ve ölçeklenebilir bir React Native video günlük uygulaması. Kullanıcıların videolarını içe aktarmasına, 5 saniyelik kesitler almasına ve bu anıları meta verileriyle saklamasına olanak tanır.

[English] A modern, fast, and scalable React Native video diary application. Allows users to import videos, crop 5-second segments, and store these memories with associated metadata.

---

## 🚀 Öne Çıkan Özellikler / Key Features

### 🇹🇷 Türkçe
- **Modern Video Kırpma:** `expo-trim-video` ve Tanstack Query ile asenkron video işleme.
- **Kalıcı Depolama (SQLite):** Tüm anılar `expo-sqlite` ile cihazınızda yerel bir veritabanında saklanır.
- **Akıllı Navigasyon:** Expo Router ile dosya tabanlı, performanslı yönlendirme.
- **Şık Tasarım:** NativeWind (Tailwind CSS) ile modern ve temiz arayüz.
- **Performanslı State Yönetimi:** Zustand ile hafif ve hızlı merkezi state.
- **Zod Validasyonu:** Form girişleri için güçlü şema doğrulama.
- **Akıcı Animasyonlar:** React Native Reanimated ile premium uygulama deneyimi.

### 🇺🇸 English
- **Modern Video Trimming:** Asynchronous video processing using `expo-trim-video` and Tanstack Query.
- **Persistent Storage (SQLite):** All memories are stored locally in a database using `expo-sqlite`.
- **Smart Navigation:** Performance-oriented, file-based routing with Expo Router.
- **Sleek Design:** Modern and clean interface built with NativeWind (Tailwind CSS).
- **High-Performance State Management:** Lightweight and fast central state handled by Zustand.
- **Zod Validation:** Robust schema validation for form inputs.
- **Smooth Animations:** Premium app experience powered by React Native Reanimated.

---

## 🏗️ Proje Yapısı / Project Structure

```text
.
├── app/                  # Expo Router (Routing)
│   ├── (tabs)/           # Main Tabs (Video List, Favorites)
│   ├── detail/[id].tsx   # Video Details Page
│   └── edit/[id].tsx     # Video Edit Page
├── src/
├── components/           # Reusable UI Components
│   │   ├── CropModal/    # 3-step video cropping module
│   │   ├── VideoCard.tsx # List item component
│   │   └── VideoPlayer.tsx # Video player component
│   ├── hooks/            # Custom Hooks (useTrimVideo, useSplashscreen)
│   ├── services/         # Database Service Layer (SQLite CRUD)
│   ├── store/            # Zustand Central State Management
│   ├── types/            # TypeScript Type Definitions
│   └── utils/            # Utility Functions (Validation, Formatter)
```

---

## 🛠️ Kurulum Adımları / Installation Steps

**TR:** ÖNEMLİ: Proje React 19 ve Expo mimarisi üzerinde yükselmektedir. Paket çakışmalarını önlemek için kurulum sırasında legacy bayrağını kullanmanız önerilir.

**EN:** IMPORTANT: This project is built on React 19 and the Expo architecture. It is recommended to use the legacy flag during installation to prevent package conflicts.

1. **Depoyu klonlayın / Clone the repository:**
   ```bash
   git clone <repo-url>
   cd video-diary-app
   ```

2. **Bağımlılıkları yükleyin / Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   # or via Expo
   npx expo install -- --legacy-peer-deps
   ```

3. **Native Klasörleri Oluşturun / Generate Native Folders:**

   **TR:** Bu projede native kütüphaneler bulunduğu için projeyi çalıştırmadan önce native dosyaları (`android` ve `ios` klasörlerini) oluşturmalısınız:
   **EN:** Because this project uses native libraries, you need to generate native files (`android` and `ios` folders) before running the project:
   ```bash
   npx expo prebuild --clean
   ```

4. **Uygulamayı başlatın / Start the application:**

   **TR:** Native klasörler oluşturulduktan sonra projeyi derleyip çalıştırabilirsiniz:
   **EN:** Once native folders are generated, you can compile and run the project:
   ```bash
   # Android için / For Android:
   npx expo run:android

   # iOS için / For iOS:
   npx expo run:ios
   ```

---

## 🏗️ Mimari ve Teknolojiler / Architecture & Technologies

**TR:** Bu uygulama, sürdürülebilirlik ve performans için katmanlı bir mimari kullanır:
**EN:** This application uses a layered architecture for sustainability and performance:

- **Core:** Expo SDK (Managed Workflow)
- **State:** Zustand (Native SQLite syncing)
- **Database:** `expo-sqlite` (via Modular `DBService` layer)
- **Async Logic:** Tanstack Query (for Video trimming operations)
- **Styling:** NativeWind (Tailwind styles)
- **Validation:** Zod Schema
- **Animations:** Reanimated v4

---

## 📱 Kullanım Kılavuzu / User Guide

### 🇹🇷 Türkçe
1. **Anı Ekle:** Sağ alttaki `+` butonuna basın.
2. **Video Seç:** Cihazınızdan bir video seçin.
3. **Kırp:** Scrubber'ı kaydırarak en güzel 5 saniyelik anı belirleyin.
4. **Detay Ekle:** Anınıza bir isim ve açıklama verin.
5. **Kaydet:** "Save Memory" butonuna basın.

### 🇺🇸 English
1. **Add Memory:** Tap the `+` button in the bottom right.
2. **Select Video:** Choose a video from your device gallery.
3. **Crop:** Move the scrubber to select the perfect 5-second highlight.
4. **Add Details:** Provide a name and description for your memory.
5. **Save:** Press the "Save Memory" button.

---
## TR 
## 💎 Bonus Özellikler Dahil Edildi!
- ✅ **Edit Page:** Kayıtlı videoların isim ve açıklamalarını düzenleme.
- ✅ **SQLite:** AsyncStorage yerine daha profesyonel SQLite motoru.
- ✅ **Reanimated:** Tüm geçiş ve modal animasyonları.
- ✅ **Zod Schema:** Zorunlu alan kontrolü ve minimum karakter validasyonu.

## EN
## 💎 Bonus Features Added!
- ✅ **Edit Page:** Edit names and descriptions of saved videos.
- ✅ **SQLite:** Professional SQLite engine instead of simple AsyncStorage.
- ✅ **Reanimated:** Smooth transitions and modal animations.
- ✅ **Zod Schema:** Mandatory field checks and character min-length validation.
