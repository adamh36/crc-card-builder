# CRC Card Builder

CRC Card Builder is a web-based application designed to help students and teams create and manage Class–Responsibility–Collaborator (CRC) cards. It was developed as part of the CIS 375 Software Engineering course at the University of Michigan–Dearborn (Fall 2025).

---

## Overview

This project provides a structured environment for designing object-oriented systems using CRC cards. Each project can contain multiple cards describing a class name, its responsibilities, and collaborators. The backend supports persistent storage through MongoDB and exposes RESTful API routes for full CRUD functionality. The frontend will provide an intuitive interface for creating, editing, and managing cards.

---

## Technology Stack

- Frontend: Next.js 16 (App Router), TypeScript, Tailwind CSS  
- Backend: Next.js API Routes, Mongoose, Zod for input validation  
- Database: MongoDB Atlas (cloud-hosted)  
- Runtime: Node.js 20+

---

## Features Implemented (Backend Complete)

- MongoDB database connection and environment configuration  
- Mongoose models for Projects and Cards  
- RESTful API routes for project and card management  
- Zod validation for request data  
- API tested locally with cURL and Postman  
- Fully compatible with Next.js 16 App Router

---

## Environment Setup

1. Clone the repository:
   ```
   git clone https://github.com/<your-username>/crc-card-builder.git
   cd crc-card-builder
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the project root and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/crcdb?retryWrites=true&w=majority
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── projects/         → CRUD endpoints for Projects
│   │   ├── cards/            → CRUD endpoints for CRC Cards
│   │   └── test/             → Test route for MongoDB connection
│   ├── page.tsx              → Main landing page
│
├── lib/
│   └── db.ts                 → MongoDB connection helper
│
└── models/
    ├── Project.ts            → Mongoose schema for Projects
    └── Card.ts               → Mongoose schema for CRC Cards
```

---

## API Endpoints

**Create a Project**
```
POST /api/projects
Content-Type: application/json
{
  "name": "Demo Project",
  "description": "first demo"
}
```

**Get All Projects**
```
GET /api/projects
```

**Create a CRC Card**
```
POST /api/cards
Content-Type: application/json
{
  "projectId": "<project_id>",
  "className": "Order",
  "responsibilities": ["calculate total"],
  "collaborators": ["Cart"]
}
```

**Get Cards for a Project**
```
GET /api/cards?projectId=<project_id>
```

**Update a Card**
```
PATCH /api/cards/<card_id>
Content-Type: application/json
{
  "attributes": ["id", "total"],
  "methods": ["addItem", "checkout"]
}
```

**Delete a Card**
```
DELETE /api/cards/<card_id>
```

---

## Current Progress

| Phase | Description | Status |
|-------|--------------|--------|
| 1 | Repository setup with Next.js and configuration | Completed |
| 2 | MongoDB connection and environment setup | Completed |
| 3 | Mongoose models for Project and Card | Completed |
| 4 | RESTful CRUD API for Projects and Cards | Completed |
| 5 | Frontend UI for Projects and Cards | In Progress |

---

## Team Members


---

## License

This project was created for educational purposes as part of the CIS 375 Software Engineering course.  
All rights reserved by the University of Michigan–Dearborn and respective authors.

---

# Default Next.js Documentation

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

