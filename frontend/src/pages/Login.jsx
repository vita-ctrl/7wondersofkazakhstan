import { useState, useCallback, memo, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEnvelope,
  faEye,
  faEyeSlash,
  faCheckCircle,
  faExclamationCircle,
  faCheck,
  faSpinner,
  faPlane,
  faMapMarkedAlt,
  faCompass,
  faMountain,
  faUmbrellaBeach,
} from "@fortawesome/free-solid-svg-icons";

// --------------------------------------------------------
// ФУНКЦИЯ passwordStrength
// --------------------------------------------------------
function passwordStrength(password) {
  let score = 0;
  if (!password) return 0;

  if (password.length >= 6) score += 30;
  if (password.length >= 10) score += 20;

  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[@$!%*#?&]/.test(password)) score += 10;

  return Math.min(score, 100);
}

// Мемоизированный InputField
const InputField = memo(
  ({
    icon,
    type,
    name,
    placeholder,
    value,
    onChange,
    error,
    showToggle = false,
    onToggle,
    showPasswordIcon,
  }) => (
    <div className="relative mb-5">
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-r from-[#424E2B]/20 to-[#5A6841]/20 dark:from-blue-400/20 dark:to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={`
            relative w-full pl-16 ${showToggle ? 'pr-14' : 'pr-4'} py-4
            bg-white dark:bg-gray-900
            border-2 rounded-xl
            transition-all duration-300
            text-gray-900 dark:text-white
            font-medium
            ${error
              ? "border-red-400 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
              : "border-gray-200 dark:border-gray-700 focus:border-[#424E2B] dark:focus:border-blue-400 focus:shadow-lg focus:shadow-[#424E2B]/10 dark:focus:shadow-blue-400/20"
            }
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          `}
          placeholder={placeholder}
        />

        <div
          className={`
          absolute left-4 top-1/2 -translate-y-1/2
          w-10 h-10 rounded-xl
          flex items-center justify-center
          transition-all duration-300
          ${error
              ? "bg-red-50 dark:bg-red-900/20 text-red-500"
              : "bg-linear-to-br from-[#424E2B] to-[#5A6841] dark:from-blue-500 dark:to-blue-600 text-white shadow-lg"
            }
        `}
        >
          <FontAwesomeIcon icon={icon} className="text-sm" />
        </div>

        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#424E2B] dark:hover:text-blue-400 transition-all p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FontAwesomeIcon icon={showPasswordIcon} />
          </button>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-500 text-sm font-medium animate-shake px-2">
          <FontAwesomeIcon icon={faExclamationCircle} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
);

InputField.displayName = "InputField";

// PasswordStrengthIndicator компонент
const PasswordStrengthIndicator = memo(({ password }) => {
  const strength = passwordStrength(password);

  const getColor = () => {
    if (strength < 40) return "from-red-500 to-red-600";
    if (strength < 70) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  const getText = () => {
    if (strength < 40) return "Слабый";
    if (strength < 70) return "Средний";
    return "Сильный";
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400 font-semibold">
          Сложность пароля
        </span>
        <span
          className={`font-bold ${strength < 40
            ? "text-red-500"
            : strength < 70
              ? "text-yellow-500"
              : "text-green-500"
            }`}
        >
          {getText()}
        </span>
      </div>
      <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 bg-linear-to-r ${getColor()} relative`}
          style={{ width: `${strength}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-shimmer-slow"></div>
        </div>
      </div>
    </div>
  );
});

PasswordStrengthIndicator.displayName = "PasswordStrengthIndicator";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegisterPath = location.pathname === "/register";
  const [isFlipped, setIsFlipped] = useState(isRegisterPath);

  useEffect(() => {
    if (location.pathname === "/register") {
      setIsFlipped(true);
    } else if (location.pathname === "/login") {
      setIsFlipped(false);
    }
  }, [location.pathname]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    loginEmail: "",
    loginPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const requested = useRef(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Refs для измерения высоты форм
  const loginFormRef = useRef(null);
  const registerFormRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState("auto");

  const redirectUrl = location.state?.redirectUrl;
  const dateId = location.state?.dateId || null;
  const participants = location.state?.participants || 1;

  // Эффект для плавного изменения высоты контейнера
  useEffect(() => {
    const updateHeight = () => {
      if (isFlipped && registerFormRef.current) {
        setContainerHeight(`${registerFormRef.current.offsetHeight}px`);
      } else if (!isFlipped && loginFormRef.current) {
        setContainerHeight(`${loginFormRef.current.offsetHeight}px`);
      }
    };

    // Небольшая задержка для корректного измерения после рендера
    const timer = setTimeout(updateHeight, 50);
    
    // Обновляем при изменении размера окна
    window.addEventListener('resize', updateHeight);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateHeight);
    };
  }, [isFlipped, formData.password, successMessage]);

  // --------------------------------------------------------
  // ОБРАБОТКА ТОКЕНА ПОДТВЕРЖДЕНИЯ
  // --------------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);

    const params = new URLSearchParams(window.location.search);
    const verifyToken = params.get("verify_token");

    if (verifyToken && !requested.current) {
      setIsVerifyingToken(true);
      handleTokenVerification(verifyToken);
    } else {
      const existingToken = localStorage.getItem("token");
      if (existingToken && !redirectUrl) {
        navigate("/");
      }
    }
    return () => (requested.current = true);
  }, [navigate, redirectUrl]);

  const getUserData = async (token) => {
    try {
      const response = await fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Ошибка получения данных пользователя:", error);
    }
    return null;
  };

  const handleTokenVerification = async (token) => {
    try {
      const response = await fetch(`/api/verify_token?token=${token}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Токен недействителен");
      }

      const data = await response.json();

      // Если сервер возвращает access_token, автоматически логиним пользователя
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);

        // Получаем данные пользователя
        const userData = await getUserData(data.access_token);
        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
        }

        window.dispatchEvent(new Event("authChange"));

        setSuccessMessage("✅ Аккаунт успешно подтвержден! Перенаправление на главную...");
        
        // Перенаправляем на главную страницу через 1.5 секунды
        setTimeout(() => {
          if (redirectUrl) {
            navigate(redirectUrl, {
              replace: true,
              state: { dateId: dateId, participants: participants },
            });
          } else {
            navigate("/", { replace: true });
          }
        }, 1500);
      } else {
        // Если токен не возвращается, показываем сообщение и предлагаем войти
        setSuccessMessage("✅ Аккаунт успешно подтвержден! Теперь войдите в систему.");
        setTimeout(() => {
          setIsFlipped(false);
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setErrors({
        general:
          error.message ||
          "Неверный или уже использованный токен подтверждения.",
      });
    } finally {
      setIsVerifyingToken(false);
      window.history.replaceState({}, "", `${window.location.pathname}`);
    }
  };

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Имя обязательно";
    } else if (formData.username.length < 2) {
      newErrors.username = "Минимум 2 символа";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Минимум 6 символов";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    return newErrors;
  }, [formData]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const handleLoginSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!formData.loginEmail) {
        newErrors.loginEmail = "Введите email";
      } else if (!emailRegex.test(formData.loginEmail)) {
        newErrors.loginEmail = "Неверный формат email";
      }

      if (!formData.loginPassword) {
        newErrors.loginPassword = "Введите пароль";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: formData.loginEmail,
            password: formData.loginPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const msg = data.detail || data.message || "Неверные учетные данные";
          setErrors({
            loginEmail: msg,
            loginPassword: msg,
          });
          return;
        }

        if (data.access_token) {
          localStorage.setItem("token", data.access_token);

          const userData = await getUserData(data.access_token);
          if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            localStorage.setItem(
              "user",
              JSON.stringify({
                email: formData.loginEmail,
              })
            );
          }

          window.dispatchEvent(new Event("authChange"));

          setSuccessMessage("✅ Вход выполнен успешно!");
          setTimeout(() => {
            if (redirectUrl)
              navigate(redirectUrl, {
                replace: true,
                state: { dateId: dateId, participants: participants },
              });
            else navigate("/", { replace: true });
          }, 1000);
        }
      } catch (err) {
        setErrors({
          loginEmail: "Ошибка соединения",
          loginPassword: "Проверьте интернет",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, navigate, redirectUrl, dateId, participants]
  );

  const handleRegisterSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            first_name: formData.username,
            last_name: "",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMsg = data.detail || data.message || "Ошибка регистрации";

          if (
            errorMsg.toLowerCase().includes("email") ||
            errorMsg.includes("почт")
          ) {
            setErrors((prev) => ({ ...prev, email: errorMsg }));
          } else if (
            errorMsg.toLowerCase().includes("password") ||
            errorMsg.includes("парол")
          ) {
            setErrors((prev) => ({ ...prev, password: errorMsg }));
          } else {
            setErrors((prev) => ({ ...prev, email: errorMsg }));
          }
          return;
        }

        setSuccessMessage(
          `✅ Регистрация успешна! Проверьте почту ${formData.email} для подтверждения.`
        );

        setFormData((prev) => ({
          ...prev,
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }));
        setErrors({});

        setTimeout(() => {
          setIsFlipped(false);
          navigate("/login");
          setSuccessMessage("");
        }, 5000);
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          email: "Не удалось связаться с сервером",
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm, navigate]
  );

  const handleFlip = useCallback(() => {
    if (isFlipped) {
      navigate("/login", { replace: true, state: location.state });
    } else {
      navigate("/register", { replace: true, state: location.state });
    }
  }, [isFlipped, navigate, location.state]);

  if (isVerifyingToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#FFF8EF] via-[#F9F4EC] to-[#F3E9D9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#424E2B]/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#5A6841]/10 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="text-center relative z-10">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 border-4 border-[#424E2B]/20 dark:border-blue-400/20 border-t-[#424E2B] dark:border-t-blue-400 rounded-full animate-spin"></div>
            <FontAwesomeIcon
              icon={faPlane}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#424E2B] dark:text-blue-400 text-3xl"
            />
          </div>
          <h2 className="text-4xl font-bold text-[#424E2B] dark:text-white mb-3 font-['Playfair_Display']">
            Подтверждение email
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-['Inter']">Проверяем токен...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-32 flex justify-center items-start bg-linear-to-br from-[#FFF8EF] via-[#F9F4EC] to-[#F3E9D9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 relative overflow-hidden font-['Inter']">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[5%] w-96 h-96 bg-[#424E2B]/5 dark:bg-blue-500/5 rounded-full blur-3xl animate-float-1"></div>
        <div className="absolute top-40 right-[10%] w-72 h-72 bg-[#5A6841]/5 dark:bg-blue-400/5 rounded-full blur-3xl animate-float-2"></div>
        <div className="absolute bottom-20 left-[15%] w-80 h-80 bg-[#424E2B]/5 dark:bg-blue-600/5 rounded-full blur-3xl animate-float-3"></div>

        {/* Декоративные элементы */}
        <FontAwesomeIcon icon={faPlane} className="absolute top-[15%] left-[8%] text-[#424E2B]/5 dark:text-blue-400/5 text-5xl rotate-45 animate-float-1" />
        <FontAwesomeIcon icon={faMountain} className="absolute top-[25%] right-[12%] text-[#5A6841]/5 dark:text-blue-500/5 text-6xl animate-float-2" />
        <FontAwesomeIcon icon={faCompass} className="absolute bottom-[20%] left-[10%] text-[#424E2B]/5 dark:text-blue-400/5 text-5xl animate-float-3" />
        <FontAwesomeIcon icon={faUmbrellaBeach} className="absolute bottom-[30%] right-[8%] text-[#5A6841]/5 dark:text-blue-500/5 text-4xl animate-float-1" style={{ animationDelay: '2s' }} />
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-slideDown">
          <div className="bg-linear-to-r from-emerald-500 via-green-500 to-teal-500 text-white p-5 rounded-2xl shadow-2xl flex items-center justify-between backdrop-blur-xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FontAwesomeIcon icon={faCheck} className="text-xl" />
              </div>
              <span className="font-semibold">{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-white/80 hover:text-white text-3xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-slideDown">
          <div className="bg-linear-to-r from-red-500 via-rose-500 to-pink-500 text-white p-5 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FontAwesomeIcon icon={faExclamationCircle} className="text-xl" />
              </div>
              <span className="font-semibold">{errors.general}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Slide Container with dynamic height */}
      <div className="relative z-10 w-full max-w-4xl">
        <div
          className="relative transition-all duration-700 ease-in-out overflow-hidden"
          style={{ height: containerHeight }}
        >

          {/* Login Form */}
          <div
            ref={loginFormRef}
            className={`transition-all duration-700 ease-out ${isFlipped ? 'absolute inset-0 -translate-x-full opacity-0 pointer-events-none' : 'relative translate-x-0 opacity-100'
              }`}
          >
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-gray-800/20 overflow-hidden">
              <div className="p-12 md:p-16">
                <div className="max-w-md mx-auto">
                  <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-[#424E2B] via-[#5A6841] to-[#424E2B] dark:from-blue-500 dark:via-blue-600 dark:to-blue-500 rounded-3xl mb-6 shadow-xl animate-float-1">
                      <FontAwesomeIcon icon={faPlane} className="text-white text-3xl" />
                    </div>
                    <h2 className="text-5xl font-bold text-[#424E2B] dark:text-white mb-3 font-['Playfair_Display']">
                      Добро пожаловать
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Войдите в свой аккаунт
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <InputField
                      icon={faEnvelope}
                      type="email"
                      name="loginEmail"
                      placeholder="Email"
                      value={formData.loginEmail}
                      onChange={handleChange}
                      error={errors.loginEmail}
                    />

                    <InputField
                      icon={faLock}
                      type={showLoginPassword ? "text" : "password"}
                      name="loginPassword"
                      placeholder="Пароль"
                      value={formData.loginPassword}
                      onChange={handleChange}
                      error={errors.loginPassword}
                      showToggle={true}
                      onToggle={() => setShowLoginPassword(!showLoginPassword)}
                      showPasswordIcon={showLoginPassword ? faEyeSlash : faEye}
                    />

                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        className="text-sm text-[#424E2B] dark:text-blue-400 hover:underline font-semibold transition-colors"
                      >
                        Забыли пароль?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`
                          relative overflow-hidden w-full py-4 rounded-xl font-bold text-lg
                          transition-all duration-300
                          ${isLoading
                          ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                          : "bg-linear-to-r from-[#424E2B] via-[#5A6841] to-[#424E2B] dark:from-blue-500 dark:via-blue-600 dark:to-blue-500 hover:shadow-2xl hover:shadow-[#424E2B]/30 dark:hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
                        }
                          text-white group
                        `}
                    >
                      <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                      <span className="relative flex items-center justify-center gap-3">
                        {isLoading ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xl" />
                            Вход...
                          </>
                        ) : (
                          <>
                            Войти
                            <FontAwesomeIcon icon={faPlane} className="group-hover:translate-x-2 transition-transform" />
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      Нет аккаунта?
                    </p>
                    <button
                      onClick={handleFlip}
                      className="text-[#424E2B] dark:text-blue-400 font-bold hover:underline text-lg transition-colors"
                    >
                      Зарегистрироваться
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Register Form */}
          <div
            ref={registerFormRef}
            className={`transition-all duration-700 ease-out ${isFlipped ? 'relative translate-x-0 opacity-100' : 'absolute inset-0 translate-x-full opacity-0 pointer-events-none'
              }`}
          >
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-gray-800/20 overflow-hidden">
              <div className="p-12 md:p-16">
                <div className="max-w-md mx-auto">
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-[#5A6841] via-[#424E2B] to-[#5A6841] dark:from-blue-600 dark:via-blue-700 dark:to-blue-600 rounded-3xl mb-6 shadow-xl animate-float-2">
                      <FontAwesomeIcon icon={faCompass} className="text-white text-3xl" />
                    </div>
                    <h2 className="text-5xl font-bold text-[#424E2B] dark:text-white mb-3 font-['Playfair_Display']">
                      Создать аккаунт
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Начните своё путешествие
                    </p>
                  </div>

                  {successMessage && isFlipped ? (
                    <div className="text-center py-8 animate-scaleIn">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full mb-6">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-5xl" />
                      </div>
                      <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4 font-['Playfair_Display']">
                        Успешно!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                        {successMessage}
                      </p>
                      <p className="text-sm text-gray-500">
                        Перенаправление...
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      <InputField
                        icon={faUser}
                        type="text"
                        name="username"
                        placeholder="Имя"
                        value={formData.username}
                        onChange={handleChange}
                        error={errors.username}
                      />

                      <InputField
                        icon={faEnvelope}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                      />

                      <div>
                        <InputField
                          icon={faLock}
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Пароль"
                          value={formData.password}
                          onChange={handleChange}
                          error={errors.password}
                          showToggle={true}
                          onToggle={() => setShowPassword(!showPassword)}
                          showPasswordIcon={showPassword ? faEyeSlash : faEye}
                        />
                        {formData.password && (
                          <PasswordStrengthIndicator password={formData.password} />
                        )}
                      </div>

                      <InputField
                        icon={faLock}
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Подтвердите пароль"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        showToggle={true}
                        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                        showPasswordIcon={showConfirmPassword ? faEyeSlash : faEye}
                      />

                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          required
                          className="
      w-5 h-5
      rounded-md
      border-2 border-gray-300 dark:border-gray-600
      text-[#424E2B] dark:text-blue-400
      focus:ring-2 focus:ring-[#424E2B]/20 dark:focus:ring-blue-400/20
      cursor-pointer
      transition-all
    "
                        />

                        <span className="text-sm leading-snug text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                          Я соглашаюсь с{" "}
                          <button type="button" className="text-[#424E2B] dark:text-blue-400 hover:underline font-semibold">
                            условиями
                          </button>{" "}
                          и{" "}
                          <button type="button" className="text-[#424E2B] dark:text-blue-400 hover:underline font-semibold">
                            политикой
                          </button>
                        </span>
                      </label>


                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`
                            relative overflow-hidden w-full py-4 rounded-xl font-bold text-lg
                            transition-all duration-300
                            ${isLoading
                            ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                            : "bg-linear-to-r from-[#5A6841] via-[#424E2B] to-[#5A6841] dark:from-blue-600 dark:via-blue-700 dark:to-blue-600 hover:shadow-2xl hover:shadow-[#5A6841]/30 dark:hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]"
                          }
                            text-white group
                          `}
                      >
                        <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                        <span className="relative flex items-center justify-center gap-3">
                          {isLoading ? (
                            <>
                              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xl" />
                              Регистрация...
                            </>
                          ) : (
                            <>
                              Зарегистрироваться
                              <FontAwesomeIcon icon={faCompass} className="group-hover:rotate-180 transition-transform duration-500" />
                            </>
                          )}
                        </span>
                      </button>
                    </form>
                  )}

                  <div className="mt-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      Уже есть аккаунт?
                    </p>
                    <button
                      onClick={handleFlip}
                      className="text-[#424E2B] dark:text-blue-400 font-bold hover:underline text-lg transition-colors"
                    >
                      Войти
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #424E2B !important;
          box-shadow: inset 0 0 0px 1000px transparent !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        .dark input:-webkit-autofill,
        .dark input:-webkit-autofill:hover,
        .dark input:-webkit-autofill:focus,
        .dark input:-webkit-autofill:active {
          -webkit-text-fill-color: white !important;
        }

        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        @keyframes float-1 {
          0%, 100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(30px, -30px);
          }
          66% {
            transform: translate(-20px, 20px);
          }
        }

        @keyframes float-2 {
          0%, 100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(-25px, 25px);
          }
          66% {
            transform: translate(25px, -20px);
          }
        }

        @keyframes float-3 {
          0%, 100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(20px, 30px);
          }
          66% {
            transform: translate(-30px, -25px);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer-slow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-float-1 {
          animation: float-1 20s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 25s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 30s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-shimmer-slow {
          animation: shimmer-slow 3s infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}