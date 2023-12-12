# E-commerce

# API Documentation

## User Authentication

### POST /login

- **Description:**
  - Authenticates a user based on phone number and password.

- **Request:**
  - Endpoint: `/login`
  - Method: `POST`
  - Body:
    ```json
    {
      "phone": "user_phone_number",
      "password": "user_password"
    }
    ```

- **Response:**
  - Success (HTTP 201):
    ```json
    {
      "success": "User logged in Successfully"
    }
    ```
  - Error (HTTP 400/422):
    ```json
    {
      "error": "Invalid Credentials"
    }
    ```

### POST /register

- **Description:**
  - Registers a new user with the provided information.

- **Request:**
  - Endpoint: `/register`
  - Method: `POST`
  - Body:
    ```json
    {
      "name": "user_name",
      "phone": "user_phone_number",
      "email": "user_email",
      "password": "user_password",
      "role": "user_role"
    }
    ```

- **Response:**
  - Success (HTTP 201):
    ```json
    {
      "success": "User Registered Successfully"
    }
    ```
  - Error (HTTP 422):
    ```json
    {
      "error": "Please add all the fields"
    }
    ```

## Product Management

### POST /products

- **Description:**
  - Adds a new product to the system. Requires authentication as both a user and a seller.

- **Request:**
  - Endpoint: `/products`
  - Method: `POST`
  - Headers:
    - Authorization: Bearer `user_token`
  - Body:
    ```json
    {
      "name": "product_name",
      "description": "product_description",
      "price": "product_price",
      "discount": "product_discount",
      "quantity": "product_quantity",
      "category": "product_category",
      "photo": "product_photo_url"
    }
    ```

- **Response:**
  - Success (HTTP 201):
    ```json
    {
      "success": "Product Added Successfully"
    }
    ```
  - Error (HTTP 422):
    ```json
    {
      "error": "Please add all the fields"
    }
    ```

### GET /products

- **Description:**
  - Retrieves a paginated list of products.

- **Request:**
  - Endpoint: `/products`
  - Method: `GET`

- **Response:**
  - Success (HTTP 201):
    ```json
    {
      "products": [...],
      "previous": 1,
      "next": 3
    }
    ```
  - Error (HTTP 500):
    ```json
    {
      "error": "Internal Server Error"
    }
    ```

## Shopping Cart

### POST /addTocart

- **Description:**
  - Adds a product to the user's shopping cart.

- **Request:**
  - Endpoint: `/addTocart`
  - Method: `POST`
  - Headers:
    - Authorization: Bearer `user_token`
  - Body:
    ```json
    {
      "product_id": "product_id",
      "quantity": "product_quantity"
    }
    ```

- **Response:**
  - Success (HTTP 201):
    ```json
    {
      "success": "Product Added to cart Successfully"
    }
    ```
  - Error (HTTP 422):
    ```json
    {
      "error": "Please add all the fields"
    }
    ```

### POST /removeFromCart

- **Description:**
  - Removes a product from the user's shopping cart.

- **Request:**
  - Endpoint: `/removeFromCart`
  - Method: `POST`
  - Headers:
    - Authorization: Bearer `user_token`
  - Body:
    ```json
    {
      "product_id": "product_id"
    }
    ```

- **Response:**
  - Success (HTTP 201):
    ```json
    {
      "success": "Product Removed from cart Successfully"
    }
    ```
  - Error (HTTP 422):
    ```json
    {
      "error": "Please add all the fields"
    }
    ```

## Seller Operations

### POST /registerSeller

- **Description:**
  - Registers a user as a seller, requiring additional seller-specific information.

- **Request:**
  - Endpoint: `/registerSeller`
  - Method: `POST`
  - Headers:
    - Authorization: Bearer `user_token`
  - Body:
    ```json
    {
      "pan_no": "seller_pan_number",
      "pan_name": "seller_pan_name",
      "pan_image": "seller_pan_image_url",
      "storeName": "seller_store_name",
      "pickUpAddress": "seller_pickup_address",
      "pickUpType": "seller_pickup_type",
      "deliveryCharge": "seller_delivery_charge",
      "bankDetails": "seller_bank_details"
    }
    ```

- **Response:**
  - Success (HTTP 201):
    ```json
    {
      "success": "Seller Registered Successfully"
    }
    ```
  - Error (HTTP 422):
    ```json
    {
      "error": "Please add all the fields"
    }
    ```

## Order Processing

### POST /buy

- **Description:**
  - Completes the purchase process, including creating an order, updating product quantities, and notifying the buyer and seller.

- **Request:**
  - Endpoint: `/buy`
  - Method: `POST`
  - Headers:
    - Authorization: Bearer `user_token`
  - Body:
    ```json
    {
      "product_id": "product_id",
      "quantity": "product_quantity",
      "address": "delivery_address",
      "method": "payment_method"
    }
    ```

- **Response:**
  - Success (HTTP 201):
    ```json
    {
      "success": "Product Bought Successfully"
    }
    ```
  - Error (HTTP 500):
    ```json
    {
      "error": "Internal Server Error"
    }
    ```

### POST /updateOrderStatus

- **Description:**
  - Updates the status of an order, potentially including a rejection reason. Requires authentication as both a user and a seller.

- **Request:**
  - Endpoint: `/updateOrderStatus`
  - Method: `POST`
  - Headers:
    - Authorization: Bearer `seller_token`
  - Body:
    ```json
    {
      "order_id": "order_id",
      "status": "order_status",
      "reason": "rejection_reason"
    }
    ```

- **Response:**
  - Success (HTTP 201):
    ```json
    {
      "success": "Order Status Updated Successfully"
    }
    ```
  - Error (HTTP 422):
    ```json
    {
      "error": "Please add all the fields"
    }
    ```

## Reviews

### POST /review

- **Description

