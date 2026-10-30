import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const isDev = process.env.NODE_ENV !== "production";
const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS || (isDev ? 5000 : 600));

const buckets = new Map<string, { count: number; resetAt: number }>();

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    const rawIp = req.ip || req.socket.remoteAddress || "unknown";
    
    // In development or local loopback, avoid throttling tests/page prefetching
    if (isDev && (rawIp === "127.0.0.1" || rawIp === "::1" || rawIp.includes("127.0.0.1"))) {
        return next();
    }

    const key = rawIp;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt < now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return next();
    }

    bucket.count += 1;

    if (bucket.count > maxRequests) {
        return res.status(httpStatus.TOO_MANY_REQUESTS).json({
            success: false,
            message: "Too many requests. Please try again later.",
            data: null,
        });
    }

    next();
};

export default rateLimiter;
