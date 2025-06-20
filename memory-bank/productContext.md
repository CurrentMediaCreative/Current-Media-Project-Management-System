# Current Media Project Management System - Product Context

## Why This Project Exists

### Current Challenges
Current Media's video production workflow currently faces several challenges:

1. **Fragmented Information Management**
   - Project details are spread across multiple platforms (Google Docs, Excel, ClickUp, etc.)
   - No single source of truth for project information
   - Manual copying of information between systems

2. **Inefficient Project Setup**
   - New project setup requires manual creation of multiple documents
   - Time-consuming process to gather and distribute project information
   - Potential for information to be missed or inconsistently recorded

3. **Budget Tracking Difficulties**
   - Budget estimates and actual costs are tracked in separate Excel files
   - No automated comparison between estimated and actual costs
   - Manual process for budget reconciliation after project completion

4. **Follow-up and Timeline Management**
   - No systematic reminders for project milestones and follow-ups
   - Potential for tasks to fall through the cracks during busy periods
   - Manual tracking of project status and deadlines

5. **Documentation Consistency**
   - Varying formats and completeness of project documentation
   - No standardized process for project debriefs and reviews
   - Difficulty in retrieving historical project information

### Problems This System Solves

1. **Centralization of Information**
   - Creates a single hub for all project-related information
   - Reduces time spent searching for project details across platforms
   - Ensures all team members have access to the same information

2. **Workflow Automation**
   - Automates the creation of project documentation
   - Streamlines the project intake process
   - Reduces manual data entry and associated errors

3. **Improved Budget Management**
   - Facilitates easy comparison between estimated and actual costs
   - Provides reminders for budget reconciliation after shoots
   - Creates historical budget data for future project planning

4. **Enhanced Project Tracking**
   - Implements systematic reminders for project milestones
   - Ensures consistent follow-up on project tasks
   - Provides clear visibility into project status and deadlines

5. **Standardized Documentation**
   - Ensures consistent format and completeness of project documentation
   - Facilitates thorough project debriefs and reviews
   - Makes historical project information easily accessible

## How It Should Work

### User Experience Goals

1. **Intuitive and Efficient**
   - Minimize clicks and data entry required for common tasks
   - Present information in a clear, easily digestible format
   - Provide visual indicators of project status and upcoming deadlines

2. **Guided Workflow**
   - Lead users through the project management process step by step
   - Provide templates and defaults to speed up data entry
   - Offer contextual help and guidance where needed

3. **Flexible but Structured**
   - Allow for customization of project details when needed
   - Maintain consistent structure for easy comparison across projects
   - Balance automation with the ability to override when necessary

4. **Proactive Assistance**
   - Notify users of upcoming deadlines and required actions
   - Highlight discrepancies between estimated and actual costs
   - Suggest next steps based on project status

5. **Seamless Integration**
   - Work harmoniously with ClickUp as the backend data source
   - Integrate with email for sending project forms to Jake
   - Potentially connect with Google Calendar for shoot day scheduling

### Core Workflow

1. **Project Status Flow**
   - NEW_NOT_SENT
     * Initial project creation in local system
     * Complete Project Information Form
     * Create Budget Document
     * Create Production Overview document with potential shotlist
     * If shoot date known: Create Google Calendar event with document links
     * If no shoot date: Add to daily notifications
   
   - NEW_SENT
     * System sends email to Jake with project info for ClickUp entry
     * System sends emails to contractors with:
       - Rate proposals
       - Production Overview document
       - Project assignment requests
     * Track contractor responses and agreed rates
     * When shoot date is added later: Create/update Google Calendar event
   
   - ACTIVE
     * Triggered when ClickUp API finds matching project in Edit List
     * Match based on exact project name
     * Store ClickUp ID for reference
     * Pull in all subtasks under the matched ClickUp list item
     * Display ClickUp status colors in our Active state UI
   
   - COMPLETED
     * Project marked as done in ClickUp
     * Awaiting final payments/invoices
     * Track invoice receipts and payments
   
   - ARCHIVED
     * All contractor invoices paid
     * Client has fully paid
     * Project complete in all aspects

2. **Project Intake**
   - Capture essential project information (Client, Budget, Scope, Timeframe)
   - System validates that all required information is provided
   - Generate project form to be sent to Jake for ClickUp entry

2. **Contractor Management**
   - System sends legally binding agreement to contractors
   - Agreement template dynamically populated with project details
   - Contractor response workflow:
     * Access agreement at currentmedia.ca/projectname/contractoragreement
     * Confirm: Double confirmation required, acknowledging legal binding
     * Decline: Optional reason field for rejection
     * All responses stored with project records
   - Track payout rate (sent to contractor) vs chargeout rate
   - Store signed agreements with project

3. **Project Setup**
   - Once Jake adds the project to ClickUp, system pulls project data
   - Automatically generate budget documents and project overview
   - Create project timeline with key milestones and deadlines
   - Calendar Integration:
     * Match project names in Google Calendar
     * Auto-attach project documents to calendar events
     * No strict naming convention required (flexible matching)

4. **Invoice Management**
   - Gmail API integration for invoice processing
   - Auto-detect invoices in emails matching project names
   - Store/link invoices in project-specific storage
   - Track invoice status per contractor:
     * "Invoice not Received" (no hyperlink)
     * "Invoice Received" (hyperlink to invoice document)
     * "Invoice Paid" (links to invoice + payment receipt)
   - Clear visual status indicators in project view

3. **Project Tracking**
   - Display current project status and upcoming deadlines
   - Provide reminders for project milestones and required actions
   - Track changes to project scope, budget, or timeline

4. **Post-Shoot Process**
   - Remind user to reconcile estimated vs. actual costs
   - Capture actual expenses and compare to budget
   - Update project status and next steps

5. **Project Completion**
   - Guide user through project review and debrief process
   - Capture lessons learned and feedback
   - Archive project with all associated documentation

## Success Metrics

The system will be considered successful if it achieves:

1. **Time Savings**
   - Reduces time spent on project administration by at least 30%
   - Decreases the time required to set up new projects by 50%

2. **Improved Accuracy**
   - Reduces errors in project documentation by 90%
   - Ensures 100% of projects have complete and standardized documentation

3. **Better Budget Management**
   - Achieves 100% completion rate for budget reconciliation
   - Improves budget accuracy for future projects based on historical data

4. **Enhanced Follow-up**
   - Ensures no project milestones or deadlines are missed
   - Achieves 100% completion rate for project debriefs and reviews

5. **User Satisfaction**
   - Team members report the system is easy to use and helpful
   - System becomes the preferred method for managing video production projects
