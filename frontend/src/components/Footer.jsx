import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faUsers,
  faMapLocationDot,
  faStar,
  faEnvelope,
  faUser,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faArrowRight,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { useState, useRef, useEffect } from "react";
import Logo from "../logo.svg";
import LogoDark from "../logo_dark.svg";
import { HashLink } from "react-router-hash-link";

export function Footer() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    hp: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    isError: false,
    email: "",
  });

  const lastSubmitRef = useRef(0);
  const SUBMIT_COOLDOWN = 5000;

  // Подключаем уникальные шрифты
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(fontLink);

    return () => {
      if (fontLink.parentNode) {
        document.head.removeChild(fontLink);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showModal("Ошибка", "Пожалуйста, введите ваше имя", true);
      return;
    }

    if (!validateEmail(formData.email)) {
      showModal("Ошибка", "Пожалуйста, введите корректный email адрес", true);
      return;
    }

    const now = Date.now();
    if (now - lastSubmitRef.current < SUBMIT_COOLDOWN) {
      showModal(
        "Подождите",
        "Пожалуйста, подождите перед повторной отправкой",
        true
      );
      return;
    }

    lastSubmitRef.current = now;
    setIsSubmitting(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        showModal(
          "Успешно!",
          "Вы подписались на эксклюзивные подборки туров. Проверьте вашу почту!",
          false,
          formData.email
        );
        setFormData({ email: "", name: "", hp: "" });
      } else {
        const errorText = await res.text();
        let errorMessage = "Произошла ошибка. Попробуйте позже.";

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          if (res.status === 429) {
            errorMessage = "Слишком много запросов. Пожалуйста, подождите.";
          } else if (res.status >= 500) {
            errorMessage = "Временные проблемы с сервером. Попробуйте позже.";
          }
        }

        showModal("Ошибка отправки", errorMessage, true);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        showModal(
          "Таймаут",
          "Слишком долгое ожидание ответа. Проверьте соединение.",
          true
        );
      } else {
        showModal(
          "Ошибка соединения",
          "Не удалось подключиться к серверу.",
          true
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showModal = (title, message, isError = false, email = "") => {
    setModalData({
      title,
      message,
      isError,
      email,
    });
    setIsModalOpen(true);

    if (!isError) {
      setTimeout(() => {
        setIsModalOpen(false);
      }, 8000);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigationLinks = [
    { href: "/#top", label: "Главная" },
    { href: "/#tours", label: "Туры" },
    { href: "/#about", label: "О нас" },
    { href: "/#reviews", label: "Отзывы" },
  ];

  const features = [
    {
      icon: faShieldHalved,
      title: "Безопасная оплата",
      description: "Надёжная платёжная система с защитой данных",
    },
    {
      icon: faUsers,
      title: "Продуманная спонтанность",
      description: "Маршруты адаптируются под вашу группу",
    },
    {
      icon: faMapLocationDot,
      title: "Проверенные гиды",
      description: "Лучшие тревел-эксперты Казахстана",
    },
    {
      icon: faStar,
      title: "Высокий рейтинг",
      description: "Средняя оценка туров — 4.9/5",
    },
  ];

  const socialIcons = [
    { icon: faXTwitter, href: "https://x.com", label: "X/Twitter" },
    { icon: faInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: faFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: faYoutube, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <>
      <footer className="relative overflow-hidden bg-linear-to-br from-white via-[#FAF8F5] to-[#F2EFEA] dark:from-[#0A0E1A] dark:via-[#0E1624] dark:to-[#121826] font-['DM_Sans'] text-gray-900 dark:text-gray-100">

        {/* Декоративные элементы фона */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 dark:bg-blue-400 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-600 dark:bg-purple-600 rounded-full blur-[100px] animate-float-delayed" />
        </div>

        {/* Текстурный оверлей */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Центральный контейнер */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 pt-20 pb-12">
          {/* Основной контент */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
            {/* БРЕНДИНГ И СОЦИАЛЬНЫЕ СЕТИ */}
            <div className="lg:col-span-3 space-y-8 animate-fade-in-up">
              <div>
                <img
                  src={Logo}
                  alt="KazWonder"
                  className="w-44 mb-6 block dark:hidden select-none transition-transform hover:scale-105 duration-300"
                  draggable={false}
                />
                <img
                  src={LogoDark}
                  alt="KazWonder"
                  className="w-44 mb-6 hidden dark:block select-none transition-transform hover:scale-105 duration-300"
                  draggable={false}
                />

                <p className="text-[15px] leading-relaxed mb-8 max-w-sm">
                  Премиальный маркетплейс авторских туров по Казахстану.
                  Откройте для себя неизведанные уголки величественной природы.
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] mb-4 font-semibold">
                  Следите за нами
                </h4>
                <div className="flex gap-3">
                  {socialIcons.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      aria-label={item.label}
                      className="group relative w-12 h-12 rounded-2xl bg-white dark:bg-[#1a2435] 
                               border border-gray-200 dark:border-gray-700 
                               flex items-center justify-center 
                               transition-all duration-300 hover:shadow-lg hover:scale-110 
                               hover:border-amber-500 dark:hover:border-blue-400
                               overflow-hidden"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent dark:from-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-blue-400 transition-colors duration-300 relative z-10"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>



            {/* ПРЕИМУЩЕСТВА */}
            <div className="lg:col-span-3 animate-fade-in-up animation-delay-200">
              <h3 className="text-2xl font-semibold mb-8">
                Почему выбирают нас
              </h3>
              <ul className="space-y-6">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="group flex items-start gap-4 animate-slide-in-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-white to-gray-50 dark:from-[#1a2435] dark:to-[#1a2435]/50 
                                  border border-gray-200 dark:border-gray-700
                                  flex items-center justify-center 
                                  group-hover:border-amber-500 dark:group-hover:border-blue-400
                                  group-hover:shadow-md transition-all duration-300">
                      <FontAwesomeIcon
                        icon={feature.icon}
                        className="text-gray-900 dark:text-gray-100 text-lg"
                      />
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-semibold text-[15px] mb-1 
                                   group-hover:text-amber-600 dark:group-hover:text-blue-400 
                                   transition-colors duration-300">
                        {feature.title}
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* НАВИГАЦИЯ - ВЕРТИКАЛЬНО */}
            <div className="lg:col-span-2 animate-fade-in-up animation-delay-150">
              <h4 className="text-xs uppercase tracking-[0.2em] mb-6 font-semibold">
                Навигация
              </h4>

              <nav className="flex flex-col gap-4">
                {navigationLinks.map((link, index) => (
                  <HashLink
                    key={link.href}
                    smooth
                    to={link.href}
                    className="group flex items-center gap-3 
                   hover:text-amber-600 dark:hover:text-blue-400
                   transition-colors duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-amber-600 dark:group-hover:bg-blue-400 transition-colors" />
                    {link.label}
                  </HashLink>
                ))}
              </nav>
            </div>

            {/* ФОРМА ПОДПИСКИ */}
            <div className="lg:col-span-4 animate-fade-in-up animation-delay-400">
              <div className="relative">
                {/* Декоративная рамка */}
                <div className="absolute -inset-4 bg-linear-to-br from-amber-500/10 to-amber-600/10 dark:from-blue-400/5 dark:to-purple-600/5 rounded-3xl blur-xl" />

                <div className="relative bg-white/80 dark:bg-[#1a2435]/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-2">
                      Эксклюзивные подборки
                    </h3>
                    <p className="text-sm">
                      Получайте лучшие туры первыми
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="hp"
                      value={formData.hp}
                      onChange={handleInputChange}
                      className="hidden"
                      autoComplete="off"
                      tabIndex="-1"
                    />

                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 dark:group-focus-within:text-blue-400 transition-colors duration-300">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ваше имя"
                        required
                        disabled={isSubmitting}
                        className="w-full pl-12 pr-4 py-4 rounded-xl 
bg-gray-50 dark:bg-[#0E1624] 
text-gray-900 dark:text-gray-100 
border-2 border-gray-200 dark:border-gray-700
placeholder:text-gray-400 dark:placeholder:text-gray-500
focus:outline-none
focus:border-amber-500 dark:focus:border-blue-400
focus:ring-4 focus:ring-amber-500/20 dark:focus:ring-blue-400/10
transition-all duration-300
disabled:opacity-50 disabled:cursor-not-allowed
"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 dark:group-focus-within:text-blue-400 transition-colors duration-300">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Ваш email"
                        required
                        disabled={isSubmitting}
                        className="w-full pl-12 pr-4 py-4 rounded-xl 
bg-gray-50 dark:bg-[#0E1624] 
text-gray-900 dark:text-gray-100 
border-2 border-gray-200 dark:border-gray-700
placeholder:text-gray-400 dark:placeholder:text-gray-500
focus:outline-none
focus:border-amber-500 dark:focus:border-blue-400
focus:ring-4 focus:ring-amber-500/20 dark:focus:ring-blue-400/10
transition-all duration-300
disabled:opacity-50 disabled:cursor-not-allowed
"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full relative overflow-hidden
bg-white dark:bg-linear-to-r dark:from-blue-400 dark:to-blue-500
text-gray-900 dark:text-white
py-4 rounded-xl font-medium
border-2 border-gray-200 dark:border-transparent
transition-all duration-300
hover:shadow-xl hover:scale-[1.02]
hover:bg-gray-50 dark:hover:bg-blue-500
active:scale-[0.98]
disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
flex items-center justify-center gap-3"
                    >
                      <span className="relative z-10">
                        {isSubmitting ? "Отправка..." : "Подписаться на рассылку"}
                      </span>

                      {isSubmitting ? (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className="animate-spin relative z-10"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="transform group-hover:translate-x-1 transition-transform duration-300 relative z-10"
                        />
                      )}

                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    </button>

                    <p className="text-xs text-center leading-relaxed">
                      Отправляя форму, вы соглашаетесь с обработкой персональных данных
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* НИЖНИЙ КОЛОНТИТУЛ */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <p className="text-sm">
                © 2025 KazWonder. Все права защищены.
              </p>

              <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
                {["Политика конфиденциальности", "Условия использования", "Cookie policy"].map(
                  (item, i) => (
                    <li key={i}>
                      <button className="hover:text-amber-600 dark:hover:text-blue-400
                                      transition-colors duration-300">
                        {item}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* УЛУЧШЕННОЕ МОДАЛЬНОЕ ОКНО */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
          {/* Оверлей */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeModal}
          />

          {/* Модальное окно */}
          <div className="relative bg-white dark:bg-[#1a2435] rounded-3xl p-10 max-w-lg w-full 
                        shadow-2xl border border-gray-200 dark:border-gray-700
                        animate-scale-in font-['DM_Sans']">

            {/* Декоративный фон */}
            <div className={`absolute top-0 left-0 right-0 h-2 rounded-t-3xl ${modalData.isError
              ? "bg-linear-to-r from-red-500 to-orange-500"
              : "bg-linear-to-r from-emerald-500 to-teal-500"
              }`} />

            {/* Иконка */}
            <div className={`flex justify-center mb-6 ${modalData.isError ? "text-red-500" : "text-emerald-500"
              }`}>
              <div className="relative">
                <div className={`absolute inset-0 ${modalData.isError ? "bg-red-500/20" : "bg-emerald-500/20"
                  } rounded-full blur-xl animate-pulse`} />
                <FontAwesomeIcon
                  icon={modalData.isError ? faTimesCircle : faCheckCircle}
                  className="text-6xl relative z-10 animate-bounce-in"
                />
              </div>
            </div>

            {/* Заголовок */}
            <h2 className={`text-3xl font-bold text-center mb-4 ${modalData.isError
              ? "text-red-600 dark:text-red-400"
              : "text-emerald-600 dark:text-emerald-400"
              }`}>
              {modalData.title}
            </h2>

            {/* Сообщение */}
            <p className="text-center text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
              {modalData.message}
            </p>

            {/* Email для успешной подписки */}
            {!modalData.isError && modalData.email && (
              <div className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 
                            rounded-2xl p-4 mb-6 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm text-gray-900 dark:text-gray-100 mb-2 text-center">
                  Письмо отправлено на:
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-center">
                  {modalData.email}
                </p>
              </div>
            )}

            {/* Прогресс-бар для автозакрытия */}
            {!modalData.isError && (
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-linear-to-r from-emerald-500 to-teal-500 animate-progress-bar"
                  style={{ animationDuration: "8s" }}
                />
              </div>
            )}

            {/* Кнопка */}
            <button
              onClick={closeModal}
              className={`w-full py-4 rounded-xl font-medium transition-all duration-300
                       hover:scale-[1.02] active:scale-[0.98] ${modalData.isError
                  ? "bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                  : "bg-linear-to-r from-emerald-500 to-teal-500 dark:from-blue-400 dark:to-blue-500 text-white hover:shadow-xl"
                }`}
            >
              {modalData.isError ? "Попробовать снова" : "Отлично!"}
            </button>
          </div>
        </div>
      )}

      {/* АНИМАЦИИ */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(0.9); }
          66% { transform: translate(20px, -20px) scale(1.1); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes progress-bar {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-progress-bar {
          animation: progress-bar linear forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </>
  );
}