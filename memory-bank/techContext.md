# Technical Context

## Project Data Architecture

### Core Components
1. Local Project Data
   - Stored in backend database
   - Contains detailed project information
   - Includes budgeting, contractors, documents
   - Has statuses: new_not_sent, new_sent, active, completed, archived

2. ClickUp Integration
   - Pulls project data from ClickUp API
   - Displays in project tracking interface
   - Can exist independently of local data
   - Provides task/status tracking

### Project Matching System
- Projects are matched by name
- Example: Local "Cool Video Project" matches ClickUp "Cool Video Project"
- This links the local project ID with the ClickUp task ID
- Simple 1:1 matching reduces complexity and potential issues

### Project Page Scenarios
1. Local-Only Project
   - Shows local project info
   - No ClickUp data yet
   - Typically new projects not sent to Jake

2. ClickUp-Only Project
   - Shows ClickUp task data
   - No local project info
   - Option to create matching local project
   - Can pre-fill creation form with ClickUp data

3. Matched Project
   - Shows both local and ClickUp data
   - Fully integrated view
   - Complete project management capabilities

### Project Creation Flows
1. Local-First Flow
   - Create local project
   - Send to Jake
   - Jake creates in ClickUp
   - Systems match by name

2. ClickUp-First Flow
   - Project exists in ClickUp
   - Create matching local project
   - Pre-fill from ClickUp data
   - Add local-specific info (budget, contractors, etc.)

### Project Completion & Archiving
- Completed projects from ClickUp populate completed projects page
- Can retroactively attach local data (invoices, documents)
- Manual archive button moves from completed to archived status
- Preserves project history and documentation

### Type System Requirements
1. Local Project Types
   - Define database structure
   - Handle local-specific fields
   - Manage project status transitions

2. ClickUp Types
   - Mirror ClickUp API structure
   - Handle task data mapping
   - Support status synchronization

3. UI Component Types
   - Support both data sources
   - Handle optional/partial data
   - Enable flexible display modes

## Implementation Notes
- Keep type system simple and focused
- Maintain clear separation between local and ClickUp data
- Use name-based matching for reliability
- Support both creation workflows
- Enable retroactive data attachment
- Preserve existing ClickUp integration functionality
