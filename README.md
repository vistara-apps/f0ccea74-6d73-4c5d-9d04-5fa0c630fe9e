# TipJarz - Base Mini App

A Base miniapp that allows creators to receive direct tips from their audience, fostering a direct monetization channel with gated content features.

## 🚀 Features

### Core Features
- **Direct Tipping**: Send cryptocurrency tips directly to creators via Base network
- **Tip-Gated Content**: Exclusive content unlocked after reaching tip thresholds
- **Social Proof**: Public tip history to encourage community engagement
- **Creator Profiles**: Customizable creator pages with bio and content
- **Real-time Updates**: Live tip tracking and content unlocking

### Technical Features
- **OnchainKit Integration**: Seamless wallet connection and transactions
- **Supabase Backend**: Scalable database for user data and content
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first design optimized for all devices
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: OnchainKit, Viem, Wagmi
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account and project
- An OnchainKit API key
- A Base wallet for testing

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/f0ccea74-6d73-4c5d-9d04-5fa0c630fe9e.git
cd f0ccea74-6d73-4c5d-9d04-5fa0c630fe9e
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# OnchainKit Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Base Network Configuration (Optional)
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

Create the following tables in your Supabase project:

#### Creators Table
```sql
CREATE TABLE creators (
  id SERIAL PRIMARY KEY,
  creator_id VARCHAR(255) UNIQUE NOT NULL,
  wallet_address VARCHAR(42) NOT NULL,
  name VARCHAR(255),
  bio TEXT,
  content TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tips Table
```sql
CREATE TABLE tips (
  id SERIAL PRIMARY KEY,
  tip_id VARCHAR(255) UNIQUE NOT NULL,
  creator_id VARCHAR(255) NOT NULL,
  tipper_address VARCHAR(42) NOT NULL,
  amount VARCHAR(50) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'ETH',
  message TEXT,
  transaction_hash VARCHAR(66),
  status VARCHAR(20) DEFAULT 'pending',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unlocked_content_id VARCHAR(255),
  FOREIGN KEY (creator_id) REFERENCES creators(creator_id)
);
```

#### Gated Content Table
```sql
CREATE TABLE gated_content (
  id SERIAL PRIMARY KEY,
  content_id VARCHAR(255) UNIQUE NOT NULL,
  creator_id VARCHAR(255) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  secret_content TEXT NOT NULL,
  min_tip_amount VARCHAR(50) NOT NULL,
  unlock_limit INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (creator_id) REFERENCES creators(creator_id)
);
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

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
