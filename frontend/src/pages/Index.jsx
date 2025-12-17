import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faMapLocationDot,
  faUsers,
  faStar,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Carousel from "../components/TourCarousel";
import ReviewCard from "../components/ReviewCard";
import { useEffect } from "react";

const items = [
  {
    title: "Байконур",
    image:
      "https://www.russian.space/kosmodromy/kosmodrom-baykonur/scale_1200-24.jpeg",
    url: "/tours/baikonur",
  },
  {
    title: "Мавзолей Ясави",
    image: "https://fs.tonkosti.ru/cl/0u/cl0uikkvo3s40844kocogsckk.jpg",
    url: "/tours/mavsoley",
  },
  {
    title: "Чарынский каньон",
    image:
      "https://sputnik.kz/img/252/01/2520108_0:0:1200:754_1920x0_80_0_0_2f1a758190a93bf393a6da720eed4169.jpg",
    url: "/tours/kanyon",
  },
  {
    title: "Озеро Каинды",
    image: "https://img.tourister.ru/files/1/9/4/1/9/6/0/8/original.jpg",
    url: "/tours/ozero",
  },
  {
    title: "Тамгалы",
    image:
      "https://pictures.pibig.info/uploads/posts/2023-04/1680701922_pictures-pibig-info-p-naskalnie-risunki-tamgali-instagram-3.jpg",
    url: "/tours/tamgaly",
  },
  {
    title: "Пик Талгар",
    image: "https://cs14.pikabu.ru/post_img/big/2022/02/04/6/164396278016862049.jpg",
    url: "/tours/pik",
  },
  {
    title: "Поющие барханы",
    image:
      "https://1zoom.club/uploads/posts/2023-03/1678128765_1zoom-club-p-barkhan-79.jpg",
    url: "/tours/barhany",
  },
];

const features = [
  {
    icon: faAward,
    title: "Безопасная оплата",
    description: "Оплачивайте туры через нашу надежную и защищенную систему.",
  },
  {
    icon: faUsers,
    title: "Продуманная спонтанность",
    description: "Маршруты легко подстраиваются под пожелания вашей группы.",
  },
  {
    icon: faMapLocationDot,
    title: "Проверенные тревел-эксперты",
    description:
      "В нашей команде только проверенные гиды, прошедшие строгий отбор.",
  },
  {
    icon: faStar,
    title: "Гарантированные туры",
    description: "7 туров с подтвержденными датами отправления.",
  },
  {
    icon: faClock,
    title: "Небольшие группы",
    description: "Теплая атмосфера в компании единомышленников.",
  },
];

export default function Index() {
  // Подключаем уникальные шрифты
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap";
    document.head.appendChild(fontLink);

    return () => {
      if (fontLink.parentNode) {
        document.head.removeChild(fontLink);
      }
    };
  }, []);

  return (
    <div className="font-['DM_Sans']">
      {/* HERO SECTION - УЛУЧШЕННЫЙ */}
      <div id="top" className="relative w-full h-[700px] overflow-hidden">
        {/* Изображение с параллаксом */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="hero.jpg"
            alt="Kazakhstan"
            className="w-full h-full object-cover scale-105 animate-ken-burns"
          />
        </div>

        {/* Градиентный оверлей */}
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/70" />

        {/* Декоративные элементы */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed" />

        {/* Контент */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="max-w-5xl animate-fade-in-up">
            {/* Надпись сверху */}
            <div className="mb-6 animate-fade-in">
              <span className="inline-block font-['Inter'] px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-beige text-sm font-light tracking-[0.2em] uppercase">
                Откройте для себя
              </span>
            </div>

            {/* Главный заголовок */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-['Cormorant_Garamond'] font-bold text-white leading-[1.1] mb-6 animate-fade-in-up animation-delay-200">
              Казахстан
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-yellow-200 to-amber-400">
                Страна семи чудес
              </span>
            </h1>

            {/* Подзаголовок */}
            <p className="text-lg md:text-xl font-['Inter'] text-gray-200 max-w-2xl mx-auto mb-10 font-light leading-relaxed animate-fade-in-up animation-delay-400">
              Авторские путешествия по величественным горам, древним городам и бескрайним степям
            </p>

            {/* CTA кнопка */}
            <div className="animate-fade-in-up animation-delay-600">
              <a
                href="#tours"
                className="group font-['Inter'] inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50"
              >
                <span className="tracking-wide">Выбрать тур</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="transform group-hover:translate-x-1 transition-transform duration-300"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Декоративная линия внизу */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-amber-500 to-transparent" />
      </div>

      {/* FEATURES SECTION - НА ВСЮ ШИРИНУ */}
      <section className="relative py-20 bg-linear-to-br from-[#F8F6F3] via-white to-[#FAF8F5] dark:from-[#0A0E1A] dark:via-[#0E1624] dark:to-[#0A0E1A]">
        {/* Декоративный фон */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-forest-dark dark:bg-blue-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600 dark:bg-purple-600 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="grid font-['Inter'] grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative inline-block mb-6">
                  {/* Декоративное кольцо */}
                  <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 to-amber-500/10 dark:from-blue-400/10 dark:to-purple-500/10 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500 blur-xl" />

                  {/* Иконка */}
                  <div className="relative w-16 h-16 mx-auto bg-white dark:bg-[#1a2435] rounded-2xl flex items-center justify-center border border-gray-200 dark:border-gray-700 group-hover:border-amber-500 dark:group-hover:border-blue-400 transition-all duration-300 group-hover:shadow-xl group-hover:scale-110">
                    <FontAwesomeIcon
                      icon={feature.icon}
                      className="text-2xl text-amber-500 dark:text-blue-400"
                    />
                  </div>
                </div>

                <h3 className="font-semibold text-[15px] mb-3 text-gray-900 dark:text-gray-100 group-hover:text-amber-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-light px-2">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOURS SECTION - НА ВСЮ ШИРИНУ */}
      <section className="py-20 bg-white dark:bg-[#0E1624]" id="tours">
        {/* Заголовок с отступами */}
        <div className="px-8 font-['Inter'] sm:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="mb-4">
              <span className="inline-block px-4 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold tracking-[0.15em] uppercase rounded-full">
                Туры
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              Популярные направления
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
              Тщательно отобранные маршруты для незабываемых приключений
            </p>
          </div>
        </div>

        {/* Карусель на всю ширину */}
        <div className="w-full animate-fade-in-up animation-delay-200">
          <Carousel items={items} />
        </div>
      </section>


      {/* REVIEWS SECTION */}
      <section
        className="py-20 bg-linear-to-br from-[#FAF8F5] via-[#F8F6F3] to-white dark:from-[#0A0E1A] dark:via-[#0E1624] dark:to-[#121826]"
        id="reviews"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            {/* Метка секции */}
            <div className="mb-4">
              <span className="inline-block font-['Inter'] px-4 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-[0.15em] uppercase rounded-full">
                Отзывы
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              Слова наших путешественников
            </h2>
            <p className="text-lg font-['Inter'] text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Настоящие эмоции и впечатления людей, которые открыли для себя Казахстан вместе с нами
            </p>
          </div>

          {/* Карточки отзывов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <ReviewCard
              logo="https://placehold.co/100x100/4F46E5/FFFFFF?text=ИЕ"
              name="Иванова Елизавета"
              rating={5}
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
              logo="https://placehold.co/100x100/8B5CF6/FFFFFF?text=АА"
              name="Алмас Альфарабиулы"
              rating={5}
              text="Гиды внимательные и профессиональные. Природа просто великолепная. Поездка превзошла ожидания — рекомендую от души."
            />
          </div>

          {/* РЕЙТИНГИ - УЛУЧШЕННЫЙ ДИЗАЙН */}
          <div className="grid font-['Inter'] grid-cols-1 lg:grid-cols-2 gap-8">
            {/* GOOGLE REVIEWS */}
            <div className="group relative bg-white dark:bg-[#1a2435] rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:border-forest-dark dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl animate-fade-in-up">
              {/* Декоративный градиент */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                {/* Заголовок */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-linear-to-br from-white to-gray-50 dark:from-[#0E1624] dark:to-[#1a2435] rounded-2xl shadow-lg flex items-center justify-center border border-gray-100 dark:border-gray-700">
                      <span className="text-2xl font-bold bg-linear-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] bg-clip-text text-transparent">
                        G
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                        Google Reviews
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                        Бизнес профиль
                      </p>
                    </div>
                  </div>
                </div>

                {/* Рейтинг */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="flex flex-col">
                    <span className="text-5xl font-bold text-gray-900 dark:text-gray-100 font-['Cormorant_Garamond']">
                      4.9
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
                      из 5 звёзд
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-[#FFB400] text-lg">
                        {[...Array(5)].map((_, index) => (
                          <FontAwesomeIcon
                            key={index}
                            icon={faStar}
                            className="drop-shadow-sm"
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        4.9
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-[#FFB400] to-[#FFA000] rounded-full transition-all duration-1000"
                        style={{ width: "98%" }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-light">
                      На основе 243 отзывов
                    </p>
                  </div>
                </div>

                {/* Статистика */}
                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-light">
                      Отлично
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      238 отзывов
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-light">
                      Хорошо
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      5 отзывов
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* YANDEX REVIEWS */}
            <div className="group font-['Inter'] relative bg-white dark:bg-[#1a2435] rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:border-forest-dark dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl animate-fade-in-up animation-delay-200">
              {/* Декоративный градиент */}
              <div className="absolute inset-0 bg-linear-to-br from-red-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                {/* Заголовок */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-linear-to-br from-[#FF0000] to-[#CC0000] rounded-2xl shadow-lg flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">Я</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                        Яндекс Карты
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                        Бизнес профиль
                      </p>
                    </div>
                  </div>
                </div>

                {/* Рейтинг */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="flex flex-col">
                    <span className="text-5xl font-bold text-gray-900 dark:text-gray-100 font-['Cormorant_Garamond']">
                      5.0
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
                      идеальный
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-[#FFB400] text-lg">
                        {[...Array(5)].map((_, index) => (
                          <FontAwesomeIcon
                            key={index}
                            icon={faStar}
                            className="drop-shadow-sm"
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        5.0
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-[#FFB400] to-[#FFA000] rounded-full transition-all duration-1000"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-light">
                      На основе 189 отзывов
                    </p>
                  </div>
                </div>

                {/* Достижение */}
                <div className="relative overflow-hidden bg-linear-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-800/50 rounded-2xl p-5">
                  {/* Декоративный элемент */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200/30 dark:bg-amber-700/20 rounded-full blur-2xl" />

                  <div className="relative flex items-center gap-4">
                    <div className="shrink-0 w-12 h-12 bg-linear-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-amber-900 dark:text-amber-100 text-base mb-1">
                        Топ-10 в Казахстане
                      </h5>
                      <p className="text-amber-700 dark:text-amber-300 text-sm font-light">
                        Среди туристических компаний
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION - ЭЛЕГАНТНЫЙ */}
      <section
        id="about"
        className="relative py-24 bg-linear-to-br from-white via-[#FAF8F5] to-[#F8F6F3] dark:from-[#0E1624] dark:via-[#0A0E1A] dark:to-[#121826] overflow-hidden"
      >
        {/* Декоративные элементы фона */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-forest-dark dark:bg-blue-400 rounded-full blur-[100px] animate-float-delayed" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* ЛЕВАЯ СТОРОНА — ТЕКСТ */}
            <div className="animate-fade-in-up">
              {/* Метка секции */}
              <div className="mb-6">
                <span className="inline-block font-['Inter'] px-4 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold tracking-[0.15em] uppercase rounded-full">
                  О компании
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-['Cormorant_Garamond'] font-bold text-gray-900 dark:text-white mb-6 leading-[1.2] tracking-tight">
                Более 15 лет открываем{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-forest-dark to-amber-700 dark:from-amber-400 dark:to-yellow-300">
                  подлинный Казахстан
                </span>
              </h2>

              <div className="space-y-5 mb-8 font-['Inter']">
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                  <strong className="font-semibold text-gray-900 dark:text-gray-100">
                    KazWonder
                  </strong>{" "}
                  — результат многолетних экспедиций, изучения природы и культурного
                  наследия Казахстана.
                </p>

                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                  С 2008 года мы создаём маршруты, объединяя опыт исследователей,
                  этнографов и гидов, чтобы раскрыть настоящую красоту страны.
                </p>
              </div>

              {/* Цитата */}
              <div className="relative pl-6 py-4 border-l-4 border-gradient-to-b from-amber-500 to-amber-700 bg-linear-to-br from-amber-50/50 to-transparent dark:from-amber-900/10 rounded-r-xl">
                <p className="italic text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed font-light">
                  Мы создаём путешествия, которые меняют восприятие и оставляют
                  след в сердце каждого путешественника.
                </p>
              </div>
            </div>

            {/* ПРАВАЯ СТОРОНА — ИЗОБРАЖЕНИЕ */}
            <div className="relative animate-fade-in-up animation-delay-200">
              {/* Декоративная рамка */}
              <div className="absolute -inset-4 bg-linear-to-br from-amber-500/20 to-forest-dark/20 dark:from-amber-400/20 dark:to-blue-400/20 rounded-3xl blur-2xl" />

              {/* Изображение */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white dark:border-gray-800 group">
                <img
                  src="history.png"
                  alt="KazWonder"
                  className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Оверлей с информацией */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 font-['Inter']">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <p className="text-white text-lg font-semibold mb-1 tracking-wide">
                      KazWonder Expeditions
                    </p>
                    <p className="text-gray-200 text-sm font-light">
                      Профессиональные туры с 2008 года
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* АНИМАЦИИ */}
      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1) translateX(0) translateY(0); }
          100% { transform: scale(1.1) translateX(-2%) translateY(-2%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(0.9); }
          66% { transform: translate(20px, -20px) scale(1.1); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-ken-burns {
          animation: ken-burns 20s ease-out infinite alternate;
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </div>
  );
}