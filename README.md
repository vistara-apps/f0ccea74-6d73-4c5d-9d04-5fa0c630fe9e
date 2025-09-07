# TipJarz - Base Miniapp

A Base miniapp that allows creators to receive direct tips from their audience, fostering a direct monetization channel.

## Features

- **Direct Tipping**: Send cryptocurrency tips directly to creators via simple in-frame interactions
- **Tip-Gated Content**: Unlock exclusive content by tipping creators
- **Social Proof**: Display recent tippers to encourage community engagement
- **Real-time Updates**: Live tip tracking and notifications
- **Mobile-First Design**: Optimized for mobile and frame experiences

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base network integration via OnchainKit
- **Wallet**: MiniKit provider for seamless wallet interactions
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety throughout the application

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.local` and configure your API keys:
   ```bash
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Architecture

### Components

- **TipButton**: Interactive tipping component with loading states
- **CreatorProfileCard**: Display creator information and stats
- **RecentTipsList**: Show recent supporters with social proof
- **GatedContentDisplay**: Locked/unlocked content based on tips
- **StatsChart**: Visual representation of tipping activity

### Data Models

- **Creator**: User profiles with wallet addresses and content
- **Tip**: Transaction records with amounts and messages
- **GatedContent**: Premium content unlocked by minimum tip amounts

### Key Features

1. **MiniKit Integration**: Seamless Base network interactions
2. **Responsive Design**: Mobile-first with floating 3D elements
3. **Real-time Updates**: Live tip tracking and notifications
4. **Social Engagement**: Community features to encourage tipping

## Deployment

The app is optimized for deployment on Vercel or similar platforms that support Next.js 15.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
