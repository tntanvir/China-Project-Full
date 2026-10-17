export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "China Project (FT PCB) API Documentation",
    version: "1.0.0",
    description:
      "Interactive Swagger documentation for all China Project (SysPCB / FT PCB) backend APIs. Supports JWT Bearer authorization and cookie authentication.",
    contact: {
      name: "Engineering Team",
      email: "ft-osr@feitianpcb.com",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server",
    },
    {
      url: "https://project-china-bakend.vercel.app",
      description: "Production Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT Bearer token: `Bearer <token>`",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
        description: "HttpOnly accessToken cookie",
      },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation successful" },
          data: { type: "object" },
        },
      },
      RegisterInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "customer@example.com" },
          password: { type: "string", minLength: 6, example: "Password123!" },
          name: { type: "string", example: "John Doe" },
          companyName: { type: "string", example: "Apex Hardware Ltd" },
          phone: { type: "string", example: "+8801700000000" },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "customer@example.com" },
          password: { type: "string", example: "Password123!" },
        },
      },
      QuoteInput: {
        type: "object",
        required: ["name", "width", "height", "quantity", "layerCount", "materialType", "boardThickness", "copperWeight", "surfaceFinish", "solderMaskColor", "silkscreenColor"],
        properties: {
          name: { type: "string", example: "Smart IoT Controller PCB" },
          width: { type: "number", example: 100 },
          height: { type: "number", example: 80 },
          quantity: { type: "integer", example: 20 },
          layerCount: { type: "integer", example: 4 },
          materialType: { type: "string", example: "FR-4" },
          boardThickness: { type: "number", example: 1.6 },
          copperWeight: { type: "number", example: 1 },
          surfaceFinish: { type: "string", example: "ENIG" },
          solderMaskColor: { type: "string", example: "Green" },
          silkscreenColor: { type: "string", example: "White" },
        },
      },
      CreateOrderInput: {
        type: "object",
        required: ["shippingAddress"],
        properties: {
          shippingAddress: { type: "string", example: "123 Tech Park, Suite 400, San Jose, CA" },
          billingAddress: { type: "string", example: "123 Tech Park, Suite 400, San Jose, CA" },
        },
      },
      SupportTicketInput: {
        type: "object",
        required: ["subject", "message"],
        properties: {
          subject: { type: "string", example: "Inquiry regarding 6-layer impedance control" },
          message: { type: "string", example: "Please check our Gerber drill file compatibility." },
        },
      },
      CreateChatRoomInput: {
        type: "object",
        properties: {
          subject: { type: "string", example: "Production status live consultation" },
        },
      },
      SendMessageInput: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string", example: "Hi, when will batch #402 ship?" },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "Auth", description: "User registration, authentication, OTP, and profile" },
    { name: "Quotes", description: "PCB quotation calculation, saved quotes, and convert to order" },
    { name: "Gerber Files", description: "Gerber CAD & BOM file upload, review, and deletion" },
    { name: "Products", description: "Electronics and PCB catalog management" },
    { name: "Cart", description: "Customer cart operations and item quantities" },
    { name: "Orders", description: "Order creation, production pipeline status, and cancellations" },
    { name: "Payments", description: "Stripe and PayPal checkouts, receipts, and transactions" },
    { name: "Support Tickets", description: "Customer support tickets, responses, and closures" },
    { name: "Chat & Realtime", description: "Live WebSocket-backed chat rooms and direct messaging" },
    { name: "Notifications", description: "In-app alerts, read status, and broadcasts" },
    { name: "Reviews", description: "Product ratings, reviews, and moderation" },
    { name: "Admin", description: "Operations dashboard, customer management, and categories" },
    { name: "RBAC", description: "Role-Based Access Control and staff permissions" },
    { name: "Super Admin", description: "Platform settings, audit logs, security, and monitoring" },
  ],
  paths: {
    // --- AUTH ---
    "/api/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register new customer account",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterInput" } } },
        },
        responses: { 201: { description: "User registered successfully" } },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login customer or administrator",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } } },
        },
        responses: { 200: { description: "Login successful; returns tokens and sets cookie" } },
      },
    },
    "/api/v1/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user and invalidate session",
        responses: { 200: { description: "Logged out successfully" } },
      },
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current logged-in user profile",
        responses: { 200: { description: "Current user profile" } },
      },
    },
    "/api/v1/auth/update-profile": {
      patch: {
        tags: ["Auth"],
        summary: "Update profile information",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  companyName: { type: "string" },
                  phone: { type: "string" },
                  address: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Profile updated" } },
      },
    },
    "/api/v1/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Obtain new access token using refresh token",
        security: [],
        responses: { 200: { description: "New access token generated" } },
      },
    },
    "/api/v1/auth/change-password": {
      post: {
        tags: ["Auth"],
        summary: "Change account password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["oldPassword", "newPassword"],
                properties: {
                  oldPassword: { type: "string" },
                  newPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Password changed successfully" } },
      },
    },
    "/api/v1/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request password reset OTP via email",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: { email: { type: "string", format: "email" } },
              },
            },
          },
        },
        responses: { 200: { description: "Reset email sent" } },
      },
    },
    "/api/v1/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password using OTP code",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp", "newPassword"],
                properties: {
                  email: { type: "string" },
                  otp: { type: "string" },
                  newPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Password reset completed" } },
      },
    },
    "/api/v1/auth/verify-email": {
      post: {
        tags: ["Auth"],
        summary: "Verify email with OTP",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                  email: { type: "string" },
                  otp: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Email verified successfully" } },
      },
    },
    "/api/v1/auth/resend-verification": {
      post: {
        tags: ["Auth"],
        summary: "Resend email verification OTP",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: { email: { type: "string" } },
              },
            },
          },
        },
        responses: { 200: { description: "Verification code resent" } },
      },
    },

    // --- QUOTES ---
    "/api/v1/quotes": {
      post: {
        tags: ["Quotes"],
        summary: "Create and calculate instant PCB quote",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/QuoteInput" } } },
        },
        responses: { 201: { description: "Quote created with price calculation" } },
      },
      get: {
        tags: ["Quotes"],
        summary: "Get all quotes (Admin only)",
        responses: { 200: { description: "List of all quotes" } },
      },
    },
    "/api/v1/quotes/my": {
      get: {
        tags: ["Quotes"],
        summary: "Get quotes created by current customer",
        responses: { 200: { description: "Customer quote list" } },
      },
    },
    "/api/v1/quotes/{quoteId}": {
      get: {
        tags: ["Quotes"],
        summary: "Get quote details by ID",
        parameters: [{ in: "path", name: "quoteId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Quote details" } },
      },
    },
    "/api/v1/quotes/{quoteId}/convert-to-order": {
      post: {
        tags: ["Quotes"],
        summary: "Convert custom quote into an official order",
        parameters: [{ in: "path", name: "quoteId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["shippingAddress"],
                properties: {
                  shippingAddress: { type: "string" },
                  billingAddress: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Order created from quote" } },
      },
    },

    // --- GERBER FILES ---
    "/api/v1/gerber-files/public-upload": {
      post: {
        tags: ["Gerber Files"],
        summary: "Guest file upload for direct inquiry",
        security: [],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  files: { type: "array", items: { type: "string", format: "binary" } },
                  fullName: { type: "string" },
                  email: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Inquiry with files uploaded" } },
      },
    },
    "/api/v1/gerber-files/upload": {
      post: {
        tags: ["Gerber Files"],
        summary: "Upload Gerber / BOM files (Authenticated)",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  files: { type: "array", items: { type: "string", format: "binary" } },
                  quoteId: { type: "string", description: "Optional Quote ID to link files with" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Files uploaded and linked" } },
      },
    },
    "/api/v1/gerber-files/my": {
      get: {
        tags: ["Gerber Files"],
        summary: "Get current user's uploaded Gerber files",
        responses: { 200: { description: "List of files" } },
      },
    },
    "/api/v1/gerber-files": {
      get: {
        tags: ["Gerber Files"],
        summary: "Get all Gerber files for review (Admin)",
        responses: { 200: { description: "All uploaded files" } },
      },
    },
    "/api/v1/gerber-files/{gerberId}": {
      get: {
        tags: ["Gerber Files"],
        summary: "Get single Gerber file details",
        parameters: [{ in: "path", name: "gerberId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "File details" } },
      },
      delete: {
        tags: ["Gerber Files"],
        summary: "Delete own Gerber file",
        parameters: [{ in: "path", name: "gerberId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "File deleted" } },
      },
    },
    "/api/v1/gerber-files/{gerberId}/review": {
      patch: {
        tags: ["Gerber Files"],
        summary: "Engineering CAM review of Gerber files (Admin)",
        parameters: [{ in: "path", name: "gerberId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["REVIEWING", "APPROVED", "REJECTED"] },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Review status updated" } },
      },
    },

    // --- PRODUCTS ---
    "/api/v1/products": {
      get: {
        tags: ["Products"],
        summary: "Get all catalog products with search & filter",
        security: [],
        parameters: [
          { in: "query", name: "searchTerm", schema: { type: "string" } },
          { in: "query", name: "category", schema: { type: "string" } },
          { in: "query", name: "page", schema: { type: "integer", default: 1 } },
          { in: "query", name: "limit", schema: { type: "integer", default: 10 } },
        ],
        responses: { 200: { description: "List of products" } },
      },
      post: {
        tags: ["Products"],
        summary: "Create new product (Admin only)",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["name", "price", "stock", "category"],
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  stock: { type: "integer" },
                  category: { type: "string" },
                  images: { type: "array", items: { type: "string", format: "binary" } },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Product created" } },
      },
    },
    "/api/v1/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product details by ID",
        security: [],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Product details" } },
      },
      patch: {
        tags: ["Products"],
        summary: "Update product (Admin only)",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  stock: { type: "integer" },
                  category: { type: "string" },
                  images: { type: "array", items: { type: "string", format: "binary" } },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Product updated" } },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product (Admin only)",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Product deleted" } },
      },
    },

    // --- CART ---
    "/api/v1/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get customer shopping cart",
        responses: { 200: { description: "Active cart with items and subtotal" } },
      },
      post: {
        tags: ["Cart"],
        summary: "Add product to cart",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "string" },
                  quantity: { type: "integer", minimum: 1 },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Item added to cart" } },
      },
    },
    "/api/v1/cart/{cartItemId}": {
      patch: {
        tags: ["Cart"],
        summary: "Update cart item quantity",
        parameters: [{ in: "path", name: "cartItemId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["quantity"],
                properties: { quantity: { type: "integer", minimum: 1 } },
              },
            },
          },
        },
        responses: { 200: { description: "Quantity updated" } },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove item from cart",
        parameters: [{ in: "path", name: "cartItemId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Item removed" } },
      },
    },

    // --- ORDERS ---
    "/api/v1/orders": {
      post: {
        tags: ["Orders"],
        summary: "Create new order from active cart",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateOrderInput" } } },
        },
        responses: { 201: { description: "Order created successfully" } },
      },
      get: {
        tags: ["Orders"],
        summary: "Get orders list (Customers see their own; Admins see all)",
        responses: { 200: { description: "Order list" } },
      },
    },
    "/api/v1/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get detailed order information",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Order details" } },
      },
    },
    "/api/v1/orders/{id}/status": {
      patch: {
        tags: ["Orders"],
        summary: "Update factory order pipeline status (Admin only)",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["PENDING", "PAID", "GERBER_REVIEW", "ENGINEERING_REVIEW", "PRODUCTION", "QUALITY_CONTROL", "PACKAGING", "SHIPPED", "DELIVERED", "CANCELLED"],
                  },
                  note: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Status updated" } },
      },
    },
    "/api/v1/orders/{id}/cancel": {
      patch: {
        tags: ["Orders"],
        summary: "Cancel order",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Order cancelled" } },
      },
    },

    // --- PAYMENTS ---
    "/api/v1/payments/stripe/create-checkout-session": {
      post: {
        tags: ["Payments"],
        summary: "Create Stripe Checkout session URL",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId"],
                properties: { orderId: { type: "string" } },
              },
            },
          },
        },
        responses: { 200: { description: "Stripe checkout session created with redirect URL" } },
      },
    },
    "/api/v1/payments/stripe/webhook": {
      post: {
        tags: ["Payments"],
        summary: "Stripe raw webhook handler",
        security: [],
        responses: { 200: { description: "Webhook received" } },
      },
    },
    "/api/v1/payments/paypal/create-order": {
      post: {
        tags: ["Payments"],
        summary: "Create PayPal order",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId"],
                properties: { orderId: { type: "string" } },
              },
            },
          },
        },
        responses: { 200: { description: "PayPal order created" } },
      },
    },
    "/api/v1/payments/paypal/capture-order": {
      post: {
        tags: ["Payments"],
        summary: "Capture PayPal payment order",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId", "payPalOrderId"],
                properties: {
                  orderId: { type: "string" },
                  payPalOrderId: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Payment captured" } },
      },
    },
    "/api/v1/payments/history": {
      get: {
        tags: ["Payments"],
        summary: "Get customer payment history",
        responses: { 200: { description: "Payment transactions" } },
      },
    },
    "/api/v1/payments/transactions": {
      get: {
        tags: ["Payments"],
        summary: "Get platform-wide financial transactions (Admin)",
        responses: { 200: { description: "All transactions" } },
      },
    },
    "/api/v1/payments/{paymentId}/receipt": {
      get: {
        tags: ["Payments"],
        summary: "Get payment receipt / invoice",
        parameters: [{ in: "path", name: "paymentId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Receipt details" } },
      },
    },
    "/api/v1/payments/{paymentId}/refund": {
      post: {
        tags: ["Payments"],
        summary: "Process refund (Admin)",
        parameters: [{ in: "path", name: "paymentId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Refund initiated" } },
      },
    },

    // --- SUPPORT ---
    "/api/v1/support/tickets": {
      post: {
        tags: ["Support Tickets"],
        summary: "Open a new support ticket",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SupportTicketInput" } } },
        },
        responses: { 201: { description: "Ticket opened" } },
      },
      get: {
        tags: ["Support Tickets"],
        summary: "Get all support tickets (Admin)",
        responses: { 200: { description: "All tickets" } },
      },
    },
    "/api/v1/support/tickets/my": {
      get: {
        tags: ["Support Tickets"],
        summary: "Get tickets created by current user",
        responses: { 200: { description: "My tickets" } },
      },
    },
    "/api/v1/support/tickets/{ticketId}": {
      get: {
        tags: ["Support Tickets"],
        summary: "Get ticket conversation details",
        parameters: [{ in: "path", name: "ticketId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Ticket details" } },
      },
    },
    "/api/v1/support/tickets/{ticketId}/replies": {
      post: {
        tags: ["Support Tickets"],
        summary: "Reply to a support ticket",
        parameters: [{ in: "path", name: "ticketId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message"],
                properties: { message: { type: "string" } },
              },
            },
          },
        },
        responses: { 201: { description: "Reply added" } },
      },
    },
    "/api/v1/support/tickets/{ticketId}/close": {
      patch: {
        tags: ["Support Tickets"],
        summary: "Close support ticket",
        parameters: [{ in: "path", name: "ticketId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Ticket closed" } },
      },
    },

    // --- CHAT ---
    "/api/v1/chat/rooms": {
      post: {
        tags: ["Chat & Realtime"],
        summary: "Create live chat room",
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateChatRoomInput" } } },
        },
        responses: { 201: { description: "Room created" } },
      },
      get: {
        tags: ["Chat & Realtime"],
        summary: "Get active chat rooms",
        responses: { 200: { description: "Chat rooms" } },
      },
    },
    "/api/v1/chat/rooms/{roomId}": {
      get: {
        tags: ["Chat & Realtime"],
        summary: "Get chat messages in room",
        parameters: [{ in: "path", name: "roomId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Room messages" } },
      },
    },
    "/api/v1/chat/rooms/{roomId}/messages": {
      post: {
        tags: ["Chat & Realtime"],
        summary: "Send message in chat room",
        parameters: [{ in: "path", name: "roomId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SendMessageInput" } } },
        },
        responses: { 201: { description: "Message sent" } },
      },
    },
    "/api/v1/chat/rooms/{roomId}/seen": {
      patch: {
        tags: ["Chat & Realtime"],
        summary: "Mark messages in room as seen",
        parameters: [{ in: "path", name: "roomId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Messages marked as seen" } },
      },
    },
    "/api/v1/chat/rooms/{roomId}/close": {
      patch: {
        tags: ["Chat & Realtime"],
        summary: "Close chat room",
        parameters: [{ in: "path", name: "roomId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Room closed" } },
      },
    },

    // --- NOTIFICATIONS ---
    "/api/v1/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "Get user notifications",
        responses: { 200: { description: "Notification list" } },
      },
    },
    "/api/v1/notifications/read-all": {
      patch: {
        tags: ["Notifications"],
        summary: "Mark all notifications as read",
        responses: { 200: { description: "All marked as read" } },
      },
    },
    "/api/v1/notifications/{notificationId}/read": {
      patch: {
        tags: ["Notifications"],
        summary: "Mark single notification as read",
        parameters: [{ in: "path", name: "notificationId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Marked as read" } },
      },
    },
    "/api/v1/notifications/broadcast": {
      post: {
        tags: ["Notifications"],
        summary: "Broadcast notification to users (Admin)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "message"],
                properties: {
                  title: { type: "string" },
                  message: { type: "string" },
                  userIds: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Broadcast dispatched" } },
      },
    },

    // --- REVIEWS ---
    "/api/v1/reviews": {
      get: {
        tags: ["Reviews"],
        summary: "Get all customer reviews (Admin)",
        responses: { 200: { description: "All reviews" } },
      },
    },
    "/api/v1/reviews/products/{productId}": {
      get: {
        tags: ["Reviews"],
        summary: "Get reviews for a product",
        security: [],
        parameters: [{ in: "path", name: "productId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Product reviews" } },
      },
      post: {
        tags: ["Reviews"],
        summary: "Post product review",
        parameters: [{ in: "path", name: "productId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rating", "comment"],
                properties: {
                  rating: { type: "integer", minimum: 1, maximum: 5 },
                  comment: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Review posted" } },
      },
    },
    "/api/v1/reviews/products/{productId}/can-review": {
      get: {
        tags: ["Reviews"],
        summary: "Check if current user is eligible to review product",
        parameters: [{ in: "path", name: "productId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Can review status" } },
      },
    },
    "/api/v1/reviews/{id}": {
      patch: {
        tags: ["Reviews"],
        summary: "Update existing review",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  rating: { type: "integer", minimum: 1, maximum: 5 },
                  comment: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Review updated" } },
      },
      delete: {
        tags: ["Reviews"],
        summary: "Delete review",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Review deleted" } },
      },
    },

    // --- ADMIN ---
    "/api/v1/admin/overview": {
      get: {
        tags: ["Admin"],
        summary: "Get operational KPI statistics",
        responses: { 200: { description: "Dashboard stats" } },
      },
    },
    "/api/v1/admin/customers": {
      get: {
        tags: ["Admin"],
        summary: "List registered customer accounts",
        responses: { 200: { description: "Customer list" } },
      },
    },
    "/api/v1/admin/customers/{userId}/status": {
      patch: {
        tags: ["Admin"],
        summary: "Change customer status (ACTIVE / BLOCKED)",
        parameters: [{ in: "path", name: "userId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: { status: { type: "string", enum: ["ACTIVE", "INACTIVE", "BLOCKED"] } },
              },
            },
          },
        },
        responses: { 200: { description: "Customer status changed" } },
      },
    },
    "/api/v1/admin/inventory": {
      get: {
        tags: ["Admin"],
        summary: "View inventory levels and warehouse stocks",
        responses: { 200: { description: "Inventory items" } },
      },
    },
    "/api/v1/admin/categories": {
      get: {
        tags: ["Admin"],
        summary: "Get product categories",
        responses: { 200: { description: "Categories list" } },
      },
      post: {
        tags: ["Admin"],
        summary: "Create product category",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: { name: { type: "string" }, description: { type: "string" } },
              },
            },
          },
        },
        responses: { 201: { description: "Category created" } },
      },
    },
    "/api/v1/admin/categories/{id}": {
      patch: {
        tags: ["Admin"],
        summary: "Update category",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { name: { type: "string" }, description: { type: "string" } },
              },
            },
          },
        },
        responses: { 200: { description: "Category updated" } },
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete category",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Category deleted" } },
      },
    },

    // --- RBAC ---
    "/api/v1/rbac/permissions": {
      get: {
        tags: ["RBAC"],
        summary: "List all system permissions",
        responses: { 200: { description: "Permissions summary" } },
      },
    },
    "/api/v1/rbac/roles": {
      get: {
        tags: ["RBAC"],
        summary: "List all staff roles",
        responses: { 200: { description: "Roles list" } },
      },
      post: {
        tags: ["RBAC"],
        summary: "Create custom role with assigned permissions",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "slug"],
                properties: {
                  name: { type: "string" },
                  slug: { type: "string" },
                  description: { type: "string" },
                  permissions: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Role created" } },
      },
    },
    "/api/v1/rbac/roles/{id}": {
      patch: {
        tags: ["RBAC"],
        summary: "Update role permissions",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  permissions: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Role updated" } },
      },
      delete: {
        tags: ["RBAC"],
        summary: "Delete role",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Role deleted" } },
      },
    },
    "/api/v1/rbac/admins": {
      get: {
        tags: ["RBAC"],
        summary: "List all administrator accounts",
        responses: { 200: { description: "Admins list" } },
      },
      post: {
        tags: ["RBAC"],
        summary: "Create new admin staff user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "name"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                  name: { type: "string" },
                  roleSlugs: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Admin created" } },
      },
    },
    "/api/v1/rbac/admins/{userId}/suspend": {
      patch: {
        tags: ["RBAC"],
        summary: "Suspend admin staff account",
        parameters: [{ in: "path", name: "userId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Admin suspended" } },
      },
    },
    "/api/v1/rbac/admins/{userId}/activate": {
      patch: {
        tags: ["RBAC"],
        summary: "Reactivate admin staff account",
        parameters: [{ in: "path", name: "userId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Admin reactivated" } },
      },
    },
    "/api/v1/rbac/assign-role": {
      post: {
        tags: ["RBAC"],
        summary: "Assign role to a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId", "roleId"],
                properties: {
                  userId: { type: "string" },
                  roleId: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Role assigned" } },
      },
    },

    // --- SUPER ADMIN ---
    "/api/v1/super-admin/overview": {
      get: {
        tags: ["Super Admin"],
        summary: "Global platform performance KPIs",
        responses: { 200: { description: "Super Admin overview" } },
      },
    },
    "/api/v1/super-admin/settings": {
      get: {
        tags: ["Super Admin"],
        summary: "Get platform system configuration",
        responses: { 200: { description: "Platform settings" } },
      },
      put: {
        tags: ["Super Admin"],
        summary: "Update platform system configuration",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  platformName: { type: "string" },
                  smtpHost: { type: "string" },
                  maintenanceMode: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Settings saved" } },
      },
    },
    "/api/v1/super-admin/audit-logs": {
      get: {
        tags: ["Super Admin"],
        summary: "View administrative security audit trail",
        responses: { 200: { description: "Audit logs" } },
      },
    },
    "/api/v1/super-admin/security": {
      get: {
        tags: ["Super Admin"],
        summary: "Platform security center metrics and failed logins",
        responses: { 200: { description: "Security stats" } },
      },
    },
    "/api/v1/super-admin/monitoring": {
      get: {
        tags: ["Super Admin"],
        summary: "Server and database performance monitoring",
        responses: { 200: { description: "Monitoring metrics" } },
      },
    },
  },
};

export const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
    .swagger-ui .info .title { color: #1e293b; font-family: Inter, sans-serif; font-weight: 800; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 15px; border-radius: 8px; }
  `,
  customSiteTitle: "FT PCB API Docs",
};
