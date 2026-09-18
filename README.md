# CampusHub

CampusHub

CampusHub is a student-focused marketplace made for college campuses.

It provides a single platform where students can buy, sell, rent, and exchange products and rooms within their campus community. The idea is to make it easier for students to find useful items from other students instead of searching through different WhatsApp groups or other platforms.

🌐 Live Website

CampusHub:
https://campushub-marketplace.netlify.app/

📂 GitHub Repository

https://github.com/kIRTIRAJSHARMA/CampusHub

About the Project

CampusHub is a full-stack web application designed around the needs of college students.

Students can use the platform to:

Browse products listed by other students
Sell products they no longer need
Rent or exchange items
List rooms or accommodation-related listings
Create an account and log in securely
View product details
Upload product images
Search and explore available listings
Make payments through integrated payment options

The main goal is to create a campus-specific marketplace where transactions and communication can happen within the student community.

Why CampusHub?

College students frequently buy things such as:

Books
Electronics
Furniture
Accessories
Study materials
Hostel essentials
Cycles
Other used products

After a student no longer needs these items, finding another student who needs them can be difficult.

CampusHub tries to solve this problem by providing one place where students can list and discover these products.

Instead of depending completely on WhatsApp groups or random social media posts, students can use CampusHub to browse organized listings.

Features
👤 User Authentication

Users can create an account and log in to CampusHub.

The project includes:

User registration
Login
Password protection
JWT-based authentication
Google authentication

Passwords are securely handled using bcryptjs, while JWT is used for authentication and authorization.

🛍️ Product Marketplace

Users can:

Add products
View products
View product details
Upload product images
Manage their listings
Browse products listed by other users

The marketplace is designed specifically around products that students commonly buy, sell, rent, or exchange.

🏠 Room Listings

CampusHub also supports room-related listings, allowing users to post and discover accommodation-related options.

📷 Image Uploads

Product images are handled using Cloudinary.

This avoids storing large image files directly inside the application database.

🔐 Security

The backend includes several security-related packages and middleware, including:

JWT authentication
Password hashing
Helmet
CORS
Express Rate Limit
Input validation
📱 Responsive Interface

The frontend is built with React and styled using Tailwind CSS so that the application can be used across different screen sizes.

Tech Stack
Frontend
React
Vite
JavaScript
React Router
Tailwind CSS
Axios
Framer Motion
React Icons
React Hot Toast
Google OAuth

The frontend dependencies and build configuration are available in the frontend/package.json file.

Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcryptjs
Cloudinary
Razorpay
Stripe
Multer
Google Auth Library
Helmet
CORS

The backend uses Express and Mongoose and contains authentication, database, image-upload, payment, and security-related dependencies.

Database

MongoDB

Mongoose is used in the backend to communicate with MongoDB.

Project Structure
CampusHub/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── ...
│   │
│   └── package.json
│
├── netlify.toml
├── package.json
└── README.md

The repository is separated into frontend and backend, with the root package providing commands for running each part of the project.

How the Application Works

The application is divided into two main parts.

Frontend

The React frontend provides the user interface.

When a user performs an action such as logging in, viewing products, creating a listing, or making a payment, the frontend communicates with the backend through API requests.

Backend

The Express backend handles:

Authentication
User management
Product management
Room listings
Database operations
Image uploads
Payment-related operations
API requests

The backend connects to MongoDB and starts the Express server through src/server.js.

Database

MongoDB stores application data such as users and marketplace listings.

Image Storage

Cloudinary is used for storing uploaded images.

Deployment

CampusHub uses separate hosting for the frontend and backend.

Frontend — Netlify

The frontend is deployed on Netlify.

Live website:

https://campushub-marketplace.netlify.app/

The repository contains a netlify.toml configuration that tells Netlify to use the frontend directory as the build directory and publish the generated dist folder.

[build]
base = "frontend"
command = "npm run build"
publish = "dist"
Backend — Render

The backend is hosted separately on Render.

This is necessary because Netlify is being used for the frontend while the Express API needs a server environment to run continuously.

The frontend communicates with the deployed backend through API requests.

Database — MongoDB

MongoDB is used as the application's database.

Image Storage — Cloudinary

Cloudinary is used for storing product and other uploaded images.

Why Does It Take Some Time to Show Products?

If the website has not been opened for some time, you may notice that the products take a little while to appear.

This is mainly because the backend is hosted on Render.

The backend may go into an inactive/sleep state when it has not received requests for some time, depending on the Render service configuration.

When someone opens CampusHub and the frontend makes its first API request, the backend may need a short amount of time to start responding again.

Because the products are fetched from the backend and database rather than being stored directly in the frontend, the product section can take a few seconds to load during this first request.

After the backend is active, subsequent requests generally respond normally.
