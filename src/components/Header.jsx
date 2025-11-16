import ThemeToggle from "./ThemeToggle";

export function Header() {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800/50 fixed w-full z-50 transition-colors duration-300 pl-30 pr-10">
      <div className="w-full mx-auto pl-2 pr-8 sm:pl-4 sm:pr-10">
        <div className="flex justify-between items-center h-16">
          {/* <!-- ЛОГОТИП + МЕНЮ --> */}
          <div className="flex items-center space-x-8">
            {/* <!-- Логотип --> */}
            <a href="/" className="shrink-0 flex items-center">
              <span className="text-lg font-bold bg-linear-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
                KazWonder
              </span>
            </a>
            {/* <!-- Главное меню --> */}
            <div className="flex items-center space-x-6 whitespace-nowrap">
              {/* <!-- Путешествия --> */}
              <div className="flex gap-x-4 relative" data-dropdown>
                <a
                  href="/"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font transition-colors duration-200"
                >
                  Главная
                </a>
                <a
                  href="/contacts"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font transition-colors duration-200"
                >
                  Контакты
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* <!-- 🔹 Переключатель темы --> */}
            <ThemeToggle />
            <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 px-3 py-1 rounded-md text-sm font-medium transition duration-300">
              Войти
            </button>
            {/* <button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-3 py-1 rounded-md text-sm font-medium transition duration-300">
              Зарегистрироваться
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
