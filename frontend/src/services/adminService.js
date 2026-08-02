import api from "./api";


// ==========================================
// USER MANAGEMENT
// ==========================================

export async function getAllUsers() {
  const { data } = await api.get(
    "/admin/users"
  );

  return data;
}


export async function createUser(
  userData
) {
  const { data } = await api.post(
    "/admin/users",
    userData
  );

  return data;
}


export async function updateUser(
  id,
  userData
) {
  const { data } = await api.put(
    `/admin/users/${id}`,
    userData
  );

  return data;
}


export async function deleteUser(
  id
) {
  const { data } = await api.delete(
    `/admin/users/${id}`
  );

  return data;
}



// ==========================================
// BIKE MANAGEMENT
// ==========================================

// Get all bikes
export async function getAllBikes() {

  const { data } =
    await api.get(
      "/admin/bikes"
    );

  return data;
}


// Approve bike
export async function approveBike(
  id
) {

  const { data } =
    await api.put(
      `/admin/bikes/${id}/approve`
    );

  return data;
}


// Reject bike
export async function rejectBike(
  id,
  rejectionReason
) {

  const { data } =
    await api.put(
      `/admin/bikes/${id}/reject`,
      {
        rejectionReason,
      }
    );

  return data;
}