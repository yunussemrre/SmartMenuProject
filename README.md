# SmartMenu - Restoran ve Isletme Otomasyon Ekosistemi

SmartMenu; kafe ve restoranlarin siparis, mutfak yonetimi, kasa ve analiz sureclerini uctan uca dijitallestiren, SignalR ile guclendirilmis Full-Stack bir otomasyon cozumudur.

---

## One Cikan Ozellikler

- **Guvenli Cihaz Muhurleme:** Sabit tabletlerin masalarla hatasiz eslesmesini saglayan 5 haneli dinamik aktivasyon kodu sistemi.
- **Real-Time Operasyon:** SignalR (WebSockets) entegrasyonu sayesinde mutfak, garson ve kasa arasinda milisaniyelik canli veri akisi.
- **Akilli Erisim Kontrolu:** Ziyaretci (Onizleme) ve Fiziksel Musteri (Servis Modu) ayrimi ile yetkisiz siparis veya garson cagirma islemlerinin engellenmesi.
- **Gelismis Mutfak Terminali:** Ascilar icin optimize edilmis, servis hizini artıran dinamik siparis takip ekrani.
- **Business Intelligence (BI):** Satis verilerini, urun verimliligini ve saatlik yogunluk haritalarini raporlayan analiz motoru.
- **Merkezi Yonetim:** Tek panel uzerinden urun, kategori, personel ve masa yonetimi.

---

## Teknoloji Yigini (Tech Stack)

### Backend
- **Framework:** .NET 9 Web API
- **Real-Time:** Microsoft SignalR
- **ORM:** Entity Framework Core (Code First)
- **Database:** SQL Server
- **Serialization:** System.Text.Json (Cycle Handling)

### Frontend
- **Library:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM v6
- **QR Engine:** qrcode.react

---

## Mimari Yapi

Proje, Separation of Concerns (SoC) prensibiyle katmanli olarak insa edilmistir:

### Backend (SmartMenu.API)
- `Controllers/`: API Endpoint'leri ve is mantigi akisi.
- `Hubs/`: Real-time iletisim (SignalR) merkezi.
- `Data/`: DbContext ve veritabani konfigurasyonlari.
- `Models/`: Domain varliklari (Entity) ve veri semalari.
- `wwwroot/uploads/`: Fiziksel medya (urun gorselleri) depolama alani.

### Frontend (SmartMenu.Client)
- `src/pages/`: Rol bazli ozellesmis ekranlar (Admin, Waiter, Kitchen, Cashier).
- `src/api/`: Merkezi API servis konfigurasyonu ve sabitler.
- `src/types/`: Proje genelinde kullanilan TypeScript arayuzleri (Interfaces).
- `src/components/`: Tekrar kullanilabilir arayuz bilesenleri.

---

## Hizli Kurulum ve Calistirma

### 1. Backend Hazirligi
```bash
cd SmartMenu.API

# appsettings.json dosyasindaki ConnectionString'i kendi SQL Server adresinize gore guncelleyin.
# Veritabanini ve tablolari olusturun:
dotnet ef database update

# Uygulamayi baslatin:
dotnet run
2. Frontend HazirligiBashcd SmartMenu.Client

# Gerekli bagimliliklari yukleyin:
npm install

# Uygulamayi gelistirme modunda baslatin:
npm run dev
Varsayilan Giris Bilgileri (Demo)RolKullanici AdiSifreYonetici (Admin)admin1234Garson (Waiter)garson1123Asci (Chef)asci1123

Bu proje, kurumsal olcekte bir isletme yonetim mimarisi ornegi olarak gelistirilmistir.