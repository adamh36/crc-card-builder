# CRC Card Builder

CRC Card Builder is a full-stack web application that allows students and teams to design, create, and manage Class–Responsibility–Collaborator (CRC) cards. Developed as part of the CIS 375 Software Engineering course at the University of Michigan–Dearborn (Fall 2025), the project provides a clear, intuitive environment for modeling object-oriented systems, integrating both frontend and backend functionality with persistent cloud storage through MongoDB Atlas. Each project in the system can hold multiple CRC cards, each representing a class with its responsibilities, collaborators, attributes, and methods. The backend provides RESTful CRUD APIs using Next.js API Routes, Mongoose for data modeling, and Zod for validation. The frontend, built with Next.js 16, TypeScript, and Tailwind CSS, provides a clean and responsive interface for creating and managing cards. The app runs locally on port 3000 and can be accessed at `/projects`.

## Tech Stack
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS  
- **Backend:** Next.js API Routes, Mongoose ODM, Zod Validation  
- **Database:** MongoDB Atlas (cloud-hosted)  
- **Runtime:** Node.js 20+  

## Features
- Fully functional CRUD API for Projects and Cards  
- MongoDB connection with environment configuration  
- Zod-based request validation for all endpoints  
- Mongoose models for Project and Card data  
- Interactive UI for adding, editing, and deleting CRC cards  
- Data persistence with MongoDB Atlas  
- API tested locally with cURL and Postman  
- Compatible with Next.js 16 App Router  

## Limitations
- Users must have their IP address whitelisted in MongoDB Atlas to run the app locally  
- `.env.local` must not be shared or pushed to GitHub (contains credentials)  
- Each collaborator requires explicit database access through Atlas IP rules  

## Setup
1. **Clone the repository**  
   `git clone https://github.com/adamh36/crc-card-builder.git && cd crc-card-builder`  
2. **Install dependencies**  
   `npm install`  
3. **Add environment variables** — create `.env.local` in the root and add  
   `MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/crcdb?retryWrites=true&w=majority`  
4. **Run the app**  
   `npm run dev`  
5. **Open in browser** → `http://localhost:3000/projects`  

## Structure
src/  
├── app/  
│   ├── api/  
│   │   ├── projects/     → CRUD routes for Projects  
│   │   ├── cards/         → CRUD routes for CRC Cards  
│   │   └── test/           → MongoDB connection test  
│   ├── projects/page.tsx   → Main UI (React components)  
│   └── page.tsx               → Landing page  
├── lib/db.ts                     → Database connection helper  
└── models/  
    ├── Project.ts                  → Project schema  
    └── Card.ts                     → Card schema  

## API
**Create Project** → POST `/api/projects`  body `{"name":"Demo Project","description":"First demo project"}`  
**Get Projects** → GET `/api/projects`  
**Create Card** → POST `/api/cards`  body `{"projectId":"<project_id>","className":"Order","responsibilities":["calculate total"],"collaborators":["Cart"]}`  
**Get Cards** → GET `/api/cards?projectId=<project_id>`  
**Update Card** → PATCH `/api/cards/<card_id>` body `{"attributes":["id","total"],"methods":["addItem","checkout"]}`  
**Delete Card** → DELETE `/api/cards/<card_id>`  

## Progress
| Phase | Description | Status |  
|:--|:--|:--|  
| 1 | Repo setup with Next.js and config | ✅ |  
| 2 | MongoDB connection and environment setup | ✅ |  
| 3 | Mongoose models for Project and Card | ✅ |  
| 4 | RESTful CRUD API for Projects and Cards | ✅ |  
| 5 | Frontend UI integration | ✅ |  
| 6 | Documentation and organization updates | 🚧 |  
| 7 | Future features (Q&A Assistant, search/edit/delete, PDF export) | 🕓 |  

## Future Enhancements
- AI Q&A assistant for CRC design guidance  
- Advanced search and filter capabilities  
- Export to PDF/Markdown/JSON  
- Team authentication and collaboration  

## Team
**Adam Hammoud** – Software Lead & Full‑Stack Developer  

## License
Created for educational use under CIS 375 (Fall 2025). © 2025 University of Michigan–Dearborn. All rights reserved.

## Deployment
Deploy via [Vercel](https://vercel.com) or Node‑compatible host. Ensure `MONGODB_URI` is configured in environment variables.  

✅ **Access:** Run locally at `http://localhost:3000/projects`




