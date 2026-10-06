# Building an Android APK

Every app is a PWA and can be installed from the browser without any native
build. When a real APK is needed (sideloading, testing on devices without a
modern browser, store submission), the web build can be wrapped with
**Capacitor**. The APK contains the built assets and runs completely offline;
it does not depend on the hosted version.

A lighter alternative for store distribution is a Trusted Web Activity (TWA)
built with Bubblewrap, which simply opens the hosted URL in a Chrome shell. The
steps below cover the Capacitor route, which works offline.

## One-time setup in the app

Run inside `apps/<app>`:

```
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "<App name>" <reverse.dns.app.id> --web-dir dist
npx cap add android
```

This creates `capacitor.config.ts` (`appId`, `appName`, `webDir: 'dist'`) and an
`android/` Gradle project. Commit both, except `android/local.properties`: it
holds the machine-specific Android SDK path and is regenerated locally
(`sdk.dir=<path to your Android SDK>`).

A convenience script keeps the native assets in sync:

```json
"build:android": "vite build && cap copy android"
```

## Updating the APK after web changes

Whenever the web code changes, rebuild and copy the assets into the native
project, then compile the APK again:

```
npm run build:android
```

## Route A: Android Studio (recommended)

Android Studio manages its own JDK and SDK, so this is the least fragile route.

1. Open the `android/` folder in Android Studio.
2. Wait for the Gradle sync to finish.
3. **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.
4. The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.

## Route B: command line (Gradle wrapper)

Requires a JDK 17 or newer on the `JAVA_HOME` path. If the global `JAVA_HOME`
points to an older JDK, set it explicitly for the build:

```powershell
$env:JAVA_HOME = "<path to a JDK 17+>"
& ".\android\gradlew.bat" -p ".\android" assembleDebug
```

```sh
JAVA_HOME=<path to a JDK 17+> ./android/gradlew -p ./android assembleDebug
```

The result is the same `android/app/build/outputs/apk/debug/app-debug.apk`
(a few MB for a typical app).

## Installing on a device

- **Sideload**: copy `app-debug.apk` to the phone and open it (allow
  installation from unknown sources when prompted).
- **ADB**: with the phone connected and USB debugging enabled,
  `adb install -r app-debug.apk`.

## Signed release APK (optional)

A debug APK is enough for local installs. For distribution, create a keystore
with `keytool` and add a `signingConfig` to `android/app/build.gradle`, then
build with `assembleRelease`. Keep the keystore and its passwords out of the
repository.

## Notes

- The ad banners need network access, so an offline APK shows the placeholder
  until the device is online.
- `localStorage` inside the APK is separate from the browser's, so saved
  settings and scores do not carry over between the web app and the APK.
