export const API_BASE =
  typeof window !== "undefined"
    ? (import.meta.env.NEXT_PUBLIC_API_BASE as string) || "http://localhost:5000"
    : process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export const SOCKET_BASE =
  typeof window !== "undefined"
    ? (import.meta.env.NEXT_PUBLIC_SOCKET_BASE as string) || API_BASE
    : process.env.NEXT_PUBLIC_SOCKET_BASE || API_BASE;
