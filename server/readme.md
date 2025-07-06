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