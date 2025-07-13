import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HeaderSlider = () => {
  const router = useRouter();
  
  const sliderData = [
    {
      id: 1,
      title: "Makan Cerdas, Jaga Bumi - Temukan Menu Ramah Lingkungan",
      offer: "Pilih Makanan Sehat, Kurangi Jejak Karbon Anda!",
      buttonText1: "Pesan Sekarang",
      buttonText2: "Lihat Menu Ramah Lingkungan",
      imgSrc: assets.header_headphone_image,
      button1Link: "/menu",
      button2Link: "/#fitur",
    },
    {
      id: 2,
      title: "Makan Enak, Bumi Sehat - Pilih Menu yang Peduli Lingkungan!",
      offer: "Pilih Makanan Sehat, Kurangi Dampak Karbon!",
      buttonText1: "Mulai Pilih Makanan",
      buttonText2: "Pelajari Lebih Lanjut",
      imgSrc: assets.header_playstation_image,
      button1Link: "/menu",
      button2Link: "/trashback",
    },
    {
      id: 3,
      title: "Makanan Lebih Hijau, Masa Depan Lebih Cerah",
      offer: "Jaga Tubuh dan Bumi dengan Setiap Pilihan Anda!",
      buttonText1: "Cek Menu Ramah Lingkungan",
      buttonText2: "Bergabung dengan Gerakan Hijau",
      imgSrc: assets.header_macbook_image,
      button1Link: "/menu",
      button2Link: "/trashback",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-[#479C25] pb-1">{slide.offer}</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6 ">
                <button 
                  onClick={() => router.push(slide.button1Link)}
                  className="md:px-10 px-7 md:py-2.5 py-2 bg-[#479C25] rounded-full text-white font-medium hover:bg-[#3a7d1f] transition-colors cursor-pointer"
                >
                  {slide.buttonText1}
                </button>
                <button 
                  onClick={() => router.push(slide.button2Link)}
                  className="group flex items-center gap-2 px-6 py-2.5 font-medium hover:text-[#479C25] transition-colors cursor-pointer"
                >
                  {slide.buttonText2}
                  <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon} alt="arrow_icon" />
                </button>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <Image
                className="md:w-72 w-48"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-[#479C25]" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
