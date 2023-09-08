# E-Commerce Backend Project

## Description

This project is an educational example of a backend service for an e-commerce platform. It uses Node.js, Express, and MongoDB, among other technologies from the MERN ecosystem, to create a RESTful API for managing products, carts, and user authentication.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)


## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Thayrov/Backend.git
    ```
2. Navigate to the project directory:
    ```bash
    cd your-repo-name
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Create a `.env.production` or `.env.development` files based on the `.env.example`  and fill in the environment variables.
5. Run the project:
    ```bash
    npm start
    ```
    or
    
     ```bash
    npm run dev
    ```

## Usage

After starting the server, you can use the following base URL to access the API:

```bash
http://localhost:PORT/api/
```

Replace `PORT` with the port number you specified in the `.env` file.

## API Documentation

The API documentation is available at:

```bash
http://localhost:PORT/apidocs
```

## Folder Structure

- `src/`: Source code
  - `config/`: Configuration files
  - `controllers/`: Route controllers
  - `dao/`: Data access objects
  - `dto/`: Data transfer objects
  - `middlewares/`: Custom middleware
  - `routes/`: API routes
  - `services/`: Business logic
- `docs/`: API documentation (Swagger)
- `.env`: Environment variables (do not commit)
- `README.md`: This file
- `package.json`: Project metadata and dependencies

## Environment Variables

# The port number the application will listen on
PORT=

# GitHub OAuth Credentials
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# MongoDB connection string
MONGO_URL=

# Secret for session storage
SESSION_SECRET=

# Type of persistence storage (e.g., 'memory', 'fs', 'mongo')
PERSISTANCE=

# Node environment (development or production)
NODE_ENV=

# Google email for some services like sending notifications, etc.
GOOGLE_EMAIL=

# Password for the Google email account
GOOGLE_PASS=


