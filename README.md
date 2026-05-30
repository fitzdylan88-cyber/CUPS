# CUPS - Cafe Item Rating App

A progressive web app for discovering and rating individual items at cafes.

## Features

- 🏙️ Discover nearby cafes using Google Places API
- ⭐ Rate individual cafe items (coffee, pastries, etc.) with photos
- 📱 Personal "cafe passport" to track visits
- 👥 Community ratings and leaderboards
- 🎨 Beautiful, gamified interface

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:password@localhost:5432/cups
```

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Zustand
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **APIs**: Google Places, Google Maps
- **Storage**: Firebase Storage / AWS S3 / Cloudinary
- **Animation**: Framer Motion

## Project Structure

```
CUPS/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
├── lib/               # Utilities, types, store
├── public/            # Static assets
└── styles/            # CSS files
```

## V1 Roadmap

### Must-Have
- [ ] User authentication
- [ ] Find nearby cafes (Google Places)
- [ ] Rate items with photo
- [ ] Personal cafe history
- [ ] Cafe detail pages
- [ ] User profiles
- [ ] Basic leaderboards

### Nice-to-Have
- [ ] Map view
- [ ] Social sharing
- [ ] Export cafe passport

## License

Private - Dylan Fitzpatrick
