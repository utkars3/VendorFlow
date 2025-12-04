# Demo Video Plan

## 1. Introduction (0:00 - 0:30)
- Briefly explain the problem: Procurement is messy and manual.
- Introduce the solution: AI-Powered RFP Management System.
- Show the Dashboard (empty state or with some data).

## 2. Vendor Management (0:30 - 1:30)
- Navigate to **Vendor Management**.
- Show existing vendors.
- Add a new vendor (use a real email if possible, or a disposable one for testing).
- Explain that this database is used for sending RFPs.

## 3. Creating an RFP (1:30 - 3:30)
- Navigate to **Create RFP**.
- Type a natural language request:
  > "I need to buy 20 high-end laptops for our engineering team. Specs: 32GB RAM, 1TB SSD, M3 Max chips. Budget is around $80,000. We need them delivered by next month. Also need 20 4K monitors."
- Click **Generate Draft**.
- Show the AI-generated structured preview (JSON/Form).
- Highlight how it extracted: Items, Quantity, Specs, Budget, Deadline.
- Click **Create RFP**.

## 4. Sending RFP (3:30 - 4:30)
- Go to **RFP Details** page for the newly created RFP.
- Show the details view.
- Click **Send to Vendors**.
- Select the test vendor(s).
- Click **Send**.
- Show the status update to "SENT".
- (Optional) Show the received email in the vendor's inbox.

## 5. Receiving & Parsing Proposals (4:30 - 6:30)
- Reply to the email with a proposal.
  > "Hi, we can supply the 20 laptops for $75,000. Delivery in 3 weeks. Warranty is 3 years. Payment terms Net 30."
- Go back to the app and click **Check Emails**.
- Show the new proposal appearing in the list.
- Show the **Parsed Data**: Price ($75,000), Delivery (3 weeks), Warranty (3 years).

## 6. AI Comparison (6:30 - 7:30)
- (If possible, have another proposal pre-seeded or send another one).
- Click **AI Compare & Recommend**.
- Show the comparison table/summary.
- Highlight the **Recommendation** and **Reasoning** provided by AI.

## 7. Code Walkthrough (7:30 - 9:00)
- Briefly show the project structure.
- **Backend**:
  - `openai.service.ts`: Show the prompt for parsing and comparison.
  - `imap.service.ts`: Show how emails are fetched.
- **Frontend**:
  - `CreateRFP.tsx`: Show the split view logic.
  - `RFPDetails.tsx`: Show the integration of multiple APIs.

## 8. Conclusion (9:00 - 9:30)
- Recap the benefits: Speed, Structure, Automation.
- Mention future improvements (Auth, Real-time updates).
