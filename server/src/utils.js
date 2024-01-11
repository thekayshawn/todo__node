import path from "path";
import http from "http";

export const ROOT_DIR = path.resolve(__dirname, "../");

export const allowedOrigins = ["http://localhost:5173"];

/**
 * @param {http.ServerResponse} res
 * @param {Object} json
 */
export function sendJSON(res, json) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(json));
}

/**
 * @param {http.ServerResponse} res
 * @param {number} statusCode
 * @param {string} message
 */
export function sendError(res, statusCode, message) {
  res.statusCode = statusCode;
  sendJSON(res, { error: message });
}

/**
 * @typedef {(
 *  req: http.IncomingMessage,
 *  res: http.ServerResponse,
 * ) => void} RequestSender
 */

/**
 * @type {RequestSender}
 */
export const send400 = (res, message) =>
  sendError(res, 400, message || "Bad Request");

/**
 * @type {RequestSender}
 */
export const send401 = (res, message) =>
  sendError(res, 401, message || "Unauthorized");

/**
 * @type {RequestSender}
 */
export const send403 = (res, message) =>
  sendError(res, 403, message || "Forbidden");

/**
 * @type {RequestSender}
 */
export const send404 = (res, message) =>
  sendError(res, 404, message || "Not Found");

/**
 * @type {RequestSender}
 */
export const send405 = (res, message) =>
  sendError(res, 405, message || "Method Not Allowed");

/**
 * @type {RequestSender}
 */
export const send500 = (res, message) =>
  sendError(res, 500, message || "Internal Server Error");
