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

Enhanced schema for comprehensive project management:

```sql
-- Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  status TEXT NOT NULL,
  timeframe JSONB,
  budget JSONB,
  clickup_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contractors
CREATE TABLE contractors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  payout_rate DECIMAL,
  chargeout_rate DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Contractors
CREATE TABLE project_contractors (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  contractor_id INTEGER REFERENCES contractors(id),
  role TEXT NOT NULL,
  payout_rate DECIMAL NOT NULL,
  chargeout_rate DECIMAL NOT NULL,
  agreement_status TEXT NOT NULL,
  agreement_response_date TIMESTAMP,
  decline_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contractor Agreements
CREATE TABLE contractor_agreements (
  id SERIAL PRIMARY KEY,
  project_contractor_id INTEGER REFERENCES project_contractors(id),
  agreement_text TEXT NOT NULL,
  signed_at TIMESTAMP,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  contractor_id INTEGER REFERENCES contractors(id),
  file_path TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT NOT NULL,
  received_date TIMESTAMP,
  paid_date TIMESTAMP,
  payment_receipt_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendar Events
CREATE TABLE calendar_events (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  google_event_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
- Real-time data fetching via API
- No local storage of ClickUp data except IDs
- Project matching based on exact name
- Status mapping:
  * ClickUp statuses influence UI (e.g., colors for ACTIVE state)
  * Local statuses remain independent
  * Subtasks pulled and displayed in project details
- Error handling and retry mechanisms
- Separation between local and ClickUp data in UI where appropriate

### Email Integration
- Gmail API integration for:
  * Sending contractor agreements
  * Receiving and processing invoices
  * Automated document attachment handling
- Dynamic email templates with project-specific data
- Invoice detection and processing:
  * Match emails by project name
  * Extract and store PDF/DOC attachments
  * Update invoice status in system
- Contractor agreement emails with secure links
- Email tracking and status updates

### Google Calendar Integration
- Match project names flexibly
- Auto-attach project documents to events
- Two-way sync capabilities:
  * Create events from project system
  * Detect and link existing events
- Document linking in event descriptions

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

## Implementation Questions

### Contractor Agreement UI
- Should double confirmation dialog show full agreement text again?
- What specific legal disclaimers to include in confirmation?
- Need for customizable agreement templates per project type?

### Invoice Processing
- Implement OCR for automatic amount extraction?
- Add validation for invoice amount vs agreed rate?
- Track invoice due dates and add payment reminders?

### Document Storage
- Proposed structure: /projects/{projectId}/[agreements|invoices|receipts]/
- Final storage solution TBD:
  * Dedicated server folder structure
  * Cloud storage service
  * Database binary storage
- Document branding and templates to be designed

Note: These questions should be revisited and answered before implementing each specific feature.

## Future Considerations

### Potential Enhancements
- Additional analytics features
- Enhanced reporting capabilities
- Improved automation
- UI/UX improvements

*Note: All enhancements must be discussed and approved before implementation to maintain system simplicity and efficiency.*
