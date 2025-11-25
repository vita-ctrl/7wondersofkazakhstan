import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faMapLocationDot,
  faUsers,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import { faClock, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import Carousel from "../components/TourCarousel";
import ReviewCard from "../components/ReviewCard";


export default function Index() {
  return (
    <>
      {/* HERO */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <img
          src="hero.jpg"
          alt="Kazakhstan"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-5xl">
            Авторские туры — новый формат насыщенных путешествий<br />
          </h1>
        </div>
      </div>

      {/* Преимущества — фон #E5D9C6 , текст #424E2B */}
      <section className="mt-16 mb-6 bg-[#E5D9C6] dark:bg-slate-900">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 text-center">

            {/* 1 */}
            <div>
              <FontAwesomeIcon
                icon={faAward}
                className="text-4xl mb-4 text-[#6c9225] dark:text-[#E5D9C6] "
              />
              <h3 className="font-bold mb-2 text-[#424E2B] dark:text-[#E5D9C6]">
                Безопасная оплата
              </h3>
              <p className="text-sm text-[#424E2B] dark:text-[#E5D9C6]">
                Бронируйте туры через нашу надежную платежную систему
              </p>
            </div>

            {/* 2 */}
            <div>
              <FontAwesomeIcon
                icon={faUsers}
                className="text-4xl mb-4 text-[#6c9225] dark:text-[#E5D9C6]"
              />
              <h3 className="font-bold mb-2 text-[#424E2B] dark:text-[#E5D9C6]">
                Продуманная спонтанность
              </h3>
              <p className="text-sm text-[#424E2B] dark:text-[#E5D9C6]">
                Маршруты могут адаптироваться под пожелания группы
              </p>
            </div>

            {/* 3 */}
            <div>
              <FontAwesomeIcon
                icon={faMapLocationDot}
                className="text-4xl mb-4 text-[#6c9225] dark:text-[#E5D9C6]"
              />
              <h3 className="font-bold mb-2 text-[#424E2B] dark:text-[#E5D9C6]">
                Проверенные тревел-эксперты
              </h3>
              <p className="text-sm text-[#424E2B] dark:text-[#E5D9C6]">
                В нашей базе 3 гида, прошедших тщательный отбор
              </p>
            </div>

            {/* 4 */}
            <div>
              <FontAwesomeIcon
                icon={faStar}
                className="text-4xl mb-4 text-[#6c9225] dark:text-[#E5D9C6]"
              />
              <h3 className="font-bold mb-2 text-[#424E2B] dark:text-[#E5D9C6]">
                Гарантированные туры
              </h3>
              <p className="text-sm text-[#424E2B] dark:text-[#E5D9C6]">
                7 туров с гарантированным отправлением
              </p>
            </div>

            {/* 5 */}
            <div>
              <FontAwesomeIcon
                icon={faClock}
                className="text-4xl mb-4 text-[#6c9225] dark:text-[#E5D9C6]"
              />
              <h3 className="font-bold mb-2 text-[#424E2B] dark:text-[#E5D9C6]">
                Небольшие группы
              </h3>
              <p className="text-sm text-[#424E2B] dark:text-[#E5D9C6]">
                Атмосфера в компании единомышленников
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Популярные туры */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="tours">
        <div className="text-center pt-15">
          <h2
            className="text-3xl font-bold mb-4 text-[#424E2B] dark:text-[#E5D9C6]"
          >
            Популярные туры
          </h2>
        </div>
      </div>
      <Carousel />

      {/* Блок отзывов */}
      <div className="max-w-7xl mb-12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#424E2B] dark:text-[#E5D9C6] mb-4">
            Отзывы наших путешественников
          </h2>
          <p className="text-lg text-[#424E2B] dark:text-[#E5D9C6] max-w-3xl mx-auto">
            Настоящие эмоции и впечатления людей, которые увидели Казахстан
            вместе с нами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReviewCard
            logo="https://placehold.co/100x100/4F46E5/FFFFFF?text=ИЕ"
            name="Иванова Елизавета"
            rating={4}
            text="Поездка оставила только приятные впечатления. Всё организовано аккуратно и с заботой, чувствуется профессионализм команды."
          />

          <ReviewCard
            logo="https://placehold.co/100x100/10B981/FFFFFF?text=ШМ"
            name="Шабельникова Марина"
            rating={5}
            text="Места невероятно красивые! Организация на высшем уровне, всё чётко, комфортно и очень душевно. Настоящее приключение!"
          />

          <ReviewCard
            logo="https://placehold.co/100x100/F59E0B/FFFFFF?text=РВ"
            name="Руденко Виталий"
            rating={5}
            text="Встретили отлично, маршрут насыщенный и интересный. Понравилось абсолютно всё — вернусь ещё раз!"
          />

          <ReviewCard
            logo="https://placehold.co/100x100/3B82F6/FFFFFF?text=ШМ"
            name="Шелконогов Марк"
            rating={5}
            text="Огромное спасибо за эту поездку! Команда супер, атмосфера дружелюбная. Получил больше эмоций, чем ожидал."
          />

          <ReviewCard
            logo="https://placehold.co/100x100/E11D48/FFFFFF?text=АТ"
            name="Абдыкадыров Тамерлан"
            rating={5}
            text="Каждый день был наполнен впечатлениями. Организация продумана до мелочей. Казахстан открывается совершенно по-другому!"
          />

          <ReviewCard
            logo="https://placehold.co/100x100/8B5CF6/FFFFFF?text=ДА"
            name="Дуйсенбек Альфарабиулы"
            rating={5}
            text="Гиды внимательные и профессиональные. Природа просто великолепная. Поездка превзошла ожидания — рекомендую от души."
          />
        </div>
      </div>



      <div className="w-full py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* GOOGLE REVIEWS */}
            <div className="bg-[#e7e1d5] dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                {/* Логотип Google */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                    <div className="flex items-center space-x-1 text-xl font-bold">
                      <span className="text-[#4285F4]">G</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#424E2B] dark:text-[#E5D9C6]">Google Reviews</h4>
                    <p className="text-sm text-gray-500">Бизнес профиль</p>
                  </div>
                </div>

              </div>



              {/* Рейтинг */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-[#424E2B] dark:text-[#E5D9C6]">4.9</span>
                  <span className="text-sm text-gray-500">из 5 звёзд</span>
                </div>

                {/* Звёзды с прогрессом */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex text-[#FFB400] text-lg">
                      {"★".repeat(5)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">4.9</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#FFB400] h-2 rounded-full"
                      style={{ width: '98%' }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">На основе 243 отзывов</span>
                </div>
              </div>

              {/* Последние отзывы */}
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-[#E5D9C6]">Отлично</span>
                  <span className="font-medium text-[#424E2B] dark:text-[#E5D9C6]">238 отзывов</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-[#E5D9C6]">Хорошо</span>
                  <span className="font-medium text-[#424E2B] dark:text-[#E5D9C6]">5 отзывов</span>
                </div>
              </div>

              {/* CTA кнопка */}
              <button className="w-full mt-6 bg-[#e5d9c6] dark:bg-gray-700 dark:text-[#e5d9c6] dark:hover:text-gray-700 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
                <span>Оставить отзыв</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>

            {/* YANDEX REVIEWS */}
            <div className="bg-[#e7e1d5] dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                {/* Логотип Яндекс */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#FF0000] rounded-xl shadow-md flex items-center justify-center">
                    <span className="text-white text-xl font-bold">Я</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#424E2B] dark:text-[#E5D9C6]">Яндекс Карты</h4>
                    <p className="text-sm text-gray-500">Бизнес профиль</p>
                  </div>
                </div>
              </div>

              {/* Рейтинг */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-[#424E2B] dark:text-[#E5D9C6]">5.0</span>
                  <span className="text-sm text-gray-500">идеальный рейтинг</span>
                </div>

                {/* Звёзды с прогрессом */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex text-[#FFB400] text-lg">
                      {"★".repeat(5)}
                    </div>
                    <span className="text-sm font-medium text-[#424E2B] dark:text-[#E5D9C6]">5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#FFB400] h-2 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">На основе 189 отзывов</span>
                </div>
              </div>

              {/* Достижения */}
              <div className="bg-yellow-50 dark:bg-gray-800 border border-yellow-200 rounded-xl p-4 mt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">🏆</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-yellow-800 dark:text-yellow-50 text-sm">Топ-10 в Казахстане</h5>
                    <p className="text-yellow-600 dark:text-yellow-100 text-xs">Среди туристических компаний</p>
                  </div>
                </div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-[#e5d9c6] dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-[#424E2B] dark:text-[#E5D9C6]">94%</div>
                  <div className="text-xs text-gray-500">Рекомендуют</div>
                </div>
                <div className="text-center p-3 bg-[#e5d9c6] dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-[#424E2B] dark:text-[#E5D9C6]">12 мес</div>
                  <div className="text-xs text-gray-500">Лидер рейтинга</div>
                </div>
              </div>
            </div>
          </div>

          {/* Дополнительная статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#424E2B] dark:text-[#E5D9C6]">500+</div>
              <div className="text-[#424E2B] dark:text-[#E5D9C6] text-sm">Довольных клиентов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#424E2B] dark:text-[#E5D9C6]">98%</div>
              <div className="text-[#424E2B] dark:text-[#E5D9C6] text-sm">Положительных отзывов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#424E2B] dark:text-[#E5D9C6]">4.9</div>
              <div className="text-[#424E2B] dark:text-[#E5D9C6] text-sm">Средний рейтинг</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#424E2B] dark:text-[#E5D9C6]">24/7</div>
              <div className="text-[#424E2B] dark:text-[#E5D9C6] text-sm">Поддержка</div>
            </div>
          </div>
        </div>
      </div>

      <section id="about" className="py-16 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">

          {/* ЛЕВАЯ СТОРОНА — ТЕКСТ */}
          <div>
            <span className="text-lg font-semibold text-[#6c9225] dark:text-[#d4af37] uppercase tracking-wide">
              О компании
            </span>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-3 leading-tight">
              Более 15 лет открываем{" "}
              <span className="text-[#424E2B] dark:text-[#E5D9C6]">
                подлинный Казахстан
              </span>
            </h2>

            <p className="mt-6 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong className="text-[#424E2B] dark:text-[#E5D9C6]">KazWonder</strong> — результат многолетних экспедиций,
              изучения природы и культурного наследия Казахстана.
            </p>

            <p className="mt-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              С 2008 года мы создаём маршруты, объединяя опыт исследователей,
              этнографов и гидов, чтобы раскрыть настоящую красоту страны.
            </p>

            <div className="mt-6 border-l-4 border-[#6c9225] dark:border-[#d4af37] pl-4">
              <p className="italic text-gray-600 dark:text-gray-400 text-sm">
                "Мы создаём путешествия, которые меняют восприятие и оставляют след."
              </p>
            </div>
          </div>

          {/* ПРАВАЯ СТОРОНА — МАЛЕНЬКОЕ АККУРАТНОЕ ФОТО */}
          <div className="relative">
            <img
              src="history.png"
              alt="KazWonder"
              className="rounded-xl w-full h-[380px] object-cover shadow-md"
            />

            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">KazWonder Expeditions</p>
              <p className="text-xs opacity-80">С 2008 года</p>
            </div>
          </div>

        </div>
      </section>
      
      


    </>
  );
}
