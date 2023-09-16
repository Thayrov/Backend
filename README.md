# E-Commerce Backend Project

## Description

This project is an educational example of a backend service for an e-commerce platform. It uses Node.js, Express, and MongoDB, among other technologies from the MERN ecosystem, to create a RESTful API for managing products, carts, and user authentication.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Thayrov/Backend.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Backend
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
  - `docs/`: API documentation (Swagger)
  - `dto/`: Data transfer objects
  - `middlewares/`: Custom middleware
  - `routes/`: API routes
  - `services/`: Business logic
  - `views/`: Views made with handlebars
- `.env`: Environment variables (do not commit)
- `.gitignore`: Confirm .env file location in here
- `package.json`: Project metadata and dependencies
- `app.js`: App starting file
- `README.md`: This file

## Environment Variables

### The port number the application will listen on
```bash
PORT=
```
### GitHub OAuth Credentials
```bash
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```
### MongoDB connection string
```bash
MONGO_URL=
```
### Secret for session storage
```bash
SESSION_SECRET=
```
### Type of persistence storage (e.g., 'memory', 'fs', 'mongo')
```bash
PERSISTANCE=
```
### Node environment (development or production)
```bash
NODE_ENV=
```
### Google email for some services like sending notifications, etc.
```bash
GOOGLE_EMAIL=
```
### Password for the Google email account
```bash
GOOGLE_PASS=
```

## Contribution Guidelines
Feel free to open an issue or submit a pull request if you find any bugs or have suggestions for improvements.

## License
This project is licensed under the MIT License.

## Acknowledgments
Big thanks to FreeCodeCamp for providing these learning resources.

## Contact
For any further questions or collaboration, feel free to get in touch via [email](mailto:contact@thayrov.com).