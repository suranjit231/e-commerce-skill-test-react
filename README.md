# E-Commerce Skill Test Project

This is a fully responsive e-commerce web application built using React, Firebase, and Redux Toolkit. The application allows users to browse products, filter them by category and price, search for specific products, and manage their shopping cart. The application also includes an admin section for adding, updating, and deleting products. User authentication is handled via Firebase.

## Tech Stack

- **Frontend**: React.js, CSS (for styling)
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Authentication
- **Backend**: Firebase Firestore (NoSQL database)
- **Hosting**: Firebase Hosting (optional)
- **Others**: Firebase Storage (for storing product images)

## Features

- **User Authentication**: Users can sign up and log in using Firebase Authentication.
- **Product Management**: 
  - Admins can add, update, and delete products.
  - Users can view product details and filter products by category and price.
- **Shopping Cart**: Users can add products to their cart and proceed to place an order.
- **Product Search**: Users can search for products using a search bar.
- **Category Filtering**: Users can filter products by category using the category slicer.
- **Responsive Design**: The application is fully responsive and works well on all device sizes.
  
## Setup and Configuration

To get started with this project locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/suranjit231/e-commerce-skill-test-react.git
cd e-commerce-skill-test
```
### 2. Install Dependencies
```
npm install
```
### 3. Environment Variables
    - Create a .env file in the root directory of the project and add the following environment variables:
```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```
### 4. Start the Application
```
npm start
```
## 5. Using the Application

### Login/Sign Up:
- Click on the `Login` button.
- If you don't have an account, click on `Sign Up` to create one.
- After signing up, log in using your credentials.

### User Profile:
- Click on the user profile icon in the navbar to open the sidebar.
- In the sidebar, you will find an `Admin` link.

### Admin Actions:
- Click on `Admin` to access the admin dashboard.
- Here, you can:
  - Add new products.
  - Update existing products.
  - Delete products.

### Explore the Application:
- Browse the products.
- Filter products by category and price.
- Add items to your cart.


