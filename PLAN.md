# Coffee Shop Rating App - Product Plan

## Context

**Problem:** Coffee/cafe lovers have no centralized way to discover and rate specific items at cafes in their area. Existing solutions (Yelp, Google Reviews) rate entire venues, not individual items. Users want to track their cafe adventures and discoveries like Barstool's One Bite pizza rating, but for coffee shops.

**Core Concept:** A social rating app where users discover cafes via Google Places API, rate specific menu items (coffee, pastries, sandwiches, etc.) with a score + photo + optional notes, and build a personal "cafe passport" tracking everywhere they've been and what they've tried.

**Key Differentiator:** Item-level ratings (not just cafe ratings) + low barrier to entry (not just for coffee snobs—anyone can rate any cafe item) + personal tracking + community discovery.

---

## Refined Roadmap (Based on Decisions)

### V1 (MVP - Launch in Single City)
**Goal:** Prove concept, get initial user base, validate product-market fit

**Core Features:**
- User authentication (email/password, maybe Google OAuth)
- Find nearby cafes (Google Places API integration)
- Rate individual items: score (1-5 or 1-10) + required photo + optional notes
- User profile: name, avatar, bio, list of cafes visited
- View personal rating history & cafe "passport" (list of cafes visited)
- Cafe detail page: all user reviews for that cafe aggregated
- Simple search: find cafes by name or location
- Basic leaderboards: top-rated items, most-reviewed cafes

**Technical Approach:**
- **Platform:** Progressive Web App (PWA) using React + TypeScript
- **Backend:** Node.js/Express or similar, with PostgreSQL for data
- **Authentication:** JWT tokens
- **APIs:** Google Places API, Google Maps API for location services
- **Hosting:** Vercel (PWA), Firebase, or similar
- **Photos:** Cloud storage (Firebase Storage, AWS S3, or Cloudinary)

**Launch Scope:** Dublin, Ireland (confirmed)

---

## V1 Feature Checklist

### Must-Have for Launch:
- [ ] User sign-up/login
- [ ] Find nearby cafes (Google Places)
- [ ] Create rating: score + photo + optional note
- [ ] View personal history (all ratings)
- [ ] Cafe detail page (see all community ratings for that cafe)
- [ ] Personal profile (editable)
- [ ] Basic leaderboards
- [ ] Search cafes by name/location

### Nice-to-Have for V1 (if time):
- [ ] Map view
- [ ] Share rating to social media
- [ ] Export "cafe passport" as image

---

## Design Direction

**Visual Style:** Playful, gamified, celebratory  
**Color Palette:** 
- Primary: Muted grays, soft blacks, warm grays
- Accent: Subtle earth tones (muted browns, warm grays, soft greens)
- Neutral: Off-white backgrounds, dark gray text

**UI Characteristics:**
- Generous rounded corners (30-40px on cards)
- Soft shadows for depth
- Card-based layouts
- Lots of breathing room (generous padding)

---

## How to Test V1 End-to-End (Verification)

1. **Create account** → Sign up with email, set profile
2. **Discover cafes** → Open app, allow location, see nearby cafes from Google Places
3. **Rate an item** → Take photo of a coffee/pastry, give it a 4-star rating, add optional note, submit
4. **View history** → See all your ratings in a "cafe passport" view
5. **View cafe page** → Click on a cafe, see all community ratings for items there
6. **Search & explore** → Search for a specific cafe by name
7. **Leaderboards** → See top-rated items and most-reviewed cafes city-wide
8. **Profile** → Update name, avatar, bio
