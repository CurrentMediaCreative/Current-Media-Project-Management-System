# Project Brief: CurrentMedia Project Management System (PMS)

## Overview

A web-based project management system that integrates with ClickUp API to display and manage CurrentMedia's projects. The system will be hosted on Render.com and accessible at currentmedia.ca/pms.

## Core Requirements

### ClickUp Integration

- Read-only integration with ClickUp API
- Pull projects from a specific List in ClickUp
- Handle master projects and their subtasks
- Automatically create project pages based on ClickUp data

### Key Features

1. **Dashboard**

   - Overview of key projects
   - Metrics: total active projects, revenue from completed projects, revenue from active projects
   - Quick access to project details

2. **Projects Page**

   - Display all projects as cards
   - Search and sort functionality
   - Basic project information on cards (status, deadline, etc.)

3. **Project Detail Pages**

   - Comprehensive view of project data from ClickUp
   - URL structure: currentmedia.ca/pms/projects/[project-name]
   - Display all relevant ClickUp fields

4. **Local Document Management**
   - Create new projects through custom forms
   - Project Overview Form
   - Project Budget Breakdown
   - Production Breakdown
   - Attach documents to existing projects

### Technical Requirements

- Hosted on Render.com
- Connected to custom domain (currentmedia.ca/pms)
- Responsive design for various devices
- Secure authentication system
- Efficient data fetching from ClickUp API

## Project Scope

This is an MVP (Minimum Viable Product) focused on creating a simple but effective project tracking system. The goal is to avoid over-complication while providing a useful tool for tracking project progress and managing project-related documents.

## Success Criteria

- Successfully pull and display project data from ClickUp
- Provide accurate metrics on the dashboard
- Enable efficient project browsing and searching
- Allow creation and attachment of project documents
- Create an intuitive, user-friendly interface

## Future Considerations (Post-MVP)

- Enhanced reporting capabilities
- Team member management
- Timeline visualizations
- Client portal access
- Integration with other systems
