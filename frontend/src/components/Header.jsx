import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faCog,
  faBars,
  faTimes,
  faChevronDown,
  faPlane,
  faMapMarkerAlt,
  faCompass,
  faHome,
  faPhone,
  faRoute,
  faUserEdit
} from "@fortawesome/free-solid-svg-icons";
import { HashLink } from "react-router-hash-link";

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Проверяем авторизацию при загрузке и при изменении
  useEffect(() => {
    checkAuth();

    // Слушаем события авторизации/выхода
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  // Отслеживаем скролл для эффекта
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрываем мобильное меню при изменении роута
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);

    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new Event('authChange'));

    // Перенаправляем на главную
    navigate('/');
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/profile');
  }, [navigate]);

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Получаем инициалы пользователя
  const getUserInitials = useCallback(() => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  }, [user]);

  // Получаем отображаемое имя
  const getDisplayName = useCallback(() => {
    if (user?.first_name) {
      return user.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Профиль';
  }, [user]);

  return (
    <>
      <nav
        className={`
    font-['Inter']
    bg-[#F5EEDF] dark:bg-gray-900
    bg-opacity-95 dark:bg-opacity-95
    backdrop-blur-xl
    shadow-sm dark:shadow-gray-800/30
    fixed w-full z-50
    transition-all duration-500 ease-out
    border-b border-[#E6DCC8]/70 dark:border-gray-800/50
    ${scrolled ? 'py-2' : 'py-3'}
  `}
      >


        {/* Летящие облака фон */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
        </div>

        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-12">
            {/* ЛЕВАЯ ЧАСТЬ - МЕНЮ */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Главная с иконкой дома */}
              <HashLink
                smooth
                to="/#top"
                className="group relative text-gray-700 dark:text-gray-300 hover:text-[#424E2B] dark:hover:text-blue-400 font-semibold transition-all duration-300 text-lg"
              >
                <span className="relative inline-flex items-center gap-2">
                  <FontAwesomeIcon 
                    icon={faHome} 
                    className="text-[#424E2B]/70 dark:text-blue-400/70 group-hover:text-[#424E2B] dark:group-hover:text-blue-400 transition-colors group-hover:scale-110 transform duration-300" 
                  />
                  Главная
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-[#424E2B] to-[#5A6841] dark:from-blue-400 dark:to-blue-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </HashLink>

              {/* Контакты с иконкой телефона */}
              <Link
                to="/contacts"
                className="group relative text-gray-700 dark:text-gray-300 hover:text-[#424E2B] dark:hover:text-blue-400 font-semibold transition-all duration-300 text-lg"
              >
                <span className="relative inline-flex items-center gap-2">
                  <FontAwesomeIcon 
                    icon={faPhone} 
                    className="text-[#424E2B]/70 dark:text-blue-400/70 group-hover:text-[#424E2B] dark:group-hover:text-blue-400 transition-colors group-hover:rotate-12 transform duration-300" 
                  />
                  Контакты
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-[#424E2B] to-[#5A6841] dark:from-blue-400 dark:to-blue-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </Link>

              {/* Туры с иконкой маршрута */}
              <HashLink
                smooth
                to="/#tours"
                className="group relative text-gray-700 dark:text-gray-300 hover:text-[#424E2B] dark:hover:text-blue-400 font-semibold transition-all duration-300 text-lg"
              >
                <span className="relative inline-flex items-center gap-2">
                  <FontAwesomeIcon 
                    icon={faRoute} 
                    className="text-[#424E2B]/70 dark:text-blue-400/70 group-hover:text-[#424E2B] dark:group-hover:text-blue-400 transition-colors group-hover:translate-x-1 transform duration-300" 
                  />
                  Туры
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-[#424E2B] to-[#5A6841] dark:from-blue-400 dark:to-blue-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </HashLink>
            </div>

            {/* ПРАВАЯ ЧАСТЬ */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* AUTH BUTTON/PROFILE - DESKTOP */}
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="
                        group
                        flex items-center space-x-2
                        bg-linear-to-r from-[#424E2B] to-[#5A6841]
                        dark:from-blue-500 dark:to-blue-600
                        text-white 
                        pl-1.5 pr-3 py-1.5
                        rounded-xl
                        font-semibold 
                        transition-all duration-300
                        hover:shadow-lg hover:shadow-[#424E2B]/30 dark:hover:shadow-blue-500/30
                        hover:scale-105
                        border-2 border-transparent
                        hover:border-white/20
                        relative
                        overflow-hidden
                        text-sm
                      "
                    >
                      {/* Блик анимация */}
                      <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                      {/* Avatar с пульсацией */}
                      <div className="relative">
                        <div className="w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-xs border-2 border-white/30 group-hover:bg-white/30 transition-colors relative z-10">
                          {getUserInitials()}
                        </div>
                        <div className="absolute inset-0 bg-white/30 rounded-full animate-ping-slow opacity-75"></div>
                      </div>

                      <span className="max-w-[80px] truncate relative z-10 text-sm">{getDisplayName()}</span>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-[10px] transition-transform duration-300 relative z-10 ${dropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown меню */}
                    {dropdownOpen && (
                      <div className="
                        absolute right-0 mt-3 w-72
                        bg-white dark:bg-gray-800
                        rounded-2xl shadow-2xl
                        border border-gray-200 dark:border-gray-700
                        overflow-hidden
                        animate-dropdown
                      ">
                        {/* Информация о пользователе */}
                        <div className="p-5 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 relative overflow-hidden">
                          {/* Декоративные элементы */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#424E2B]/10 to-transparent dark:from-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                          <div className="flex items-start gap-3 relative z-10">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-linear-to-r from-[#424E2B] to-[#5A6841] dark:from-blue-500 dark:to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                                {getUserInitials()}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 dark:text-white truncate text-base">
                                {user?.first_name} {user?.last_name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">
                                {user?.email}
                              </p>
                              <div className="mt-2 flex items-center gap-1 text-xs text-[#424E2B] dark:text-blue-400">
                                <FontAwesomeIcon icon={faPlane} className="text-xs" />
                                <span className="font-medium">Готов к приключениям</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Меню */}
                        <div className="py-2 px-3">
                          {/* Прямоугольная кнопка редактирования профиля */}
                          <button
                            onClick={handleProfileClick}
                            className="
                              w-full
                              flex items-center justify-center gap-2
                              bg-linear-to-r from-gray-100 to-gray-50
                              dark:from-gray-700 dark:to-gray-600
                              hover:from-[#424E2B]/10 hover:to-[#5A6841]/10
                              dark:hover:from-blue-500/20 dark:hover:to-blue-600/20
                              text-gray-700 dark:text-gray-200
                              font-semibold
                              py-3 px-4
                              rounded-xl
                              border border-gray-200 dark:border-gray-600
                              hover:border-[#424E2B]/30 dark:hover:border-blue-500/30
                              transition-all duration-300
                              group
                              shadow-sm hover:shadow-md
                            "
                          >
                            <FontAwesomeIcon 
                              icon={faUserEdit} 
                              className="text-[#424E2B] dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" 
                            />
                            <span>Редактировать профиль</span>
                          </button>

                          <div className="h-px bg-linear-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-3" />

                          <button
                            onClick={handleLogout}
                            className="
                              w-full text-left px-4 py-3
                              flex items-center gap-3
                              text-red-600 dark:text-red-400
                              hover:bg-linear-to-r hover:from-red-50 hover:to-red-100
                              dark:hover:from-red-900/20 dark:hover:to-red-900/30
                              transition-all duration-200
                              rounded-xl
                              group
                            "
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                              <FontAwesomeIcon icon={faSignOutAlt} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                            <span className="font-medium">Выйти</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="
                      group
                      relative 
                      inline-flex
                      items-center
                      justify-center
                      bg-linear-to-r from-[#424E2B] to-[#5A6841]
                      dark:from-blue-500 dark:to-blue-600
                      text-white 
                      px-6 py-2
                      rounded-xl
                      font-bold
                      text-base
                      transition-all duration-300
                      hover:shadow-lg hover:shadow-[#424E2B]/30 dark:hover:shadow-blue-500/30
                      hover:scale-105
                      overflow-hidden
                      border-2 border-transparent
                      hover:border-white/20
                    "
                  >
                    <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <span className="relative">Войти</span>
                  </Link>
                )}
              </div>

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden relative w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors overflow-hidden group"
                aria-label="Toggle menu"
              >
                <span className="absolute inset-0 bg-linear-to-r from-[#424E2B]/10 to-[#5A6841]/10 dark:from-blue-500/10 dark:to-blue-600/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-lg"></span>
                <FontAwesomeIcon
                  icon={mobileMenuOpen ? faTimes : faBars}
                  className="text-xl transition-all duration-300 relative z-10 group-hover:rotate-90"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`
          md:hidden fixed inset-0 z-40 transition-all duration-300 ease-out
          ${mobileMenuOpen ? 'visible' : 'invisible'}
        `}
        style={{ top: scrolled ? '56px' : '64px' }}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`
            absolute top-0 right-0 w-full max-w-sm h-full
            bg-white dark:bg-gray-900
            shadow-2xl
            transform transition-transform duration-300 ease-out
            overflow-y-auto
            ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="p-6 space-y-6">
            {/* User Info - Mobile */}
            {isAuthenticated && user && (
              <div className="pb-6 border-b border-gray-200 dark:border-gray-700 relative overflow-hidden">
                {/* Декоративный фон */}
                <div className="absolute inset-0 bg-linear-to-br from-[#424E2B]/5 to-transparent dark:from-blue-500/5 rounded-xl"></div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-linear-to-r from-[#424E2B] to-[#5A6841] dark:from-blue-500 dark:to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {getUserInitials()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-[#424E2B] dark:text-blue-400">
                      <FontAwesomeIcon icon={faCompass} className="animate-spin-slow" />
                      <span>Исследователь</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links - Mobile */}
            <nav className="space-y-2">
              <HashLink
                smooth
                to="/#top"
                className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-linear-to-r hover:from-[#424E2B]/10 hover:to-[#5A6841]/5 dark:hover:from-blue-500/10 dark:hover:to-blue-600/5 transition-all font-semibold text-base group"
              >
                <span className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faHome} className="text-[#424E2B] dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  Главная
                </span>
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </HashLink>

              <Link
                to="/contacts"
                className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-linear-to-r hover:from-[#424E2B]/10 hover:to-[#5A6841]/5 dark:hover:from-blue-500/10 dark:hover:to-blue-600/5 transition-all font-semibold text-base group"
              >
                <span className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faPhone} className="text-[#424E2B] dark:text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
                  Контакты
                </span>
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>

              <HashLink
                smooth
                to="/#tours"
                className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-linear-to-r hover:from-[#424E2B]/10 hover:to-[#5A6841]/5 dark:hover:from-blue-500/10 dark:hover:to-blue-600/5 transition-all font-semibold text-base group"
              >
                <span className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faRoute} className="text-[#424E2B] dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                  Туры
                </span>
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </HashLink>
            </nav>

            {/* Theme Toggle - Mobile */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="text-xl">🌓</span>
                  Тема
                </span>
                <ThemeToggle />
              </div>
            </div>

            {/* Auth Actions - Mobile */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {isAuthenticated ? (
                <>
                  {/* Прямоугольная кнопка редактирования профиля - Mobile */}
                  <button
                    onClick={handleProfileClick}
                    className="
                      w-full
                      flex items-center justify-center gap-2
                      bg-linear-to-r from-gray-100 to-gray-50
                      dark:from-gray-800 dark:to-gray-700
                      hover:from-[#424E2B]/10 hover:to-[#5A6841]/10
                      dark:hover:from-blue-500/20 dark:hover:to-blue-600/20
                      text-gray-700 dark:text-gray-200
                      font-semibold
                      py-4 px-4
                      rounded-xl
                      border border-gray-200 dark:border-gray-600
                      hover:border-[#424E2B]/30 dark:hover:border-blue-500/30
                      transition-all duration-300
                      group
                      shadow-sm hover:shadow-md
                    "
                  >
                    <FontAwesomeIcon 
                      icon={faUserEdit} 
                      className="text-[#424E2B] dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" 
                    />
                    <span>Редактировать профиль</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="
                      w-full flex items-center justify-center gap-3 px-4 py-4
                      rounded-xl text-red-600 dark:text-red-400
                      bg-red-50 dark:bg-red-900/20
                      hover:bg-red-100 dark:hover:bg-red-900/30
                      border border-red-200 dark:border-red-800
                      transition-all font-semibold text-base group
                    "
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="group-hover:translate-x-1 transition-transform" />
                    <span>Выйти</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="
                    relative overflow-hidden
                    block w-full text-center
                    bg-linear-to-r from-[#424E2B] to-[#5A6841]
                    dark:from-blue-500 dark:to-blue-600
                    text-white font-bold
                    px-6 py-4 rounded-xl
                    hover:shadow-lg
                    transition-all duration-300
                    group
                  "
                >
                  <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faPlane} className="group-hover:translate-x-2 transition-transform" />
                    Начать путешествие
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-dropdown {
          animation: dropdown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Облака анимация */
        .cloud {
          position: absolute;
          background: linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.4));
          border-radius: 100px;
          opacity: 0.6;
        }

        .dark .cloud {
          background: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
        }

        .cloud::before,
        .cloud::after {
          content: '';
          position: absolute;
          background: inherit;
          border-radius: 100px;
        }

        .cloud-1 {
          width: 100px;
          height: 30px;
          top: 20%;
          animation: float-cloud-1 40s infinite linear;
        }

        .cloud-1::before {
          width: 50px;
          height: 40px;
          top: -20px;
          left: 10px;
        }

        .cloud-1::after {
          width: 60px;
          height: 30px;
          top: -10px;
          right: 10px;
        }

        .cloud-2 {
          width: 80px;
          height: 25px;
          top: 60%;
          animation: float-cloud-2 50s infinite linear;
          animation-delay: -10s;
        }

        .cloud-2::before {
          width: 40px;
          height: 35px;
          top: -15px;
          left: 15px;
        }

        .cloud-2::after {
          width: 50px;
          height: 25px;
          top: -8px;
          right: 15px;
        }

        .cloud-3 {
          width: 120px;
          height: 35px;
          top: 40%;
          animation: float-cloud-3 60s infinite linear;
          animation-delay: -30s;
        }

        .cloud-3::before {
          width: 60px;
          height: 45px;
          top: -22px;
          left: 20px;
        }

        .cloud-3::after {
          width: 70px;
          height: 35px;
          top: -12px;
          right: 20px;
        }

        @keyframes float-cloud-1 {
          from { left: -150px; }
          to { left: 100%; }
        }

        @keyframes float-cloud-2 {
          from { left: -120px; }
          to { left: 100%; }
        }

        @keyframes float-cloud-3 {
          from { left: -180px; }
          to { left: 100%; }
        }

        /* Медленная пульсация */
        @keyframes ping-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.75;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Медленное вращение */
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        /* Prevent body scroll when mobile menu is open */
        ${mobileMenuOpen ? 'body { overflow: hidden; }' : ''}
      `}</style>
    </>
  );
}