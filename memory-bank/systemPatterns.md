# Current Media Project Management System - System Patterns

## System Architecture

The Current Media Project Management System follows a clean, efficient architecture focused on three core components with a simple dashboard interface.

```mermaid
flowchart TD
    subgraph Dashboard
        Login[Login]
        Notifications[Notifications]
        Navigation[Section Navigation]
    end
    
    subgraph Core Components
        PCS[Project Creation System]
        PT[Project Tracking]
        FM[Financial Management]
    end
    
    subgraph External
        ClickUp[ClickUp]
        Email[Email Service]
    end
    
    Login --> Navigation
    Navigation --> PCS
    Navigation --> PT
    Navigation --> FM
    
    Notifications --> |Check Status| PCS
    Notifications --> |Check Status| PT
    Notifications --> |Check Status| FM
    
    PCS --> Email
    PT --> ClickUp
    FM --> ClickUp
```

## Component Structure

### 1. Project Creation System

The project creation system follows a feature-based organization with clear separation of concerns:

```mermaid
flowchart TD
    subgraph Project Creation Flow
        Initial[Initial Project Info] --> Scope[Scope Definition]
        Scope --> Budget[Smart Budget System]
        Budget --> Team[Contractor Management]
        Team --> Overview[Production Overview]
    end

    subgraph Components by Feature
        Initial --> |Contains| BasicInfo[Basic Project Details]
        Initial --> |Contains| Timeline[Timeline Setup]
        
        Scope --> |Contains| Requirements[Project Requirements]
        Scope --> |Contains| Deliverables[Deliverables]
        Scope --> |Contains| TechSpecs[Technical Specifications]
        
        Budget --> |Contains| Scenarios[Budget Scenarios]
        Budget --> |Contains| CostBreakdown[Cost Analysis]
        Budget --> |Contains| ProfitCalc[Profit Calculator]
        
        Team --> |Contains| TeamComp[Team Composition]
        Team --> |Contains| Emails[Assignment Emails]
        Team --> |Contains| Tracking[Response Tracking]
        
        Overview --> |Contains| Timeline[Production Timeline]
        Overview --> |Contains| TeamView[Team Overview]
        Overview --> |Contains| Requirements[Requirements Review]
    end
```

#### Component Structure

1. **Initial Project Info (`InitialProjectInfo.tsx`)**
   - Project title and client details
   - Timeline configuration
   - Initial budget estimation
   - Basic project parameters

2. **Scope Definition (`ScopeDefinition.tsx`)**
   - Project requirements list
   - Deliverables management
   - Technical requirements
   - Priority settings
   - Additional notes

3. **Smart Budget System (`SmartBudgetSystem.tsx`)**
   - Multiple budget scenarios
   - Cost breakdown analysis
   - Profit margin calculator
   - Risk assessment
   - Contingency planning

4. **Contractor Management (`ContractorManagement.tsx`)**
   - Team composition
   - Email assignment system
   - Response tracking
   - Rate management
   - Availability confirmation

5. **Production Overview (`ProductionOverview.tsx`)**
   - Timeline visualization
   - Team overview
   - Requirements summary
   - Budget overview
   - Production readiness check

### 2. Project Tracking
```mermaid
flowchart LR
    New[New - Not Sort] --> Pending[Pending ClickUp Entry]
    Pending --> Active[Active in ClickUp]
    Active --> Completed[Completed - Pending Invoices]
    Completed --> Archived[Archived]
```

### 3. Financial Management
```mermaid
flowchart TD
    Analytics[Smart Analytics] --> Estimate[Estimate vs Actual]
    Analytics --> Performance[Team Performance]
    
    Payments[Payment Tracking] --> Client[Client Payments]
    Payments --> Contractor[Contractor Payments]
    
    Client --> Profit[Profit Analysis]
    Contractor --> Profit
```

## Key Technical Decisions

### Frontend Design
- Clean, efficient dashboard layout
- Simple navigation between sections
- Status-based notification system
- Minimal, focused UI components

### Backend Structure
- Basic API endpoints for core functionality
- Simple data synchronization with ClickUp
- Efficient email service integration
- Straightforward data storage

### Data Management
- Focus on essential project data
- Simple, efficient data structures
- Basic data validation
- Practical error handling

### Authentication
- Basic single-user login
- Simple session management
- No complex user roles needed

## Design Patterns

### Frontend Patterns

1. **Component Pattern**
   - Clean, focused components
   - Clear component hierarchy
   - Simple state management

2. **Dashboard Pattern**
   - Central navigation hub
   - Status notifications
   - Quick access to core functions

3. **Form Pattern**
   - Step-by-step project creation
   - Clear validation feedback
   - Progress saving

### Backend Patterns

1. **Service Pattern**
   - Focused service responsibilities
   - Clear data flow
   - Simple error handling

2. **Integration Pattern**
   - Direct ClickUp synchronization
   - Simple email notifications
   - Basic data mapping

## Component Relationships

### Project Flow

```mermaid
flowchart TD
    Dashboard[Dashboard] --> Create[Create Project]
    Dashboard --> Track[Track Projects]
    Dashboard --> Manage[Manage Finances]
    
    Create --> Form[Project Form]
    Form --> Budget[Budget Calculator]
    Budget --> Contractors[Contractor Assignment]
    
    Track --> Status[Status Updates]
    Track --> Sync[ClickUp Sync]
    
    Manage --> Analytics[Financial Analytics]
    Manage --> Payments[Payment Tracking]
```

### Data Flow

```mermaid
flowchart TD
    ClickUp[ClickUp API] --> Sync[Data Sync]
    Sync --> Local[Local Storage]
    
    Local --> Projects[Project Data]
    Local --> Financial[Financial Data]
    
    Projects --> UI[User Interface]
    Financial --> UI
```

## Technical Constraints

1. **Simplicity First**
   - Keep implementation straightforward
   - Focus on core functionality
   - Avoid unnecessary complexity

2. **Practical Integration**
   - Basic ClickUp data sync
   - Simple email notifications
   - Essential data storage

3. **Single User Focus**
   - Basic authentication
   - Simple session management
   - No multi-user complexity

## Evolution Strategy

The system is designed to evolve based on practical needs:

1. **Core First**
   - Build essential features
   - Ensure solid foundation
   - Test thoroughly

2. **Practical Improvements**
   - Discuss enhancements first
   - Focus on workflow benefits
   - Avoid feature bloat

3. **User-Driven Updates**
   - Regular feedback
   - Focus on efficiency
   - Practical solutions
