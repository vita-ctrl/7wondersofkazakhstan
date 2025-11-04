export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-800 text-white py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Три ровных колонки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Колонка 1 */}
          <div>
            <h3 className="text-lg font-bold mb-4">KazWonder</h3>
            <p className="text-gray-400 dark:text-gray-300">
              KazWonder — создаем незабываемые приключения с 2008 года.
              Присоединяйтесь к нам на маршруте и откройте всю красоту
              Казахстана!
            </p>
          </div>

          {/* Колонка 2 */}
          <div>
            <h4 className="text-lg font-bold mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2 text-gray-400 dark:text-gray-300">
              <li>
                <a
                  href="Основа.html"
                  className="hover:text-white dark:hover:text-gray-100"
                >
                  Главная
                </a>
              </li>
              <li>
                <a
                  href="#tours"
                  className="hover:text-white dark:hover:text-gray-100"
                >
                  Туры
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="hover:text-white dark:hover:text-gray-100"
                >
                  Галерея
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-white dark:hover:text-gray-100"
                >
                  О нас
                </a>
              </li>
            </ul>
          </div>

          {/* Колонка 3 */}
          <div>
            <h4 className="text-lg font-bold mb-4">Поддержка</h4>
            <ul className="space-y-2 text-gray-400 dark:text-gray-300">
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-100"
                >
                  Часто задаваемые вопросы
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-100"
                >
                  Политика бронирования
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-100"
                >
                  Руководство по безопасности
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-100"
                >
                  Условия и положения
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-100"
                >
                  Политика конфиденциальности
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя линия и копирайт */}
        <div className="pt-8 text-center border-t border-gray-700 dark:border-gray-600 mt-8">
          <p className="text-gray-400 dark:text-gray-400 text-sm">
            © 2025 KazWonder. Все права защищены.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white dark:hover:text-gray-100"
            >
              <i data-feather="facebook" className="w-5 h-5"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white dark:hover:text-gray-100"
            >
              <i data-feather="instagram" className="w-5 h-5"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white dark:hover:text-gray-100"
            >
              <i data-feather="twitter" className="w-5 h-5"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white dark:hover:text-gray-100"
            >
              <i data-feather="youtube" className="w-5 h-5"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
