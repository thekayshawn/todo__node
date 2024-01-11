// Utils
import { database } from "../database";
import { NewTodo, Todo } from "./todoTypes";

/**
 * Get all todos
 * @returns {Promise<Todo[]>} - All todos
 */
async function getAllTodos(): Promise<Todo[]> {
  return database.todos.findMany();
}

/**
 * Get todo by id
 * @param {string} id - Todo id
 * @returns {Promise<Todo>} - Todo
 */
async function getTodoById(id: Todo["id"]): Promise<Todo | null> {
  return database.todos.findUnique({ where: { id } });
}

/**
 * Add todo
 * @param {Todo} todo - Todo
 * @returns {Promise<Todo>} - Add todo
 */
async function addTodo({ title, completed }: NewTodo): Promise<Todo> {
  return database.todos.create({ data: { title, completed } });
}

/**
 * Update todo
 * @param {Todo['id']} id - Todo id
 * @param {Todo} todo - Todo
 * @returns {Promise<Todo>} - Updated todo
 */
async function updateTodoById(
  id: Todo["id"],
  todo: Partial<NewTodo>
): Promise<Todo> {
  return database.todos.update({ where: { id }, data: todo });
}

/**
 * Remove todo
 * @param {string} id - Todo id
 * @returns {Promise<void>} - Remove todo
 */
async function removeTodoById(id: Todo["id"]): Promise<Todo> {
  return database.todos.delete({ where: { id } });
}

export const todoModel = {
  addTodo,
  getAllTodos,
  getTodoById,
  updateTodoById,
  removeTodoById,
};
