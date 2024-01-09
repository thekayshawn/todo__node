import path from "path";
import http from "http";

export const ROOT_DIR = path.resolve(__dirname, "../");

export const allowedOrigins = ["http://localhost:5173"];

export function sendJSON(res: http.ServerResponse, json: any) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(json));
}

export function sendError(
  res: http.ServerResponse,
  statusCode: number,
  message: string
) {
  res.statusCode = statusCode;
  sendJSON(res, { error: message });
}

export function send400(res: http.ServerResponse, message?: string) {
  sendError(res, 400, message || "Bad Request");
}

export function send401(res: http.ServerResponse, message?: string) {
  sendError(res, 401, message || "Unauthorized");
}

export function send403(res: http.ServerResponse, message?: string) {
  sendError(res, 403, message || "Forbidden");
}

export function send404(res: http.ServerResponse, message?: string) {
  sendError(res, 404, message || "Not Found");
}

export function send405(res: http.ServerResponse, message?: string) {
  sendError(res, 405, message || "Method Not Allowed");
}

export function send500(res: http.ServerResponse, message?: string) {
  sendError(res, 500, message || "Internal Server Error");
}
