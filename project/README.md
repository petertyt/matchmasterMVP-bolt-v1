# Matchmaster - Tournament Management Platform

A modern, mobile-first tournament management platform built with Expo React Native and Supabase. Matchmaster features a sleek design system, comprehensive tournament management, clan functionality, and real-time features.

## 🎯 Features

### Core Functionality
- **Tournament Management**: Create, manage, and participate in tournaments with multiple formats
- **Clan System**: Form teams, compete together, and climb leaderboards
- **Real-time Updates**: Live match tracking and notifications
- **User Profiles**: Comprehensive stats, achievements, and customization
- **Search & Discovery**: Find tournaments and clans easily

### Design System
- **Modern UI/UX**: Material Design 3 inspired with custom components
- **Dark/Light Themes**: Automatic system theme detection with smooth transitions
- **Responsive Design**: Optimized for all screen sizes and orientations
- **Accessibility**: WCAG compliant with proper contrast ratios and touch targets

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Supabase Integration**: Authentication, real-time database, and edge functions
- **Offline Support**: Graceful degradation when network is unavailable
- **Performance Optimized**: Lazy loading, image optimization, and efficient rendering

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/matchmaster.git
   cd matchmaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### Project Structure
```
matchmaster/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── _layout.tsx        # Root layout
│   └── ...
├── components/            # Reusable UI components
│   ├── ui/               # Design system components
│   └── ...
├── constants/            # App constants and design tokens
├── hooks/               # Custom React hooks
├── lib/                # Third-party library configurations
├── screens/            # Screen components
├── services/           # API and business logic
└── types/             # TypeScript type definitions
```

### Design System

The app uses a comprehensive design system based on Material Design 3 principles:

- **8px Grid System**: Consistent spacing throughout the app
- **Typography Scale**: 4 levels with proper hierarchy
- **Color System**: Semantic color tokens with light/dark variants
- **Component Library**: Reusable, accessible components
- **Motion System**: Consistent animations and transitions

### Key Components

#### Header Component
- Collapsible search functionality
- Fixed positioning with proper spacing
- Responsive design for different screen sizes

#### Floating Action Button (FAB)
- Material Design 3 specifications
- Smooth entrance/exit animations
- Positioned above tab bar with proper margins

#### Tournament & Clan Cards
- Consistent card-based layout
- Status indicators with color coding
- Progressive disclosure of information

## 🎨 Design Specifications

### Spacing System
- **Grid Unit**: 8px
- **Component Spacing**: Multiples of 8px (8, 16, 24, 32, 48, 64)
- **Header Padding**: 16px bottom, 24px between header and content
- **FAB Position**: 24px from edges, 24px above tab bar

### Typography
- **Display**: Poppins Bold (32-57px)
- **Headlines**: Poppins SemiBold (24-32px)  
- **Titles**: Inter SemiBold (14-22px)
- **Body**: Inter Regular (12-16px)
- **Labels**: Inter Medium (11-14px)

### Colors
- **Primary**: #7F5AF0 (Purple)
- **Secondary**: #2CB67D (Green)
- **Error**: #EF4444 (Red)
- **Warning**: #F59E0B (Orange)
- **Success**: #22C55E (Green)

### Animations
- **Duration**: 150ms (fast), 300ms (normal), 500ms (slow)
- **Easing**: Standard Material Design curves
- **Entrance**: 800ms with spring physics

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build:web` - Build for web
- `npm run lint` - Run ESLint

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Expo recommended configuration
- **Prettier**: Consistent code formatting
- **File Organization**: Feature-based structure

### Testing
- **Unit Tests**: Jest + React Native Testing Library
- **E2E Tests**: Detox (planned)
- **Accessibility**: Built-in accessibility testing

## 📱 Platform Support

### Web (Primary)
- Full feature support
- Responsive design for desktop/tablet
- Progressive Web App capabilities

### iOS/Android
- Native performance with Expo
- Platform-specific optimizations
- App Store/Play Store ready

## 🔐 Authentication & Security

### Supabase Auth
- Email/password authentication
- OAuth providers (Google, Apple)
- Row Level Security (RLS)
- JWT token management

### Data Security
- Encrypted data transmission
- Secure API endpoints
- User data privacy compliance

## 🚀 Deployment

### Web Deployment
```bash
npm run build:web
# Deploy to Netlify, Vercel, or similar
```

### Mobile Deployment
```bash
# Build for iOS
eas build --platform ios

# Build for Android  
eas build --platform android
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the established design system
- Write comprehensive TypeScript types
- Include proper error handling
- Test on multiple screen sizes
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** - For the amazing React Native framework
- **Supabase** - For the backend infrastructure
- **Material Design** - For design system inspiration
- **Lucide Icons** - For the beautiful icon library

---

Built with ❤️ using Expo React Native and Supabase