import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import { PaymentController } from "./app/modules/payment/payment.controller";
import config from "./config";
import rateLimiter from "./app/middlewares/rateLimiter";



import swaggerUi from "swagger-ui-express";
import { swaggerSpec, swaggerUiOptions } from "./app/shared/swagger";

const app: Application = express();

// Middlewares
const allowedOrigins = [
    config.frontend_url,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://wupingfeitian.vercel.app"
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
        ) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use(cookieParser());
app.use(rateLimiter);

// Stripe requires the original raw body for webhook signature verification.
app.post(
    "/api/v1/payments/stripe/webhook",
    express.raw({ type: "application/json" }),
    PaymentController.handleStripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically with attachment header for forced download
app.use(
    "/uploads",
    express.static("uploads", {
        setHeaders: (res, filePath) => {
            const filename = path.basename(filePath);
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
            res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        },
    })
);

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.get("/docs", (_req: Request, res: Response) => {
    res.redirect("/api-docs");
});

// Root route
app.get("/", (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: "China Project (SysPCB) Backend API is running",
        documentation: "/api-docs",
    });
});

// API routes
app.use("/api/v1", router);

// Error handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;
