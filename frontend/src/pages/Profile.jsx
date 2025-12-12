import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, setUser, getToken } from "../utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faSave, 
  faArrowLeft, 
  faCamera,
  faUserCircle 
} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    avatar: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Проверяем авторизацию
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    // Загружаем данные пользователя
    const user = getUser();
    if (user) {
      setCurrentUser(user);
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || ""
      });
      
      // Устанавливаем предпросмотр аватарки
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, avatar: "Пожалуйста, выберите изображение" });
        return;
      }
      
      // Проверяем размер файла (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, avatar: "Размер файла не должен превышать 5MB" });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatarPreview(base64String);
        setFormData(prev => ({
          ...prev,
          avatar: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = "Имя обязательно";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }
    
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Неверный формат телефона";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const token = getToken();
      
      // Формируем данные для отправки
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || ""
      };
      
      // Добавляем аватар только если он был изменен
      if (formData.avatar && formData.avatar !== currentUser?.avatar) {
        updateData.avatar = formData.avatar;
      }
      
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        
        // Обновляем данные в localStorage
        const existingUser = getUser();
        const newUserData = {
          ...existingUser,
          ...updatedUser,
          avatar: updatedUser.avatar || existingUser.avatar
        };
        setUser(newUserData);
        setCurrentUser(newUserData);
        
        // Обновляем preview аватарки
        if (updatedUser.avatar) {
          setAvatarPreview(updatedUser.avatar);
        }
        
        setSuccessMessage("Профиль успешно обновлен!");
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        // Обработка ошибок
        let errorMessage = "Ошибка обновления профиля";
        
        try {
          const errorText = await response.text();
          console.error("Текст ошибки:", errorText);
          
          if (response.status === 404) {
            errorMessage = "Сервер не найден. Проверьте подключение к интернету или URL адрес.";
          } else {
            // Пробуем распарсить JSON
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.detail || errorData.message || errorMessage;
            } catch {
              errorMessage = errorText || `HTTP ошибка: ${response.status}`;
            }
          }
        } catch (e) {
          errorMessage = "Ошибка при обработке ответа сервера";
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Ошибка обновления:", error);
      setErrors({ 
        general: error.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#E5D9C6] to-[#F5F0E8] dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-[#424E2B] dark:hover:text-white"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Назад
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
            <h1 className="text-3xl font-bold text-[#424E2B] dark:text-white mb-2">
              Редактировать профиль
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Обновите ваши личные данные
            </p>

            {/* Аватар пользователя */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Аватар" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Если изображение не загружается
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <FontAwesomeIcon 
                        icon={faUserCircle} 
                        className="text-6xl text-gray-400"
                      />
                    </div>
                  )}
                </div>
                
                <label className="absolute bottom-2 right-2 bg-[#424E2B] text-white p-3 rounded-full cursor-pointer hover:bg-[#2E371D] transition-colors shadow-lg">
                  <FontAwesomeIcon icon={faCamera} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold text-[#424E2B] dark:text-white">
                  {formData.first_name} {formData.last_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {formData.email}
                </p>
              </div>
              
              {errors.avatar && (
                <p className="text-red-500 text-sm mt-2">{errors.avatar}</p>
              )}
            </div>

            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                {successMessage}
              </div>
            )}

            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Имя *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3 pl-12
                        bg-white/50 dark:bg-gray-700/50
                        border ${errors.first_name ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                        rounded-xl
                        focus:ring-2 focus:ring-[#424E2B] dark:focus:ring-blue-500
                        focus:border-transparent
                        outline-none
                        transition-all
                      `}
                      placeholder="Введите ваше имя"
                    />
                    <FontAwesomeIcon 
                      icon={faUser} 
                      className="absolute left-4 top-4 text-gray-400"
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#424E2B] dark:focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Введите вашу фамилию"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3 pl-12
                        bg-white/50 dark:bg-gray-700/50
                        border ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                        rounded-xl
                        focus:ring-2 focus:ring-[#424E2B] dark:focus:ring-blue-500
                        focus:border-transparent
                        outline-none
                        transition-all
                      `}
                      placeholder="Введите ваш email"
                    />
                    <FontAwesomeIcon 
                      icon={faEnvelope} 
                      className="absolute left-4 top-4 text-gray-400"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Телефон
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3 pl-12
                        bg-white/50 dark:bg-gray-700/50
                        border ${errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                        rounded-xl
                        focus:ring-2 focus:ring-[#424E2B] dark:focus:ring-blue-500
                        focus:border-transparent
                        outline-none
                      `}
                      placeholder="+7 (999) 999-99-99"
                    />
                    <FontAwesomeIcon 
                      icon={faPhone} 
                      className="absolute left-4 top-4 text-gray-400"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    w-full bg-[#424E2B] text-white py-3 rounded-xl 
                    hover:bg-[#2E371D] dark:bg-blue-600 dark:hover:bg-blue-700 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center space-x-2 font-medium
                  "
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>{isLoading ? "Сохранение..." : "Сохранить изменения"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;