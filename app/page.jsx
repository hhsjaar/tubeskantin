'use client'
import React, { useEffect } from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  useEffect(() => {
    // Inisialisasi skrip chatbot
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";
      Chatbot.init({
        chatflowid: "7fd8c2a4-4082-4d8a-a6de-47f18cb948a1",
        apiHost: "http://localhost:3000",
        theme: {
          disclaimer: {
            title: 'Syarat & Ketentuan',
            message: 'Dengan menggunakan chatbot ini, Anda setuju terhadap <a target="_blank" href="https://flowiseai.com/terms">Syarat & Ketentuan</a> yang berlaku.',
            textColor: '#1f2937',
            buttonColor: '#10b981',
            buttonText: 'Mulai Percakapan',
            buttonTextColor: 'white',
            blurredBackgroundColor: 'rgba(0, 0, 0, 0.4)',
            backgroundColor: '#ecfdf5'
          },
          button: {
            backgroundColor: '#10b981', // Tailwind green-500
            right: 24,
            bottom: 24,
            size: 50,
            dragAndDrop: true,
            iconColor: 'white',
            customIconSrc: 'https://cdn-icons-png.flaticon.com/512/4712/4712039.png', // ikon chat hijau
            autoWindowOpen: {
              autoOpen: true,
              openDelay: 3,
              autoOpenOnMobile: false
            }
          },
          tooltip: {
            showTooltip: true,
            tooltipMessage: 'Hai, ada yang bisa dibantu?',
            tooltipBackgroundColor: '#065f46',
            tooltipTextColor: 'white',
            tooltipFontSize: 14
          },
          chatWindow: {
            showTitle: true,
            showAgentMessages: true,
            backgroundColor: '#ffffff',
            fontSize: 14,
            width: 360,
            height: 480,
            customCss: 'border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);'
          }
        }
      });
    `;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
