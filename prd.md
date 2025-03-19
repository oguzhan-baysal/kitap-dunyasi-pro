# Kitap Dünyası Pro - Proje Gereksinimleri Dokümanı

## Proje Özeti
Kitap Dünyası Pro, kullanıcıların kitapları listeleyebileceği, filtreleyebileceği, arayabileceği, favorilere ekleyebileceği ve kitapları yönetebileceği kapsamlı bir web uygulamasıdır. Uygulama, modern bir arayüz ve zengin kullanıcı deneyimi sunmalıdır.

## Teknik Altyapı

### Temel Teknolojiler
- **Framework:** Vue.js v3 (Composition API)
- **State Yönetimi:** Vuex
- **Stil:** CSS/SCSS (framework kullanmadan)
- **HTTP İstekleri:** Axios (interceptor içermeli)
- **Routing:** Vue Router
- **Form Doğrulama:** Vuelidate veya Yup
- **Veri Saklama:** localStorage
- **Kimlik Doğrulama:** localStorage tabanlı basit auth sistemi

### Özel Geliştirmeler
- En az 2 custom directive
- En az 3 custom component
- GitHub üzerinde paylaşım

## Veri Yönetimi

### Lokal Veri Yönetimi
- Tüm kitap verileri için CRUD işlemleri localStorage üzerinde
- Kullanıcı bilgileri localStorage'da
- Favoriler ve yorumlar localStorage'da

### Harici API Entegrasyonu
- Döviz kuru API'ı ile farklı para birimlerinde fiyat gösterimi
- 30 dakikada bir döviz kurlarının güncellenmesi
- Kurların localStorage'da önbelleğe alınması
- Bağlantı sorunları için hata yönetimi

## Uygulama Özellikleri

### Kullanıcı Yönetimi
- Kayıt sayfası (İsim, e-posta, şifre)
- Giriş sayfası (e-posta, şifre)
- Şifremi unuttum sayfası (simülasyon)
- Kullanıcı profili sayfası
- JWT benzeri token sistemi
- Yetkili rotalar (authenticated routes)

### Ana Sayfa
- Kitap karüseli/slider (öne çıkan kitaplar)
- Grid görünümlü kitap listesi (sonsuz scroll)
- Hover efektleri ve animasyonlar
- Filtreleme sistemi:
  - Kategori, dil, yayın yılı, sayfa sayısı
  - Fiyat aralığı (çoklu para birimi desteği)
  - İçerik erişim türü
- Arama özelliği (200ms debounce)
- Favori ekle/çıkar
- Görünüm değiştirme (liste/grid)
- Sıralama seçenekleri
- Para birimi değiştirme

### Kitap Detay Sayfası
- Kitap bilgileri (resim, başlık, yazar, kategori, açıklama)
- Yorum ekleme/silme/düzenleme
- Favori ekle/çıkar
- İlgili kitaplar bölümü
- Paylaşım butonları
- İnceleme yazma sistemi (1-5 yıldız)
- İnceleme/yorum listesi
- Detaylı meta bilgiler

### Kitap Ekleme/Düzenleme Sayfası
- Çok adımlı form (wizard)
- Form validasyonları
- Dinamik form alanları
- Görsel yükleme (base64)
- Zengin metin editörü
- Form durumu korunması
- Çoklu para birimi desteği

### Profil Sayfası
- Kullanıcı bilgileri düzenleme
- Favoriler listesi
- Kullanıcının kitapları
- Kullanıcının yorumları
- İstatistikler

## Vuex Store Yapısı

### Modüller
- Books (kitaplar, seçili kitap, yükleme durumu, hata)
- User (kullanıcı bilgileri, auth durumu, token)
- UI (tema, görünüm modu, loading durumları)
- Favorites (favori kitaplar)
- Comments (kitap yorumları)
- Currency (döviz kurları, seçili para birimi, senkronizasyon zamanı)

### Store Gereksinimleri
- localStorage senkronizasyonu
- Async/await kullanımı
- Performans odaklı tasarım

## İleri Seviye Özellikler
- Sonsuz scroll (kütüphane kullanmadan)
- Tema değiştirme (light/dark ve renk temaları)
- Global hata yakalama
- Offline çalışma desteği
- Lazy loading components
- Dynamic imports
- Performans optimizasyonları
- Vue devtools uyumluluğu
- Responsive tasarım (masaüstü, tablet, mobil)
- Verimli localStorage kullanımı
- Akıllı kur senkronizasyonu

## Bonus Özellikler (Opsiyonel)
- i18n desteği (en az iki dil)
- Vue 3 Teleport kullanımı
- Vue 3 Suspense kullanımı
- Custom plugin geliştirme
- Etiket sistemi
- Okuma listesi
- Grafik göstergeleri
- Yazı tipi ayarları
- WCAG uyumluluğu
- IndexedDB kullanımı
- Ödeme simülasyonu
- Fiyat trend grafikleri
- Koleksiyon değeri gösterimi

## Değerlendirme Kriterleri
- Kod kalitesi ve organizasyonu
- Mimari ve tasarım
- Fonksiyonellik
- Performans
- Kullanıcı deneyimi ve arayüz
- Güvenlik

## Teslim Gereksinimleri
- GitHub reposu
- README.md (kurulum, teknolojiler, komutlar, zorluklar, çözümler)
- ARCHITECTURE.md (mimari kararlar)
- Demo linki (Netlify, Vercel vb.)


## İpuçları
- Composition API'yi etkin kullanın
- Custom composables geliştirin
- Global state kullanımına dikkat edin
- API isteklerini optimize edin
- Render performansını iyileştirin
- Küçük ve tekrar kullanılabilir bileşenler oluşturun
- Tek yönlü veri akışı sağlayın
- localStorage sınırlamalarına dikkat edin