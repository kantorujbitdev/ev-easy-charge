const API_URL = import.meta.env.VITE_API_URL; // untuk Vite

export async function goLogin(username: string, password: string) {
  try {
    const response = await fetch(API_URL + "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Login gagal: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response Login:", data); // 🔍 Log data dari server
    return data;
  } catch (error) {
    console.error("Terjadi kesalahan saat login:", error);
    throw error;
  }
}

export async function goLogout(username: string) {
  try {
    const response = await fetch(API_URL + "/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });

    if (!response.ok) {
      throw new Error(`Logout gagal: ${response.status}`);
      return false;
    }

    const data = await response.json();
    console.log("Response Logout:", data); // 🔍 Log data dari server

    return true;
  } catch (error) {
    console.error("Terjadi kesalahan saat logout:", error);
    return false;
  }
}
