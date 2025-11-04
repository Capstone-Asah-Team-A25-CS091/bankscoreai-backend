# BankScoreAI Backend

This is the backend for the BankScoreAI application. It provides a RESTful API for user authentication and other features.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Bun
* PostgreSQL

### Installing

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/bankscoreai-backend.git
   ```
2. Install the dependencies:
   ```sh
   bun install
   ```
3. Create a `.env` file in the root of the project with the following variables:
   ```
   DB_USER=your_db_user
   DB_HOST=your_db_host
   DB_DATABASE=capstone_asah
   DB_PASSWORD=your_db_password
   DB_PORT=your_db_port
   JWT_SECRET=your_jwt_secret
   ```
4. Run the database migrations:
   ```sh
   bun run migrate
   ```
5. Start the server:
   ```sh
   bun run start
   ```

The server will be running on `http://localhost:3000`.

## API Documentation

### Authentication

#### `POST /api/auth/register`

Registers a new user.

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
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "your_jwt_token"
}
```

#### `POST /api/auth/login`

Logs in a user.

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
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "your_jwt_token"
}
```

#### `PUT /api/auth/password`

Updates the password of the authenticated user.

**Headers:**

* `Authorization`: `Bearer your_jwt_token`

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
  "message": "Password updated successfully"
}
```