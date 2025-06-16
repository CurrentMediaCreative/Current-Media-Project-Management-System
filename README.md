# Current Media Project Management System

A custom project management system designed for Current Media's video production workflow.

## Overview

The Current Media Project Management System is a web-based application that streamlines and automates the video production project management workflow. It integrates with ClickUp as the backend data source while providing a custom frontend interface tailored to Current Media's specific workflow needs.

## Key Features

- Project intake process with automated document generation
- Integration with ClickUp for project data
- Budget tracking and comparison (estimated vs. actual)
- Project timeline visualization and milestone tracking
- Automated reminders for project follow-ups
- Project completion and review workflow

## Project Structure

```
current-media-project-management-system/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js application
├── shared/                 # Shared code between frontend and backend
├── memory-bank/            # Project documentation and context
├── .github/                # GitHub Actions workflows
├── .gitignore              # Git ignore file
├── package.json            # Root package.json for scripts
└── README.md               # Project documentation
```

## Development

### Prerequisites

- Node.js (v16+)
- npm or Yarn
- Git
- MongoDB (local or Atlas)

### Setup

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Set up environment variables
4. Start the development server
   ```
   npm run dev
   ```

## Memory Bank

This project uses a Memory Bank approach to maintain comprehensive documentation. The Memory Bank contains:

- Project brief and requirements
- Product context and user experience goals
- System architecture and design patterns
- Technical context and development approach
- Active context and current focus
- Progress tracking and status updates

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For questions or support, contact Brayden at Current Media.
