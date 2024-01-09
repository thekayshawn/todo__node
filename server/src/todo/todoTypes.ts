export type Todo = {
  id: number;
  title: string;
  completed: number;
  createdAt: Date;
};

export type NewTodo = Omit<Todo, "id" | "createdAt">;
