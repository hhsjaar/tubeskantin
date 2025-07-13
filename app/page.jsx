'use client'
import React, { useEffect, useState } from "react";
import HeaderSlider from "@/components/HeaderSlider";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import axios from 'axios';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { BubbleChat } from "flowise-embed-react";


const kantinList = [
  {
    name: "Kantin Teknik",
    description: "Nikmati hidangan lezat di area Teknik Mesin",
    id: "kantek"
  },
  {
    name: "Kantin Kodok",
    description: "Tempat favorit mahasiswa di area percabangan Teknik",
    id: "kandok"
  },
  {
    name: "Kantin Telkom",
    description: "Kantin pendukung di daerah Prodi Telekomunikasi",
    id: "kantel"
  },
  {
    name: "Kantin Sipil",
    description: "Tempat yang cocok untuk jajan di area Teknik Sipil",
    id: "kansip"
  },
  {
    name: "Kantin Widya",
    description: "Kantin masakan berselera di Tata Niaga",
    id: "kantintn1"
  },
  {
    name: "Kantin Tata Niaga",
    description: "Variasi menu di Kantin Tata Niaga",
    id: "kantintn2"
  },
  {
    name: "Tania Mart",
    description: "Minimarket bermanfaat di area Tata Niaga",
    id: "kantintn3"
  }
];

const Home = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products for menu count
        const { data: allData } = await axios.get('/api/product/list');
        setProducts(allData.products);

        // Fetch new products
        const { data: newData } = await axios.get('/api/product/list?sort=new');
        setNewProducts(newData.products.slice(0, 6));

        // Fetch popular products
        const { data: popularData } = await axios.get('/api/product/list?sort=popular');
        setPopularProducts(popularData.products.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleKantinClick = (kantin) => {
    router.push(`/menu?kantin=${encodeURIComponent(kantin)}`);
  };

  const getMenuCountByKantin = (kantinId) => {
    return products.filter(product => product.kantin === kantinId).length;
  };

  return (
    <>
      <Navbar />
      
      {/* HeaderSlider */}
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
      </div>

      {/* Makanan Favorit Section - Full Width */}
      <div className=" py-16 px-6 md:px-16 lg:px-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h2 className="text-4xl font-semibold mb-4 bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent relative">
                Makanan Favorit Minggu Ini
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {popularProducts.map((product, index) => (
              <div key={index} className="transform hover:scale-105 transition-transform duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ngantin Slogan Section - Full Width */}
      <div className="bg-gradient-to-r from-[#479C25] to-[#3a7d1f] py-16 px-6 md:px-16 lg:px-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">Ngantin</h1>
          <p className="text-2xl md:text-3xl font-medium mb-6">Praktis Jajannya, Cerdas Pilihannya, Peduli Lingkungannya</p>
          <p className="text-xl opacity-90 max-w-4xl mx-auto leading-relaxed">Platform jajan online terdepan untuk mahasiswa Polines yang menggabungkan kemudahan, efisiensi, dan kepedulian lingkungan dalam satu genggaman</p>
        </div>
      </div>

      {/* Menu Baru Section - Full Width */}
      <div className=" py-16 px-6 md:px-16 lg:px-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h2 className="text-4xl font-semibold mb-4 bg-gradient-to-r from-[#479C25] to-green-600 bg-clip-text text-transparent relative">
                Menu Baru
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[#479C25] to-green-600 rounded-full"></div>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {newProducts.map((product, index) => (
              <div key={index} className="transform hover:scale-105 transition-transform duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fitur Unggulan Section - Full Width */}
      <div id="fitur" className="bg-gradient-to-br from-gray-900 to-gray-800 py-16 px-6 md:px-16 lg:px-32 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">🛠️ Fitur Unggulan Ngantin</h2>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">Solusi lengkap untuk kebutuhan jajan mahasiswa modern yang cerdas dan peduli lingkungan</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-gradient-to-br from-[#479C25]/20 to-transparent border border-[#479C25]/30 rounded-2xl p-8 hover:border-[#479C25]/50 hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-6">📱</div>
              <h3 className="text-2xl font-bold mb-4 text-[#479C25]">Jajan Gak Pake Ribet</h3>
              <p className="text-gray-300 leading-relaxed mb-4">Pesan makanan langsung lewat aplikasi, cukup klik dari HP, bayar online, dan tunggu makananmu siap.</p>
              <p className="text-[#479C25] font-semibold">📱 Efisiensi waktu, maksimalin produktivitas!</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#479C25]/20 to-transparent border border-[#479C25]/30 rounded-2xl p-8 hover:border-[#479C25]/50 hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-6">📊</div>
              <h3 className="text-2xl font-bold mb-4 text-[#479C25]">Lebih Efisien & Terkontrol</h3>
              <p className="text-gray-300 leading-relaxed mb-4">Semua riwayat transaksi, pesanan, dan pengeluaran kamu terekam rapi. Atur keuangan makanmu tanpa repot.</p>
              <p className="text-[#479C25] font-semibold">📊 Tracking belanja = gaya hidup cerdas.</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#479C25]/20 to-transparent border border-[#479C25]/30 rounded-2xl p-8 hover:border-[#479C25]/50 hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-6">🥗</div>
              <h3 className="text-2xl font-bold mb-4 text-[#479C25]">Informasi Gizi Lengkap</h3>
              <p className="text-gray-300 leading-relaxed mb-4">Setiap menu menampilkan info kandungan gizi seperti kalori, protein, lemak, hingga alergi makanan.</p>
              <p className="text-[#479C25] font-semibold">🥗 Makan enak, tetap sehat dan terukur.</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#479C25]/20 to-transparent border border-[#479C25]/30 rounded-2xl p-8 hover:border-[#479C25]/50 hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-6">🌍</div>
              <h3 className="text-2xl font-bold mb-4 text-[#479C25]">Sadar Lingkungan</h3>
              <p className="text-gray-300 leading-relaxed mb-4">Setiap pembelian menampilkan estimasi jejak karbon, termasuk opsi menu dengan dampak lingkungan lebih rendah.</p>
              <p className="text-[#479C25] font-semibold">🌍 Makan sambil belajar jadi warga bumi yang bijak.</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#479C25]/20 to-transparent border border-[#479C25]/30 rounded-2xl p-8 hover:border-[#479C25]/50 hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-6">♻️</div>
              <h3 className="text-2xl font-bold mb-4 text-[#479C25]">Trashback Reward</h3>
              <p className="text-gray-300 leading-relaxed mb-4">Dapat reward atau potongan harga jika kamu mengonfirmasi membuang sisa makanan dan sampah dengan benar.</p>
              <p className="text-[#479C25] font-semibold">♻️ Buang Sampah? Dapat Hadiah!</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#479C25]/20 to-transparent border border-[#479C25]/30 rounded-2xl p-8 hover:border-[#479C25]/50 hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-6">🍽️</div>
              <h3 className="text-2xl font-bold mb-4 text-[#479C25]">Multi-Kantin Platform</h3>
              <p className="text-gray-300 leading-relaxed mb-4">Akses semua kantin di Polines dalam satu platform. Promo eksklusif, cashback, dan loyalty point tersedia.</p>
              <p className="text-[#479C25] font-semibold">🍽️ Lebih banyak pilihan, lebih gampang jajan.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kantin Kami Section - Full Width */}
      <div id="kantin" className="bg-gradient-to-br from-blue-400/10 via-purple-300/10 to-pink-300/10 py-16 px-6 md:px-16 lg:px-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h2 className="text-4xl font-semibold mb-4 bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent relative">
                Kantin Kami
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {kantinList.map((kantin, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:scale-105 border border-gray-100"
                onClick={() => handleKantinClick(kantin.name)}
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={assets.kandok}
                    alt={kantin.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    width={800}
                    height={600}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-semibold text-gray-800">{getMenuCountByKantin(kantin.name)} Menu</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-xl text-white mb-1 drop-shadow-lg">{kantin.name}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {kantin.description}
                  </p>
                  <button className="bg-gradient-to-r from-[#479C25] to-green-600 hover:from-[#3a7d1f] hover:to-green-700 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 w-full shadow-lg hover:shadow-xl transform hover:scale-105">
                    Lihat Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
      <BubbleChat
  chatflowid="0b35dc4a-1fab-4446-b39d-1d4563fc1e2b"
            apiHost="https://chatbot-production-3c48.up.railway.app"
            chatflowConfig={{
                /* Chatflow Config */
            }}
            observersConfig={{
                /* Observers Config */
            }}
            theme={{    
                button: {
                    backgroundColor: '#006400',
                    right: 20,
                    bottom: 20,
                    size: 65,
                    dragAndDrop: true,
                    iconColor: 'white',
                    customIconSrc: 'ai.svg',
                    autoWindowOpen: {
                        autoOpen: true,
                        openDelay: 2,
                        autoOpenOnMobile: false
                    }
                },
                tooltip: {
                    showTooltip: false,
                    tooltipMessage: 'AI Mimin Ngantin 🧠!',
                    tooltipBackgroundColor: '#14532D',
                    tooltipTextColor: 'white',
                    tooltipFontSize: 16
                },
                disclaimer: {
                    showDisclaimer : false,
                    title: 'Peringatan',
                    message: "By using this chatbot, you agree to the <a target=\"_blank\" href=\"https://flowiseai.com/terms\">Terms & Condition</a>",
                    textColor: 'black',
                    buttonColor: '#3b82f6',
                    buttonText: 'Start Chatting',
                    buttonTextColor: 'white',
                    blurredBackgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backgroundColor: 'white'
                },
                customCSS: ``,
                chatWindow: {
                    showTitle: true,
                    showAgentMessages: true,
                    title: 'Mimin Ngantin  🌿',
                    titleAvatarSrc: 'ai.svg',
                    welcomeMessage: 'Halo, mau makan apa hari ini?',
                    errorMessage: 'Wah maaf aku kurang tau',
                    backgroundColor: '#ffffff',
                    backgroundImage: 'enter image path or link',
                    height: 600,
                    width: 400,
                    fontSize: 16,
                    starterPrompts: [
                        '🍜 Rekomendasi menu favorit hari ini',
                        '🥗 Menu sehat dan bergizi',
                        '🌱 Makanan ramah lingkungan',
                        '📍 Kantin mana yang paling dekat?',
                    ],
                    starterPromptFontSize: 15,
                    clearChatOnReload: false,
                    sourceDocsTitle: 'Sources:',
                    renderHTML: true,
                    botMessage: {
                        backgroundColor: '#f7f8ff',
                        textColor: '#303235',
                        showAvatar: false,
                        avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png'
                    },
                    userMessage: {
                        backgroundColor: '#006400',
                        textColor: '#ffffff',
                        showAvatar: false,
                        avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png'
                    },
                    textInput: {
                        placeholder: 'Mau makan apa hari ini?',
                        backgroundColor: '#ffffff',
                        textColor: '#303235',
                        sendButtonColor: '#006400',
                        maxChars: 50,
                        maxCharsWarningMessage: 'Kamu mencapai batas maksimum. Masukkan kurang dari 50 karakter',
                        autoFocus: true,
                        sendMessageSound: true,
                        sendSoundLocation: 'send_message.mp3',
                        receiveMessageSound: true,
                        receiveSoundLocation: 'receive_message.mp3'
                    },
                    feedback: {
                        color: '#303235'
                    },
                    dateTimeToggle: {
                        date: true,
                        time: true
                    },
                    footer: {
                        textColor: '#303235',
                        text: 'Ngantin',
                        company: '- Kantin Digital Polines 🤖',
                        companyLink: 'https://ngantin.in'
                    }}
  }}
/>


    </>
  );
};

export default Home;
