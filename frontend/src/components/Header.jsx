import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons";

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Проверяем авторизацию при загрузке и при изменении
  useEffect(() => {
    checkAuth();

    // Слушаем события авторизации/выхода
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setDropdownOpen(false);

    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new Event('authChange'));

    // Перенаправляем на главную
    navigate('/');
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className="bg-taupe dark:bg-gray-900/80 backdrop-blur-md shadow-sm dark:shadow-gray-800/30 fixed w-full z-50 transition-all duration-300 border-b border-gray-100/50 dark:border-gray-800/50">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-15">
          {/* ЛОГОТИП + МЕНЮ */}
          <div className="flex items-center space-x-10 h-15">
            {/* Главное меню */}
            <div className="md:flex items-center space-x-8">
              {/* Главная */}
              <Link
                to="/"
                className="relative text-olive-dark dark:text-beige hover:text-olive-dark dark:hover:text-blue-400 font-medium transition-all duration-300 group"
              >
                <span className="relative text-xl">
                  Главная
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-olive-dark dark:bg-blue-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </Link>

              {/* Контакты */}
              <Link
                to="/contacts"
                className="relative text-olive-dark dark:text-beige hover:text-olive-dark dark:hover:text-blue-400 font-medium transition-all duration-300 group"
              >
                <span className="relative text-xl">
                  Контакты
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-olive-dark dark:bg-blue-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </Link>

              {/* Туры */}
              <a
                href="/#tours"
                className="relative text-olive-dark dark:text-beige hover:text-olive-dark dark:hover:text-blue-400 font-medium transition-all duration-300 group"
              >
                <span className="relative text-xl">
                  Туры
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-olive-dark dark:bg-blue-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </a>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Кнопка Войти или Профиль */}
            {isAuthenticated ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="
                    flex items-center space-x-2
                    relative 
                    bg-[#424E2B]
                    text-white 
                    px-4 py-2 
                    rounded-xl 
                    font-semibold 
                    transition-all duration-300 
                    border-2 border-transparent
                    hover:bg-beige
                    hover:text-olive-dark
                    hover:border-olive-dark
                    dark:bg-blue-400
                    dark:text-white
                    dark:hover:bg-gray-900
                    dark:hover:text-blue-400
                    dark:hover:border-blue-400
                  "
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-sm" />
                  </div>
                  <span>{user?.first_name || user?.email?.split('@')[0] || 'Профиль'}</span>
                </button>

                {/* Dropdown меню */}
                {dropdownOpen && (
                  <div className="
                    absolute right-0 mt-2 w-56
                    bg-white dark:bg-gray-800
                    rounded-xl shadow-xl
                    border border-gray-200 dark:border-gray-700
                    overflow-hidden
                    animate-fadeIn
                  ">
                    {/* Информация о пользователе */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Меню */}
                    <div className="py-1">
                      <button
                        onClick={handleProfileClick}
                        className="
                          w-full text-left px-4 py-3
                          flex items-center space-x-3
                          text-gray-700 dark:text-gray-300
                          hover:bg-gray-100 dark:hover:bg-gray-700
                          transition-colors
                        "
                      >
                        <FontAwesomeIcon icon={faCog} className="text-gray-500" />
                        <span>Редактировать профиль</span>
                      </button>

                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="
                          w-full text-left px-4 py-3
                          flex items-center space-x-3
                          text-red-600 dark:text-red-400
                          hover:bg-red-50 dark:hover:bg-red-900/20
                          transition-colors
                        "
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Выйти</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="
                  relative 
                  bg-[#424E2B]
                  text-white 
                  px-6 py-2 
                  rounded-xl 
                  font-semibold 
                  transition-all duration-300 
                  border-2 border-transparent
                  hover:bg-beige
                  hover:text-olive-dark
                  hover:border-olive-dark
                  dark:bg-blue-400
                  dark:text-white
                  dark:hover:bg-gray-900
                  dark:hover:text-blue-400
                  dark:hover:border-blue-400
                "
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}