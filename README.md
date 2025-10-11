# DSAR Discovery Engine

A premium TypeScript-based Data Subject Access Request (DSAR) discovery engine powered by OpenAI and Composio. This application helps organizations automate GDPR/CCPA compliance by discovering, reviewing, and managing user data across multiple SaaS applications.

## Features

- **User Discovery**: Search for user data across registered applications using email
- **AI-Powered Review**: OpenAI GPT-4 analyzes whether user data can be safely deleted under CCPA/GDPR
- **Automated Deletion**: Delete user data with a single click using Composio's integrations
- **App Management**: Browse and authenticate with 100+ Composio-supported applications
- **Premium UI**: Modern, responsive design with real-time status updates

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **AI**: OpenAI GPT-4
- **Integrations**: Composio SDK
- **Storage**: In-memory (MVP)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API Key
- Composio API Key

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
COMPOSIO_API_KEY=your-composio-api-key-here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### User Discovery Tab

1. Enter a user's email address
2. Click "Discover" to search across all registered apps
3. View results showing which apps contain the user's data
4. Click "Review for Deletion" to get AI analysis
5. Delete data from specific apps after user confirmation

### App Discovery Tab

1. Browse all available Composio-supported applications
2. Use the search bar to find specific apps
3. Click "Authenticate" to connect new applications
4. Manage authenticated apps

### Request Tab

Coming soon - Submit new DSAR requests

## API Routes

### `GET /api/registered-apps`
Returns list of registered and authenticated applications.

### `GET /api/app-discovery`
Returns all available Composio applications.

### `POST /api/user-discovery`
Searches for user data across registered apps.
```json
{
  "email": "user@example.com"
}
```

### `POST /api/user-review`
AI reviews user data for deletion compliance.
```json
{
  "email": "user@example.com",
  "userData": { ... }
}
```

### `POST /api/user-delete`
Deletes user data from specified app.
```json
{
  "email": "user@example.com",
  "appId": "hubspot",
  "confirmation": true
}
```

## Supported Apps (Initial MVP)

- HubSpot (configured by default)
- Add more apps via the App Discovery tab

## Architecture

```
/app
  /api              # API routes
  /page.tsx         # Main UI with tabs
  /layout.tsx       # Root layout
/components
  /ui               # Shadcn UI components
  /RequestTab.tsx   # Request submission
  /UserDiscoveryTab.tsx  # User search workflow
  /AppDiscoveryTab.tsx   # App management
/lib
  /composio.ts      # Composio integration
  /openai.ts        # OpenAI integration
  /registeredApps.ts # In-memory app store
```

## Security Considerations

- Environment variables must be kept secure
- User confirmation required before any deletion
- All API calls are server-side only
- GDPR/CCPA compliance validation via AI

## Future Enhancements

- Database persistence
- Multi-tenant support
- Audit logging
- Webhook support for automated DSAR processing
- Email notifications
- Advanced search filters
- Bulk operations

## License

ISC

## Support

For issues or questions, please open an issue on the repository.

