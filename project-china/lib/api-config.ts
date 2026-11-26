/**
 * Resolves backend API URLs safely across both Next.js Server-Side Rendering (Docker internal network)
 * and Browser clients (public origin or Nginx reverse proxy relative path).
 */

const DEFAULT_PUBLIC_API_URL = "/api/v1";
const DEFAULT_DEV_ORIGIN = "http://localhost:5000";

function trimTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    const internalUrl = process.env.INTERNAL_API_URL;
    if (internalUrl) return trimTrailingSlashes(internalUrl);

    const publicUrl = process.env.NEXT_PUBLIC_API_URL;
    if (publicUrl && /^https?:\/\//i.test(publicUrl)) {
      return trimTrailingSlashes(publicUrl);
    }

    return `${DEFAULT_DEV_ORIGIN}/api/v1`;
  }

  return trimTrailingSlashes(process.env.NEXT_PUBLIC_API_URL || DEFAULT_PUBLIC_API_URL);
}

export function getBackendOrigin(): string {
  if (typeof window === "undefined") {
    const internalOrigin = process.env.INTERNAL_API_ORIGIN;
    if (internalOrigin) return trimTrailingSlashes(internalOrigin);

    const publicOrigin = process.env.NEXT_PUBLIC_API_ORIGIN;
    if (publicOrigin && /^https?:\/\//i.test(publicOrigin)) {
      return trimTrailingSlashes(publicOrigin);
    }

    return DEFAULT_DEV_ORIGIN;
  }

  const publicOrigin = process.env.NEXT_PUBLIC_API_ORIGIN;
  if (publicOrigin) return trimTrailingSlashes(publicOrigin);
  return window.location.origin;
}

export function getSocketUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_ORIGIN;
  if (configured && configured !== "same-origin") {
    return trimTrailingSlashes(configured);
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return DEFAULT_DEV_ORIGIN;
}
