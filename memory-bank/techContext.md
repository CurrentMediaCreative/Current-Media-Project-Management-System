# Technical Context: CurrentMedia Project Management System

## Technologies Used

### Frontend

- **React**: For building the user interface
- **React Router**: For page navigation
- **Tailwind CSS**: For styling
- **Axios**: For API requests

### Backend

- **Node.js/Express**: For the server
- **MongoDB**: For document storage
- **JWT**: For simple authentication

### Development & Deployment

- **Git/GitHub**: For version control
- **Render.com**: For hosting the application
- **MongoDB Atlas**: For database hosting

## Development Setup

### Local Development Environment

1. **Node.js**: v18.x or later
2. **npm**: v9.x or later
3. **Git**: For version control

### Project Structure

```
currentmedia-pms/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   └── src/                # React source code
│
├── server/                 # Backend Node.js/Express application
│   └── src/                # Server source code
│
└── README.md               # Project documentation
```

### Environment Variables

#### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

#### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/currentmedia-pms
JWT_SECRET=your_jwt_secret
CLICKUP_CLIENT_ID=your_clickup_client_id
CLICKUP_CLIENT_SECRET=your_clickup_client_secret
CLICKUP_REDIRECT_URI=http://localhost:3000
```

## Technical Constraints

### ClickUp API Considerations

- **Rate Limits**: Be mindful of ClickUp API rate limits
- **Authentication**: OAuth 2.0 flow for authorization
- **Data Structure**: Need to adapt to ClickUp's task structure

### Render.com Considerations

- Free tier has limitations (sleep after inactivity)
- Configure proper build commands for deployment

### Security Basics

- Secure authentication
- HTTPS for all communications
- Input validation

## MVP Technical Approach

For the MVP, we'll focus on:

1. **Simple Architecture**: Minimize complexity
2. **Core Features First**: Focus on essential ClickUp integration
3. **Iterative Development**: Build incrementally
4. **Performance**: Keep the application responsive
5. **Maintainability**: Clean, well-documented code

This simplified technical context provides the essential information needed for MVP development without overcomplicating the initial build. We can expand and refine the technical approach as the project evolves.
