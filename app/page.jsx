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
import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';

const BubbleChat = dynamic(
  () => import('flowise-embed-react').then(mod => mod.BubbleChat),
  { ssr: false }
);
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
    name: "Kantin Berkah",
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
  const { isDarkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Modal effect - muncul saat halaman dimuat
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1000); // Delay 1 detik setelah halaman dimuat

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products for menu count
        const { data: allData } = await axios.get('/api/product/list');
        setProducts(allData.products);

        // Fetch new products
        const { data: newData } = await axios.get('/api/product/list?sort=new');
        // Tampilkan semua produk termasuk yang tidak tersedia
        setNewProducts(newData.products.slice(0, 6));

        // Fetch popular products
        const { data: popularData } = await axios.get('/api/product/list?sort=popular');
        // Tampilkan semua produk termasuk yang tidak tersedia
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
    // Hanya menghitung produk yang tersedia (isAvailable !== false)
    return products.filter(product => product.kantin === kantinId && product.isAvailable !== false).length;
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Gunakan useEffect untuk kode yang membutuhkan window
  useEffect(() => {
    // Kode yang mengakses window aman di sini
    // karena useEffect hanya berjalan di browser
  }, []);
  
  // Atau gunakan pengecekan langsung
  const isBrowser = typeof window !== 'undefined';
  // Gunakan isBrowser untuk kondisional rendering atau logika
  
  return (
    <>
      <Navbar />
      
      {/* Modal Iklan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Tombol Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Konten Modal */}
            <div className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  🎉 Selamat Datang di Ngantin!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Platform jajan online terdepan untuk mahasiswa Polines
                </p>
              </div>
              
              {/* Gambar Landing Poster */}
              <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden">
                <Image
                  src={assets.landingposter}
                  alt="Ngantin Landing Poster"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Call to Action */}
              <div className="text-center">
                <button
                  onClick={closeModal}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Mulai Jajan Sekarang! 🛒
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HeaderSlider */}
      <div className="px-6 md:px-16 lg:px-32 dark:bg-gray-900">
        <HeaderSlider />
      </div>

      {/* Makanan Favorit Section */}
      <div className="py-16 px-6 md:px-16 lg:px-32 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h2 className="text-4xl font-semibold mb-4 bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent relative dark:from-green-400 dark:to-green-500">
                Makanan Favorit Minggu Ini
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {popularProducts.length > 0 ? (
              popularProducts.map((product, index) => (
                <div key={index} className="transform hover:scale-105 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ngantin Slogan Section - tetap sama karena sudah menggunakan gradient */}
      <div id="slogan" className="bg-gradient-to-r from-[#479C25] to-[#3a7d1f] py-16 px-6 md:px-16 lg:px-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">Ngantin</h1>
          <p className="text-2xl md:text-3xl font-medium mb-6">Praktis Jajannya, Cerdas Pilihannya, Peduli Lingkungannya</p>
          <p className="text-xl opacity-90 max-w-4xl mx-auto leading-relaxed">Platform jajan online terdepan untuk mahasiswa Polines yang menggabungkan kemudahan, efisiensi, dan kepedulian lingkungan dalam satu genggaman</p>
        </div>
      </div>

      {/* Menu Baru Section */}
      <div className="py-16 px-6 md:px-16 lg:px-32 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h2 className="text-4xl font-semibold mb-4 bg-gradient-to-r from-[#479C25] to-green-600 bg-clip-text text-transparent relative dark:from-green-400 dark:to-green-500">
                Menu Baru
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[#479C25] to-green-600 rounded-full"></div>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {newProducts.length > 0 ? (
              newProducts.map((product, index) => (
                <div key={index} className="transform hover:scale-105 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fitur Unggulan Section */}
      <div id="fitur" className="bg-gradient-to-r from-[#479C25] to-[#3a7d1f] dark:from-green-800 dark:to-green-900 py-16 px-6 md:px-16 lg:px-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white dark:text-green-50">🛠️ Fitur Unggulan Ngantin</h2>
            <p className="text-white/90 dark:text-green-50/90 text-xl max-w-3xl mx-auto leading-relaxed">Solusi lengkap untuk kebutuhan jajan mahasiswa modern yang cerdas dan peduli lingkungan</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 dark:hover:bg-gray-800/60 hover:transform hover:scale-105 transition-all duration-300 border border-white/20 dark:border-green-400/20">
              <div className="text-4xl mb-6">📱</div>
              <h3 className="text-2xl font-bold mb-4 text-white dark:text-green-50">Jajan Gak Pake Ribet</h3>
              <p className="text-white/80 dark:text-green-50/80 leading-relaxed mb-4">Pesan makanan langsung lewat aplikasi, cukup klik dari HP, bayar online, dan tunggu makananmu siap.</p>
              <p className="text-white dark:text-green-50 font-semibold">📱 Efisiensi waktu, maksimalin produktivitas!</p>
            </div>
            
            {/* Card kedua dengan style yang sama */}
            <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 dark:hover:bg-gray-800/60 hover:transform hover:scale-105 transition-all duration-300 border border-white/20 dark:border-green-400/20">
              <div className="text-4xl mb-6">📊</div>
              <h3 className="text-2xl font-bold mb-4 text-white dark:text-green-50">Lebih Efisien & Terkontrol</h3>
              <p className="text-white/80 dark:text-green-50/80 leading-relaxed mb-4">Semua riwayat transaksi, pesanan, dan pengeluaran kamu terekam rapi. Atur keuangan makanmu tanpa repot.</p>
              <p className="text-white dark:text-green-50 font-semibold">📊 Tracking belanja = gaya hidup cerdas.</p>
            </div>
            
            {/* Card ketiga dengan style yang sama */}
            <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 dark:hover:bg-gray-800/60 hover:transform hover:scale-105 transition-all duration-300 border border-white/20 dark:border-green-400/20">
              <div className="text-4xl mb-6">🥗</div>
              <h3 className="text-2xl font-bold mb-4 text-white dark:text-green-50">Informasi Gizi Lengkap</h3>
              <p className="text-white/80 dark:text-green-50/80 leading-relaxed mb-4">Setiap menu menampilkan info kandungan gizi seperti kalori, protein, lemak, hingga alergi makanan.</p>
              <p className="text-white dark:text-green-50 font-semibold">🥗 Makan enak, tetap sehat dan terukur.</p>
            </div>
            
            {/* Card keempat dengan style yang sama */}
            <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 dark:hover:bg-gray-800/60 hover:transform hover:scale-105 transition-all duration-300 border border-white/20 dark:border-green-400/20">
              <div className="text-4xl mb-6">🌍</div>
              <h3 className="text-2xl font-bold mb-4 text-white dark:text-green-50">Sadar Lingkungan</h3>
              <p className="text-white/80 dark:text-green-50/80 leading-relaxed mb-4">Setiap pembelian menampilkan estimasi jejak karbon, termasuk opsi menu dengan dampak lingkungan lebih rendah.</p>
              <p className="text-white dark:text-green-50 font-semibold">🌍 Makan sambil belajar jadi warga bumi yang bijak.</p>
            </div>
            
            {/* Card kelima dengan style yang sama */}
            <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 dark:hover:bg-gray-800/60 hover:transform hover:scale-105 transition-all duration-300 border border-white/20 dark:border-green-400/20">
              <div className="text-4xl mb-6">♻️</div>
              <h3 className="text-2xl font-bold mb-4 text-white dark:text-green-50">Trashback Reward</h3>
              <p className="text-white/80 dark:text-green-50/80 leading-relaxed mb-4">Dapat reward atau potongan harga jika kamu mengonfirmasi membuang sisa makanan dan sampah dengan benar.</p>
              <p className="text-white dark:text-green-50 font-semibold">♻️ Buang Sampah? Dapat Hadiah!</p>
            </div>
            
            {/* Card keenam dengan style yang sama */}
            <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 dark:hover:bg-gray-800/60 hover:transform hover:scale-105 transition-all duration-300 border border-white/20 dark:border-green-400/20">
              <div className="text-4xl mb-6">🍽️</div>
              <h3 className="text-2xl font-bold mb-4 text-white dark:text-green-50">Multi-Kantin Platform</h3>
              <p className="text-white/80 dark:text-green-50/80 leading-relaxed mb-4">Akses semua kantin di Polines dalam satu platform. Promo eksklusif, cashback, dan loyalty point tersedia.</p>
              <p className="text-white dark:text-green-50 font-semibold">🍽️ Lebih banyak pilihan, lebih gampang jajan.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kantin Kami Section - Full Width */}
      <div id="kantin" className="  py-16 px-6 md:px-16 lg:px-32">
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
                className="bg-white  dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:scale-105 border border-gray-100"
                onClick={() => handleKantinClick(kantin.name)}
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={kantin.id === "kantek" ? assets.kantek :
                         kantin.id === "kandok" ? assets.kandok :
                         kantin.id === "kantel" ? assets.kantel :
                         kantin.id === "kansip" ? assets.kansip :
                         kantin.id === "kantintn1" ? assets.kantinberkah :
                         kantin.id === "kantintn2" ? assets.kantintn :
                         kantin.id === "kantintn3" ? assets.taniamart :
                         assets.kandok}
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
                  <p className="text-gray-600 dark:text-white/95 text-sm mb-6 leading-relaxed">
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
        theme={{
          button: {
            backgroundColor: '#479C25',
            right: 20,
            bottom: 20,
            size: 65,
            dragAndDrop: true,
            iconColor: 'white',
            customIconSrc: 'ai.svg',
            autoWindowOpen: {
              autoOpen: false,
              openDelay: 2,
              autoOpenOnMobile: false
            }
          },
          tooltip: {
            showTooltip: false,
            tooltipMessage: 'AI Mimin Ngantin 🧠!',
            tooltipBackgroundColor: '#15803d',
            tooltipTextColor: 'white',
            tooltipFontSize: 16
          },
          disclaimer: {
            showDisclaimer: false,
            title: 'Peringatan',
            message: "Ketika anda menggunakan Chatbot ini, anda menyetujui <a target=\"_blank\" href=\"https://flowiseai.com/terms\">Syarat & Ketentuannya</a>",
            textColor: isDarkMode ? '#f3f4f6' : '#374151',
            buttonColor: '#22c55e',
            buttonText: 'Mulai Percakapan',
            buttonTextColor: 'white',
            blurredBackgroundColor: 'rgba(0, 0, 0, 0.8)',
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff'
          },
          chatWindow: {
            showTitle: true,
            showAgentMessages: true,
            title: 'Mimin Ngantin 🌿',
            titleAvatarSrc: 'ai.svg',
            welcomeMessage: 'Halo, mau makan apa hari ini?',
            errorMessage: 'Wah maaf aku kurang tau',
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            height: 600,
            width: 400,
            fontSize: 16,
            starterPrompts: isDarkMode ? [
  '🌙 Menu sehat hari ini dengan jejak karbon rendah',
  '🥗 Pilihan makanan bergizi dan ramah lingkungan',
  '🌿 Makanan sehat dengan jejak karbon minimal',
  '⚖️ Rekomendasi makanan seimbang dan bergizi',
] : [
  '☀️ Menu sehat dan ramah lingkungan hari ini',
  '🥗 Rekomendasi makanan bergizi dengan jejak karbon rendah',
  '🌱 Pilihan makanan dengan dampak lingkungan minimal',
  '⚖️ Rekomendasi makanan seimbang dengan nilai gizi lengkap',
]
,
            starterPromptFontSize: 15,
            starterPromptBackgroundColor: isDarkMode ? '#777777' : '#f3f4f6',
  starterPromptTextColor: isDarkMode ? '#f3f4f6' : '#374151',
  starterPromptHoverBackgroundColor: isDarkMode ? '#4b5563' : '#e5e7eb',
            clearChatOnReload: false,
            sourceDocsTitle: 'Sources:',
            renderHTML: true,
            botMessage: {
              backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
              textColor: isDarkMode ? '#f3f4f6' : '#374151',
              showAvatar: false,
              avatarSrc: 'ai.svg'
            },
            userMessage: {
              backgroundColor: '#22c55e',
              textColor: '#ffffff',
              showAvatar: false
            },
            textInput: {
              placeholder: 'Mau makan apa hari ini?',
              backgroundColor: isDarkMode ? '#111827' : '#ffffff',
              textColor: isDarkMode ? '#f3f4f6' : '#374151',
              sendButtonColor: '#22c55e',
              maxChars: 50,
              maxCharsWarningMessage: 'Kamu mencapai batas maksimum. Masukkan kurang dari 50 karakter',
              autoFocus: true,
              sendMessageSound: true,
              sendSoundLocation: 'send_message.mp3',
              receiveMessageSound: true,
              receiveSoundLocation: 'receive_message.mp3'
            },
            feedback: {
              color: isDarkMode ? '#f3f4f6' : '#374151'
            },
            dateTimeToggle: {
              date: true,
              time: true
            },
            footer: {
              textColor: isDarkMode ? '#f3f4f6' : '#374151',
              text: 'Ngantin',
              company: '- Kantin Digital Polines 🤖',
              companyLink: 'https://ngantin.in'
            }
          }
        }}
      />
    </>
  );
};

export default Home;
