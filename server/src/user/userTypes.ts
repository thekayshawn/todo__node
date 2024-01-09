export type User = {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NewUser = {
  username: string;
  password: string;
};
