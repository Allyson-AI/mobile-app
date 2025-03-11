# Allyson AI Mobile App

![Allyson Logo](https://allyson.ai/allyson-og.png)

Allyson is an AI web agent that handles online tasks for you. It can navigate websites, fill forms, collect data, manage files, and perform various web-based operations with persistence through S3 storage.

[Install from App Store](https://apps.apple.com/us/app/allyson/id6593659141)

## 🚀 Features

- **Expo Router**: Modern file-based routing system for Expo applications
- **TypeScript**: Type-safe code for better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Authentication**: Secure user authentication with Clerk
- **Notifications**: Push notifications support
- **In-App Purchases**: Support for subscriptions and purchases
- **Responsive Design**: Works on various device sizes

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v20 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator or Android Emulator (optional for local development)

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Allyson-AI/mobile-app.git
   cd mobile-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create environment files:
   - Copy `example.env.development` to `.env.development`
   - Copy `example.env.production` to `.env.production`
   - Copy `example.eas.json` to `eas.json`
   - Fill in the required environment variables

## 🏃‍♂️ Running the App

### Development Mode

```bash
npm run start
# or
yarn start
```

### Preview Mode

```bash
npm run start:preview
# or
yarn start:preview
```

### Production Mode

```bash
npm run start:production
# or
yarn start:production
```

## 📱 Building for Production

### iOS

```bash
npm run eas:build:production:ios
# or
yarn eas:build:production:ios
```

### Android

```bash
npm run eas:build:production:android
# or
yarn eas:build:production:android   
```

### iOS

```bash
npm run eas:build:preview:ios
# or
yarn eas:build:preview:ios
```

## Development Builds

### iOS

```bash
npm run eas:build:development:ios
# or
yarn eas:build:development:ios
```

### Android

```bash
npm run eas:build:development:android
# or
yarn eas:build:development:android
```

## 🧩 Project Structure

```
allyson-mobile-app/
├── app/                  # Main application code with Expo Router
│   ├── (auth)/           # Authenticated routes
│   ├── (guest)/          # Guest/public routes
│   ├── _layout.tsx       # Root layout component
│   └── index.tsx         # Entry point
├── assets/               # Static assets like images and fonts
├── components/           # Reusable UI components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and constants
├── .env.development      # Development environment variables
├── .env.production       # Production environment variables
└── tsconfig.json         # TypeScript configuration
```

## 🔧 Configuration

### Environment Variables

The app uses different environment files for different environments:

- `.env.development` - Development environment
- `.env.production` - Production environment
- `eas.json` - EAS configuration
Required environment variables:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication key
- `EXPO_PUBLIC_HOST_URL` - Host URL for the app
- `EXPO_PUBLIC_API_URL` - API URL for backend services
- `POSTHOG_API_KEY` - PostHog analytics key
- `REVENUECAT_APPLE` - RevenueCat key for iOS
- `REVENUECAT_GOOGLE` - RevenueCat key for Android
- `SUPERWALL_IOS_API_KEY` - Superwall key for iOS
- `SUPERWALL_ANDROID_API_KEY` - Superwall key for Android

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE). This means if you use this software as part of a service you offer to others, you must make the complete source code available to the users of that service under the same license.

1. AGPL-3.0 - Personal Use
2. Commercial License (Contact us for details)

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes between versions.