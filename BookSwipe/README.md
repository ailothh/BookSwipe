# 📚 BookSwipe

> **Swipe your way to your next favorite book** - A Tinder-inspired book discovery app powered by AI

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-orange.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

BookSwipe revolutionizes how you discover books by combining the addictive swipe mechanics of Tinder with powerful AI-generated descriptions. Swipe through curated book recommendations, get instant AI-powered summaries, and build your reading list effortlessly.

## ✨ Features

- 🎯 **Swipe-Based Discovery** - Intuitive Tinder-style interface for browsing books
- 🤖 **AI-Powered Descriptions** - Groq LLM generates engaging, concise book summaries
- 📖 **Real Book Data** - High-quality book covers and metadata from Google Books API
- ⌨️ **Keyboard Controls** - Use arrow keys (← →) to swipe on web
- 💾 **Smart Matches** - Save your liked books and build your reading list
- 🎨 **Beautiful UI** - Modern orange gradient design with smooth animations
- 🌐 **Web Optimized** - Fully functional web version for hackathon demos

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (installed globally or via npx)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BookSwipe/BookSwipe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open the app**
   - Press `w` for web browser
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your phone

## 🔧 Configuration (Optional)

### Groq API Key (Recommended)

For AI-generated book descriptions, get a free API key:

1. Sign up at [Groq Console](https://console.groq.com)
2. Create an API key
3. Create a `.env` file in the `BookSwipe` directory:
   ```bash
   EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
   ```

**Note:** The app works without the API key - it will use smart text processing as a fallback.

## 🎮 How to Use

### Swiping Books

- **Swipe Right** (→) or press **Right Arrow Key** - Like the book (saves to matches)
- **Swipe Left** (←) or press **Left Arrow Key** - Pass on the book
- **Tap Card** - Flip to see full book details and description

### Navigation

- **Swipe Tab** - Main book discovery screen
- **Explore Tab** - Browse curated book lists
- **Matches Tab** - View all books you've liked
- **Profile Tab** - Your profile and settings

## 🛠️ Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **UI Library:** React Native Gesture Handler
- **Swipe Component:** rn-swiper-list
- **AI/LLM:** Groq API (Llama 3.1)
- **Book Data:** Google Books API
- **Styling:** React Native StyleSheet with Linear Gradients

## 📁 Project Structure

```
BookSwipe/
├── app/
│   ├── (tabs)/
│   │   ├── home.tsx          # Main swipe screen
│   │   ├── explore.tsx       # Book exploration
│   │   ├── matches.tsx       # Liked books
│   │   └── profile.tsx      # User profile
│   └── index.tsx             # Login screen
├── services/
│   ├── googleBooks.ts        # Google Books API integration
│   ├── llm.ts               # Groq LLM integration
│   └── matchesStorage.ts    # Matches storage
└── components/               # Reusable components
```

## 🎯 Hackathon Highlights

- ✅ **Fully Functional** - Complete swipe-based book discovery
- ✅ **AI Integration** - Real-time LLM-generated descriptions
- ✅ **Web Ready** - Optimized for web browser demos
- ✅ **Production Quality** - Clean code, TypeScript, error handling
- ✅ **Modern UI/UX** - Beautiful gradients, smooth animations
- ✅ **API Integration** - Google Books + Groq LLM

## 🔮 Future Enhancements

- [ ] User authentication and cloud sync
- [ ] Personalized recommendations based on swipe history
- [ ] Social features - share matches with friends
- [ ] Reading progress tracking
- [ ] Book club creation and discussions
- [ ] Integration with Goodreads and other platforms

## 📝 License

This project is created for hackathon purposes.

## 👥 Contributors

Built with ❤️ for hackathon demo

---

**Made with React Native, Expo, and lots of ☕**
