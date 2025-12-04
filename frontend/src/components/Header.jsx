import ThemeToggle from "./ThemeToggle";
import Logo from "../logo.svg";
import { Link } from "react-router-dom";

export function Header() {
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

            {/* Войти */}
            <a
              href="/login"
              className="
                relative 
                bg-olive-dark dark:bg-blue-400
                text-white 
                px-6 py-2.5 
                rounded-xl 
                font-semibold 
                transition-all duration-300 
                border-2 border-transparent
                hover:bg-beige dark:hover:bg-gray-900
                hover:text-olive-dark dark:hover:text-blue-400
                hover:border-olive-dark dark:hover:border-blue-400
              "
            >
              Войти
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
