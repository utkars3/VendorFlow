# AI-Powered RFP Management System

A single-user web application to streamline the procurement process using AI.

## Features
- **Create RFPs**: Describe your needs in natural language, and the system generates a structured RFP.
- **Vendor Management**: Manage your vendor database.
- **Email Integration**: Send RFPs to vendors via email and receive proposals automatically.
- **AI Parsing**: Automatically parses incoming vendor proposals (email body) into structured data.
- **AI Comparison**: Compares multiple proposals and recommends the best vendor based on your requirements.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Lucide React
- **Backend**: Node.js, Express, TypeScript, Prisma (SQLite)
- **AI**: OpenAI API (GPT-4o)
- **Email**: Nodemailer (SMTP), imap-simple (IMAP)

## Prerequisites
- Node.js (v18+)
- OpenAI API Key
- Email Account (IMAP/SMTP enabled, e.g., Gmail with App Password)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npx prisma migrate dev --name init
   npm run seed # Optional: Add seed vendors
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Configuration (.env)
```env
DATABASE_URL="file:./dev.db"
PORT=3000
OPENAI_API_KEY="sk-..."
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_HOST="imap.gmail.com"
```

## Usage Flow
1. Go to **Vendor Management** and add a few vendors (use real emails if you want to test sending).
2. Go to **Create RFP**, describe your need (e.g., "I need 50 laptops..."), and create the RFP.
3. In **RFP Details**, click **Send to Vendors** and select recipients.
4. Reply to the email you receive with a proposal (include price, delivery, etc.).
5. Click **Check Emails** in the app to fetch and parse the proposal.
6. Once proposals are in, click **AI Compare & Recommend** to see the analysis.

## Assumptions & Decisions
- **Single User**: No authentication implemented as per requirements.
- **Email**: Uses IMAP to fetch *all* unseen emails. In a real app, we'd use webhooks or specific filtering.
- **AI**: We use GPT-4o for its superior reasoning in parsing and comparison.
- **Database**: SQLite is used for ease of local setup.

## AI Tools Used
- **Cursor/Claude**: Used for scaffolding the project structure, generating boilerplate code (Prisma schema, Express routes), and refining the UI components with TailwindCSS.
- **OpenAI API**: The core intelligence for parsing RFPs and comparing proposals.
