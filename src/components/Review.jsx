export function Review(props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md testimonial-card transition-colors duration-300">
      <div className="flex items-center mb-4">
        <img
          src={props.logo}
          alt={props.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <h4 className="font-bold text-gray-900 dark:text-white">
            {props.name}
          </h4>

          {/* динамические звезды */}
          <div className="flex text-yellow-400">
            {[...Array(props.rating)].map((_, i) => (
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
          </div>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 italic">{props.text}</p>
    </div>
  );
}
