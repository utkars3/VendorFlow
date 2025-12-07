# ProcureAI 🚀

**ProcureAI** is an intelligent procurement platform that streamlines the entire Request for Proposal (RFP) lifecycle. By leveraging Google's Gemini AI, it automates the tedious parts of sourcing—from drafting requirements to analyzing complex vendor proposals.

## ✨ Key Features

*   **🤖 AI-Powered RFP Generation**: Describe your needs in natural language, and the AI generates a structured, professional RFP.
*   **📧 Automated Proposal Parsing**: Automatically extracts key data (Price, Delivery Time, Warranty) from unstructured vendor emails and proposals.
*   **📊 Smart Vendor Comparison**: AI analyzes multiple proposals side-by-side, scores them, and provides a recommendation on which vendor to choose.
*   **👥 Vendor Management**: A centralized dashboard to manage vendor contacts and relationships.
*   **📈 Interactive Dashboard**: Track the status of all your Draft, Sent, and Closed RFPs in one place.

---

## 1. Project Setup

### Prerequisites
*   **Node.js**: v20.18.3 or higher
*   **Database**: PostgreSQL (Ensure you have a running instance)
*   **API Keys**:
    *   `GEMINI_API_KEY`: Get it from [Google AI Studio](https://aistudio.google.com/)
    *   Email Credentials (for sending/receiving RFPs)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd procurement_Project
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    
    # Configure Environment Variables
    cp .env.example .env
    # Update .env with:
    # DATABASE_URL="postgresql://user:password@localhost:5432/procurement_db"
    # GEMINI_API_KEY="your_api_key"
    # EMAIL_USER="your_email@gmail.com"
    # EMAIL_PASS="your_app_password"
    
    # Run Migrations
    npm run db:migrate:dev
    ```

3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    ```

### Running Locally

1.  **Start Backend**:
    ```bash
    cd backend
    npm run dev
    # Server runs on http://localhost:3000
    ```

2.  **Start Frontend**:
    ```bash
    cd frontend
    npm run dev
    # Client runs on http://localhost:5173
    ```

---

## 2. Tech Stack

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **HTTP Client**: Axios

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database ORM**: Prisma
*   **Database**: PostgreSQL
*   **AI Engine**: Google Gemini 2.5 Flash (`@google/generative-ai`)
*   **Email**: Nodemailer (sending), Imap-Simple (receiving), Mailparser

---

## 3. API Documentation

### RFP Endpoints

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/rfps/generate` | Generate RFP structure from text | `{ description: string }` |
| `POST` | `/api/rfps` | Create a new RFP | `{ title, description, structuredData }` |
| `GET` | `/api/rfps` | Get all RFPs | - |
| `GET` | `/api/rfps/:id` | Get specific RFP details | - |
| `POST` | `/api/rfps/:id/send` | Send RFP to vendors | `{ vendorIds: string[] }` |
| `POST` | `/api/rfps/check-emails` | Check for new vendor proposals | - |
| `POST` | `/api/rfps/:id/compare` | AI comparison of proposals | - |

### Vendor Endpoints

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/vendors` | Add a new vendor | `{ name, email, contactName }` |
| `GET` | `/api/vendors` | Get all vendors | - |

---

## 4. Decisions & Assumptions

### Key Design Decisions
*   **AI-First Approach**: We chose to use Gemini for both generation and parsing to handle the variability of natural language and unstructured emails.
*   **Structured Data Storage**: While the input is unstructured, we store the parsed RFP data as JSON strings in the database to allow for flexible schema evolution without constant migrations.
*   **Prisma & PostgreSQL**: Chosen for type safety and relational data integrity, crucial for linking RFPs to Vendors and Proposals.

### Assumptions
*   **Email Format**: We assume vendors reply to the specific RFP email thread. The system uses subject line matching or specific identifiers to link emails to RFPs.
*   **Currency**: The system currently defaults to INR (₹) for financial comparisons.
*   **AI Reliability**: We assume the AI will return valid JSON. We have implemented fallback parsing and safe rendering in the frontend to handle cases where it might fail.

---

## 5. AI Tools Usage

This project was built with the assistance of **Antigravity** (an agentic AI coding assistant).

*   **Role**: Antigravity acted as a pair programmer, handling full-stack implementation, debugging, and refactoring.
*   **Key Contributions**:
    *   **Boilerplate & Setup**: Rapidly set up the React+Vite frontend and Express+Prisma backend.
    *   **Complex Logic**: Implemented the `gemini.service.ts` to handle prompt engineering for RFP generation and proposal parsing.
    *   **Refactoring**: Refactored the monolithic `RFPDetails.tsx` into smaller, reusable components (`ProposalCard`, `AIComparison`, etc.) for better maintainability.
    *   **Debugging**: Diagnosed and fixed UI crashes caused by inconsistent AI response formats (handling object vs. primitive types for prices).
*   **Learnings**: The use of AI agents significantly sped up the development of complex features like email parsing and AI integration, allowing for a focus on high-level architecture and user experience.
