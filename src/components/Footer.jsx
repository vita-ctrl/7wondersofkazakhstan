import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faUsers,
  faMapLocationDot,
  faStar,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";

export function Footer() {
  const [formData, setFormData] = useState({ email: "", name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setFormData({ email: "", name: "" });
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const navigationLinks = [
    { href: "/", label: "Главная" },
    { href: "/#tours", label: "Туры" },
    { href: "/about", label: "О нас" },
    { href: "/reviews", label: "Отзывы" },
    { href: "/blog", label: "Блог" },
  ];

  const legalLinks = [
    { href: "/privacy", label: "Политика конфиденциальности" },
    { href: "/terms", label: "Условия использования" },
    { href: "/cookies", label: "Cookie policy" },
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
    { icon: faTwitter, href: "#\T" },
    { icon: faInstagram, href: "#" },
    { icon: faFacebook, href: "#" },
    { icon: faYoutube, href: "#" },
  ];

  return (
    <footer
      className="py-16 relative overflow-hidden text-[#274E13] bg-[#cab99e]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ЛОГО */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#274E13] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <h2 className="text-2xl font-bold text-[#274E13]">
                KazWonder
              </h2>
            </div>

            <p className="leading-relaxed text-sm mb-6 max-w-md text-[#274E13]">
              KazWonder — премиальный маркетплейс авторских туров по Казахстану.
              Мы создаём уникальные маршруты, наполненные эмоциями, природой
              и атмосферой настоящего приключения.
            </p>

            <div className="flex space-x-4">
              {socialIcons.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="w-10 h-10 rounded-lg bg-[#274E13]/10 hover:bg-[#274E13]/20 transition flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={item.icon} className="text-[#274E13]" />
                </a>
              ))}
            </div>
          </div>

          {/* ПРЕИМУЩЕСТВА */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-lg mb-6 text-[#274E13]">
              Почему выбирают нас
            </h3>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 bg-[#274E13]/10 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={feature.icon}
                      className="text-[#274E13] text-sm"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#274E13]">{feature.title}</h4>
                    <p className="text-xs text-[#274E13]/70">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* НАВИГАЦИЯ */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-lg mb-6 text-[#274E13]">
              Навигация
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[#274E13] hover:text-[#1f3f0f] transition block py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ФОРМА */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-lg mb-6 text-[#274E13]">
              Эксклюзивные подборки туров
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#274E13]/70"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ваш email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#274E13]/30 text-[#274E13] placeholder-[#274E13]/50 focus:border-[#274E13] outline-none"
                />
              </div>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#274E13]/70"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ваше имя"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#274E13]/30 text-[#274E13] placeholder-[#274E13]/50 focus:border-[#274E13] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#274E13] hover:bg-[#1f3f0f] text-white font-semibold py-3 rounded-xl transition"
              >
                {isSubmitting ? "Отправка..." : "Подписаться на рассылку"}
              </button>

              <p className="text-xs text-[#274E13]/60">
                Подписываясь, вы соглашаетесь с{" "}
                <a href="/privacy" className="underline text-[#274E13]">
                  Политикой конфиденциальности
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* НИЖНЯЯ ЛИНИЯ */}
        <div className="border-t border-[#274E13]/20 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#274E13]">
              © 2025 KazWonder. Все права защищены.
            </p>

            <ul className="flex gap-6 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[#274E13]/70 hover:text-[#274E13]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
}
