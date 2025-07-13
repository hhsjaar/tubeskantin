import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="px-6 md:px-16 lg:px-32 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-[#479C25] mb-4">Ngantin</h2>
            <p className="text-xl text-gray-300 mb-6 font-medium">Jajan Cerdas, Peduli Lingkungan</p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Platform jajan online terdepan untuk mahasiswa Polines yang menggabungkan kemudahan, efisiensi, dan kepedulian lingkungan dalam satu genggaman.
            </p>
            
            {/* Developer Info */}
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <span>👨‍💻</span>
                <span className="text-gray-300">Dikembangkan oleh: <span className="text-[#479C25] font-semibold">Roy Arya & Arifa Mutia</span></span>
              </p>
              <p className="flex items-center gap-2">
                <span>📧</span>
                <span className="text-gray-300">Email: <a href="mailto:ngantin@polines.ac.id" className="text-[#479C25] hover:underline">ngantin@polines.ac.id</a></span>
              </p>
              <p className="flex items-center gap-2">
                <span>📍</span>
                <span className="text-gray-300">Kampus: Politeknik Negeri Semarang, Tembalang, Semarang</span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Navigasi</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#479C25] transition-colors duration-300 flex items-center gap-2">
                  <span>🏠</span> Beranda
                </Link>
              </li>
              <li>
                <Link href="/#fitur" className="text-gray-300 hover:text-[#479C25] transition-colors duration-300 flex items-center gap-2">
                  <span>⚡</span> Fitur
                </Link>
              </li>
              <li>
                <Link href="/#kantin" className="text-gray-300 hover:text-[#479C25] transition-colors duration-300 flex items-center gap-2">
                  <span>🏪</span> Kantin Kami
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-300 hover:text-[#479C25] transition-colors duration-300 flex items-center gap-2">
                  <span>🍽️</span> Menu
                </Link>
              </li>
              <li>
                <Link href="/trashback" className="text-gray-300 hover:text-[#479C25] transition-colors duration-300 flex items-center gap-2">
                  <span>♻️</span> Trashback
                </Link>
              </li>
            </ul>
          </div>

          {/* Additional Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Lainnya</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/my-orders" className="text-gray-300 hover:text-[#479C25] transition-colors duration-300 flex items-center gap-2">
                  <span>📦</span> Pesanan Saya
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-[#479C25] transition-colors duration-300 flex items-center gap-2">
                  <span>🛒</span> Keranjang
                </Link>
              </li>
              <li>
                <Link href="/notification" className="text-gray-300 hover:text-[#479C25] transition-colors duration-300 flex items-center gap-2">
                  <span>🔔</span> Notifikasi
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#479C25] transition-colors duration-300 flex items-center gap-2">
                  <span>📞</span> Bantuan
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 bg-gray-900 px-6 md:px-16 lg:px-32 py-8">
        <div className="text-center space-y-4">
          <p className="text-gray-400 text-sm">
            © 2025 Ngantin – Kantin Digital Polines.
          </p>
          <p className="text-gray-400 text-sm">
            Seluruh hak cipta dilindungi. Dibuat dengan semangat mahasiswa untuk perubahan kampus.
          </p>
          <p className="text-[#479C25] font-medium text-sm flex items-center justify-center gap-2">
            <span>💚</span>
            Dari mahasiswa, oleh mahasiswa, untuk mahasiswa dan bumi yang lebih baik
            <span>🌍</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
