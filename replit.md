# Medication Cart Simulator

## Overview
Interactive medication cart simulator for nursing students. Students can open drawers, view medications and tools, read detailed labels with clinical information, and practice dose preparation by choosing delivery methods and filling to correct dosages.

## Architecture
- **Frontend**: React + Vite + TanStack Query + Framer Motion + shadcn/ui
- **Backend**: Express.js with PostgreSQL (Drizzle ORM)
- **Routing**: wouter

## Project Structure
- `client/src/pages/home.tsx` - Main page with cart, drawer contents, label dialog, and dose preparation
- `client/src/components/medication-cart.tsx` - Visual medication cart with animated drawers
- `client/src/components/drawer-contents.tsx` - Contents panel showing medications/tools in a drawer
- `client/src/components/medication-label-dialog.tsx` - Detailed medication label dialog with "Prepare Dose" button
- `client/src/components/dose-preparation.tsx` - Interactive dose preparation dialog (syringe fill + tablet cup)
- `client/src/components/cart-header.tsx` - App header
- `server/routes.ts` - API endpoints for drawers and medications
- `server/storage.ts` - Database storage layer
- `server/seed.ts` - Seed data with realistic medications and tools
- `server/db.ts` - Database connection
- `shared/schema.ts` - Data models (drawers, medications)

## API Routes
- `GET /api/drawers` - All drawers sorted by position
- `GET /api/drawers/:id` - Single drawer
- `GET /api/medications` - All medications
- `GET /api/medications/drawer/:drawerId` - Medications in a specific drawer
- `GET /api/medications/:id` - Single medication

## Database
- PostgreSQL with Drizzle ORM
- Tables: users, drawers, medications
- Seed data: 7 drawers with 20 medications/tools
- Medications have preparation metadata (prepMethod, prepTargetAmount, prepTargetUnit, prepMaxAmount) for dose preparation exercises

## Key Features
- 7 color-coded drawers (Cardiovascular, Analgesics, Antibiotics, GI, Respiratory, Controlled Substances, IV Supplies)
- Click-to-open drawer interaction
- Detailed medication labels with dosage, route, warnings, nursing considerations
- Controlled substance indicators with schedule classes
- Tools and supplies section in the bottom drawer
- Interactive dose preparation: students choose syringe or medication cup, fill to correct dosage, get immediate feedback
- Syringe simulator with visual fill level and +/- buttons for precise mL adjustments
- Tablet cup simulator with animated tablet placement and +/- buttons
- Data-driven dosage targets stored in database for clinical accuracy
