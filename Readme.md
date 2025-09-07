# Rydon

Rydon is a full-stack ride-hailing platform inspired by Uber, built with **React.js** for the frontend and **Node.js/Express** for the backend. It supports real-time ride requests, live tracking, OTP-based ride confirmation, and role-based authentication for both users and captains (drivers).

---

## 🚀 Features

- **User & Captain Registration/Login**
  - Secure JWT authentication for both roles
  - OTP-based registration for added security

- **Ride Booking & Management**
  - Users can book rides by entering pickup and destination addresses
  - Fare estimation for different vehicle types (car, auto, moto)
  - Real-time ride status updates

- **Live Location Tracking**
  - Users and captains share live GPS locations
  - Google Maps integration for displaying routes and markers
  - Dotted and solid route lines for visual clarity

- **Captain Dashboard**
  - Captains receive ride requests in real-time
  - Accept/decline rides and update ride status

- **OTP Ride Confirmation**
  - Users confirm ride start with a secure OTP
  - Prevents unauthorized ride starts

- **Logout & Token Blacklisting**
  - Secure logout with JWT token blacklisting

- **Responsive UI**
  - Modern, mobile-friendly design using Tailwind CSS

---

## 🛠️ Tech Stack

- **Frontend:** React.js, react-router, react-hot-toast, @react-google-maps/api, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), MySQL (optional), Socket.IO
- **Maps & Location:** Google Maps API, Geolocation API
- **Authentication:** JWT, OTP via email

---

## 📦 Project Structure

```
/Client
  /src
    /components      # Reusable UI components (LiveTracking, VehiclePanel, etc.)
    /pages           # Main pages (Home, Login, Signup, Riding, etc.)
    /context         # React Contexts for state management
    /utils           # Utility functions and wrappers

/server
  /controller        # Express route controllers
  /models            # Mongoose schemas and models
  /routes            # Express route definitions
  /db                # Database connection files (MongoDB, MySQL)
  /socket.js         # Socket.IO real-time logic
```

---

## ⚡ Quick Start

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/rydon.git
   cd rydon
   ```

2. **Setup environment variables**
   - Create `.env` files in both `/Client` and `/server` with required keys (see `.env.example`).

3. **Install dependencies**
   ```sh
   cd server && npm install
   cd ../Client && npm install
   ```

4. **Start the backend**
   ```sh
   cd ../server
   npm run dev
   ```

5. **Start the frontend**
   ```sh
   cd ../Client
   npm run dev
   ```

6. **Access the app**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌏 Live Tracking Example

- User and captain locations are shown as markers on the map.
- Dotted lines indicate the captain's route to the pickup point.
- Solid lines show the route from pickup to destination.

---

## 📝 API Documentation

See [`server/readme.md`](./server/readme.md) for full API docs.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄