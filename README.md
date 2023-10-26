# E-Commerce Backend Project

## Description

This project is an educational example of a backend service for an e-commerce platform. It uses Node.js, Express, and MongoDB, among other technologies from the MERN ecosystem, to create a RESTful API for managing products, carts, and user authentication.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
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
- `test/`: Tests code
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
GITHUB_CALLBACK_URL=
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

## Endpoints

### Views endpoints

get http://localhost:8080

get http://localhost:8080/view/products/

get http://localhost:8080/view/products/:pid

get http://localhost:8080/login

get http://localhost:8080/register

get http://localhost:8080/profile

get http://localhost:8080/admin

get http://localhost:8080/logout

### Products API endpoints

post http://localhost:8080/api/products

get http://localhost:8080/api/products

get http://localhost:8080/api/products/:pid

put http://localhost:8080/api/products/:pid

delete http://localhost:8080/api/products/:pid

### Carts API endpoints

post http://localhost:8080/api/carts

post http://localhost:8080/api/carts/:cid/product/:pid

post http://localhost:8080/api/carts/:cid/purchase

get http://localhost:8080/api/carts/:cid

put http://localhost:8080/api/carts/:cid

put http://localhost:8080/api/carts/:cid/products/:pid

delete http://localhost:8080/api/carts/:cid/products/:pid

delete http://localhost:8080/api/carts/:cid

### Users API endpoints

post http://localhost:8080/api/users/login

post http://localhost:8080/api/users/request-password-reset

post http://localhost:8080/api/users/reset-password

post http://localhost:8080/api/users/register

post http://localhost:8080/api/users/:uid/documents

get http://localhost:8080/api/users/github

get http://localhost:8080/api/users/githubcallback

get http://localhost:8080/api/users/current

get http://localhost:8080/api/users/forgot-password

get http://localhost:8080/api/users/reset-password

get http://localhost:8080/api/users/all-users

put http://localhost:8080/api/users/premium/:uid

delete http://localhost:8080/api/users/cleanup-users

### Other endpoints

get http://localhost:8080/mockingproducts

get http://localhost:8080/error

get http://localhost:8080/loggerTest

use http://localhost:8080/apidocs

get http://localhost:8080/chat

post http://localhost:8080/chat


## Contribution Guidelines
Feel free to open an issue or submit a pull request if you find any bugs or have suggestions for improvements.

## License
This project is licensed under the MIT License.

## Acknowledgments
Big thanks to <a href="https://www.coderhouse.com" target="_blank">Coderhouse</a> for providing the learning resources.

## Contact
For any further questions or collaboration, feel free to get in touch via [email](mailto:contact@thayrov.com).
