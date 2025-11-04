
# BankScoreAI Backend

Ini adalah backend untuk aplikasi BankScoreAI. Ini menyediakan API RESTful untuk otentikasi pengguna dan fitur lainnya.

## Memulai

Instruksi ini akan membantu Anda mendapatkan salinan proyek yang berjalan di mesin lokal Anda untuk tujuan pengembangan dan pengujian.

### Prasyarat

* Bun
* PostgreSQL

### Instalasi

1. Kloning repositori:
   ```sh
   git clone https://github.com/your-username/bankscoreai-backend.git
   ```
2. Instal dependensi:
   ```sh
   bun install
   ```
3. Buat file `.env` di root proyek dengan variabel berikut:
   ```
   DB_USER=nama_pengguna_db_anda
   DB_HOST=host_db_anda
   DB_DATABASE=capstone_asah
   DB_PASSWORD=kata_sandi_db_anda
   DB_PORT=port_db_anda
   JWT_SECRET=kunci_rahasia_jwt_anda
   ```
4. Jalankan migrasi database:
   ```sh
   bun run migrate
   ```
5. Mulai server:
   ```sh
   bun run start
   ```

Server akan berjalan di `http://localhost:3000`.

## Dokumentasi API

### Otentikasi

#### `POST /api/auth/register`

Mendaftarkan pengguna baru.

**Body Permintaan:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Respon:**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "token_jwt_anda"
}
```

#### `POST /api/auth/login`

Masuk sebagai pengguna.

**Body Permintaan:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respon:**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "token_jwt_anda"
}
```

#### `PUT /api/auth/password`

Memperbarui kata sandi pengguna yang terotentikasi.

**Header:**

* `Authorization`: `Bearer token_jwt_anda`

**Body Permintaan:**

```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Respon:**

```json
{
  "message": "Kata sandi berhasil diperbarui"
}
```
