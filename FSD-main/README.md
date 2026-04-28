# Volunteer Connect (MERN)

A simple beginner-friendly MERN app that connects volunteers with NGO opportunities.

## Tech Stack

- MongoDB + Mongoose
- Express + Node.js
- React + React Router
- JWT authentication
- Axios for API calls
- Bootstrap for simple UI

## Project Structure

```text
Volunteer-Connect/
  backend/
    config/
      db.js
    controllers/
      applicationController.js
      authController.js
      opportunityController.js
    middleware/
      authMiddleware.js
    models/
      Application.js
      Opportunity.js
      User.js
    routes/
      applicationRoutes.js
      authRoutes.js
      opportunityRoutes.js
    .env.example
    package.json
    server.js
  frontend/
    src/
      components/
        NavBar.jsx
        ProtectedRoute.jsx
      context/
        AuthContext.jsx
      pages/
        Home.jsx
        Login.jsx
        Register.jsx
        NgoDashboard.jsx
        UserDashboard.jsx
      services/
        api.js
      App.jsx
      main.jsx
      index.css
    index.html
    package.json
```

## Backend Setup

1. Open terminal in `backend`.
2. Install packages:
   - `npm install`
3. Create `.env` from `.env.example`.
4. Start backend:
   - `npm run dev`

## Frontend Setup

1. Open terminal in `frontend`.
2. Install packages:
   - `npm install`
3. Start frontend:
   - `npm run dev`

## Sample API Calls

Base URL: `http://localhost:5000`

### Auth

- **Register**
  - `POST /api/auth/register`
  - Body:
    ```json
    {
      "name": "Test NGO",
      "email": "ngo@example.com",
      "password": "123456",
      "role": "NGO"
    }
    ```

- **Login**
  - `POST /api/auth/login`
  - Body:
    ```json
    {
      "email": "ngo@example.com",
      "password": "123456"
    }
    ```

### Opportunities

- **Get all opportunities (public)**
  - `GET /api/opportunities`

- **Create opportunity (NGO only)**
  - `POST /api/opportunities`
  - Header: `Authorization: Bearer <token>`
  - Body:
    ```json
    {
      "title": "Beach Cleanup",
      "description": "Help clean the city beach.",
      "date": "2026-05-15",
      "location": "Mumbai"
    }
    ```

### Applications

- **Apply to opportunity (User only)**
  - `POST /api/applications`
  - Header: `Authorization: Bearer <token>`
  - Body:
    ```json
    {
      "opportunityId": "OPPORTUNITY_OBJECT_ID"
    }
    ```

- **Get my applications (User only)**
  - `GET /api/applications/me`
  - Header: `Authorization: Bearer <token>`
