import { Card } from "./Card";
import { Review } from "./Review";

export function FeaturedTours() {
  return (
    <>
      <div className="max-w-7xl mb-12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center my-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
            image="https://kulturologia.ru/files/u23606/236060800.jpg"
            title="ChatGPT TOP!"
            description="Описание 1"
          />
          <Card
            image="https://kulturologia.ru/files/u23606/236060800.jpg"
            title="Название 1"
            description="Описание 1"
          />
          <Card
            image="https://kulturologia.ru/files/u23606/236060800.jpg"
            title="Название 1"
            description="Описание 1"
          />
          <Card
            image="https://kulturologia.ru/files/u23606/236060800.jpg"
            title="Название 1"
            description="Описание 1"
          />
          <Card
            image="https://kulturologia.ru/files/u23606/236060800.jpg"
            title="Название 1"
            description="Описание 1"
          />
          <Card
            image="https://kulturologia.ru/files/u23606/236060800.jpg"
            title="Название 1"
            description="Описание 1"
          />
          <Card
            image="https://kulturologia.ru/files/u23606/236060800.jpg"
            title="7 элемент"
            description="Описание 1"
          />
        </div>
        <div class="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Отзывы наших путешественников
            </h2>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
              Не только наши слова — послушайте тех, кто это испытал
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Review text="Я недовольна!" name="Иванова Елизавета" rating={1} />
            <Review name="Шабельникова Марина" rating={5} />
            <Review name="Руденко Виталий" rating={5} />
            <Review name="Шелконогов Марк" rating={5} />
            <Review name="Абдыкадыров Тамерлан" rating={5} />
            <Review name="Дуйсенбек Альфарабиулы" rating={5} />
          </div>
        </div>
      </div>
    </>
  );
}
