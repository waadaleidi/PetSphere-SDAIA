# PetSphere

A luxury, elegant pet care companion built as a final university project. PetSphere helps pet owners manage their pet's health, feeding, gallery, journal and reminders — all in one beautiful place.

## Features

- **Landing page** with hero, feature overview and call-to-action
- **Authentication** — real registration & login with validation, stored in LocalStorage (no demo accounts)
- **Dashboard** — greeting, active pet card, today's reminders, upcoming vaccines, recent activity, quick stats
- **Unlimited pets** — add, edit, delete and switch between pets with full profiles (photo, name, species, breed, age, gender, weight, color, birthday, microchip ID, medical notes, emergency contact)
- **Image upload** — preview, replace and delete photos, stored as data URLs in LocalStorage
- **Pet profile** — beautiful profile card with health info, allergies, medications and quick links
- **Feeding** — daily schedule for breakfast, lunch, dinner and water with progress tracking
- **Health** — vaccines, medical history, allergies, weight tracking, vet visits and medications
- **Gallery** — multi-image upload, captions, lightbox preview, download and delete
- **Journal** — daily notes with mood, photos and a timeline view
- **Reminders** — vaccines, food, medicine, vet appointments with due dates and completion tracking
- **Settings** — light/dark theme, profile editing and logout
- **LocalStorage persistence** for accounts, pets, gallery, schedules, journal, health, reminders and theme
- **Responsive design** for desktop, tablet and mobile
- **Accessible color contrast** and smooth animations

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- LocalStorage
- lucide-react icons

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## How it works

1. Open the landing page and create an account (register with a real email and password).
2. Add your first pet with a photo and details.
3. Explore the dashboard, feeding, health, gallery, journal and reminders.
4. Switch between pets any time from the top bar or pet pages.
5. Toggle dark/light mode in Settings — your choice is saved.

All data lives in your browser's LocalStorage. No server, no tracking.

## Project Structure

```
src/
  components/      Reusable UI (Logo, Modal, ImageUpload, Toaster, etc.)
  context/         AuthContext, ThemeContext, PetContext
  lib/             Storage utilities
  pages/           Landing, Login, Register, Dashboard, Pets, PetProfile,
                   Feeding, Health, Gallery, Journal, Reminders, Settings
  types.ts         Shared TypeScript types
  App.tsx          Router + providers
  main.tsx         Entry point
  index.css        Tailwind theme + design tokens
```

## License

Final university project — PetSphere.
