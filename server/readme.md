# API Documentation

## User Routes

### Register User

- **Endpoint:** `POST /users/register`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "fullName": { "firstName": "John", "lastName": "Doe" },
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `201 Created`
    ```json
    { "success": true, "message": "User registered successfully", "user": { ... } }
    ```
  - `400 Bad Request` (validation error)
  - `409 Conflict` (user exists)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/users/register -H "Content-Type: application/json" -d '{"fullName":{"firstName":"John","lastName":"Doe"},"email":"john@example.com","password":"yourpassword"}'
  ```

---

### Login User

- **Endpoint:** `POST /users/login`
- **Description:** Login user and get JWT token.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "message": "User loggedIn", "token": "<jwt_token>", "user": { ... } }
    ```
  - `400 Bad Request` (validation error)
  - `401 Unauthorized` (invalid credentials)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/users/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"yourpassword"}'
  ```

---

### Get User Profile

- **Endpoint:** `GET /users/profile`
- **Description:** Get authenticated user's profile. Requires JWT.
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "message": "profile data fetched", "user": { ... } }
    ```
  - `401 Unauthorized` (no/invalid token)
- **Example:**
  ```sh
  curl -X GET http://localhost:5000/users/profile -H "Authorization: Bearer <jwt_token>"
  ```

---

### Logout User

- **Endpoint:** `GET /users/logout`
- **Description:** Logout user, blacklist token. Requires JWT.
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "message": "User logged out" }
    ```
  - `401 Unauthorized` (no/invalid token)
- **Example:**
  ```sh
  curl -X GET http://localhost:5000/users/logout -H "Authorization: Bearer <jwt_token>"
  ```

---

## Captain Routes

### Register Captain

- **Endpoint:** `POST /captains/register`
- **Description:** Register a new captain.
- **Request Body:**
  ```json
  {
    "fullName": { "firstName": "Jane", "lastName": "Smith" },
    "email": "jane@example.com",
    "password": "yourpassword",
    "vehicle": {
      "colour": "red",
      "plate": "XYZ123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
  ```
- **Response:**
  - `201 Created`
    ```json
    { "success": true, "message": "User created successfully", "captain": { ... } }
    ```
  - `400 Bad Request` (validation error or already registered)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/captains/register -H "Content-Type: application/json" -d '{"fullName":{"firstName":"Jane","lastName":"Smith"},"email":"jane@example.com","password":"yourpassword","vehicle":{"colour":"red","plate":"XYZ123","capacity":4,"vehicleType":"car"}}'
  ```

---

### Login Captain

- **Endpoint:** `POST /captains/login`
- **Description:** Login captain and get JWT token.
- **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "message": "Logged in successfully", "token": "<jwt_token>" }
    ```
  - `400 Bad Request` (validation error)
  - `401 Unauthorized` (invalid credentials)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/captains/login -H "Content-Type: application/json" -d '{"email":"jane@example.com","password":"yourpassword"}'
  ```

---

### Get Captain Profile

- **Endpoint:** `GET /captains/profile`
- **Description:** Get authenticated captain's profile. Requires JWT.
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "message": "Profile fetched successfully", "data": { ... } }
    ```
  - `401 Unauthorized` (no/invalid token)
- **Example:**
  ```sh
  curl -X GET http://localhost:5000/captains/profile -H "Authorization: Bearer <jwt_token>"
  ```

---

### Logout Captain

- **Endpoint:** `GET /captains/logout`
- **Description:** Logout captain, blacklist token. Requires JWT.
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "message": "Captain logged out successfully" }
    ```
  - `401 Unauthorized` (no/invalid token)
- **Example:**
  ```sh
  curl -X GET http://localhost:5000/captains/logout -H "Authorization: Bearer <jwt_token>"
  ```