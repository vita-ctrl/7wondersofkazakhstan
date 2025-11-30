import ThemeToggle from "./ThemeToggle";
import Logo from "../logo.svg";

export function Header() {
  return (
    <nav className="bg-[#cab99e] dark:bg-gray-900/80 backdrop-blur-md shadow-sm dark:shadow-gray-800/30 fixed w-full z-50 transition-all duration-300 border-b border-gray-100/50 dark:border-gray-800/50">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-15">
          {/* ЛОГОТИП + МЕНЮ */}
          <div className="flex items-center space-x-10 h-15">
            {/* Главное меню */}
            <div className="md:flex items-center space-x-8">
              <a
                href="/"
                className="relative text-[#424e2b] dark:text-[#E5D9C6] hover:text-[blue-600] dark:hover:text-blue-400 font-medium transition-all duration-300 group"
              >
                <span className="relative text-xl">
                  Главная
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#424E2B] dark:bg-blue-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </a>

              <a
                href="/contacts"
                className="relative text-[#424e2b] dark:text-[#E5D9C6] hover:text-[#424E2B] dark:hover:text-blue-400 font-medium transition-all duration-300 group"
              >
                <span className="relative text-xl">
                  Контакты
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#424E2B] dark:bg-blue-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </a>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ */}
          <div className="flex items-center space-x-4">
            {/* Переключатель темы */}
            <ThemeToggle />

            <button
              className="
    relative 
    bg-[#424E2B] dark:bg-blue-400
    text-white 
    px-6 py-2.5 
    rounded-xl 
    font-semibold 
    transition-all 
    duration-300 
    border-2 
    border-transparent
    hover:bg-[#E5D9C6] dark:hover:bg-white
    hover:text-[#424E2B] dark:hover:text-blue-400
    hover:border-[#424E2B] dark:hover:border-blue-400
  "
            >
              Войти
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}