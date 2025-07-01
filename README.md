# CurrentMedia Project Management System

A web-based project management system that integrates with ClickUp API to display and manage CurrentMedia's projects.

## Features

- Dashboard with project metrics and overview
- Project listing with search and filtering
- Detailed project pages with subtasks
- Document management for projects
- ClickUp API integration
- Local project creation and management

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Node.js, Express
- **Authentication**: JWT
- **Deployment**: Render.com

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- ClickUp account with API access

### Installation

1. Clone the repository

   ```
   git clone [repository-url]
   cd CurrentMedia-PMS
   ```

2. Install dependencies

   ```
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables

   - Copy `.env.example` to `.env` in the server directory
   - Add the required environment variables (see below)

4. Start the development servers

   ```
   # Start both client and server
   npm run dev

   # Or start them separately
   npm run client
   npm run server
   ```

### Environment Variables

#### Server (.env)

```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here

# ClickUp API Configuration
CLICKUP_API_URL=https://api.clickup.com/api/v2
CLICKUP_API_KEY=your_clickup_api_key_here
CLICKUP_LIST_ID=your_clickup_list_id_here
```

## Project Structure

```
CurrentMedia-PMS/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   └── src/                # React source code
│       ├── components/     # Reusable UI components
│       ├── context/        # React context providers
│       ├── pages/          # Page components
│       └── services/       # API service functions
│
├── server/                 # Backend Node.js/Express application
│   └── src/                # Server source code
│       ├── middleware/     # Express middleware
│       ├── routes/         # API routes
│       └── uploads/        # Document uploads directory
│
├── memory-bank/            # Project documentation
└── README.md               # Project documentation
```

## Development

- Frontend: `npm run client` (runs on http://localhost:3000)
- Backend: `npm run server` (runs on http://localhost:5000)
- Both: `npm run dev`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/verify` - Verify JWT token

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/metrics` - Get project metrics
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Documents

- `GET /api/documents/project/:projectId` - Get all documents for a project
- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents` - Create a new document
- `PUT /api/documents/:id` - Update a document
- `DELETE /api/documents/:id` - Delete a document
- `POST /api/documents/:id/attachments` - Upload an attachment to a document

## ClickUp API Integration

This application integrates with the ClickUp API to fetch project data:

1. Get a ClickUp API key from your ClickUp account settings
2. Set the API key in your server's `.env` file
3. Configure the list ID for the projects you want to fetch

## Deployment to Render.com

1. Push your code to GitHub
2. Create a new Web Service on Render.com
3. Connect your GitHub repository
4. Configure the build settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Set up environment variables
6. Deploy

## License

[ISC License]
