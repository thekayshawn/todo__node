import { ParsedUrlQuery } from "querystring";

// Utils
import { Controller } from "../types";
import { todoModel } from "./todoModel";
import { send400, send404, send405, send500, sendJSON } from "../utils";

/**
 * @param {ParsedUrlQuery} query
 * @returns {number | undefined}
 */
function getTodoId(query) {
  // Get the ID from the query
  const id = query.id?.toString();

  // Send 400 if the id is missing
  if (!id) {
    return;
  }

  return parseInt(id);
}

/**
 * @param {Controller} controller
 * @returns {void}
 */
function getTodos({ res, query }) {
  const id = getTodoId(query);

  // Return todo by id if it exists
  if (id) {
    todoModel
      .getTodoById(id)
      .then((todo) => {
        if (!todo) {
          send404(res);
          return;
        }

        sendJSON(res, todo);
      })
      .catch((error) => {
        console.error(error);
        send500(res);
      });

    return;
  }

  // Otherwise, fetch all todos
  todoModel
    .getAllTodos()
    .then((todos) => {
      sendJSON(res, todos);
    })
    .catch((error) => {
      console.error(error);
      send500(res);
    });
}

/**
 * @param {Controller} param0
 * @returns {void}
 */
function postTodo({ req, res }) {
  let body = "";

  req.on("data", (chunk) => {
    if (!chunk) {
      send400(res);
      return;
    }

    body += chunk;
  });

  req.on("end", () => {
    const params = JSON.parse(body);

    /**
     * @type {string | undefined}
     * Get the title from the query
     */
    const title = params.title;

    // Send 400 if the title is missing
    if (!title) {
      send400(res);
      return;
    }

    todoModel
      .addTodo({ title, completed: 0 })
      .then((newTodo) => {
        sendJSON(res, newTodo);
      })
      .catch((error) => {
        console.error(error);
        send500(res);
      });
  });
}

/**
 * @param {Controller} param0
 * @returns {void}
 */
function patchTodo({ req, res, query }) {
  const id = query.id?.toString();
  const todoId = parseInt(id || "");

  if (!todoId) {
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
    const params = JSON.parse(body);

    /**
     * @type {string | undefined}
     */
    const title = params.title;

    /**
     * @type {boolean | undefined}
     */
    const completed = params.completed;

    // Send 400 if no data is provided
    if (!title && completed === undefined) {
      send400(res);
      return;
    }

    const todo = {
      ...(title && { title }),
      ...(completed !== undefined && { completed: completed ? 1 : 0 }),
    };

    todoModel
      .updateTodoById(todoId, todo)
      .then((updatedTodo) => {
        sendJSON(res, updatedTodo);
      })
      .catch((error) => {
        console.error(error);
        send500(res);
      });
  });
}

/**
 * @param {Controller} param0
 * @returns {void}
 */
function deleteTodo({ res, query }) {
  const id = getTodoId(query);

  if (!id) {
    send400(res);
    return;
  }

  todoModel
    .removeTodoById(id)
    .then(() => {
      sendJSON(res, { id });
    })
    .catch((error) => {
      console.error(error);
      send500(res);
    });
}

/**
 * @param {Controller} param0
 * @returns {void}
 */
export function todoController({ req, res, query }) {
  // Get the HTTP method
  const method = req.method?.toLowerCase();

  // Send 400 if the method is missing
  if (!method) {
    send400(res);
    return;
  }

  const handler = {
    get: getTodos,
    post: postTodo,
    patch: patchTodo,
    delete: deleteTodo,
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
