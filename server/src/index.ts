// Node
import url from "url";
import http from "http";

// Utils
import { allowedOrigins, send400, send403, send404 } from "./utils";

// Controllers
import { userController } from "./user/userController";
import { todoController } from "./todo/todoController";

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    // Allow CORS
    const clientUrl = req.url;
    const origin = req.headers.origin;

    // In case the URL or Origin is missing, we pass a 400 error
    if (!clientUrl || !origin) {
      send400(res);
      return;
    }

    if (!allowedOrigins.includes(origin)) {
      send403(res);
      return;
    }

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, PATCH, DELETE, OPTIONS"
      );
      res.statusCode = 200;
      res.end();
      return;
    }

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, PUT, POST, PATCH, DELETE, OPTIONS"
    );

    // Parse the URL
    const { pathname, query } = url.parse(clientUrl, true);

    // Find requested controller
    const controller = {
      "/todos": todoController,
      "/users": userController,
    }[pathname || ""];

    // Send 404 if no controller is found
    if (!controller) {
      send404(res);
      return;
    }

    // Forward the request to the controller
    controller({ req, res, query });
  }
);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
