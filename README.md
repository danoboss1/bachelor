This repository contains a mobile application developed as part of a bachelor’s thesis by Daniel Sehnoutek. The application is focused on measuring Executive Functions.

The README provides a complete guide on how to set up and run the project. It includes two main approaches:

### Frontend-only setup (quick start)

Run the mobile application using Expo Go (SDK 53) and connect to the already deployed backend on Vercel, which is connected to a Neon database and fully running.

### Full local setup (development mode)

Set up and run the entire project locally, including:
- configuring environment variables
- running the backend server
- setting up a local PostgreSQL database
- running Prisma migrations
- connecting the frontend to the local backend

The versions of libraries and tools used in this project were defined as part of the bachelor’s thesis requirements. The application specifically requires Expo Go with SDK 53, which must be installed manually if not available in the default store version.

# Getting Started

1. Make sure you are in the repo and open the frontend folder.

2. Install Expo Go on your Android device or use an Android emulator. The app must support Expo SDK 53.

---

## 📱 Install Expo Go with SDK 53 (Android)

Expo Go from Google Play always contains the latest SDK version.  
If you need SDK 53, install it manually using an APK.

**Official download (Expo):**  
https://expo.dev/go?platform=android&sdkVersion=53

---

### 📲 Install on Android device

1. Open the link above on your phone  
2. Download the `.apk` file  
3. Open the downloaded file (usually in **Downloads**)  
4. If prompted:
   - go to **Settings**
   - enable **Install unknown apps** for your browser
5. Confirm installation

---

### 💻 Install on Android emulator

**Option 1 – Drag & Drop**
1. Download the `.apk` file on your computer
2. Start the emulator
3. Drag the `.apk` file into the emulator window
4. Installation will start automatically

**Option 2 – ADB (terminal)**

```bash
adb install Expo-Go-SDK53.apk
```

If already installed:

```bash
adb install -r Expo-Go-SDK53.apk
```

---

## ⚙️ Environment Setup

Before running the project, you need to create a `.env` file.

1. Rename `.env.example` to `.env`

```bash
cp .env.example .env
```

2. Open `.env` and set your backend URL:

```
EXPO_PUBLIC_API_URL=https://your-backend-url.com
```

To use the Vercel, which is currently running please use: EXPO_PUBLIC_API_URL=https://bachelor-pi.vercel.app

You can also use a local backend:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

> ⚠️ Important: never commit your `.env` file

---

3. Install project dependencies:

```bash
npm install
```

4. Start the Expo development server:

```bash
npx expo start
```

5. Open Expo Go on your mobile device or emulator. Scan the QR code shown in the terminal / Expo Dev Tools with your phone camera, or use Expo Go’s built-in QR scanner.

If you use an Android emulator, you can also choose `Run on Android device/emulator` from Expo Dev Tools or run:

```bash
npm run android
```

---

6. The app should open in Expo Go and start running.

---

# Backend - Local Setup (PostgreSQL)

This guide shows how to run the backend locally with PostgreSQL.

## 1. Prerequisites

- Node.js 18+ (recommended)
- npm
- PostgreSQL (local install or Docker)

PostgreSQL download:
https://www.postgresql.org/download/

PostgreSQL Docker image:
https://hub.docker.com/_/postgres

## 2. Start PostgreSQL

You can use either a local installation or Docker.

### Option A: Local PostgreSQL

1. Start the PostgreSQL service.
2. Create a database (example: bachelor_db).
3. Make sure you know:
	 - host (usually localhost)
	 - port (usually 5432)
	 - username
	 - password
	 - database name

### Option B: Docker PostgreSQL

Example command:

```bash
docker run --name bachelor-postgres 	-e POSTGRES_USER=postgres 	-e POSTGRES_PASSWORD=postgres 	-e POSTGRES_DB=bachelor_db 	-p 5432:5432 	-d postgres
```

## 3. Configure environment variables

Create a local .env file:

```bash
cp .env.example .env
```

Configure the following environment variables in .env:

### DATABASE_URL

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bachelor_db?schema=public"
```

Adjust username, password, host, port, and database name to match your setup.

### JWT_SECRET

The JWT_SECRET is used to sign and verify JSON Web Tokens (JWTs) for user authentication.

Generate a secure random JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add it to your .env file:

```env
JWT_SECRET="your_generated_secret_here"
```

**Security considerations:**
- Keep JWT_SECRET private and never commit it to version control
- Use a strong, randomly generated secret (at least 32 characters)
- In production, store JWT_SECRET securely (e.g., in environment variables through your deployment platform)
- Change the secret periodically and update all tokens if needed

## 4. Install dependencies

```bash
npm install
```

## 5. Run Prisma migrations

Apply existing migrations to your local database:

```bash
npx prisma migrate dev
```

Optional checks:

```bash
npx prisma studio
```

## 6. Start backend

```bash
npm start
```

The start script does:
- Prisma client generation
- TypeScript compilation
- starts the server from dist/server.js

---

## 🔗 Connect Frontend to Local Backend

After the backend and database are running, connect the mobile app to your local server.

### 1. Backend should be running

```bash
npm start
```

Server runs on:

```
http://localhost:3000
```

---

### 2. Update frontend `.env`

#### Android Emulator

```
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

#### Physical Android device

```
EXPO_PUBLIC_API_URL=http://YOUR_PC_IP:3000
```

Example:
```
EXPO_PUBLIC_API_URL=http://192.168.0.123:3000
```

> ⚠️ Android emulator uses `10.0.2.2` instead of localhost.

---

### 3. Restart Expo

```bash
npx expo start -c
```

---

### 4. Run the app

```bash
npm run android
```

---

## 🔚 Summary

- Vercel API → production
- Local backend → requires PostgreSQL + Prisma setup
- Frontend connects via localhost / 10.0.2.2 / LAN IP
- Always restart Expo after `.env` changes

## Common issues

- Connection refused:
	- PostgreSQL is not running or wrong host/port in DATABASE_URL.
- Authentication failed:
	- wrong username or password in DATABASE_URL.
- Database does not exist:
	- create the database first, then rerun migration.
