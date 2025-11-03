export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Три ровных колонки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Колонка 1 */}
          <div>
            <h3 className="text-lg font-bold mb-4">7 Wonders of Kazakhstan</h3>
            <p className="text-gray-400">
              7 Wonders of Kazakhstan — создаем незабываемые приключения с 2000
              года. Присоединяйтесь к нам на маршруте и откройте всю красоту
              Казахстана!
            </p>
          </div>

          {/* Колонка 2 */}
          <div>
            <h4 className="text-lg font-bold mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="Основа.html" className="hover:text-white">
                  Главная
                </a>
              </li>
              <li>
                <a href="#tours" className="hover:text-white">
                  Туры
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white">
                  Галерея
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white">
                  О нас
                </a>
              </li>
            </ul>
          </div>

          {/* Колонка 3 */}
          <div>
            <h4 className="text-lg font-bold mb-4">Поддержка</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="поддержка.html#faq" className="hover:text-white">
                  Часто задаваемые вопросы
                </a>
              </li>
              <li>
                <a href="поддержка.html#booking" className="hover:text-white">
                  Политика бронирования
                </a>
              </li>
              <li>
                <a href="поддержка.html#safety" className="hover:text-white">
                  Руководство по безопасности
                </a>
              </li>
              <li>
                <a href="поддержка.html#terms" className="hover:text-white">
                  Условия и положения
                </a>
              </li>
              <li>
                <a href="поддержка.html#privacy" className="hover:text-white">
                  Политика конфиденциальности
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя линия и копирайт */}
        <div className="pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 7 Wonders of Kazakhstan. Все права защищены.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <i data-feather="facebook" className="w-5 h-5"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <i data-feather="instagram" className="w-5 h-5"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <i data-feather="twitter" className="w-5 h-5"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <i data-feather="youtube" className="w-5 h-5"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
