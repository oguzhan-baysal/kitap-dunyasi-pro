# 📚 Kitap Dünyası Pro

Modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir kitap yönetim uygulaması.

## 🚀 Özellikler

- 📱 Responsive tasarım
- 🌓 Koyu/açık tema desteği
- 📊 Kitap yönetimi ve organizasyonu
- 👥 Kullanıcı yetkilendirme sistemi
- 💰 Çoklu para birimi desteği
- ❤️ Favori kitap listesi
- 💬 Yorum ve değerlendirme sistemi
- 🔍 Gelişmiş arama ve filtreleme

## 🛠️ Teknolojiler

- Vue.js 3 (Composition API)
- Vuex 4 (State Management)
- Vue Router 4
- SCSS (Custom Design)
- Vee-validate & Yup (Form Validation)
- Axios (HTTP Client)
- LocalStorage (Veri Saklama)

## 📦 Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/oguzhan-baysal/kitap-dunyasi-pro.git

# Proje dizinine gidin
cd kitap-dunyasi-pro

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## 🔧 Kullanılan Komutlar

```bash
# Geliştirme
npm run dev

# Derleme
npm run build

# Lint
npm run lint

# Format
npm run format
```

## 📁 Proje Yapısı

```
src/
├── assets/         # Statik dosyalar
├── components/     # Vue bileşenleri
├── composables/    # Composition API hooks
├── router/         # Vue Router yapılandırması
├── store/          # Vuex store modülleri
├── types/          # TypeScript tipleri
├── utils/          # Yardımcı fonksiyonlar
└── views/          # Sayfa bileşenleri
```

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

Oğuzhan Baysal

## 🚧 Zorluklar ve Çözümler

### 1. State Yönetimi
**Zorluk:** Çoklu para birimi ve favori kitapların senkronizasyonu karmaşıktı.
**Çözüm:** Vuex modüllerini daha küçük parçalara böldük ve vuex-persistedstate ile localStorage senkronizasyonunu sağladık.

### 2. Performans Optimizasyonu
**Zorluk:** Büyük kitap listelerinde performans sorunları yaşandı.
**Çözüm:** Virtual scrolling ve lazy loading teknikleri uygulandı. Ayrıca computed property'ler ile gereksiz render'lar engellendi.

### 3. Form Validasyonu
**Zorluk:** Karmaşık form validasyonları ve async kontroller yönetimi zordu.
**Çözüm:** Vee-validate ve Yup kombinasyonu ile schema-based validasyon sistemi kuruldu.

### 4. Tema Değişimi
**Zorluk:** Dinamik tema değişiminde stil geçişleri sorunluydu.
**Çözüm:** CSS değişkenleri ve SCSS mixin'leri kullanılarak merkezi tema sistemi oluşturuldu.

### 5. API Önbellekleme
**Zorluk:** Sürekli API çağrıları performansı düşürüyordu.
**Çözüm:** Axios interceptor'lar ve localStorage ile akıllı önbellekleme sistemi implementi edildi.
