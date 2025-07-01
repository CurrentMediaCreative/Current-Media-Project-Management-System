# System Patterns: CurrentMedia Project Management System

## System Architecture

The CurrentMedia PMS follows a modern web application architecture with these key components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Express Backend│────▶│  ClickUp API    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │
         │                      │
         ▼                      ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Local Storage  │     │  Render Database│
│  (Browser)      │     │                 │
└─────────────────┘     └─────────────────┘
```

### Frontend Architecture

The frontend follows a component-based architecture using React:

```
┌─────────────────────────────────────────────────┐
│ App Container                                   │
│ ┌─────────────────┐  ┌─────────────────────────┐│
│ │ Navigation      │  │ Page Container          ││
│ │                 │  │ ┌─────────────────────┐ ││
│ │                 │  │ │ Dashboard           │ ││
│ │                 │  │ └─────────────────────┘ ││
│ │                 │  │ ┌─────────────────────┐ ││
│ │                 │  │ │ Projects List       │ ││
│ │                 │  │ └─────────────────────┘ ││
│ │                 │  │ ┌─────────────────────┐ ││
│ │                 │  │ │ Project Detail      │ ││
│ │                 │  │ └─────────────────────┘ ││
│ │                 │  │ ┌─────────────────────┐ ││
│ │                 │  │ │ Forms               │ ││
│ └─────────────────┘  │ └─────────────────────┘ ││
│                      └─────────────────────────┘│
└─────────────────────────────────────────────────┘
```

## Key Technical Decisions

### 1. Full-Stack JavaScript Approach

**Decision**: Use JavaScript/TypeScript throughout the stack (React frontend, Node.js/Express backend).

**Rationale**:

- Unified language across the stack simplifies development
- Large ecosystem of libraries and tools
- Excellent support for API integrations
- Strong community support

### 2. API-First Backend Design

**Decision**: Design the backend as a clean API layer between the frontend and ClickUp.

**Rationale**:

- Decouples frontend from direct ClickUp API dependencies
- Allows for caching and rate limiting to optimize ClickUp API usage
- Provides a place to transform and enrich data before sending to frontend
- Enables future extensions without frontend changes

### 3. Document Storage Strategy

**Decision**: Store project documents in a Render.com database rather than relying solely on browser local storage.

**Rationale**:

- Local storage has size limitations (typically 5-10MB)
- Database storage allows access across devices
- Provides data persistence beyond browser sessions
- Enables future backup and recovery options

### 4. Authentication Approach

**Decision**: Implement simple authentication for the initial MVP.

**Rationale**:

- Protects sensitive project data
- Provides a foundation for future user-specific features
- Relatively simple to implement with modern auth libraries

### 5. Responsive Design Strategy

**Decision**: Use a mobile-first design approach with Tailwind CSS.

**Rationale**:

- Ensures usability across devices
- Tailwind provides utility classes for rapid development
- Consistent design system without heavy custom CSS

## Component Relationships

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  App            │────▶│  Router         │────▶│  Pages          │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                         │
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  UI Components  │◀────│  Page Components│◀────│  Data Providers │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Critical Implementation Paths

### 1. ClickUp API Integration Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│ Auth with   │────▶│ Fetch       │────▶│ Transform   │────▶│ Cache       │
│ ClickUp     │     │ Project Data│     │ Data        │     │ Results     │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   │
                                                                   ▼
                                                            ┌─────────────┐
                                                            │             │
                                                            │ Serve to    │
                                                            │ Frontend    │
                                                            │             │
                                                            └─────────────┘
```

### 2. Document Management Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│ Create/Edit │────▶│ Validate    │────▶│ Save to     │
│ Document    │     │ Form Data   │     │ Database    │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │             │
                                        │ Link to     │
                                        │ Project     │
                                        │             │
                                        └─────────────┘
```

### 3. Dashboard Metrics Calculation

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│ Fetch All   │────▶│ Filter by   │────▶│ Calculate   │
│ Projects    │     │ Status      │     │ Metrics     │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │             │
                                        │ Render      │
                                        │ Dashboard   │
                                        │             │
                                        └─────────────┘
```

## Data Models

### Project Model

```
Project {
  id: string              // ClickUp task ID
  name: string            // Project name
  status: string          // Current status
  budget: number          // Project budget
  deadline: Date          // Project deadline
  description: string     // Project description
  subtasks: Task[]        // Array of subtasks
  documents: Document[]   // Array of attached documents
  createdAt: Date         // Creation date
  updatedAt: Date         // Last update date
}
```

### Document Model

```
Document {
  id: string              // Unique document ID
  projectId: string       // Associated project ID
  type: string            // Document type (overview, budget, production)
  content: Object         // Document content (JSON)
  createdAt: Date         // Creation date
  updatedAt: Date         // Last update date
}
```

### User Model

```
User {
  id: string              // Unique user ID
  username: string        // Username
  password: string        // Hashed password
  role: string            // User role
  createdAt: Date         // Creation date
  lastLogin: Date         // Last login date
}
```
