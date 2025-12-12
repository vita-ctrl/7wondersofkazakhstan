import { useEffect, useState, useMemo } from "react";

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

  const [status, setStatus] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Добавление keyframes без tailwind.config
    const style = document.createElement("style");
    style.innerHTML =
      "@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }" +
      "@keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }";
    document.head.appendChild(style);
  }, []);

  const fadeIn = { animation: "fadeIn 0.7s ease forwards" };
  const slideUp = { animation: "slideUp 0.8s ease forwards" };

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const cities = ["Алматы", "Туркестан"];

  const cityContacts = useMemo(
    () => ({
      Алматы: {
        address:
          "Казахстан, г. Алматы, пр. Аль-Фараби 7, БЦ Нурлы Тау, блок 5А, офис 129",
        phone: "+7 (777) 777 77 77",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18...",
      },
      Туркестан: {
        address: "Казахстан, г. Туркестан, район мавзолея Ходжи Ахмеда Ясави",
        phone: "+7 (705) 555 55 55",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18...",
      },
    }),
    []
  );

  const requestTypes = [
    "Сотрудничество",
    "Техническая поддержка",
    "Вопросы по турам",
    "Партнерство",
    "Другое",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          requestType: "",
          message: "",
          agreeToPrivacy: false,
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#FFF8EF] dark:bg-gray-900 text-gray-900 dark:text-white">

      {/* HERO */}
      <section
        className="py-20 bg-[#FFF8EF] dark:bg-gray-800 relative"
        style={fadeIn}
      >
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#424E2B]/20 dark:bg-gray-700"></div>

        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#424E2B] dark:text-[#E5D9C6]">
            Контакты и поддержка
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-lg max-w-2xl mx-auto mt-3">
            Мы на связи каждый день и готовы помочь вам.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <div
        className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12"
        style={slideUp}
      >
        {/* LEFT PANEL */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-[#424E2B] dark:text-[#E5D9C6]">
            Наши офисы
          </h2>

          <div className="flex gap-3 mb-6">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveTab(city)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === city
                    ? "bg-[#424E2B] text-[#E5D9C6] scale-105 shadow-lg shadow-[#424E2B]/40"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <div
            key={activeTab}
            className="rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700"
            style={{ animation: "fadeIn 0.8s ease" }}
          >
            <iframe
              src={cityContacts[activeTab].mapEmbed}
              className="w-full h-72"
              loading="lazy"
              title="office-map"
            ></iframe>
          </div>

          <div
            className="mt-6 bg-[#F3E9D9] dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            style={{ animation: "fadeIn 1s ease" }}
          >
            <h3 className="font-semibold text-lg text-[#424E2B] dark:text-[#E5D9C6]">
              Адрес офиса
            </h3>
            <p className="text-gray-700 dark:text-gray-400 mt-1">
              {cityContacts[activeTab].address}
            </p>

            <h3 className="font-semibold text-lg mt-4 text-[#424E2B] dark:text-[#E5D9C6]">
              Телефон
            </h3>
            <p className="text-gray-700 dark:text-gray-400">
              {cityContacts[activeTab].phone}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL (FORM) */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-[#424E2B] dark:text-[#E5D9C6]">
            Написать в поддержку
          </h2>

          <form
            onSubmit={handleSubmit}
            className="bg-[#F3E9D9] dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6"
          >
            {/* NAME */}
            <div>
              <label className="text-sm font-medium">Имя *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg bg-[#F9F4EC] dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#424E2B] transition-all"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email *</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg bg-[#F9F4EC] dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#424E2B] transition-all"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium">Телефон *</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg bg-[#F9F4EC] dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#424E2B] transition-all"
              />
            </div>

            {/* REQUEST TYPE */}
            <div>
              <label className="text-sm font-medium">Тип запроса *</label>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleInputChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg bg-[#F9F4EC] dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#424E2B] transition-all"
              >
                <option value="">Выберите...</option>
                {requestTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* MESSAGE */}
            <div>
              <label className="text-sm font-medium">Сообщение *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="mt-1 w-full px-4 py-2 border rounded-lg resize-none bg-[#F9F4EC] dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#424E2B] transition-all"
              />
            </div>

            {/* PRIVACY */}
            <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-400">
              <input
                type="checkbox"
                name="agreeToPrivacy"
                checked={formData.agreeToPrivacy}
                onChange={handleInputChange}
                required
              />
              Я соглашаюсь с политикой конфиденциальности
            </label>

            {/* BUTTON */}
            <button
              disabled={!formData.agreeToPrivacy || status === "loading"}
              className="w-full py-3 rounded-lg text-lg font-medium bg-[#424E2B] text-[#E5D9C6] hover:bg-[#5A6841] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Отправка..." : "Отправить"}
            </button>

            {/* STATUS MESSAGES */}
            {status === "success" && (
              <p className="text-green-600 text-sm text-center" style={fadeIn}>
                Сообщение отправлено!
              </p>
            )}

            {status === "error" && (
              <p className="text-red-600 text-sm text-center" style={fadeIn}>
                Ошибка при отправке. Попробуйте позже.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
