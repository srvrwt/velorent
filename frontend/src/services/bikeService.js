import api from "./api";

export const addBike = async (bikeData) => {
  const response = await api.post(
    "/bikes",
    bikeData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export async function getApprovedBikes() {
  const { data } = await api.get("/bikes/approved");

  return data;
}

export const getMyBikes = async () => {
  const response = await api.get(
    "/bikes/my-bikes"
  );

  return response.data;
};


// BIKE MANAGEMENT


// Get all bikes
export const getAllBikes = async () => {
  const response = await api.get(
    "/admin/bikes"
  );

  return response.data;
};


// Approve bike
export const approveBike = async (id) => {
  const response = await api.put(
    `/admin/bikes/${id}/approve`
  );

  return response.data;
};


// Reject bike
export const rejectBike = async (
  id,
  rejectionReason
) => {
  const response = await api.put(
    `/admin/bikes/${id}/reject`,
    {
      rejectionReason,
    }
  );

  return response.data;
};

