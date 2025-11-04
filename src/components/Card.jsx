export function Card(props) {
  return (
    <>
      <div
        id="alps"
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden tour-card transition"
      >
        <div className="relative">
          <img
            src={props.image}
            alt="image"
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {props.title}
            </h3>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-10">
            {props.description}
          </p>

          <div className="absolute left-5 bottom-5 flex items-center text-yellow-400 mb-4">
            {[...Array(props.stars)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-yellow-400"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            ))}
            <span className="text-gray-600 dark:text-gray-400 ml-1">
              ({props.rating})
            </span>
          </div>

          <div className="absolute right-5 bottom-5 flex justify-end items-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-md font-medium text-sm transition duration-300 cursor-pointer"
              id="open-alps"
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
