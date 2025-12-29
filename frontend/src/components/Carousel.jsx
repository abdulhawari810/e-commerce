import { useRef, useState, useEffect } from "react";
import carousel1 from "../assets/carousel1.png";
import carousel2 from "../assets/people1.png";
import carousel3 from "../assets/carousel3.png";
import carousel4 from "../assets/carousel4.png";
import carousel5 from "../assets/carousel5.png";
import { NavLink } from "react-router-dom";

export default function Carousel() {
  const images = [
    {
      src: carousel1,
      title: "Adidas 1dawd",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In saepe aliquam praesentium necessitatibus repudiandae sapiente reiciendis animi a nesciunt corrupti doloribus, pariatur hic vitae maiores, minima natus impedit facilis quam?",
    },
    {
      src: carousel2,
      title: "Adidas 2dadawd",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In saepe aliquam praesentium necessitatibus repudiandae sapiente reiciendis animi a nesciunt corrupti doloribus, pariatur hic vitae maiores, minima natus impedit facilis quam?",
    },
    {
      src: carousel3,
      title: "Adidas 3dadadadad",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In saepe aliquam praesentium necessitatibus repudiandae sapiente reiciendis animi a nesciunt corrupti doloribus, pariatur hic vitae maiores, minima natus impedit facilis quam?",
    },
    {
      src: carousel4,
      title: "Adidas 4adaw",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In saepe aliquam praesentium necessitatibus repudiandae sapiente reiciendis animi a nesciunt corrupti doloribus, pariatur hic vitae maiores, minima natus impedit facilis quam?",
    },
    {
      src: carousel5,
      title: "Adidas 5mdwn",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In saepe aliquam praesentium necessitatibus repudiandae sapiente reiciendis animi a nesciunt corrupti doloribus, pariatur hic vitae maiores, minima natus impedit facilis quam?",
    },
  ];

  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);

  // REF untuk setiap teks dots
  const itemRefs = useRef([]);
  const [highlightWidth, setHighlightWidth] = useState(0);
  const [highlightHeight, setHighlightHeight] = useState(0);
  const [highlightX, setHighlightX] = useState(0);

  // REF untuk interval autoplay
  const autoPlayRef = useRef(null);
  const restartTimeoutRef = useRef(null);

  // auto play logic

  const startAutoplay = () => {
    stopAutoPlay(); // clear dulu

    autoPlayRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 10 detik
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoPlay();
  }, []);

  // Update posisi highlight sesuai slide
  useEffect(() => {
    const el = itemRefs.current[index];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement.getBoundingClientRect();

    // width = element width + padding kecil
    setHighlightWidth(rect.width + 12);
    setHighlightHeight(rect.height + 0);

    // X position = distance from left WITHOUT too much padding
    setHighlightX(rect.left - parentRect.left - 6);
  }, [index]);

  // SWIPE LOGIC
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const dragging = useRef(false);

  const next = () => {
    stopAutoPlay();
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    setIndex((prev) => {
      if (prev === images.length - 1) {
        return prev;
      } else {
        return prev + 1;
      }
    });
    restartTimeoutRef.current = setTimeout(startAutoplay, 5000);
  };
  const prev = () => {
    stopAutoPlay();
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    setIndex((prev) => {
      if (prev === 0) {
        return prev;
      } else {
        return prev - 1;
      }
    });
    restartTimeoutRef.current = setTimeout(startAutoplay, 5000);
  };

  const handleTouchStart = (e) => {
    dragging.current = true;
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!dragging.current) return;

    const diff = e.touches[0].clientX - startX.current;
    currentTranslate.current = -index * containerRef.current.offsetWidth + diff;

    containerRef.current.style.transition = "none";
    containerRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  };

  const handleTouchEnd = () => {
    dragging.current = false;

    const threshold = 80;
    const moved =
      currentTranslate.current + index * containerRef.current.offsetWidth;

    if (moved < -threshold) next();
    else if (moved > threshold) prev();
    else {
      containerRef.current.style.transition = "transform .5s ease-in-out";
      containerRef.current.style.transform = `translateX(-${
        index * containerRef.current.offsetWidth
      }px)`;
    }
  };

  return (
    <>
      <div className="bgcarousel w-full flex flex-col items-center justify-center pb-4 relative object-cover">
        {/* VIEWPORT */}
        <div className="lg:w-full md:w-full w-[350px] overflow-hidden">
          <div
            ref={containerRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((src, i) => (
              <div
                key={i}
                className="w-full shrink-0 flex items-center justify-around lg:h-[450px] md:h-[450px] h-[250px] relative lg:flex-row md:flex-row"
              >
                <div className="flex flex-col w-[40%] gap-5">
                  <div className="overflow-hidden flex flex-wrap">
                    <h1
                      className={`text-3xl font-black text-primary-dark ${
                        index === i ? "animate-to-bottom" : "animate-none"
                      }`}
                    >
                      Gingham Smocked Dress With Bow - Black
                    </h1>
                  </div>
                  <div className="overflow-hidden flex flex-wrap">
                    <span
                      className={`${
                        index === i ? "animate-to-right" : "animate-none"
                      } text-4xl font-black text-primary-dark mb-[100px]`}
                    >
                      Rp 699K
                    </span>
                  </div>
                  <div className="overflow-hidden flex flex-wrap">
                    <div
                      className={`flex flex-col gap-4 ${
                        index === i ? "animate-to-top" : "animate-none"
                      }`}
                    >
                      <p className={`text-primary-dark/70`}>{src.desc}</p>
                      <NavLink
                        className={`text-primary-dark bg-accent-orange rounded-lg flex items-center justify-center text-lg font-bold gap-2.5 cursor-pointer w-[150px] h-12 mt-2.5`}
                      >
                        Buy Now
                      </NavLink>
                    </div>
                  </div>
                </div>

                <img
                  src={src.src}
                  alt="Adidas"
                  className={`w-[20%] object-cover ${
                    index === i ? "animate-img" : "animate-none"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="hidden lg:flex md:flex gap-4 mt-4 absolute justify-between w-full px-10">
          <button
            onClick={prev}
            className={`px-4 py-2  rounded-lg ${
              index === 0 ? "cursor-not-allowed" : "cursor-pointer"
            } ${
              index === 0
                ? "bg-neutral-light text-primary-dark"
                : "bg-primary-dark text-neutral-light hover:text-neutral-light hover:bg-primary-dark"
            }`}
          >
            Prev
          </button>
          <button
            onClick={next}
            className={`px-4 py-2 rounded-lg ${
              index === images.length - 1
                ? "cursor-not-allowed"
                : "cursor-pointer"
            } ${
              index === images.length - 1
                ? "bg-neutral-light text-primary-dark"
                : "bg-primary-dark text-neutral-light cursor-pointer hover:text-neutral-light hover:bg-primary-dark"
            }`}
          >
            Next
          </button>
        </div>

        {/* DOTS */}
        <div className="relative flex w-[80%] items-center justify-center lg:w-auto md:w-auto gap-4 mt-6 bg-neutral-light rounded-full px-4 py-2 transition-all ease-in-out duration-[5000]">
          {/* Highlight bergerak */}
          <div
            className="absolute left-0  bg-black rounded-full transition-transform ease-in-out duration-700! lg:h-7 md:h-7"
            style={{
              width: highlightWidth,
              height: highlightHeight,
              transform: `translateX(${highlightX}px)`,
            }}
          />

          {/* List nama */}
          {images.map((item, i) => (
            <button
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              className={`relative z-10 px-2 py-2.5 text-sm cursor-pointer transition-colors ease-in-out duration-500! ${
                i === index ? "text-white" : "text-gray-700"
              }`}
              onClick={() => {
                setIndex(i);
                stopAutoPlay();
                if (restartTimeoutRef.current)
                  clearTimeout(restartTimeoutRef.current);
                restartTimeoutRef.current = setTimeout(startAutoplay, 5000);
              }}
            >
              <span className="hidden lg:flex md:flex">{item.title}</span>
              <span className="flex lg:hidden md:hidden">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
