# Current Media Project Management System - Technical Context

## Technologies Used

### Frontend Technologies

1. **Core Framework**
   - React with TypeScript
   - Provides component-based architecture, strong typing, and excellent ecosystem

2. **State Management**
   - Redux Toolkit
   - Simplifies Redux boilerplate and provides efficient state management

3. **UI Component Library**
   - Material-UI or Chakra UI
   - Provides accessible, responsive components with customizable theming

4. **Form Handling**
   - React Hook Form
   - Efficient form validation and state management with minimal re-renders

5. **Data Fetching**
   - React Query
   - Handles caching, background updates, and optimistic UI updates

6. **Routing**
   - React Router
   - Declarative routing for React applications

7. **Styling**
   - Styled Components or Emotion
   - CSS-in-JS for component-scoped styling with theming support

8. **Data Visualization**
   - Chart.js or D3.js
   - For budget comparisons and project timeline visualization

### Backend Technologies

1. **Core Framework**
   - Node.js with Express
   - Provides efficient API development with JavaScript/TypeScript

2. **API Documentation**
   - Swagger/OpenAPI
   - Self-documenting API with interactive testing

3. **Authentication**
   - JWT (JSON Web Tokens)
   - Passport.js for authentication strategies

4. **Database**
   - MongoDB with Mongoose
   - Flexible schema for evolving data models

5. **Email Integration**
   - Nodemailer
   - For sending project forms and notifications

6. **External API Integration**
   - Axios
   - For communication with ClickUp API and other external services

7. **Background Processing**
   - Bull or Agenda
   - For handling scheduled tasks and reminders

### DevOps & Infrastructure

1. **Hosting**
   - Render.com
   - Modern cloud platform with easy deployment and scaling

2. **CI/CD**
   - GitHub Actions
   - Automated testing and deployment pipeline

3. **Monitoring**
   - Sentry
   - Error tracking and performance monitoring

4. **Version Control**
   - Git with GitHub
   - Collaborative development and code management

## Development Setup

### Local Development Environment

1. **Prerequisites**
   - Node.js (v16+)
   - npm or Yarn
   - Git
   - MongoDB (local or Atlas)

2. **Project Structure**
   ```
   current-media-project-management-system/
   ├── client/                 # Frontend React application
   │   ├── public/             # Static assets
   │   ├── src/                # Source code
   │   │   ├── components/     # Reusable UI components
   │   │   ├── pages/          # Page components
   │   │   ├── services/       # API client and services
   │   │   ├── store/          # Redux store and slices
   │   │   ├── hooks/          # Custom React hooks
   │   │   ├── utils/          # Utility functions
   │   │   └── App.tsx         # Main application component
   │   ├── package.json        # Frontend dependencies
   │   └── tsconfig.json       # TypeScript configuration
   │
   ├── server/                 # Backend Node.js application
   │   ├── src/                # Source code
   │   │   ├── api/            # API routes
   │   │   ├── models/         # Database models
   │   │   ├── services/       # Business logic
   │   │   ├── integrations/   # External API integrations
   │   │   ├── utils/          # Utility functions
   │   │   └── index.ts        # Application entry point
   │   ├── package.json        # Backend dependencies
   │   └── tsconfig.json       # TypeScript configuration
   │
   ├── shared/                 # Shared code between frontend and backend
   │   ├── types/              # TypeScript type definitions
   │   └── constants/          # Shared constants
   │
   ├── .github/                # GitHub Actions workflows
   ├── .gitignore              # Git ignore file
   ├── package.json            # Root package.json for scripts
   └── README.md               # Project documentation
   ```

3. **Development Workflow**
   - Frontend and backend development servers run concurrently
   - Hot reloading for efficient development
   - ESLint and Prettier for code quality and formatting
   - Jest and React Testing Library for testing

### Deployment Pipeline

1. **Development Environment**
   - Automatic deployment from development branch
   - Used for testing new features

2. **Staging Environment**
   - Deployment from staging branch after code review
   - Used for user acceptance testing

3. **Production Environment**
   - Deployment from main branch
   - Requires approval and successful tests

## Technical Constraints

### ClickUp Integration

1. **API Limitations**
   - Need to work within ClickUp API rate limits
   - Handle potential API changes gracefully
   - Implement caching to reduce API calls

2. **Data Synchronization**
   - Determine optimal synchronization strategy
   - Handle conflicts between local and ClickUp data
   - Implement error handling and retry mechanisms

### Authentication & Security

1. **User Management**
   - Implement secure user authentication
   - Role-based access control for different team members
   - Secure password storage and management

2. **Data Security**
   - Encrypt sensitive data in transit and at rest
   - Implement proper input validation and sanitization
   - Regular security audits and updates

### Integration with currentmedia.ca

1. **Wix Integration Options**
   - Explore options for integrating with Wix-based website
   - Consider iframe embedding, custom domain, or API integration
   - Ensure consistent user experience across platforms

2. **Alternative Approach**
   - Direct access via bookmark or desktop shortcut
   - Standalone application with its own domain
   - Consider progressive web app (PWA) capabilities

## Dependencies & External Services

### External APIs

1. **ClickUp API**
   - Primary data source for project information
   - Requires API key and proper authentication
   - Documentation: https://clickup.com/api

2. **Email Service**
   - For sending project forms and notifications
   - Options include SendGrid, Mailgun, or direct SMTP

3. **Google Calendar API** (potential)
   - For integration with shoot day scheduling
   - Requires OAuth authentication

### Third-Party Libraries

Key dependencies will include:

1. **Frontend**
   - React and React DOM
   - Redux Toolkit and React-Redux
   - React Router
   - Material-UI or Chakra UI
   - React Hook Form
   - React Query
   - Styled Components or Emotion
   - Chart.js or D3.js

2. **Backend**
   - Express
   - Mongoose
   - Passport.js and JWT
   - Nodemailer
   - Axios
   - Bull or Agenda
   - Winston (logging)

3. **Development Tools**
   - TypeScript
   - ESLint and Prettier
   - Jest and React Testing Library
   - Webpack or Vite
   - Husky (Git hooks)

## Development Roadmap

The technical implementation will follow an incremental approach:

1. **Phase 1: Foundation**
   - Set up project structure and development environment
   - Implement authentication and user management
   - Create basic frontend shell and navigation

2. **Phase 2: Core Functionality**
   - Implement ClickUp integration
   - Develop project intake form
   - Create project dashboard and details views

3. **Phase 3: Document Generation**
   - Implement budget document generation
   - Create project overview/shot list generation
   - Develop email integration for sending to Jake

4. **Phase 4: Tracking & Reminders**
   - Implement reminder system
   - Develop budget comparison functionality
   - Create project timeline visualization

5. **Phase 5: Refinement & Deployment**
   - User testing and feedback incorporation
   - Performance optimization
   - Production deployment and monitoring setup
