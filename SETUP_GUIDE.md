# DSAR Discovery Engine - Setup Guide

## Current Status

The DSAR Discovery Engine is now fully built and running. The development server is active on **http://localhost:3000**

## What Has Been Built

### Backend APIs (5 API Routes)

1. **Registered Apps API** (`/api/registered-apps`)
   - Returns apps that are registered and authenticated
   - HubSpot is pre-configured in the in-memory store

2. **App Discovery API** (`/api/app-discovery`)
   - Lists all available Composio applications
   - Used by the App Discovery tab

3. **User Discovery API** (`/api/user-discovery`)
   - Accepts: `{ email: string }`
   - Searches across all registered apps
   - Returns found/not found status for each app
   - Currently implements HubSpot contact search

4. **User Review API** (`/api/user-review`)
   - Accepts: `{ email: string, userData: object }`
   - Uses OpenAI GPT-4 to analyze deletion compliance
   - Returns: `{ canDelete: boolean, reasoning: string, risks: string[] }`

5. **User Delete API** (`/api/user-delete`)
   - Accepts: `{ email: string, appId: string, confirmation: boolean }`
   - Uses Composio's `HUBSPOT_DELETE_CONTACT_GDPR` action
   - Requires user confirmation

### Frontend UI (3 Tabs)

1. **Request Tab**
   - Placeholder for future DSAR request submission
   - Currently shows "Coming Soon" message

2. **User Discovery Tab** (Fully Functional)
   - Email input with validation
   - "Discover" button triggers agentic workflow
   - Real-time status updates:
     - "Checking registered apps..."
     - "Searching across registered apps..."
   - Results table showing:
     - App name
     - Status badge (Found/Not Found/Error)
     - Details message
     - Delete button (when found)
   - "Review for Deletion" button
   - AI review display with:
     - Can delete decision
     - Reasoning
     - Risks and considerations
   - Confirmation dialog before deletion
   - Success/error notifications

3. **App Discovery Tab** (Fully Functional)
   - Grid layout of all Composio apps
   - Search functionality
   - Each app card shows:
     - App name and key
     - Description
     - Authentication status badge
     - "Authenticate" or "Manage" button
   - Opens Composio auth flow in new window

### Premium UI Design

- Modern gradient background (slate → blue → indigo)
- Clean, professional card-based layout
- Premium color scheme with proper spacing
- Responsive design
- Real-time loading states
- Smooth transitions and animations
- No emojis (as requested)

## Required Configuration

### Environment Variables

Before using the application, you **MUST** create a `.env.local` file:

```bash
OPENAI_API_KEY=sk-your-actual-openai-key
COMPOSIO_API_KEY=your-actual-composio-key
```

### Where to Get API Keys

1. **OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Make sure you have GPT-4 access

2. **Composio API Key**
   - Go to https://app.composio.dev
   - Sign up / Log in
   - Navigate to Settings → API Keys
   - Create a new API key

## How to Use

### Step 1: Set Up Environment Variables

```bash
cd /Users/yash/Desktop/DSAR
cp .env.local.example .env.local
# Edit .env.local with your actual API keys
```

### Step 2: Access the Application

Open your browser to: **http://localhost:3000**

### Step 3: Authenticate HubSpot (Optional)

1. Go to the "App Discovery" tab
2. Find HubSpot in the list
3. Click "Authenticate"
4. Follow the Composio authentication flow

### Step 4: Test User Discovery

1. Go to the "User Discovery" tab
2. Enter a test email address (e.g., test@example.com)
3. Click "Discover"
4. Watch the agentic workflow in action:
   - System checks registered apps
   - Searches HubSpot for the email
   - Displays results
5. If found, click "Review for Deletion"
6. AI analyzes the data and provides recommendations
7. Confirm and delete if appropriate

## Workflow Demo

### Complete User Discovery Workflow

```
User Input: test@example.com
    ↓
[1] Check Registered Apps API
    ↓ (HubSpot is registered)
    ↓
[2] Search HubSpot via Composio
    ↓ (User found/not found)
    ↓
[3] Display Results Table
    ↓ (User clicks "Review")
    ↓
[4] AI Review via OpenAI
    ↓ (GPT-4 analyzes compliance)
    ↓
[5] Show AI Decision
    ↓ (User confirms deletion)
    ↓
[6] Delete via Composio
    ↓
[7] Show Success/Error
```

## File Structure

```
DSAR/
├── app/
│   ├── api/
│   │   ├── registered-apps/route.ts    ✓
│   │   ├── app-discovery/route.ts      ✓
│   │   ├── user-discovery/route.ts     ✓
│   │   ├── user-review/route.ts        ✓
│   │   └── user-delete/route.ts        ✓
│   ├── globals.css                     ✓
│   ├── layout.tsx                      ✓
│   └── page.tsx                        ✓
├── components/
│   ├── ui/
│   │   ├── button.tsx                  ✓
│   │   ├── input.tsx                   ✓
│   │   ├── card.tsx                    ✓
│   │   ├── badge.tsx                   ✓
│   │   ├── tabs.tsx                    ✓
│   │   ├── table.tsx                   ✓
│   │   └── alert.tsx                   ✓
│   ├── RequestTab.tsx                  ✓
│   ├── UserDiscoveryTab.tsx            ✓
│   └── AppDiscoveryTab.tsx             ✓
├── lib/
│   ├── utils.ts                        ✓
│   ├── composio.ts                     ✓
│   ├── openai.ts                       ✓
│   └── registeredApps.ts               ✓
├── package.json                        ✓
├── tsconfig.json                       ✓
├── tailwind.config.ts                  ✓
├── postcss.config.mjs                  ✓
├── next.config.mjs                     ✓
├── .gitignore                          ✓
├── README.md                           ✓
└── SETUP_GUIDE.md                      ✓ (this file)
```

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1
- **UI Components**: Shadcn/ui (custom implementation)
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4
- **Integrations**: Composio SDK
- **Runtime**: Node.js 18+

## Key Features Implemented

1. **In-Memory Data Store**: HubSpot pre-registered
2. **Agentic Workflow**: Multi-step automated process
3. **Real-time Updates**: Loading states and progress indicators
4. **AI-Powered Review**: GPT-4 compliance analysis
5. **One-Click Deletion**: Composio-powered data removal
6. **Premium UI**: Modern, responsive, professional design
7. **Error Handling**: Comprehensive error messages
8. **User Confirmations**: Safety checks before destructive actions

## Testing the MVP

### Test Scenario 1: Successful Discovery
```
1. Enter: john.doe@example.com
2. Click Discover
3. View results (may show "not found" if email not in HubSpot)
4. Test the workflow end-to-end
```

### Test Scenario 2: AI Review
```
1. If user is found, click "Review for Deletion"
2. Wait for AI analysis (5-10 seconds)
3. Review the AI's reasoning and risk assessment
4. See if AI recommends deletion
```

### Test Scenario 3: App Discovery
```
1. Switch to "App Discovery" tab
2. Browse available Composio apps
3. Search for specific apps (e.g., "Zendesk")
4. See HubSpot marked as "Active" (authenticated)
```

## Next Steps

1. Add your actual API keys to `.env.local`
2. Test with real HubSpot account (optional)
3. Authenticate additional apps via App Discovery
4. Extend support for more SaaS tools (Zendesk, Salesforce, etc.)
5. Add database persistence (replace in-memory store)
6. Implement audit logging
7. Add webhook support for automated DSAR processing

## Troubleshooting

### Issue: API Keys Not Working
- Make sure `.env.local` is in the root directory
- Check that keys don't have extra spaces or quotes
- Restart the dev server after adding keys

### Issue: HubSpot Search Fails
- Verify your Composio account is connected to HubSpot
- Check that HubSpot API is enabled
- Review Composio dashboard for connection status

### Issue: OpenAI Review Fails
- Ensure you have GPT-4 API access
- Check your OpenAI account has sufficient credits
- Verify the API key has proper permissions

## Support

For issues or questions:
1. Check the console logs (browser DevTools)
2. Review the terminal output
3. Check the API route responses
4. Verify environment variables are set correctly

## Success Indicators

When everything is working correctly, you should see:
- Development server running on port 3000
- UI loads without errors
- Tabs switch smoothly
- User Discovery tab accepts email input
- App Discovery tab shows available apps
- No console errors in browser DevTools

---

**Status**: READY FOR TESTING
**Version**: 1.0.0 (MVP)
**Last Updated**: October 11, 2025

