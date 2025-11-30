import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';


export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(isDarkMode);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newTheme = !isDark;
    setIsDark(newTheme);

    setTimeout(() => {
      if (newTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      setIsAnimating(false);
    }, 400);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
    relative flex items-center justify-center 
    w-11 h-11 
    group
    rounded-xl 
    bg-[#424E2B] dark:bg-blue-400
    hover:bg-[#E5D9C6] dark:hover:bg-white
    text-white 
    border-2 border-transparent 
    hover:border-[#424E2B] dark:hover:border-blue-400
    transition-all duration-300 
    transform hover:scale-105 
    shadow-md hover:shadow-lg
    ${isAnimating ? 'scale-95 rotate-180' : 'hover:rotate-6'}
  `}
      title={isDark ? "Переключить на светлую тему" : "Переключить на темную тему"}
      aria-label="Переключить тему"
      disabled={isAnimating}
    >

      {/* Иконка с улучшенной анимацией */}
      <span className={`
        text-xl transition-all duration-400 relative z-10 text-white
        ${isAnimating ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}
      `}>
        <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="group-hover:text-[#424E2B] dark:group-hover:text-blue-400" />
      </span>

      {/* Альтернативная иконка во время анимации */}
      <span className={`
        absolute text-xl transition-all duration-400 text-white
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
      `}>
        <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="group-hover:text-[#424E2B] dark:group-hover:text-blue-400" />
      </span>
    </button>
  );
}