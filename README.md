# BankScoreAI Backend

Ini adalah backend untuk aplikasi BankScoreAI. Ini menyediakan API RESTful untuk otentikasi pengguna dan fitur lainnya.

## Memulai

Instruksi ini akan membantu Anda mendapatkan salinan proyek yang berjalan di mesin lokal Anda untuk tujuan pengembangan dan pengujian.

### Syarat 

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
   bun run dev
   ```

Server akan berjalan di `http://localhost:3000`.

## Database

Berikut adalah Entity-Relationship Diagram (ERD) untuk database yang digunakan dalam proyek ini.

![ERD BankScoreAI](public/erd_v1.png)

## Dokumentasi API

### Otentikasi

#### `POST /api/auth/register`

Mendaftarkan pengguna baru.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "status": "success",
  "code": 201,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "token_jwt_anda"
  }
}
```

#### `POST /api/auth/login`

Masuk sebagai pengguna.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": "success",
  "code": 200,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "token_jwt_anda"
  }
}
```

#### `PUT /api/auth/password`

Memperbarui kata sandi pengguna yang terotentikasi.

**Header:**

* `Authorization`: `Bearer token_jwt_anda`

**Request Body:**

```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Response:**

```json
{
  "status": "success",
  "code": 200,
  "message": "Kata sandi berhasil diperbarui"
}
```
### Prediksi

Endpoint ini memerlukan otentikasi. Pastikan Anda menyertakan token JWT di header `Authorization`.

**Header:** `Authorization: Bearer <your_jwt_token>`

---

#### `POST /api/predict`

Mengunggah file CSV atau Excel untuk mendapatkan prediksi kelayakan kredit. Setiap baris dalam file akan diproses dan disimpan sebagai catatan prediksi yang terpisah.

**Request Body:**

*   **Tipe Konten:** `multipart/form-data`
*   **Key:** `file`
*   **Value:** File `.csv`, `.xlsx`, atau `.xls` Anda.

**Contoh Penggunaan (cURL):**

```bash
curl -X POST http://localhost:3000/api/predict \
-H "Authorization: Bearer <your_jwt_token>" \
-F "file=@/path/to/your/data.csv"
```

**Success Response (200 OK):**

Mengembalikan array hasil prediksi untuk setiap baris dalam file yang diunggah.

```json
{
  "status": "success",
  "code": 200,
  "message": "Prediksi berhasil.",
  "data": [
    {
      "row_number": 1,
      "original_data": {
        "age": "30",
        "job": "blue-collar",
        "marital": "married",
        "education": "basic.9y",
        "default": "no",
        "housing": "yes",
        "loan": "no",
        "contact": "cellular",
        "month": "may",
        "day_of_week": "fri",
        "duration": "261",
        "campaign": "1",
        "pdays": "999",
        "previous": "0",
        "poutcome": "nonexistent",
        "emp.var.rate": "-1.8",
        "cons.price.idx": "92.893",
        "cons.conf.idx": "-46.2",
        "euribor3m": "1.313",
        "nr.employed": "5099.1",
        "y": "no"
      },
      "prediction_result": {
        "probability": 0.0334,
        "prediction": "NO"
      }
    }
  ]
}
```

---

#### `GET /api/predict`

Mengambil riwayat semua prediksi yang telah dibuat oleh pengguna yang terotentikasi.

**Contoh Penggunaan (cURL):**

```bash
curl -X GET http://localhost:3000/api/predict \
-H "Authorization: Bearer <your_jwt_token>"
```

**Success Response (200 OK):**

Mengembalikan array objek, di mana setiap objek mewakili catatan prediksi yang disimpan dari database.

```json
{
    "status": "success",
    "code": 200,
    "message": "Hasil prediksi berhasil diambil",
    "data": [
        {
            "id": 1,
            "age": 30,
            "job": "blue-collar",
            "marital": "married",
            "education": "basic.9y",
            "has_credit_in_default": "no",
            "housing": "yes",
            "loan": "no",
            "contact": "cellular",
            "month": "may",
            "day_of_week": "fri",
            "duration": 261,
            "campaign": 1,
            "pdays": 999,
            "previous": 0,
            "poutcome": "nonexistent",
            "emp_var_rate": -1.8,
            "cons_price_idx": 92.893,
            "cons_conf_idx": -46.2,
            "euribor3m": 1.313,
            "nr_employed": 5099.1,
            "prediction_result": "NO",
            "prediction_probability": 0.0334,
            "user_id": "auth0|user123",
            "created_at": "2023-10-27T10:00:00.000Z",
            "updated_at": "2023-10-27T10:00:00.000Z"
        }
    ]
}
```

**Response Jika Tidak Ada Data (200 OK):**

```json
{
    "status": "success",
    "code": 200,
    "message": "Data masih kosong, silahkan upload csv/excel",
    "data": []
}
```