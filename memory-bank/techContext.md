# Current Media Project Management System - Technical Context

## Technology Stack

### Frontend
- React with TypeScript for UI components
- Simple state management for data flow
- Clean, efficient component structure
- Basic routing for navigation

### Backend
- Node.js with Express
- PostgreSQL for data storage
- Basic API endpoints
- Simple data validation

### External Services
- ClickUp API for project data
- Basic email service for notifications

## Implementation Details

### Frontend Structure

```
client/
├── src/
│   ├── components/         # UI Components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── projects/      # Project creation & tracking
│   │   └── finance/       # Financial management
│   │
│   ├── services/          # API communication
│   │   ├── projects/      # Project operations
│   │   └── finance/       # Financial operations
│   │
│   └── store/             # State management
```

### Backend Structure

```
server/
├── src/
│   ├── api/              # API endpoints
│   ├── services/         # Business logic
│   └── integrations/     # External services
```

### Database Schema

Simple, focused schema for essential data:

```sql
-- Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  status TEXT NOT NULL,
  timeframe JSONB,
  budget JSONB,
  contractors JSONB
);

-- Contractors
CREATE TABLE contractors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  rate DECIMAL
);

-- Invoices
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  amount DECIMAL NOT NULL,
  status TEXT NOT NULL,
  issued_date DATE,
  due_date DATE
);
```

## Core Features

### 1. Project Creation
- Step-by-step form process
- Progress saving at each step
- Budget calculation tools
- Contractor assignment
- Document generation

### 2. Project Tracking
- Status management
- ClickUp synchronization
- Invoice tracking
- Simple progress monitoring

### 3. Financial Management
- Budget vs actual comparison
- Payment tracking
- Basic financial analytics
- Profit calculation

### 4. Dashboard
- Clean, efficient layout
- Status notifications
- Quick navigation
- Essential project overview

## Integration Points

### ClickUp Integration
- Basic data synchronization
- Project status updates
- Simple error handling

### Email Integration
- Contractor notifications
- Basic email templates
- Simple tracking

## Development Guidelines

### Code Organization
- Keep components focused and simple
- Clear separation of concerns
- Minimal dependencies
- Practical error handling

### State Management
- Simple, predictable state flow
- Basic action creators
- Essential reducers
- Practical middleware

### API Design
- RESTful endpoints
- Simple request/response cycle
- Basic error responses
- Clear status codes

### Testing Strategy
- Focus on core functionality
- Basic integration tests
- Simple unit tests
- Manual testing of flows

## Deployment

### Development
- Local development setup
- Basic build process
- Simple environment config

### Production
- Single-server deployment
- Basic SSL setup
- Simple backup strategy

## Security Considerations

### Authentication
- Basic login system
- Simple session management
- Secure password storage

### Data Protection
- Basic input validation
- Simple SQL injection prevention
- Essential XSS protection

## Maintenance

### Monitoring
- Basic error logging
- Simple performance monitoring
- Essential backup verification

### Updates
- Regular dependency updates
- Simple version control
- Basic documentation maintenance

## Future Considerations

### Potential Enhancements
- Additional analytics features
- Enhanced reporting capabilities
- Improved automation
- UI/UX improvements

*Note: All enhancements must be discussed and approved before implementation to maintain system simplicity and efficiency.*
