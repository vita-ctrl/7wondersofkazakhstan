export function Header() {
  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* <!-- ЛОГОТИП + МЕНЮ --> */}
          <div className="flex items-center space-x-8">
            {/* <!-- Логотип --> */}
            <a href="#" className="shrink-0 flex items-center">
              <span className="text-lg font-bold bg-linear-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                7 Wonders of Kazakhstan
              </span>
            </a>

            {/* <!-- Главное меню --> */}
            <div className="flex items-center space-x-6 whitespace-nowrap">
              {/* <!-- Путешествия --> */}
              <div className="flex gap-x-4 relative" data-dropdown>
                <a href="#" className="text-gray-700 font">
                  Путешествия
                </a>
                <a href="#" className="text-gray-700 font">
                  Путешествия
                </a>
                <a href="#" className="text-gray-700 font">
                  Контакты
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* <!-- 🔹 Переключатель темы --> */}
            <button
              id="theme-toggle"
              className="flex items-center justify-center border border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 rounded-md w-7 h-7 transition duration-300"
            >
              🌙
            </button>

            <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 px-3 py-1 rounded-md text-sm font-medium transition duration-300">
              Войти
            </button>
            <button className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-md text-sm font-medium transition duration-300">
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
