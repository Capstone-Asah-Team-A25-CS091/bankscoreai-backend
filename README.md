
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
   git clone https://github.com/Capstone-Asah-Team-A25-CS091/bankscoreai-backend.git
   ```
2. Instal dependensi:
   ```sh
   bun install
   ```
3. Buat file `.env` di root proyek dengan variabel berikut:
   ```
   DB_USER=your_db_user
   DB_HOST=your_db_host
   DB_DATABASE=capstone_asah
   DB_PASSWORD=your_db_password
   DB_PORT=your_db_port
   JWT_SECRET=your_jwt_secret
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
