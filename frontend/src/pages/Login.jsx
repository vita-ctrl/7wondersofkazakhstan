import { useState, useCallback, memo, useEffect, useRef } from "react";
import { replace, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEnvelope,
  faEye,
  faEyeSlash,
  faCheckCircle,
  faExclamationCircle,
  faArrowLeft,
  faCheck,
  faSpinner,
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
// --------------------------------------------------------

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
    <div className="relative mt-6 h-16">
      <div className="relative">
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
        h-12
        appearance-none
        autofill:bg-transparent
        peer w-full bg-transparent border-b-2 
        pt-6 pb-2 px-2 outline-none transition-all
        ${
          error
            ? "border-red-500 text-red-500"
            : "border-olive-dark dark:border-blue-400 text-olive-dark dark:text-white"
        }
      `}
          placeholder=" "
        />

        <label
          className={`
        absolute left-2 text-sm transition-all duration-200 pointer-events-none
        text-gray-500 dark:text-gray-300
        peer-placeholder-shown:top-6 
        peer-placeholder-shown:text-sm
        peer-not-placeholder-shown:top-2 
        peer-not-placeholder-shown:text-xs
        peer-focus:top-2 
        peer-focus:text-xs
        ${error ? "text-red-500" : ""}
      `}
        >
          {placeholder}
        </label>

        <FontAwesomeIcon
          icon={icon}
          className={`
        absolute right-2 top-6 transition-colors
        ${error ? "text-red-500" : "text-olive-dark dark:text-blue-400"}
      `}
        />

        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-10 top-6 text-gray-500 hover:text-olive-dark dark:hover:text-blue-400 transition-colors"
          >
            <FontAwesomeIcon icon={showPasswordIcon} />
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <FontAwesomeIcon icon={faExclamationCircle} size="xs" />
          {error}
        </p>
      )}
    </div>
  )
);

InputField.displayName = "InputField";

// --------------------------------------------------------
// PasswordStrengthIndicator компонент
// --------------------------------------------------------
const PasswordStrengthIndicator = memo(({ password }) => {
  const strength = passwordStrength(password);

  const getColor = () => {
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getText = () => {
    if (strength < 40) return "Слабый";
    if (strength < 70) return "Средний";
    return "Сильный";
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 dark:text-gray-400">
          Сложность пароля:
        </span>
        <span
          className={`font-medium ${
            strength < 40
              ? "text-red-500"
              : strength < 70
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {getText()}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
    </div>
  );
});

PasswordStrengthIndicator.displayName = "PasswordStrengthIndicator";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegisterPath = location.pathname === "/register";
  const [active, setActive] = useState(isRegisterPath);

  useEffect(() => {
    if (location.pathname === "/register") {
      setActive(true);
    } else if (location.pathname === "/login") {
      setActive(false);
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

  const redirectUrl = location.state?.redirectUrl;

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
      // Проверяем, если пользователь уже авторизован
      const existingToken = localStorage.getItem("token");
      if (existingToken && !redirectUrl) {
        navigate("/");
      }
    }
    return () => (requested.current = true);
  }, [navigate]);

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

      setSuccessMessage("Аккаунт успешно подтвержден!");
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

  // --------------------------------------------------------
  // ВАЛИДАЦИЯ ФОРМЫ РЕГИСТРАЦИИ
  // --------------------------------------------------------
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

  // --------------------------------------------------------
  // ОБРАБОТЧИКИ ИЗМЕНЕНИЯ ПОЛЕЙ
  // --------------------------------------------------------
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

  const dateId = location.state?.dateId || null;
  const participants = location.state?.participants || 1;

  // --------------------------------------------------------
  // ВХОД
  // --------------------------------------------------------
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

          // Получаем данные пользователя
          const userData = await getUserData(data.access_token);
          if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Если не получили полные данные, сохраняем email
            localStorage.setItem(
              "user",
              JSON.stringify({
                email: formData.loginEmail,
              })
            );
          }

          // Отправляем событие об изменении авторизации
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
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setErrors({
          loginEmail: "Ошибка соединения",
          loginPassword: "Проверьте интернет",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, navigate]
  );

  // --------------------------------------------------------
  // РЕГИСТРАЦИЯ
  // --------------------------------------------------------
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

        // После успешной регистрации
        setSuccessMessage(
          `✅ Регистрация успешна! Проверьте почту ${formData.email} для подтверждения.`
        );

        // Очистка формы
        setFormData((prev) => ({
          ...prev,
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }));
        setErrors({});

        // Автоматически переключаем на форму входа через 3 секунды
        setTimeout(() => {
          setActive(false);
          setSuccessMessage("");
        }, 5000);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          email: "Не удалось связаться с сервером",
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm]
  );

  // --------------------------------------------------------
  // ЕСЛИ ИДЕТ ВЕРИФИКАЦИЯ ТОКЕНА
  // --------------------------------------------------------
  if (isVerifyingToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-beige to-[#F5F0E8] dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-olive-dark dark:border-blue-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-olive-dark dark:text-white mb-2">
            Подтверждение email
          </h2>
          <p className="text-gray-600 dark:text-gray-300">Проверяем токен...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-beige to-[#F5F0E8] dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
      {/* Уведомления */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between animate-slideDown">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheck} />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-white hover:text-gray-200 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg animate-slideDown">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faExclamationCircle} />
              <span>{errors.general}</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-4xl">
        <div
          className={`relative overflow-visible rounded-2xl shadow-2xl transition-all duration-500 
  bg-cream/90 dark:bg-gray-800/90 backdrop-blur-sm
  border border-white/20 dark:border-gray-700/20
  ${active ? "form-active" : ""}`}
        >
          <div className="absolute top-6 left-6 z-20">
            <button
              onClick={() => {
                const newPath = active ? "/login" : "/register";
                navigate(newPath, { replace: true, state: location.state });
              }}
              className="flex items-center gap-2 text-olive-dark dark:text-gray-300 hover:text-[#2a351c] dark:hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span className="hidden sm:inline">
                {active ? "Назад к входу" : "Перейти к регистрации"}
              </span>
            </button>
          </div>

          <div
            className={`shape2 absolute inset-0 transition-all duration-1000 ${
              active ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="relative flex">
            {/* Левый блок — Вход */}
            <div
              className={`w-1/2 p-8 sm:p-12 transition-all duration-700 ${
                active ? "opacity-0 -translate-x-full" : "opacity-100"
              }`}
            >
              <div className="max-w-md mx-auto mt-15">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-olive-dark dark:text-white mb-3">
                    Добро пожаловать
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Войдите в свой аккаунт
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-6">
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

                  <div className="flex items-center justify-end text-sm">
                    {/* <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-olive-dark focus:ring-olive-dark"
                      />
                      <span className="text-gray-600 dark:text-gray-300">
                        Запомнить меня
                      </span>
                    </label> */}
                    <button
                      type="button"
                      className="text-olive-dark dark:text-blue-400 hover:underline"
                    >
                      Забыли пароль?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-opacity shadow-lg ${
                      isLoading
                        ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                        : "bg-linear-to-r from-olive-dark to-[#5A6B3C] dark:from-blue-600 dark:to-blue-500 hover:opacity-90"
                    } text-white`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className="animate-spin"
                        />
                        Вход...
                      </span>
                    ) : (
                      "Войти"
                    )}
                  </button>

                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Нет аккаунта?{" "}
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/register", {
                          replace: true,
                          state: location.state,
                        })
                      }
                      className="font-semibold text-olive-dark dark:text-blue-400 hover:underline"
                    >
                      Зарегистрироваться
                    </button>
                  </p>
                </form>
              </div>
            </div>

            {/* Правый блок — Регистрация */}
            <div
              className={`w-1/2 p-8 sm:p-12 transition-all duration-700 ${
                active ? "opacity-100" : "opacity-0 translate-x-full"
              }`}
            >
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-olive-dark dark:text-white mb-3">
                    Создать аккаунт
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Присоединяйтесь к нашему сообществу
                  </p>
                </div>

                {successMessage ? (
                  <div className="text-center py-8">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 text-5xl mb-4"
                    />
                    <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                      Успешно!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {successMessage}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                      Через несколько секунд вы будете перенаправлены на
                      страницу входа...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit}>
                    <div className="space-y-4">
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
                          <PasswordStrengthIndicator
                            password={formData.password}
                          />
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
                        onToggle={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        showPasswordIcon={
                          showConfirmPassword ? faEyeSlash : faEye
                        }
                      />

                      <div className="flex items-start mt-4">
                        <input
                          type="checkbox"
                          id="terms"
                          required
                          className="mt-1 rounded border-gray-300 text-olive-dark focus:ring-olive-dark"
                        />
                        <label
                          htmlFor="terms"
                          className="ml-2 text-sm text-gray-600 dark:text-gray-300"
                        >
                          Я соглашаюсь с{" "}
                          <button
                            type="button"
                            className="text-olive-dark dark:text-blue-400 hover:underline"
                          >
                            условиями использования
                          </button>{" "}
                          и{" "}
                          <button
                            type="button"
                            className="text-olive-dark dark:text-blue-400 hover:underline"
                          >
                            политикой конфиденциальности
                          </button>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 mt-6 rounded-lg font-semibold transition-all shadow-lg ${
                          isLoading
                            ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                            : "bg-linear-to-r from-olive-dark to-[#5A6B3C] dark:from-blue-600 dark:to-blue-500 hover:opacity-90"
                        } text-white`}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <FontAwesomeIcon
                              icon={faSpinner}
                              className="animate-spin"
                            />
                            Регистрация...
                          </span>
                        ) : (
                          "Зарегистрироваться"
                        )}
                      </button>

                      <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
                        Уже есть аккаунт?{" "}
                        <button
                          type="button"
                          onClick={() =>
                            navigate("/login", {
                              replace: true,
                              state: location.state,
                            })
                          }
                          className="font-semibold text-olive-dark dark:text-blue-400 hover:underline"
                        >
                          Войти
                        </button>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
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

    .shape1 {
      background: linear-gradient(135deg, #424E2B20 0%, #E5D9C620 100%);
      clip-path: polygon(0 0, 100% 0, 100% 30%, 0 70%);
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
    
    .animate-slideDown {
      animation: slideDown 0.3s ease-out;
    }
  `}
      </style>
    </div>
  );
}
