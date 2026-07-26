import api from "./api";

export async function getAllUsers() {
  const { data } = await api.get("/admin/users");
  return data;
}