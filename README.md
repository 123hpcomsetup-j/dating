# Dating Service App

This repository contains a simple full-stack web application for an online dating platform.

## Features
- Node.js (Express) backend with JWT authentication
- SQLite database storing users with roles: `admin`, `provider`, `user`
- React-based frontend (via CDN) for login and signup
- Role-based redirection after login

## Running the project
1. Ensure Node.js is installed.
2. Install dependencies in the `server` folder:
   ```bash
   cd server && npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Open `client/index.html` in a browser.

The server stores users in `server/database.sqlite` and exposes `/signup`, `/login`, and `/profile` endpoints.
