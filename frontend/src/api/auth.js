export async function registerUser(formData) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
      first_name: formData.username,
      last_name: "",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка регистрации");
  }

  return await response.json();
}
