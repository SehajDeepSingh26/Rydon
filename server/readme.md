# User Registration API Documentation

## Endpoint

`POST /users/register`

## Description

Registers a new user in the system. This endpoint validates the input, hashes the password, creates a new user, and returns an authentication token along with the user data.

## Request Body

Send a JSON object with the following structure:

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

### Field Requirements

- `fullName.firstName` (string, required, min 3 characters)
- `fullName.lastName` (string, required, min 3 characters)
- `email` (string, required, valid email format, min 5 characters)
- `password` (string, required, min 6 characters)

## Responses

### Success

- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "_id": "user_id",
      "fullName": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "email": "john.doe@example.com",
      "socketId": null,
      "__v": 0
    },
    "success": true,
    "message": "User registered successfully"
  }
  ```

### Validation Error

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "First Name must be 3 characters longer",
        "param": "fullName.firstName",
        "location": "body"
      },
      ...
    ]
  }
  ```

### Server Error

- **Status Code:** `500 Internal Server Error`
- **Body:**
  ```json
  {
    "success": false,
    "message": "Error while registering user",
    "error": {}
  }
  ```

## Example Request

```sh
curl -X POST http://localhost:5000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {"firstName": "John", "lastName": "Doe"},
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }'
```

---

# User Login API Documentation

## Endpoint

`POST /users/login`

## Description

Authenticates a user and returns a JWT token along with user data.

## Request Body

Send a JSON object with the following structure:

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

### Field Requirements

- `email` (string, required, valid email format)
- `password` (string, required, min 6 characters)

## Responses

### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "message": "Login successful",
    "token": "<jwt_token>",
    "user": {
      "_id": "user_id",
      "fullName": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "email": "user@example.com"
    }
  }
  ```

### Validation Error

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid email",
        "param": "email",
        "location": "body"
      }
    ]
  }
  ```

### Unauthorized

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

## Example Request

```sh
curl -X POST http://localhost:5000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'
```

---

# User Profile API Documentation

## Endpoint

`GET /users/profile`

## Description

Fetches the authenticated user's profile data. Requires a valid JWT token in the request (usually sent as a cookie or in the `Authorization` header).

## Authentication

- **Required:** Yes (JWT token)

## Responses

### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "success": true,
    "message": "profile data fetched",
    "user": {
      "_id": "user_id",
      "fullName": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "email": "user@example.com",
      "socketId": null,
      "__v": 0
    }
  }
  ```

### Unauthorized

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Not authorized, token failed"
  }
  ```

### Server Error

- **Status Code:** `500 Internal Server Error`
- **Body:**
  ```json
  {
    "message": "Error occured while fetching profile data"
  }
  ```

## Example Request

```sh
curl -X GET http://localhost:5000/users/profile \
  -H "Authorization: Bearer <jwt_token>"
```

---

# User Logout API Documentation

## Endpoint

`GET /users/logout`

## Description

Logs out the authenticated user by clearing the authentication token cookie and blacklisting the token.

## Authentication

- **Required:** Yes (JWT token)

## Responses

### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "success": true,
    "message": "User logged out"
  }
  ```

### Unauthorized

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Not authorized, token failed"
  }
  ```

## Example Request

```sh
curl -X GET http://localhost:5000/users/logout \
  -H "Authorization: Bearer <jwt_token>"
```