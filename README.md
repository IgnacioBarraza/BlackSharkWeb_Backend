# BlackSharkWeb Backend

This repository contains the backend for the **BlackSharkWeb** application, built with Node.js and MySQL. It handles API requests, authentication, and database interactions for the BlackSharkWeb platform.

## Features

- User authentication (email-based).
- MySQL database integration.
- Secure environment variables for sensitive data.
- RESTful API architecture.

## Getting Started

Follow the steps below to set up and run the backend locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/)
- A package manager like `npm` or `yarn`

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/IgnacioBarraza/BlackSharkWeb_Backend.git
   cd BlackSharkWeb_Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the `.env` file with the following keys:

   ```plaintext
   PORT=3001

   MYSQLDATABASE=
   MYSQLHOST=
   MYSQLPASSWORD=
   MYSQLPORT=
   MYSQLUSER=
   MYSQL_DATABASE=

   SECRET=

   EMAIL=
   CLIENT_ID=
   CLIENT_SECRET=
   REFRESH_TOKEN=
   ```

   - Replace the placeholders with your actual values:
     - **MYSQL** variables for database connection.
     - **SECRET** for authentication token signing.
     - **EMAIL**, **CLIENT_ID**, **CLIENT_SECRET**, and **REFRESH_TOKEN** for email service configuration.

4. Start the MySQL server and ensure your database is accessible.

5. Run database migrations (if applicable).

### Running the Application

1. Start the server:

   ```bash
   npm start
   ```

2. The server will run by default on `http://localhost:3001`. You can change the port in the `.env` file.

### Scripts

- **Start**: Starts the application in production mode.
   ```bash
   npm start
   ```
- **Development**: Starts the application in development mode with live reloading.
   ```bash
   npm run dev
   ```

## Project Structure

```
BlackSharkWeb_Backend/
├── src/
│   ├── controllers/    # Handles API request logic
│   ├── models/         # Database models
│   ├── routes/         # API route definitions
│   ├── utils/          # Utility functions
│   ├── middleware/     # Middleware logic
│   └── app.js          # Main app entry point
├── .env                # Environment variables
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## Environment Variables

The application requires the following environment variables in the `.env` file:

| Variable         | Description                           |
|-------------------|---------------------------------------|
| `PORT`           | The port the server will run on       |
| `MYSQLDATABASE`   | Name of the MySQL database           |
| `MYSQLHOST`       | Host address of the MySQL database   |
| `MYSQLPASSWORD`   | Password for the MySQL user          |
| `MYSQLPORT`       | Port number for the MySQL database   |
| `MYSQLUSER`       | Username for the MySQL database      |
| `SECRET`          | Secret key for token authentication  |
| `EMAIL`           | Sender email address                |
| `CLIENT_ID`       | OAuth client ID for email service    |
| `CLIENT_SECRET`   | OAuth client secret for email service|
| `REFRESH_TOKEN`   | OAuth refresh token for email service|

---

## API Endpoints

### Authentication
| Method | Endpoint       | Description              |
|--------|----------------|--------------------------|
| POST   | `/auth/login`  | Logs in a user.          |
| POST   | `/auth/signup` | Registers a new user.    |
<!-- | POST   | `/auth/refresh`| Refreshes the auth token.|

### User Management
| Method | Endpoint       | Description              |
|--------|----------------|--------------------------|
| GET    | `/users`       | Retrieves all users.     |
| GET    | `/users/:id`   | Retrieves a user by ID.  |
| PUT    | `/users/:id`   | Updates user information.|
| DELETE | `/users/:id`   | Deletes a user by ID.    |

### Example Routes
| Method | Endpoint          | Description                    |
|--------|--------------------|--------------------------------|
| GET    | `/example`         | Example route for testing.    |
| POST   | `/example/create`  | Creates an example resource.  |
| DELETE | `/example/:id`     | Deletes an example resource.  |

*Note: Add any additional endpoints and their descriptions as needed.* -->

## Debugging Tips

1. **Environment Variables**:
   Ensure all required variables in the `.env` file are set correctly.
   
2. **Database Connection**:
   If the application can't connect to the database:
   - Verify `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, and `MYSQLDATABASE` in `.env`.
   - Test the connection manually using a database client like MySQL Workbench or CLI tools.

3. **Port Conflicts**:
   If port `3001` is already in use, change the `PORT` in `.env` or stop the other application using the port.

4. **Logs**:
   Use the application logs for debugging. In development mode, detailed error logs are provided in the terminal.

<!-- ## Future Improvements

- [ ] Implement robust unit and integration tests.
- [ ] Add rate limiting for security.
- [ ] Create detailed API documentation with Swagger.
- [ ] Set up CI/CD pipelines for automated deployment. -->

## Support

If you encounter any issues, feel free to create an issue on the [GitHub repository](https://github.com/IgnacioBarraza/BlackSharkWeb_Backend/issues).

You can also contact me via email: **ignacio.barraza.rioja@gmail.com**

---

### Acknowledgments

- Thanks to the developers of the open-source libraries used in this project.
- Special thanks to everyone contributing to the project and providing feedback.

---

### Additional Notes

- Make sure to keep your `.env` file private and do not expose it in your repository. Use `.gitignore` to ensure it is not accidentally committed.
- Consider using services like [Docker](https://www.docker.com/) to containerize and deploy the application for production use.

---

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
Happy Coding! 🚀
