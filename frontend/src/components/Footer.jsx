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
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { useState, useRef } from "react";
import Logo from "../logo.svg";
import LogoDark from "../logo_dark.svg";

export function Footer() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    hp: "", // honeypot скрытое поле
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
  const SUBMIT_COOLDOWN = 5000; // 5 секунд между запросами

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

    // Валидация
    if (!formData.name.trim()) {
      showModal("Ошибка", "Пожалуйста, введите ваше имя", true);
      return;
    }

    if (!validateEmail(formData.email)) {
      showModal("Ошибка", "Пожалуйста, введите корректный email адрес", true);
      return;
    }

    // Защита от частых запросов
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
      // Отправляем запрос с таймаутом
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут

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

    // Автозакрытие для успешных сообщений через 8 секунд
    if (!isError) {
      setTimeout(() => {
        if (isModalOpen) {
          setIsModalOpen(false);
        }
      }, 3000);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigationLinks = [
    { href: "/", label: "Главная" },
    { href: "/#tours", label: "Туры" },
    { href: "/#about", label: "О нас" },
    { href: "/#reviews", label: "Отзывы" },
  ];

  const features = [
    {
      icon: faAward,
      title: "Безопасная оплата",
      description: "Надёжная платёжная система",
    },
    {
      icon: faUsers,
      title: "Продуманная спонтанность",
      description: "Маршруты адаптируются под группу",
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
    { icon: faXTwitter, href: "https://x.com" },
    { icon: faInstagram, href: "https://instagram.com" },
    { icon: faFacebook, href: "https://facebook.com" },
    { icon: faYoutube, href: "https://youtube.com" },
  ];

  return (
    <footer className="py-16 relative overflow-hidden text-forest-dark dark:text-taupe bg-taupe dark:bg-[#0E1624]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ЛОГО */}
          <div className="lg:col-span-4">
            <img
              src={Logo}
              alt="KazWonder"
              className="w-40 mb-4 block dark:hidden"
            />

            <img
              src={LogoDark}
              alt="KazWonder"
              className="w-40 mb-4 hidden dark:block"
            />

            <p className="leading-relaxed text-sm mb-6 max-w-md text-gray-600 dark:text-taupe">
              KazWonder — премиальный маркетплейс авторских туров по Казахстану.
            </p>

            <div className="flex space-x-4">
              {socialIcons.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="w-10 h-10 rounded-lg bg-forest-dark/10 dark:bg-taupe/10 flex items-center justify-center hover:bg-forest-dark/20 dark:hover:bg-taupe/20 transition-all hover:scale-105"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-forest-dark dark:text-blue-400"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* ПРЕИМУЩЕСТВА */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-lg mb-6 text-forest-dark dark:text-taupe">
              Почему выбирают нас
            </h3>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <div className="shrink-0 w-6 h-6 bg-forest-dark/10 dark:bg-taupe/10 rounded-lg flex items-center justify-center group-hover:bg-forest-dark/20 dark:group-hover:bg-taupe/20 transition-colors">
                    <FontAwesomeIcon
                      icon={feature.icon}
                      className="text-forest-dark dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-forest-dark dark:text-taupe group-hover:text-forest-darker dark:group-hover:text-sand transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-xs opacity-70 text-gray-600 dark:text-taupe">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* НАВИГАЦИЯ */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-lg mb-6 text-forest-dark dark:text-taupe">
              Навигация
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-forest-darker dark:hover:text-sand transition-all block py-1 text-forest-dark dark:text-taupe"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ФОРМА */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-lg mb-6 text-forest-dark dark:text-taupe">
              Эксклюзивные подборки туров
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* honeypot */}
              <input
                type="text"
                name="hp"
                value={formData.hp}
                onChange={handleInputChange}
                className="hidden"
                autoComplete="off"
              />

              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-dark dark:text-blue-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ваш email"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-beige dark:bg-[#1a2435] 
                           text-forest-dark dark:text-taupe shadow-xs focus:shadow-xl
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border border-transparent focus:border-forest-dark dark:focus:border-blue-400
                           focus:outline-none transition-all disabled:opacity-50"
                />
              </div>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-dark dark:text-blue-400"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ваше имя"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-beige dark:bg-[#1a2435] 
                           text-forest-dark dark:text-taupe shadow-xs focus:shadow-xl
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border border-transparent focus:border-forest-dark dark:focus:border-blue-400
                           focus:outline-none transition-all disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer bg-forest-dark dark:bg-blue-400 text-white
                         py-3 rounded-xl font-medium hover:bg-forest-darker dark:hover:bg-blue-500 
                         active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin"
                    />
                    <span>Отправка...</span>
                  </>
                ) : (
                  "Подписаться на рассылку"
                )}
              </button>

              <p className="text-xs text-gray-600 dark:text-taupe/80 text-center">
                Отправляя форму, вы соглашаетесь с обработкой персональных
                данных
              </p>
            </form>
          </div>
        </div>

        {/* НИЖНЯЯ ЛИНИЯ */}
        <div className="border-t border-forest-dark/20 dark:border-taupe/20 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-taupe">
              © 2025 KazWonder. Все права защищены.
            </p>

            <ul className="flex gap-6 text-sm flex-wrap justify-center">
              <li>
                <p className="text-gray-600 dark:text-taupe hover:text-forest-darker dark:hover:text-sand transition-colors">
                  Политика конфиденциальности
                </p>
              </li>
              <li>
                <p className="text-gray-600 dark:text-taupe hover:text-forest-darker dark:hover:text-sand transition-colors">
                  Условия использования
                </p>
              </li>
              <li>
                <p className="text-gray-600 dark:text-taupe hover:text-forest-darker dark:hover:text-sand transition-colors">
                  Cookie policy
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* УЛУЧШЕННОЕ МОДАЛЬНОЕ ОКНО */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Оверлей с backdrop-filter */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Модальное окно */}
          <div
            className="relative bg-beige dark:bg-[#1a2435] rounded-2xl p-8 max-w-md w-full mx-4 
                         shadow-2xl transform transition-all animate-scaleIn"
          >
            {/* Иконка */}
            <div
              className={`flex justify-center mb-6 ${
                modalData.isError ? "text-red-500" : "text-green-500"
              }`}
            >
              <FontAwesomeIcon
                icon={modalData.isError ? faTimesCircle : faCheckCircle}
                className="text-5xl animate-bounceIn"
              />
            </div>

            {/* Заголовок */}
            <h2
              className={`text-2xl font-bold text-center mb-3 ${
                modalData.isError
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {modalData.title}
            </h2>

            {/* Сообщение */}
            <p className="text-center text-forest-dark dark:text-taupe mb-4">
              {modalData.message}
            </p>

            {/* Email для успешной подписки */}
            {!modalData.isError && modalData.email && (
              <div className="bg-forest-dark/5 dark:bg-taupe/5 rounded-lg p-3 mb-6 text-center">
                <p className="text-sm text-forest-dark/70 dark:text-taupe/70 mb-1">
                  Письмо отправлено на:
                </p>
                <p className="font-medium text-forest-dark dark:text-taupe">
                  {modalData.email}
                </p>
              </div>
            )}

            {/* Прогресс-бар для автозакрытия */}
            {!modalData.isError && (
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-green-500 animate-progressBar"
                  style={{ animationDuration: "8s" }}
                />
              </div>
            )}

            {/* Кнопка */}
            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className={`px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 ${
                  modalData.isError
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-forest-dark dark:bg-taupe text-white dark:text-[#0E1624] hover:bg-forest-darker dark:hover:bg-sand"
                }`}
              >
                {modalData.isError ? "Попробовать снова" : "Отлично!"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Стили для анимаций */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-progressBar {
          animation: progressBar linear forwards;
        }
      `}</style>
    </footer>
  );
}
