import { useEffect, useState, useMemo, useRef } from "react";

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
  const [focusedField, setFocusedField] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Add Font Awesome
    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    document.head.appendChild(fontAwesome);

    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
      
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes pulse-soft {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }

      .gradient-text {
        background: linear-gradient(135deg, #424E2B 0%, #5A6841 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .glass-effect {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }

      .dark .glass-effect {
        background: rgba(31, 41, 55, 0.7);
      }

      .input-glow:focus {
        box-shadow: 0 0 0 3px rgba(66, 78, 43, 0.1), 0 8px 16px -4px rgba(66, 78, 43, 0.2);
      }

      .dark .input-glow:focus {
        box-shadow: 0 0 0 3px rgba(90, 104, 65, 0.2), 0 8px 16px -4px rgba(90, 104, 65, 0.3);
      }

      .card-hover {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .card-hover:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px -12px rgba(66, 78, 43, 0.25);
      }

      .dark .card-hover:hover {
        box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4);
      }

      .btn-primary {
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }

      .btn-primary:hover::before {
        left: 100%;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 24px -8px rgba(66, 78, 43, 0.4);
      }

      .btn-primary:active {
        transform: translateY(0);
      }

      .tab-indicator {
        position: absolute;
        bottom: 0;
        height: 3px;
        background: linear-gradient(90deg, #424E2B, #5A6841);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 3px 3px 0 0;
      }

      .decorative-blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.15;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
      if (fontAwesome.parentNode) {
        document.head.removeChild(fontAwesome);
      }
    };
  }, []);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const cities = ["Алматы", "Туркестан"];

  const cityContacts = useMemo(
    () => ({
      Алматы: {
        address: "",
        phone: "",
        mapEmbed: "",
      },
      Туркестан: {
        address: "",
        phone: "",
        mapEmbed: "",
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
    <div className="min-h-screen bg-linear-to-br from-[#FFF8EF] via-[#F9F4EC] to-[#F3E9D9] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white font-['Inter'] relative overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative pt-24 pb-16 px-4"
        style={{ animation: "fadeInUp 0.8s ease-out" }}
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-olive-dark/20 dark:border-gray-700 text-sm font-medium text-olive-dark dark:text-beige">
              <i className="fas fa-envelope"></i>
              Всегда на связи
            </span>
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-bold mb-6 leading-tight
               text-olive-dark dark:text-beige"
          >
            Свяжитесь с нами
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light
              text-olive-dark dark:text-beige"
          >
            Готовы ответить на все ваши вопросы и помочь спланировать
            незабываемое путешествие
          </p>

          {/* Decorative Line */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <div
              className="h-px w-24 
                  bg-linear-to-r from-transparent to-olive-dark/30
                  dark:to-beige/30"
            />
            <div
              className="w-2 h-2 rounded-full 
                  bg-olive-dark dark:bg-beige"
            />
            <div
              className="h-px w-24 
                  bg-linear-to-l from-transparent to-olive-dark/30
                  dark:to-beige/30"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Panel - Office Information */}
          <div
            className="lg:col-span-2 space-y-6"
            style={{ animation: "slideInLeft 0.8s ease-out 0.2s both" }}
          >
            {/* City Tabs */}
            <div className="glass-effect rounded-2xl p-2 border border-white/20 dark:border-gray-700/50 shadow-xl card-hover">
              <div className="relative flex gap-2">
                {cities.map((city, idx) => (
                  <button
                    key={city}
                    onClick={() => setActiveTab(city)}
                    className={`flex-1 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${activeTab === city
                        ? "text-white bg-linear-to-br from-olive-dark to-[#5A6841] shadow-lg scale-105"
                        : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                      }`}
                    style={{ zIndex: activeTab === city ? 10 : 1 }}
                  >
                    <i
                      className={`fas fa-map-marker-alt ${activeTab === city ? "animate-bounce" : ""
                        }`}
                    ></i>
                    <span className="ml-2">{city}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Map */}
            <div
              key={activeTab}
              className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/50 dark:border-gray-700/50 card-hover"
              style={{ animation: "scaleIn 0.6s ease-out" }}
            >
              <div className="relative group">
                <iframe
                  src={cityContacts[activeTab].mapEmbed}
                  className="w-full h-80 transition-all duration-300 group-hover:scale-105"
                  loading="lazy"
                  title="office-map"
                  style={{ filter: "grayscale(20%) contrast(1.1)" }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-olive-dark/20 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              <div className="glass-effect rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-xl card-hover">

                {/* АДРЕС */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-linear-to-br from-olive-dark to-[#5A6841] text-white shadow-lg">
                    <i className="fas fa-map-marker-alt text-xl"></i>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-olive-dark dark:text-beige">
                      Адрес офиса
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Казахстан, г. Алматы, ул. Байзакова, 280
                    </p>
                  </div>
                </div>

                {/* ТЕЛЕФОН */}
                <div className="flex items-start gap-4 mt-4">
                  <div className="p-3 rounded-xl bg-linear-to-br from-olive-dark to-[#5A6841] text-white shadow-lg">
                    <i className="fas fa-phone text-xl"></i>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-olive-dark dark:text-beige">
                      Телефон
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      +7 (777) 777-77-77
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Panel - Contact Form */}
          <div
            className="lg:col-span-3"
            style={{ animation: "slideInRight 0.8s ease-out 0.3s both" }}
          >
            <div className="glass-effect rounded-2xl p-8 md:p-10 border border-white/20 dark:border-gray-700/50 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold mb-3 text-olive-dark dark:text-beige">
                  Напишите нам
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Заполните форму, и мы свяжемся с вами в ближайшее время
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Имя <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="Введите ваше имя"
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-400 focus:border-olive-dark dark:focus:border-[#5A6841] outline-none transition-all duration-300 input-glow"
                  />
                  {focusedField === "name" && (
                    <div
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-linear-to-r from-olive-dark to-[#5A6841] rounded-full"
                      style={{ animation: "scaleIn 0.3s ease-out" }}
                    />
                  )}
                </div>

                {/* Email Input */}
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="your@email.com"
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-400 focus:border-olive-dark dark:focus:border-[#5A6841] outline-none transition-all duration-300 input-glow"
                  />
                  {focusedField === "email" && (
                    <div
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-linear-to-r from-olive-dark to-[#5A6841] rounded-full"
                      style={{ animation: "scaleIn 0.3s ease-out" }}
                    />
                  )}
                </div>

                {/* Request Type Select */}
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Тип запроса <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("requestType")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:border-olive-dark dark:focus:border-[#5A6841] outline-none transition-all duration-300 input-glow appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23424E2B' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.75rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "3rem",
                    }}
                  >
                    <option value="">Выберите тип запроса</option>
                    {requestTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {focusedField === "requestType" && (
                    <div
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-linear-to-r from-olive-dark to-[#5A6841] rounded-full"
                      style={{ animation: "scaleIn 0.3s ease-out" }}
                    />
                  )}
                </div>

                {/* Message Textarea */}
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Сообщение <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows={5}
                    placeholder="Расскажите подробнее о вашем вопросе..."
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-400 focus:border-olive-dark dark:focus:border-[#5A6841] outline-none transition-all duration-300 resize-none input-glow"
                  />
                  {focusedField === "message" && (
                    <div
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-linear-to-r from-olive-dark to-[#5A6841] rounded-full"
                      style={{ animation: "scaleIn 0.3s ease-out" }}
                    />
                  )}
                </div>

                {/* Privacy Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      name="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onChange={handleInputChange}
                      required
                      className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-olive-dark focus:ring-2 focus:ring-olive-dark focus:ring-offset-0 cursor-pointer transition-all"
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                    Я соглашаюсь с{" "}
                    <a
                      href="#"
                      className="text-olive-dark dark:text-[#5A6841] hover:underline font-medium"
                    >
                      политикой конфиденциальности
                    </a>
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!formData.agreeToPrivacy || status === "loading"}
                  className="w-full py-4 rounded-xl text-lg font-semibold bg-linear-to-r from-olive-dark to-[#5A6841] text-white shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg btn-primary flex items-center justify-center gap-3"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      Отправить сообщение
                      <i className="fas fa-paper-plane"></i>
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {status === "success" && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                    style={{ animation: "scaleIn 0.4s ease-out" }}
                  >
                    <i className="fas fa-check-circle text-xl shrink-0"></i>
                    <span className="font-medium">
                      Сообщение успешно отправлено! Мы свяжемся с вами в
                      ближайшее время.
                    </span>
                  </div>
                )}

                {status === "error" && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                    style={{ animation: "scaleIn 0.4s ease-out" }}
                  >
                    <i className="fas fa-exclamation-circle text-xl shrink-0"></i>
                    <span className="font-medium">
                      Произошла ошибка. Пожалуйста, попробуйте позже или
                      позвоните нам.
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
