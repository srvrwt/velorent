import axios from "axios";

export async function googleLogin(credential) {
  const response = await axios.post(
    "http://localhost:5000/api/auth/google",
    {
      credential,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
}