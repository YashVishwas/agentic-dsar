# Quick Start Guide

## Your DSAR Discovery Engine is READY!

The development server is currently running at:
### http://localhost:3000

---

## Immediate Next Steps

### 1. Add Your API Keys (Required)

The application needs API keys to function. Edit the `.env.local` file:

```bash
# Open the file
nano .env.local

# Or use any text editor
code .env.local
```

Add your keys:
```
OPENAI_API_KEY=sk-your-actual-openai-api-key
COMPOSIO_API_KEY=your-actual-composio-api-key
```

**Where to get keys:**
- OpenAI: https://platform.openai.com/api-keys
- Composio: https://app.composio.dev (Settings → API Keys)

### 2. Restart the Server

After adding keys:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 3. Open the Application

Visit: **http://localhost:3000**

---

## Test the Application

### Test 1: Browse Apps (No API keys needed)
1. Click "App Discovery" tab
2. View available Composio apps
3. Search for "HubSpot"
4. See it marked as "Active"

### Test 2: User Discovery (Needs API keys)
1. Click "User Discovery" tab
2. Enter email: `test@example.com`
3. Click "Discover"
4. Watch the agentic workflow

### Test 3: AI Review (Needs API keys)
1. If user is found, click "Review for Deletion"
2. Wait for AI analysis
3. Review the compliance decision

---

## What You Built

### 3 Tabs
- **Request Tab**: Placeholder for future DSAR forms
- **User Discovery Tab**: Full agentic workflow (email → search → review → delete)
- **App Discovery Tab**: Browse and authenticate Composio apps

### 5 API Routes
- GET `/api/registered-apps` - List registered apps
- GET `/api/app-discovery` - List all Composio apps
- POST `/api/user-discovery` - Search user data
- POST `/api/user-review` - AI compliance review
- POST `/api/user-delete` - Delete user data

### Key Features
- Premium UI with gradient backgrounds
- Real-time status updates
- AI-powered deletion review (GPT-4)
- One-click data deletion
- HubSpot pre-configured
- TypeScript type safety
- Error handling & notifications

---

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Install new dependencies
npm install package-name
```

---

## Project Structure

```
DSAR/
├── app/              # Next.js pages & API routes
├── components/       # React components (tabs, UI)
├── lib/              # Utilities (OpenAI, Composio, data)
├── .env.local        # Your API keys (you need to add these)
└── README.md         # Full documentation
```

---

## Documentation Files

- **README.md** - Main project documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **PROJECT_SUMMARY.md** - Complete feature list
- **QUICK_START.md** - This file

---

## Troubleshooting

### Issue: Server won't start
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

### Issue: API calls fail
- Check `.env.local` has correct keys
- Verify no extra spaces in keys
- Restart server after adding keys

### Issue: TypeScript errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## Ready to Deploy?

When you're ready for production:

1. Add a database (PostgreSQL/MongoDB)
2. Replace in-memory store in `lib/registeredApps.ts`
3. Add authentication (NextAuth.js)
4. Deploy to Vercel:
   ```bash
   npm run build
   vercel deploy
   ```

---

## Support

Check these files for more info:
- `README.md` - Features & usage
- `SETUP_GUIDE.md` - Detailed setup
- `PROJECT_SUMMARY.md` - Complete architecture

---

**Status**: READY
**URL**: http://localhost:3000

Start by adding your API keys to `.env.local` and then visit the app!

