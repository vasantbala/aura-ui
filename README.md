# Aura — Intelligent Personal Assistant

Aura is a cross-platform mobile personal assistant that integrates with your calendar and task apps to help you stay on top of bills, subscriptions, passport renewals, and more.

---

## Tech-Stack Decisions

### 1. Cross-platform with React Native (Expo)

**Decision:** React Native + [Expo](https://expo.dev) for a single codebase that targets **both Android and iOS**.

| Option | Verdict |
|---|---|
| React Native + Expo | ✅ **Chosen** — best ecosystem, fastest prototype, single codebase |
| Flutter | ✅ Good alternative if Dart is preferred |
| Native Android only | ❌ Rejected — limits iOS reach unnecessarily |
| Separate native codebases | ❌ Rejected — doubles maintenance cost for a prototype |

**Why Expo?**
- Built-in support for push notifications, auth, and secure storage without native build setup
- `expo-auth-session` provides a drop-in social login flow
- `expo-notifications` handles push tokens and scheduling
- [EAS Build](https://docs.expo.dev/build/introduction/) compiles production `.apk` / `.ipa` without a local Mac required

---

### 2. Monorepo Structure

**Decision:** **Monorepo** using npm workspaces, with this repository (`aura-ui`) as the root.

```
aura-ui/               ← this repo (monorepo root)
├── apps/
│   └── mobile/        ← React Native Expo app (this phase)
└── packages/          ← reserved for future shared libs
                          (e.g. aura-api-client, aura-notifications)
```

Future backend services (Node/Python) can either:
- Live in `apps/` here (if tightly coupled), **or**
- Live in their own repos and be consumed via APIs

For prototype phase, keeping everything in one repo reduces friction.

---

### 3. App Features (Phase 1)

| Feature | Implementation |
|---|---|
| Social Login (Google) | `expo-auth-session` + Google OAuth 2.0 |
| Social Login (Apple) | `expo-apple-authentication` (iOS only, requires Apple Developer account) |
| Push Notifications | `expo-notifications` (local + Expo Push Service) |
| Secure token storage | `expo-secure-store` |
| Tab navigation | `@react-navigation/bottom-tabs` |
| Task integrations | Placeholder screens — Microsoft To Do & Todoist OAuth coming in Phase 2 |
| Calendar integration | Placeholder screen — Google Calendar OAuth coming in Phase 2 |

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/go) app on your phone (fastest way to preview)
- Or Android Studio / Xcode for emulators

### Install Dependencies

```bash
cd apps/mobile
npm install
```

### Configure Environment Variables

Copy `.env.example` and fill in your OAuth credentials:

```bash
cp apps/mobile/.env.example apps/mobile/.env.local
```

| Variable | Where to get it |
|---|---|
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID` | [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS` | Same console — create an **iOS OAuth client** |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB` | Same console — create a **Web OAuth client** |

> **Never commit your `.env.local`** — it is gitignored. For CI/CD use [EAS Secrets](https://docs.expo.dev/build-reference/variables/).

### Run

```bash
# Start the dev server (scan QR code with Expo Go)
cd apps/mobile
npm start

# Or target a specific platform
npm run android   # opens Android emulator
npm run ios       # opens iOS simulator (macOS only)
```

---

## Push Notification Setup

Push notifications require an [EAS project](https://expo.dev/accounts) to obtain a project ID:

1. `npm install -g eas-cli`
2. `eas login`
3. `eas build:configure`  (creates `eas.json` and adds `extra.eas.projectId` to `app.json`)

For development testing you can skip EAS and use **local scheduled notifications** — tap the 🔔 button on any task in the Tasks screen.

---

## Apple Sign-In (iOS)

Apple Sign-In requires:

1. An **Apple Developer account** ($99/year)
2. Add `expo-apple-authentication` to the project:
   ```bash
   cd apps/mobile && npx expo install expo-apple-authentication
   ```
3. Enable **Sign In with Apple** capability in your Apple Developer portal
4. Update `app.json`:
   ```json
   "ios": {
     "usesAppleSignIn": true
   }
   ```

See [Expo Apple Authentication docs](https://docs.expo.dev/versions/latest/sdk/apple-authentication/) for full setup.

---

## Project Structure

```
apps/mobile/
├── app.json               ← Expo app config
├── App.tsx                ← Root component (AuthProvider + RootNavigator)
├── index.ts               ← Entry point
├── src/
│   ├── context/
│   │   └── AuthContext.tsx        ← Auth state (user, signIn, signOut)
│   ├── hooks/
│   │   └── usePushNotifications.ts ← Push token registration + listeners
│   ├── navigation/
│   │   ├── RootNavigator.tsx      ← Login vs. Main routing
│   │   └── TabNavigator.tsx       ← Bottom tab bar
│   ├── screens/
│   │   ├── LoginScreen.tsx        ← Google OAuth sign-in
│   │   ├── HomeScreen.tsx         ← Upcoming reminders dashboard
│   │   ├── TasksScreen.tsx        ← Tasks with local notification reminders
│   │   ├── CalendarScreen.tsx     ← Calendar events
│   │   └── SettingsScreen.tsx     ← Profile + integrations
│   └── utils/
│       └── auth.ts                ← Google OAuth helpers
└── assets/                ← App icons and splash screen
```

---

## Roadmap

- [ ] **Phase 2 — Integrations**: Google Calendar, Microsoft To Do, Todoist OAuth
- [ ] **Phase 2 — Backend**: Notification rules engine (when to remind about bills, renewals, subscriptions)
- [ ] **Phase 3 — AI**: Natural language task creation, smart reminders
- [ ] **Phase 3 — Wearables**: Watch notifications (WearOS / Apple Watch)
