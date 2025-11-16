const GalleryStyles = () => (
  <style jsx global>{`
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .slide-in-right {
      animation: slideInRight 0.5s ease-out;
    }

    .slide-in-left {
      animation: slideInLeft 0.5s ease-out;
    }

    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }

    .thumbnails-container {
      scroll-behavior: smooth;
    }
  `}</style>
);

export default GalleryStyles;
