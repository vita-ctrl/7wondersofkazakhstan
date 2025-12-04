import { useState } from "react";

export default function TumodoContacts() {
  const [activeTab, setActiveTab] = useState("Алматы");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requestType: "",
    message: "",
    agreeToPrivacy: false,
  });

  // ✔ Наши города вместо стран
  const cities = ["Алматы", "Туркестан"];

  // ✔ Контакты по городам
  const cityContacts = {
    Алматы: {
      address:
        "Казахстан, г. Алматы, пр. Аль-Фараби 7, БЦ Нурлы Тау, блок 5А, офис 129",
      phone: "+7 (777) 777 77 77",
    },
    Туркестан: {
      address: "Казахстан, г. Туркестан, район мавзолея Ходжи Ахмеда Ясави",
      phone: "+7 (705) 555 55 55",
    },
  };

  const requestTypes = [
    "Выберите ваш запрос",
    "Сотрудничество",
    "Техническая поддержка",
    "Вопросы по турам",
    "Партнерство",
    "Другое",
  ];

  const contactBlocks = [
    {
      icon: "💼",
      title: "Отдел продаж",
      email: "sales@kazwonder.kz",
      description: "Вопросы по турам, бронированию и ценам",
    },
    {
      icon: "🎧",
      title: "Служба поддержки",
      email: "support@kazwonder.kz",
      description: "Техническая помощь и консультации",
    },
    {
      icon: "📣",
      title: "Пресс-служба",
      email: "pr@kazwonder.kz",
      description: "Для СМИ и информационных запросов",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.message &&
      formData.agreeToPrivacy
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Свяжитесь с нами
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы готовы ответить на ваши вопросы и помочь с выбором тура
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* TABS — ГОРОДА */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold mb-6">Наши офисы</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveTab(city)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === city
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* MAP + ADDRESS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-linear-to-br from-blue-100 to-indigo-100 rounded-2xl h-96 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-700 font-medium">
                  Интерактивная карта {activeTab}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Нажмите для увеличения
                </p>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-sm font-medium text-gray-700">
                {activeTab}
              </span>
            </div>
          </div>

          {/* ADDRESS BLOCK */}
          <div className="bg-gray-50 rounded-2xl p-8 border shadow-sm">
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <span className="text-2xl">📍</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Адрес офиса</h3>
                <p className="text-gray-600">
                  {cityContacts[activeTab].address}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Контактный телефон
                </h3>
                <p className="text-blue-600 font-medium text-lg">
                  {cityContacts[activeTab].phone}
                </p>
                <p className="text-gray-500 text-sm mt-1">Пн-Пт 9:00-18:00</p>
              </div>
            </div>

            <button className="w-full mt-8 bg-white border border-blue-600 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-50">
              Проложить маршрут
            </button>
          </div>
        </div>

        {/* CONTACT BLOCKS */}
        <div className="mb-16">
          <h2 className="text-2xl text-center font-semibold mb-8">
            Свяжитесь с отделом
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactBlocks.map((block, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">{block.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{block.title}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {block.description}
                </p>
                <a
                  href={`mailto:${block.email}`}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  {block.email} →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl text-center font-semibold mb-4">
            Отправьте нам сообщение
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Мы ответим вам в течение 24 часов
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Имя / Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">Имя *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border rounded-xl"
                />
              </div>
            </div>

            {/* Телефон / Тип запроса */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">Телефон</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Тип запроса</label>
                <select
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl"
                >
                  {requestTypes.map((type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Сообщение */}
            <div>
              <label className="block text-sm mb-2">Сообщение *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                className="w-full px-4 py-3 border rounded-xl resize-none"
              />
            </div>

            {/* Privacy */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeToPrivacy"
                checked={formData.agreeToPrivacy}
                onChange={handleInputChange}
                className="mt-1 mr-3"
                required
              />
              <label className="text-sm text-gray-600">
                Я соглашаюсь с политикой конфиденциальности
              </label>
            </div>

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-4 rounded-xl font-semibold text-lg ${
                isFormValid()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Отправить сообщение
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
