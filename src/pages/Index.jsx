import { Card } from "../components/Card";
import { Review } from "../components/Review";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faMapLocationDot,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";

export default function Index() {
  return (
    <>
      <div className="relative pt-16">
        <div className="max-w-7xl mx-auto rounded-xl overflow-hidden">
          <div className="relative h-96 rounded-t-xl overflow-hidden">
            <div className="w-full h-full rounded-t-xl overflow-hidden">
              <img
                src="hero.jpg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
                Путешествия по Казахстану
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mb-12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center my-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Популярные места
          </h2>
        </div>
        <div
          className="
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-10
lg:[&>*:nth-last-child(1):nth-child(3n+1)]:col-start-2
"
        >
          <Card
            url="/tours"
            rating={32}
            stars={5}
            image="https://www.russian.space/kosmodromy/kosmodrom-baykonur/scale_1200-24.jpeg"
            title="Байконур"
            description="Первый в мире космодром. Именно отсюда началась эра освоения космоса - отсюда стартовал Юрий Гагарин."
          />
          <Card
            rating={114}
            stars={4}
            image="https://fs.tonkosti.ru/cl/0u/cl0uikkvo3s40844kocogsckk.jpg"
            title="Мавзолей Ходжи Ахмеда Ясави (Туркестан)"
            description="Великий памятник исламской архитектуры XIV века, построенный по приказу Тимура. Входит в список Всемирного наследия ЮНЕСКО."
          />
          <Card
            rating={63}
            stars={5}
            image="https://sputnik.kz/img/252/01/2520108_0:0:1200:754_1920x0_80_0_0_2f1a758190a93bf393a6da720eed4169.jpg"
            title="Чарынский каньон"
            description="Один из самых красивых природных памятников Казахстана. Его называют «младшим братом Гранд-Каньона» за поразительное сходство и величие."
          />
          <Card
            rating={49}
            stars={5}
            image="https://img.tourister.ru/files/1/9/4/1/9/6/0/8/original.jpg"
            title="Озеро Каинды"
            description="Уникальное озеро с затопленным лесом и изумрудной водой. Образовалось после землетрясения в начале XX века."
          />
          <Card
            rating={78}
            stars={5}
            image="https://pictures.pibig.info/uploads/posts/2023-04/1680701922_pictures-pibig-info-p-naskalnie-risunki-tamgali-instagram-3.jpg"
            title="Наскальные изображения в урочище Тамгалы"
            description="Древняя галерея под открытым небом, где около 5 000 петроглифов рассказывают о жизни и верованиях людей бронзового века."
          />
          <Card
            rating={13}
            stars={5}
            image="https://cs17.pikabu.ru/s/2025/08/30/16/ejhflvbn_lg.jpg"
            title="Пик Победы"
            description="Самая высокая вершина Казахстана и всего Тянь-Шаня — 7 439 метров над уровнем моря. Символ силы, мужества и покорения невозможного. С её склонов открываются завораживающие виды на горные хребты и вечные ледники."
          />
          <Card
            rating={237}
            stars={5}
            image="https://1zoom.club/uploads/posts/2023-03/1678128765_1zoom-club-p-barkhan-79.jpg"
            title="Поющие барханы"
            description="Песчаная дюна, которая «поёт», когда по ней проходит ветер. Удивительное природное чудо, создающее мелодию пустыни."
          />
        </div>
        <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Отзывы наших путешественников
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Не только наши слова — послушайте тех, кто это испытал
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Review
              logo="https://placehold.co/100x100/4F46E5/FFFFFF?text=ИЕ"
              text="Я недовольна!"
              name="Иванова Елизавета"
              rating={3}
            />
            <Review
              logo="https://placehold.co/100x100/10B981/FFFFFF?text=ШМ"
              text="Организация отличная, всё чётко и продумано. Места просто завораживают!"
              name="Шабельникова Марина"
              rating={5}
            />
            <Review
              logo="https://placehold.co/100x100/F59E0B/FFFFFF?text=РВ"
              text="Поездка крутая! Но теперь Казахстан угрожает нам бомбардировкой :("
              name="Руденко Виталий"
              rating={4}
            />
            <Review
              logo="https://placehold.co/100x100/3B82F6/FFFFFF?text=ШМ"
              text="Потрясающее путешествие и замечательная команда. Обязательно поеду ещё раз!"
              name="Шелконогов Марк"
              rating={5}
            />
            <Review
              logo="https://placehold.co/100x100/E11D48/FFFFFF?text=АТ"
              text="Каждый день был наполнен эмоциями и открытиями. Спасибо команде!"
              name="Абдыкадыров Тамерлан"
              rating={5}
            />
            <Review
              logo="https://placehold.co/100x100/8B5CF6/FFFFFF?text=ДА"
              text="Гиды профессиональные, природа восхищает. Всё на высшем уровне."
              name="Дуйсенбек Альфарабиулы"
              rating={5}
            />
          </div>
        </div>
        <section
          id="about"
          className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div className="mb-12 lg:mb-0">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  Наша история
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Проект «KazWonder» родился из любви к родной земле и
                  стремления показать всему миру величие и красоту Казахстана.
                  Мы начали с идеи собрать в одном месте самые удивительные
                  природные и культурные достопримечательности страны — те, что
                  вдохновляют, поражают и напоминают, каким богатством мы
                  обладаем.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Сначала это были небольшие экспедиции и фотопутешествия, а
                  сегодня «KazWonder» — это команда исследователей и гидов,
                  которые создают уникальные маршруты и открывают для людей
                  историю каждой жемчужины нашей страны.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      className="text-blue-500 dark:text-blue-400 text-3xl mr-3"
                      icon={faAward}
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">
                        15+ лет
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Совместного опыта
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      className="text-blue-500 dark:text-blue-400 text-3xl mr-3"
                      icon={faUsers}
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">
                        5000+
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Счастливых путешественников
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      className="text-blue-500 dark:text-blue-400 text-3xl mr-3"
                      icon={faMapLocationDot}
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">
                        25+
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Направлений
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      className="text-blue-500 dark:text-blue-400 text-3xl mr-3"
                      icon={faStar}
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">
                        4.9/5
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Средний рейтинг
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <img
                  src="history.png"
                  alt="Our team"
                  className="w-full rounded-lg shadow-xl dark:shadow-gray-800/50"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
