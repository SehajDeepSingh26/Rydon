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
    "password": "yourpassword",
    "otp": "123456"
  }
  ```
- **Response:**
  - `201 Created`
    ```json
    { "success": true, "message": "User registered successfully", "user": { ... } }
    ```
  - `400 Bad Request` (validation error)
  - `409 Conflict` (user exists)
  - `404 Not Found` (OTP not found)
  - `403 Forbidden` (invalid OTP)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/users/register -H "Content-Type: application/json" -d '{"fullName":{"firstName":"John","lastName":"Doe"},"email":"john@example.com","password":"yourpassword","otp":"123456"}'
  ```

---

### Send OTP (User)

- **Endpoint:** `POST /users/send-otp`
- **Description:** Send OTP to user's email for registration.
- **Request Body:**
  ```json
  { "email": "john@example.com" }
  ```
- **Response:**
  - `201 Created`
    ```json
    { "success": true, "message": "Otp sent successfully", "Otp": "123456" }
    ```
  - `404 Not Found` (email not found)
  - `409 Conflict` (user already present)
  - `500 Internal Server Error` (server error)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/users/send-otp -H "Content-Type: application/json" -d '{"email":"john@example.com"}'
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
    },
    "otp": "123456"
  }
  ```
- **Response:**
  - `201 Created`
    ```json
    { "success": true, "message": "User created successfully", "captain": { ... } }
    ```
  - `400 Bad Request` (validation error or already registered)
  - `404 Not Found` (OTP not found)
  - `403 Forbidden` (invalid OTP)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/captains/register -H "Content-Type: application/json" -d '{"fullName":{"firstName":"Jane","lastName":"Smith"},"email":"jane@example.com","password":"yourpassword","vehicle":{"colour":"red","plate":"XYZ123","capacity":4,"vehicleType":"car"},"otp":"123456"}'
  ```

---

### Send OTP (Captain)

- **Endpoint:** `POST /captains/send-otp`
- **Description:** Send OTP to captain's email for registration.
- **Request Body:**
  ```json
  { "email": "jane@example.com" }
  ```
- **Response:**
  - `201 Created`
    ```json
    { "success": true, "message": "OTP sent successfully", "OTP": "123456" }
    ```
  - `404 Not Found` (email not found)
  - `400 Bad Request` (captain already exists)
  - `500 Internal Server Error` (server error)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/captains/send-otp -H "Content-Type: application/json" -d '{"email":"jane@example.com"}'
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

---

## Ride Routes

### Get Fare

- **Endpoint:** `GET /ride/get-fare?pickup=...&destination=...`
- **Description:** Get fare estimates for different vehicle types.
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "fares": { "car": 100, "auto": 80, "moto": 60 } }
    ```
  - `500 Internal Server Error` (server error)
- **Example:**
  ```sh
  curl -X GET "http://localhost:5000/ride/get-fare?pickup=LocationA&destination=LocationB"
  ```

---

### Create Ride

- **Endpoint:** `POST /ride/create`
- **Description:** Create a new ride request.
- **Request Body:**
  ```json
  {
    "pickup": "LocationA",
    "destination": "LocationB",
    "vehicleType": "car"
  }
  ```
- **Response:**
  - `201 Created`
    ```json
    { "success": true, "ride": { ... } }
    ```
  - `400 Bad Request` (validation error)
  - `500 Internal Server Error` (server error)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/ride/create -H "Content-Type: application/json" -d '{"pickup":"LocationA","destination":"LocationB","vehicleType":"car"}'
  ```

---

### Accept Ride

- **Endpoint:** `POST /ride/accept`
- **Description:** Captain accepts a ride.
- **Request Body:**
  ```json
  {
    "ride": { "_id": "rideId", ... },
    "captain": "captainId"
  }
  ```
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "message": "Ride confirmed." }
    ```
  - `500 Internal Server Error` (server error)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/ride/accept -H "Content-Type: application/json" -d '{"ride":{"_id":"rideId"},"captain":"captainId"}'
  ```

---

### Fetch Ride Details

- **Endpoint:** `POST /ride/details`
- **Description:** Get all details of a ride.
- **Request Body:**
  ```json
  { "rideId": "rideId" }
  ```
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "ride": { ... } }
    ```
  - `500 Internal Server Error` (server error)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/ride/details -H "Content-Type: application/json" -d '{"rideId":"rideId"}'
  ```

---

### Confirm Ride

- **Endpoint:** `POST /ride/confirm`
- **Description:** Confirm ride with OTP.
- **Request Body:**
  ```json
  { "rideId": "rideId", "otp": "123456" }
  ```
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "message": "Ride Started, Happy Journey !!" }
    ```
  - `400 Bad Request` (missing rideId or otp)
  - `401 Unauthorized` (invalid OTP)
  - `500 Internal Server Error` (server error)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/ride/confirm -H "Content-Type: application/json" -d '{"rideId":"rideId","otp":"123456"}'
  ```

---

### Finish Ride

- **Endpoint:** `POST /ride/finish`
- **Description:** Mark ride as completed.
- **Request Body:**
  ```json
  { "rideId": "rideId", "captainId": "captainId" }
  ```
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "message": "Ride Completed" }
    ```
  - `500 Internal Server Error` (server error)
- **Example:**
  ```sh
  curl -X POST http://localhost:5000/ride/finish -H "Content-Type: application/json" -d '{"rideId":"rideId","captainId":"captainId"}'
  ```

---

## Maps Routes

### Get Coordinates

- **Endpoint:** `GET /maps/get-cordinates?address=...`
- **Description:** Get latitude and longitude for an address.
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "ltd": 12.34, "lng": 56.78 }
    ```
  - `400 Bad Request` (validation error)
  - `500 Internal Server Error` (server error)
- **Example:**
  ```sh
  curl -X GET "http://localhost:5000/maps/get-cordinates?address=SomePlace"
  ```

---

### Get Distance & Time

- **Endpoint:** `GET /maps/get-distance-time?origin=...&destination=...`
- **Description:** Get distance and time between two locations.
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "distance": { ... }, "duration": { ... } }
    ```
  - `400 Bad Request` (validation error)
  - `404 Not Found` (no routes found)
  - `500 Internal Server Error` (server error)
- **Example:**
  ```sh
  curl -X GET "http://localhost:5000/maps/get-distance-time?origin=PlaceA&destination=PlaceB"
  ```

---

### Get AutoComplete Suggestions

- **Endpoint:** `GET /maps/get-suggestions?input=...`
- **Description:** Get location autocomplete suggestions.
- **Response:**
  - `200 OK`
    ```json
    { "success": true, "suggestions": [ ... ] }
    ```
  - `400 Bad Request` (validation error)
  - `404 Not Found` (no input found)
  - `500 Internal Server Error` (server error)
- **Example:**
  ```sh
  curl -X GET "http://localhost:5000/maps/get-suggestions?input=SomePlace"
  ```

---

## Validation & Error Handling

- All endpoints validate required fields and respond with appropriate error messages and status codes.
- If a required field is missing or invalid, a `400 Bad Request` is returned with details.
- Authentication is required for protected routes (profile, logout, ride actions).
- OTP is required for registration and confirmation where applicable.

---