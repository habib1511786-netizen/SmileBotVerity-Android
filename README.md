# SmileBot: Verity — Android app + local AI backend

The app is configured to call a backend on the **same Android device** at `http://127.0.0.1:3000/api/chat`.

## Run the server in Termux

1. Install Node.js: `pkg update && pkg install nodejs`
2. Extract this project and `cd` into its `server` folder.
3. Run `npm install`
4. Create your private settings file: `cp .env.example .env && nano .env`
5. Set `AI_API_KEY` to an API key from your AI provider. The defaults use an OpenAI-compatible Chat Completions API; adjust `AI_BASE_URL` and `AI_MODEL` for your provider.
6. Start it with `npm start` and keep Termux running.
7. In another Termux session, check it: `curl http://127.0.0.1:3000/health`. `aiConfigured` should be `true`.

Never put API keys in the Android app or share your `.env` file. API usage may cost money depending on your provider.

## Build APK

Open the project in Android Studio with Android SDK 35 installed, sync Gradle, then select **Build → Build APK(s)**. The debug APK is normally at `app/build/outputs/apk/debug/app-debug.apk`.

The APK is a client; the backend runs separately. Keep Termux running while chatting. The app manifest already enables Internet access and cleartext HTTP for local development. Use HTTPS for a public production server.
