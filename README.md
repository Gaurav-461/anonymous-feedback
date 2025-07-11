# Anonymous Feedback App

A web application that allows users to receive and send anonymous feedback. Built with Next.js, this app provides a secure and user-friendly platform for open communication.

## Features

- User authentication (sign up, sign in, email verification)
- Unique username selection and validation
- Send and receive anonymous messages
- User dashboard to manage received messages
- Message suggestions
- Dark/light theme toggle
- Responsive UI

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- React
- TypeScript
- Tailwind CSS
- NextAuth.js (authentication)
- MongoDB (via Mongoose)
- Resend (email service)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm, npm, yarn, or bun
- MongoDB database (local or cloud)
- Resend API key (for email verification)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Gaurav-461/anonymous-feedback.git

   cd anonymous_feedback_app
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   # or
   bun install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   RESEND_API_KEY=your_resend_api_key
   NEXTAUTH_URL=http://localhost:3000
   ```