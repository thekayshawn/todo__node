import { Controller } from "../types";
import { userModel } from "./userModel";
import { ParsedUrlQuery } from "querystring";
import { send400, send404, send405, send500, sendJSON } from "../utils";

function getUserId(query: ParsedUrlQuery): number | undefined {
  // Get the ID from the query
  const id = query.id?.toString();

  // Send 400 if the id is missing
  if (!id) {
    return;
  }

  return parseInt(id);
}

function getUser({ res, query }: Controller) {
  // Get the ID from the query
  const id = getUserId(query);

  // Send 400 if the id is missing
  if (!id) {
    send400(res);
    return;
  }

  userModel
    .getUserById(id)
    .then((user) => {
      // Send 404 if the user is missing
      if (!user) {
        send404(res);
        return;
      }

      sendJSON(res, user);
    })
    .catch((error) => {
      console.error(error);
      send500(res);
    });
}

function postUser({ req, res }: Controller) {
  let body = "";

  req.on("data", (chunk) => {
    if (!chunk) {
      send400(res);
      return;
    }

    body += chunk;
  });

  req.on("end", () => {
    const user = JSON.parse(body);

    userModel
      .addUser(user)
      .then((user) => {
        sendJSON(res, user);
      })
      .catch((error) => {
        console.error(error);
        send500(res);
      });
  });
}

function patchUser({ req, res, query }: Controller) {
  // Get the ID from the query
  const id = getUserId(query);

  // Send 400 if the id is missing
  if (!id) {
    send400(res);
    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    if (!chunk) {
      send400(res);
      return;
    }

    body += chunk;
  });

  req.on("end", () => {
    const user = JSON.parse(body);

    userModel
      .updateUserById(id, user)
      .then((user) => {
        sendJSON(res, user);
      })
      .catch((error) => {
        console.error(error);
        send500(res);
      });
  });
}

function deleteUser({ res, query }: Controller) {
  // Get the ID from the query
  const id = getUserId(query);

  // Send 400 if the id is missing
  if (!id) {
    send400(res);
    return;
  }

  userModel
    .removeUserById(id)
    .then(() => {
      sendJSON(res, { id });
    })
    .catch((error) => {
      console.error(error);
      send500(res);
    });
}

export function userController({ req, res, query }: Controller) {
  // Get the HTTP method
  const method = req.method?.toLowerCase();

  // Send 400 if the method is missing
  if (!method) {
    send400(res);
    return;
  }

  const handler = {
    get: getUser,
    post: postUser,
    patch: patchUser,
    delete: deleteUser,
  }[method || ""];

  // In case of no match, send 405
  if (!handler) {
    send405(res);
    return;
  }

  // Call the handler
  handler({
    req,
    res,
    query,
  });
}
