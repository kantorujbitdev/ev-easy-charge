// //src/lib/api_user.ts
// const API_URL = import.meta.env.VITE_API_URL; // untuk Vite

// export async function goLogin(username: string, password: string) {
//   try {
//     const response = await fetch(API_URL + "/api/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username: username,
//         password: password,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Login gagal: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Response Login:", data); // 🔍 Log data dari server
//     return data;
//   } catch (error) {
//     console.error("Terjadi kesalahan saat login:", error);
//     throw error;
//   }
// }

// export async function goLogout(username: string, token: string) {
//   try {
//     const response = await fetch(API_URL + "/api/auth/logout", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token, // opsional
//       },
//       body: JSON.stringify({
//         username: username,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Logout gagal: ${response.status}`);
//       return false;
//     }

//     const data = await response.json();
//     console.log("Response Logout:", data); // 🔍 Log data dari server

//     return true;
//   } catch (error) {
//     console.error("Terjadi kesalahan saat logout:", error);
//     return false;
//   }
// }

// src/lib/api_user.ts
import api from "./axios";

export interface ApiLoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
    vehicle: string;
    license_plate: string;
    email: string;
    phone: string;
    profile_image: string;
  };
}

export async function goLogin(
  username: string,
  password: string
): Promise<ApiLoginResponse> {
  try {
    const res = await api.post<ApiLoginResponse>("/auth/login", {
      username,
      password,
    });
    console.log("Response Login:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("Terjadi kesalahan saat login:", err);
    // lempar error dengan pesan dari server kalau ada
    throw new Error(err.response?.data?.message || err.message);
  }
}

export async function goLogout(
  username: string // masih dipakai body
): Promise<boolean> {
  try {
    const res = await api.post("/auth/logout", { username });
    console.log("Response Logout:", res.data);
    return true;
  } catch (err) {
    console.error("Terjadi kesalahan saat logout:", err);
    return false;
  }
}
