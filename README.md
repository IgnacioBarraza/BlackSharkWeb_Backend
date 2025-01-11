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

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL](https://www.mysql.com/)
- A package manager like `npm`, `yarn` or `pnpm`

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/IgnacioBarraza/BlackSharkWeb_Backend.git
   cd BlackSharkWeb_Backend
   ```

2. Install dependencies:

   ```sh
   # NPM
   npm install
   # Yarn
   yarn install
   # PNPM
   pnpm install
   ```

3. Create a `.env` file in the root directory with the following keys for the database configuration:

   ```plaintext
   PORT=3000

   DB_NAME=<your_database_name>
   DB_HOST=<db_host> // By default localhost
   DB_PASSWORD=<your_db_password>
   DB_PORT=<db_port> // By default 3306
   DB_USER=<your_db_user>
   NODE_ENV=dev // For logs purpose only

   SECRET=
   REFRESH_TOKEN=

   EMAIL=
   CLIENT_ID=
   CLIENT_SECRET=
   ```

4. Start the MySQL server and ensure your database is accessible.

5. Run database migrations (if applicable).

### Running the Application

1. Run the application:
    ```sh
    # NPM
    npm run dev
    # Yarn
    yarn dev
    #PNPM
    pnpm run dev
    ```

2. The server will run by default on `http://localhost:3000`. You can change the port in the `.env` file.

### Scripts

- **Start**: Starts the application in production mode.
   ```sh
   npm start
   ```
- **Development**: Starts the application in development mode with live reloading.
   ```sh
   npm run dev
   ```

## Directory Structure
For this project is used the **Layered architecture**

```
BlackSharkWeb_Backend/
├── src
│   ├── config
│   │   └── data-source.ts
│   ├── controllers
│   │   └── **.ts
│   ├── dtos
│   │   └── **.ts
│   ├── entities
│   │   └── **.ts
│   ├── middlewares
│   │   ├── errorHandler.ts
│   │   ├── validationMiddleware.ts
│   │   └── validateUser.ts
│   ├── routes
│   │   └── **.ts
│   ├── services
│   │   └── **.ts
│   ├── utils
│   │   └── validation.ts
│   ├── app.ts
│   └── index.ts
├── tests
│   └── **.test.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

- **config**: Contains configuration files, such as the database configuration.
- **controllers**: Handles HTTP requests and responses.
- **dtos**: Data Transfer Objects for request validation and transformation.
- **entities**: Contains the core business entities and domain models.
- **middlewares**: Custom middleware functions for error handling and validation.
- **routes**: Defines the API routes.
- **services**: Contains the business logic of the application.
- **utils**: Utility functions and helpers.
- **tests**: Contains unit and integration tests.

---

## Example Endpoints

### Update Service

- **URL**: `api/service/:id/update`
- **Method**: `PUT`
- **Request Body**:
    ```json
    {
        "name": "New Service Name",
        "priceo": 100,
        "description": "New Description",
        "imageUrl": "https://example.com/new_image.jpg"
    }
    ```
- **Response**:
    ```json
    {
        "uid": "",
        "name": "New Service Name",
        "price": 100,
        "description": "New Description",
        "imageUrl": "https://example.com/new_image.jpg"
    }
    ```

### Running Tests

To run the tests, use the following command:
```sh
# NPM
npm test
# Yarn
yarn test
# PNPM
pnpm test
```

## Debugging Tips

1. **Environment Variables**:
   Ensure all required variables in the `.env` file are set correctly.
   
2. **Database Connection**:
   If the application can't connect to the database:
   - Verify `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `.env`.
   - Test the connection manually using a database client like MySQL Workbench or CLI tools.

3. **Port Conflicts**:
   If port `3000` is already in use, change the `PORT` in `.env` or stop the other application using the port.

4. **Logs**:
   Use the application logs for debugging. In development mode, detailed error logs are provided in the terminal.

## Future Improvements

- [ ] Implement robust unit and integration tests.
- [ ] Create detailed API documentation with Swagger.
- [ ] Set up CI/CD pipelines for automated deployment.

## Support

If you encounter any issues, feel free to create an issue on the [GitHub repository](https://github.com/IgnacioBarraza/BlackSharkWeb_Backend/issues).


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
