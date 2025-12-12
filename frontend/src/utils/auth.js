// utils/auth.js
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => {
  localStorage.setItem('token', token);
  window.dispatchEvent(new Event('authChange'));
};

export const removeToken = () => {
  localStorage.removeItem('token');
  window.dispatchEvent(new Event('authChange'));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  window.dispatchEvent(new Event('authChange'));
};

export const removeUser = () => {
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('authChange'));
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Проверка и обновление данных пользователя
export const updateUserData = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch('/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
      return userData;
    }
  } catch (error) {
    console.error('Ошибка обновления данных пользователя:', error);
  }
  return null;
};