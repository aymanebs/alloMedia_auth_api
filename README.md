# Authentication API

## Description

This is a robust authentication API built with Express.js and MongoDB. It provides secure user registration, login with OTP (One-Time Password) verification, email verification, and password reset functionality.

## Features

- User registration with email verification
- Secure login with OTP verification
- Password reset functionality
- JWT (JSON Web Token) based authentication
- Bcrypt password hashing
- Email notifications using Nodemailer

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose ORM
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Nodemailer for sending emails
- Joi for input validation
- dotenv for environment variable management

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- MongoDB (v4.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/aymanebs/alloMedia_auth_api.git
   ```

2. Navigate to the project directory:
   ```
   cd alloMedia_auth_api
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password
   SESSION_SECRET=your_session_secret
   ```

   Replace the placeholder values with your actual MongoDB URI, JWT secret, and email credentials.

## Usage

1. Start the server:
   ```
   npm start
   ```

2. The API will be available at `http://localhost:3000` (or the port you specified in the .env file).

## API Endpoints

- POST `/register`: Register a new user
- POST `/register/verify-email/:id/:token`: Verify user's email
- POST `/login`: Login user (sends OTP)
- POST `/login/verify-otp`: Verify OTP and complete login
- POST `/resetPassword`: Request password reset (sends OTP)
- POST `/resetPassword/verifyOtp`: Verify OTP for password reset
- POST `/resetPassword/updatePassword`: Update password after OTP verification

## Security Features

- Email verification for new user registrations
- OTP verification for login and password reset
- Secure password hashing using bcrypt
- JWT-based authentication
- Input validation using Joi

## Contributing

Contributions to this project are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

