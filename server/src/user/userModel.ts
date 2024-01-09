import { User } from "./userTypes";
import { database } from "../database";

async function getUserById(id: User["id"]) {
  return database.user.findUnique({ where: { id } });
}

async function getUserByUsername(username: User["username"]) {
  return database.user.findFirst({ where: { username } });
}

async function addUser(user: User) {
  return database.user.create({ data: user });
}

async function removeUserById(id: User["id"]) {
  return database.user.delete({ where: { id } });
}

async function updateUserById(id: User["id"], user: Partial<User>) {
  return database.user.update({ where: { id }, data: user });
}

export const userModel = {
  addUser,
  getUserById,
  removeUserById,
  updateUserById,
  getUserByUsername,
};
