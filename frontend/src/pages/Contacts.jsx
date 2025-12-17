import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import MapComponent from "../components/MapComponent";
import { InputMask } from "@react-input/mask";

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
  const [validationErrors, setValidationErrors] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const formRef = useRef(null);
  const heroRef = useRef(null);

  // Parallax effect
  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    document.head.appendChild(fontAwesome);

    const style = document.createElement("style");
    style.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

/* ===== RESET ===== */
input:focus,
textarea:focus,
select:focus {
  outline: none;
}

/* ===== ANIMATIONS ===== */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.2); opacity: 0; }
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* ===== GLASS EFFECT ===== */
.glass-effect {
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.3);
}

.dark .glass-effect {
  background: rgba(31,41,55,0.75);
  border: 1px solid rgba(255,255,255,0.1);
}

/* ===== DECORATIVE ELEMENTS ===== */
.decorative-circle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.decorative-circle-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%);
  top: -200px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.decorative-circle-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%);
  bottom: -150px;
  left: -100px;
  animation: float 6s ease-in-out infinite 1s;
}

.dark .decorative-circle-1 {
  background: radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%);
}

.dark .decorative-circle-2 {
  background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
}

/* ===== CARD HOVER ===== */
.card-hover {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
}

.dark .card-hover:hover {
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

/* ===== LIGHT THEME ===== */
.input-glow {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.input-glow:focus {
  border-color: #000000 !important;
  box-shadow:
    0 0 0 4px rgba(0,0,0,0.1),
    0 8px 16px -4px rgba(0,0,0,0.2);
  transform: translateY(-1px);
}

.input-glow:hover:not(:focus) {
  border-color: #333333;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* Focus line animation */
.focus-line {
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, #000000, #333333);
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-glow:focus + .focus-line {
  transform: scaleX(1);
}

/* Select dropdown */
select.input-glow {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 3rem;
  appearance: none;
  cursor: pointer;
}

/* ===== DARK THEME ===== */
.dark .input-glow:focus {
  border-color: #2563EB !important;
  box-shadow:
    0 0 0 4px rgba(37,99,235,0.15),
    0 8px 16px -4px rgba(37,99,235,0.3);
}

.dark .input-glow:hover:not(:focus) {
  border-color: #3B82F6;
  box-shadow: 0 4px 12px rgba(37,99,235,0.1);
}

.dark .focus-line {
  background: linear-gradient(to right, #2563EB, #3B82F6);
}

.dark select.input-glow {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%232563EB' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}

/* Checkbox */
.custom-checkbox {
  position: relative;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.custom-checkbox .checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #fff;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .custom-checkbox .checkmark {
  background-color: #1f2937;
  border-color: #4b5563;
}

.custom-checkbox:hover .checkmark {
  border-color: #000000;
  transform: scale(1.05);
}

.dark .custom-checkbox:hover .checkmark {
  border-color: #2563EB;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #000000;
  border-color: #000000;
}

.dark .custom-checkbox input:checked ~ .checkmark {
  background-color: #2563EB;
  border-color: #2563EB;
}

.custom-checkbox .checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

/* Button animations */
.btn-primary {
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.btn-primary:not(:disabled):active {
  transform: translateY(0);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.2),
    transparent
  );
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

/* Status messages */
.status-message {
  animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Privacy link */
.privacy-link {
  position: relative;
  color: #000000;
  font-weight: 600;
  transition: color 0.3s;
}

.privacy-link::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: #000000;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.privacy-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.dark .privacy-link {
  color: #3B82F6;
}

.dark .privacy-link::after {
  background-color: #3B82F6;
}

/* Tab indicator */
.tab-indicator {
  position: absolute;
  height: 100%;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
}

.dark .tab-indicator {
  background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
}

/* Map container animation */
.map-container {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.map-container::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #000000, #333333, #000000);
  background-size: 400% 400%;
  border-radius: 18px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.4s;
  animation: gradient-shift 3s ease infinite;
}

.dark .map-container::before {
  background: linear-gradient(45deg, #2563EB, #3B82F6, #2563EB);
  background-size: 400% 400%;
}

.map-container:hover::before {
  opacity: 1;
}

/* Contact info icon pulse */
.contact-icon {
  position: relative;
}

.contact-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: rgba(0,0,0,0.1);
  transform: translate(-50%, -50%);
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.dark .contact-icon::before {
  background: rgba(37,99,235,0.3);
}

/* Validation error shake */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.error-shake {
  animation: shake 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 0.8s linear infinite;
}

/* Tooltip */
.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  padding: 6px 12px;
  background: #1f2937;
  color: white;
  font-size: 12px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s, transform 0.3s;
  z-index: 1000;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1f2937;
}

.has-tooltip:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-4px);
}
`;

    document.head.appendChild(style);

    return () => {
      if (style.parentNode) document.head.removeChild(style);
      if (fontAwesome.parentNode) document.head.removeChild(fontAwesome);
    };
  }, []);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const cities = useMemo(() => ["Алматы", "Туркестан"], []);

  const cityContacts = useMemo(
    () => ({
      Алматы: {
        address: "Казахстан, г. Алматы, ул. Сатпаева, 30А",
        phone: "+7 (777) 777-77-77",
        email: "almaty@KazWonder.kz",
        workingHours: "Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 15:00",
        map: {
          lat: 43.235403220870666,
          lng: 76.9215415,
          popup: "Офис в Алматы, ул. Сатпаева, 30А",
        },
      },
      Туркестан: {
        address: "Казахстан, г. Туркестан, ул. Тауке хана, 190",
        phone: "+7 (888) 888-88-88",
        email: "turkestan@KazWonder.kz",
        workingHours: "Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 15:00",
        map: {
          lat: 43.302151156188245,
          lng: 68.25394966277416,
          popup: "Офис в Туркестане, ул. Тауке хана, 190",
        },
      },
    }),
    []
  );

  const requestTypes = useMemo(
    () => [
      "Сотрудничество",
      "Техническая поддержка",
      "Вопросы по турам",
      "Партнерство",
      "Другое",
    ],
    []
  );

  // Real-time validation
  const validateField = useCallback((name, value) => {
    const errors = {};

    switch (name) {
      case "name":
        if (value.length < 2) {
          errors.name = "Имя должно содержать минимум 2 символа";
        } else if (!/^[а-яёА-ЯЁa-zA-Z\s-]+$/.test(value)) {
          errors.name = "Имя может содержать только буквы";
        }
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Введите корректный email адрес";
        }
        break;

      case "phone":
        if (value.length > 0 && value.length != 18) {
          errors.phone = "Введите корректный номер телефона";
        }
        break;

      case "message":
        if (value.length < 10) {
          errors.message = "Сообщение должно содержать минимум 10 символов";
        }
        break;

      default:
        break;
    }

    return errors;
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      // Clear validation error on change
      if (validationErrors[name]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      const errors = validateField(name, value);

      if (Object.keys(errors).length > 0) {
        setValidationErrors((prev) => ({ ...prev, ...errors }));
      }

      setFocusedField(null);
    },
    [validateField]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    // Validate all fields
    const errors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const fieldErrors = validateField(key, value);
      Object.assign(errors, fieldErrors);
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          city: activeTab,
          timestamp: new Date().toISOString(),
        }),
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
        setValidationErrors({});

        // Smooth scroll to top of form
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  };

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.requestType &&
      formData.message.trim() &&
      formData.agreeToPrivacy &&
      Object.keys(validationErrors).length === 0
    );
  }, [formData, validationErrors]);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFF8EF] via-[#F9F4EC] to-[#F3E9D9] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white font-['Inter'] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="decorative-circle decorative-circle-1" />
      <div className="decorative-circle decorative-circle-2" />

      {/* Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 px-4"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          opacity: 1 - scrollY / 500,
        }}
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Animated Badge */}
          <div
            className="inline-block mb-6"
            style={{ animation: "fadeInUp 0.8s ease-out" }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-900/20 dark:border-blue-500/30 text-sm font-semibold text-gray-900 dark:text-blue-400 shadow-lg">
              <i className="fas fa-headset"></i>
              Всегда на связи
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-['Cormorant_Garamond'] font-bold mb-6 leading-tight text-gray-900 dark:text-white tracking-tight"
            style={{ animation: "fadeInUp 0.8s ease-out 0.1s both" }}
          >
            Свяжитесь с нами
          </h1>

          {/* Subtitle */}
          <p
            className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light text-gray-700 dark:text-gray-300"
            style={{ animation: "fadeInUp 0.8s ease-out 0.2s both" }}
          >
            Готовы ответить на все ваши вопросы и помочь спланировать
            незабываемое путешествие
          </p>

          {/* Decorative Divider */}
          <div
            className="mt-12 flex items-center justify-center gap-4"
            style={{ animation: "fadeInUp 0.8s ease-out 0.3s both" }}
          >
            <div className="h-px w-32 bg-linear-to-r from-transparent via-gray-900/40 to-transparent dark:via-blue-400/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-gray-900 dark:bg-blue-400 shadow-lg" />
            <div className="h-px w-32 bg-linear-to-l from-transparent via-gray-900/40 to-transparent dark:via-blue-400/40" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Left Panel - Office Information */}
          <div
            className="lg:col-span-2 space-y-6"
            style={{ animation: "slideInLeft 0.8s ease-out 0.2s both" }}
          >
            {/* City Tabs with Indicator */}
            <div className="glass-effect rounded-2xl p-2 border border-white/30 dark:border-gray-700/50 shadow-xl card-hover relative">
              <div className="relative flex gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setActiveTab(city)}
                    className={`flex-1 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${
                      activeTab === city
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <i
                      className={`fas fa-map-marker-alt mr-2 ${
                        activeTab === city ? "animate-bounce" : ""
                      }`}
                    />
                    {city}
                  </button>
                ))}

                {/* Animated Tab Indicator */}
                <div
                  className="tab-indicator"
                  style={{
                    width: `calc(50% - 4px)`,
                    transform: `translateX(${
                      activeTab === "Туркестан" ? "calc(100% + 8px)" : "0"
                    })`,
                  }}
                />
              </div>
            </div>

            {/* Map with Animated Border */}
            <div className="map-container glass-effect shadow-2xl">
              <MapComponent
                key={activeTab}
                zoom={20}
                height="420px"
                lat={cityContacts[activeTab].map.lat}
                long={cityContacts[activeTab].map.lng}
                popup={cityContacts[activeTab].map.popup}
              />
            </div>

            {/* Contact Information Cards */}
            <div className="space-y-4">
              {/* Address */}
              <div className="glass-effect rounded-xl p-5 flex items-start gap-4 card-hover border border-white/30 dark:border-gray-700/50 shadow-lg">
                <div className="p-3 rounded-xl bg-linear-to-br from-gray-900 to-gray-700 dark:from-blue-600 dark:to-blue-500 text-white shadow-lg shrink-0">
                  <i className="fas fa-map-marker-alt text-lg"></i>
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                    Адрес офиса
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {cityContacts[activeTab].address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="glass-effect rounded-xl p-5 flex items-start gap-4 card-hover border border-white/30 dark:border-gray-700/50 shadow-lg">
                <div className="p-3 rounded-xl bg-linear-to-br from-gray-900 to-gray-700 dark:from-blue-600 dark:to-blue-500 text-white shadow-lg shrink-0">
                  <i className="fas fa-phone text-lg"></i>
                </div>

                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                    Телефон
                  </h3>
                  <a
                    href={`tel:${cityContacts[activeTab].phone.replace(
                      /\s|\(|\)|-/g,
                      ""
                    )}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-blue-400 transition-colors leading-relaxed"
                  >
                    {cityContacts[activeTab].phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="glass-effect rounded-xl p-5 flex items-start gap-4 card-hover border border-white/30 dark:border-gray-700/50 shadow-lg">
                <div className="p-3 rounded-xl bg-linear-to-br from-gray-900 to-gray-700 dark:from-blue-600 dark:to-blue-500 text-white shadow-lg shrink-0">
                  <i className="fas fa-envelope text-lg"></i>
                </div>

                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                    Email
                  </h3>
                  <a
                    href={`mailto:${cityContacts[activeTab].email}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-blue-400 transition-colors leading-relaxed"
                  >
                    {cityContacts[activeTab].email}
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="glass-effect rounded-xl p-5 flex items-start gap-4 card-hover border border-white/30 dark:border-gray-700/50 shadow-lg">
                <div className="p-3 rounded-xl bg-linear-to-br from-gray-900 to-gray-700 dark:from-blue-600 dark:to-blue-500 text-white shadow-lg shrink-0">
                  <i className="fas fa-clock text-lg"></i>
                </div>

                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                    Часы работы
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {cityContacts[activeTab].workingHours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Contact Form */}
          <div
            className="lg:col-span-3"
            style={{ animation: "slideInRight 0.8s ease-out 0.3s both" }}
          >
            <div className="glass-effect rounded-2xl p-8 md:p-12 border border-white/30 dark:border-gray-700/50 shadow-2xl">
              <div className="mb-10">
                <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] font-bold mb-4 text-gray-900 dark:text-white">
                  Напишите нам
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Заполните форму, и мы свяжемся с вами в ближайшее время
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="relative">
                  <label className="block text-sm font-bold mb-2.5 text-gray-800 dark:text-gray-200">
                    Имя <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Введите ваше имя"
                      className={`w-full px-5 py-4 rounded-xl border-2 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 input-glow ${
                        validationErrors.name
                          ? "border-red-400 error-shake"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <i className="fas fa-exclamation-circle"></i>
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div className="relative">
                  <label className="block text-sm font-bold mb-2.5 text-gray-800 dark:text-gray-200">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      placeholder="your@email.com"
                      className={`w-full px-5 py-4 rounded-xl border-2 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 input-glow ${
                        validationErrors.email
                          ? "border-red-400 error-shake"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <i className="fas fa-exclamation-circle"></i>
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Input (Optional) */}
                <div className="relative">
                  <label className="block text-sm font-bold mb-2.5 text-gray-800 dark:text-gray-200">
                    Телефон{" "}
                    <span className="text-gray-400 font-normal text-xs">
                      (необязательно)
                    </span>
                  </label>
                  <div className="relative">
                    <InputMask
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      mask="+7 (7__) ___-__-__"
                      replacement={{ _: /\d/ }}
                      placeholder="+7 (___) ___-__-__"
                      className={`w-full px-5 py-4 rounded-xl border-2 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 input-glow ${
                        validationErrors.phone
                          ? "border-red-400 error-shake"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <i className="fas fa-exclamation-circle"></i>
                      {validationErrors.phone}
                    </p>
                  )}
                </div>

                {/* Request Type Select */}
                <div className="relative">
                  <label className="block text-sm font-bold mb-2.5 text-gray-800 dark:text-gray-200">
                    Тип запроса <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white transition-all duration-300 input-glow"
                    >
                      <option value="">Выберите тип запроса</option>
                      {requestTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="relative">
                  <label className="block text-sm font-bold mb-2.5 text-gray-800 dark:text-gray-200">
                    Сообщение <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      rows={5}
                      placeholder="Расскажите подробнее о вашем вопросе..."
                      className={`w-full px-5 py-4 rounded-xl border-2 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 resize-none input-glow ${
                        validationErrors.message
                          ? "border-red-400 error-shake"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    />
                  </div>
                  {validationErrors.message && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <i className="fas fa-exclamation-circle"></i>
                      {validationErrors.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {formData.message.length} / 1000 символов
                  </p>
                </div>

                {/* Privacy Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="custom-checkbox mt-1">
                    <input
                      type="checkbox"
                      name="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="checkmark"></span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                    Я соглашаюсь с{" "}
                    <span className="privacy-link">
                      политикой конфиденциальности
                    </span>{" "}
                    и обработкой персональных данных
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || status === "loading"}
                  className="w-full py-5 rounded-xl text-lg font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-blue-600 dark:to-blue-500 text-white shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl btn-primary flex items-center justify-center gap-3 transition-all duration-300"
                >
                  {status === "loading" ? (
                    <>
                      <div className="spinner" />
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
                  <div className="status-message flex items-center gap-3 p-5 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400">
                    <i className="fas fa-check-circle text-2xl shrink-0"></i>
                    <div>
                      <p className="font-bold mb-1">Успешно отправлено!</p>
                      <p className="text-sm">
                        Мы свяжемся с вами в ближайшее время.
                      </p>
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="status-message flex items-center gap-3 p-5 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
                    <i className="fas fa-exclamation-circle text-2xl shrink-0"></i>
                    <div>
                      <p className="font-bold mb-1">Произошла ошибка</p>
                      <p className="text-sm">
                        Пожалуйста, попробуйте позже или позвоните нам напрямую.
                      </p>
                    </div>
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
