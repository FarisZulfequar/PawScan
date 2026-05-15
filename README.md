# PawScan

AI-powered dog skin disease classifier built with React Native and TensorFlow Lite.

## About

PawScan lets you scan your dog's skin condition using your phone camera and get an instant AI-powered analysis. The app classifies 6 common conditions and provides triage guidance on whether to monitor at home or visit a vet.

**Conditions detected:**
- Dermatitis
- Fungal Infection
- Hypersensitivity
- Demodicosis
- Ringworm
- Healthy

---

## Tech Stack

- **React Native** (Expo) — cross-platform mobile app
- **TensorFlow Lite** — on-device image classification
- **Firebase Auth** — user authentication
- **Firestore** — scan history and pet profiles
- **MobileNetV2** — transfer learning model trained on dog skin disease dataset

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- Xcode (for iOS)
- Android Studio (for Android)
- Expo CLI

```bash
npm install -g expo-cli
```

### Installation

1. Clone the repo
```bash
git clone https://github.com/yourusername/PawScan.git
cd PawScan
```

2. Install dependencies
```bash
npm install
```

3. Install iOS pods
```bash
cd ios && pod install && cd ..
```

### Running the App

> This project uses native packages (TensorFlow Lite) and **must** be run with `expo run` — `expo start` will not work.

**iOS:**
```bash
npx expo run:ios
```

**Android:**
```bash
npx expo run:android
```

## Model

The classification model was trained using TensorFlow/Keras with transfer learning on top of MobileNetV2, trained on a dog skin disease dataset with 6 classes. The model is exported as a `.tflite` file and runs fully on-device, so no internet required for scanning.

---

## Author

Built by [Faris Zulfquar](https://github.com/FarisZulfequar)

---

*PawScan is for informational purposes only and is not a substitute for professional veterinary advice.*
