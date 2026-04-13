README.md file is loading... Now I am testing if everything works.
Currently, there is written how to run the application with Vercel and Neon
and also how to run backend locally.

This README.md file is still missing how to connect local db and project requirements.

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

1. Rename `.env.dist` to `.env`

```bash
mv .env.dist .env
```

(Optional) You can also copy it instead:

```bash
cp .env.dist .env
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

## ➕ Alternative Setup (Local Backend Development)

If you want to run the backend locally instead of using the deployed Vercel API, follow this setup.

### 🖥️ 1. Start backend locally

Go to your backend folder and run:

```bash
npm start
```

This will generate Prisma client, build TypeScript, and start server on:

```
http://localhost:3000
```

---

### 📱 2. Update frontend `.env`

#### Android Emulator (recommended for local dev)

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

### 🔄 3. Restart Expo

```bash
npx expo start -c
```

---

### 🚀 4. Run the app

```bash
npm run android
```

---

## 🔚 Summary

- Vercel API → production
- Local backend → localhost / 10.0.2.2 / LAN IP
- Always restart Expo after `.env` changes
