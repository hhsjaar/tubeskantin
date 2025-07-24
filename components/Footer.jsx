import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#479C25] to-[#3a7d1f] dark:from-[#2d6317] dark:to-[#1f4011] text-white relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
      <div className="px-6 md:px-16 lg:px-32 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-4 hover:text-green-200 transition-colors duration-300">Ngantin</h2>
            <p className="text-xl text-white/90 mb-6 font-medium">Jajan Cerdas, Peduli Lingkungan</p>
            <p className="text-white/80 leading-relaxed mb-8 hover:text-white transition-colors duration-300">
              Platform jajan online terdepan untuk mahasiswa Polines yang menggabungkan kemudahan, efisiensi, dan kepedulian lingkungan dalam satu genggaman.
            </p>
            
            {/* Developer Info */}
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 group">
                <span className="transform group-hover:scale-110 transition-transform duration-300">👨‍💻</span>
                <span className="text-white/90 group-hover:text-white transition-colors duration-300">Dikembangkan oleh: <span className="text-white font-semibold group-hover:text-green-200">Roy Arya & Arifa Mutia</span></span>
              </p>
              <p className="flex items-center gap-2 group">
                <span className="transform group-hover:scale-110 transition-transform duration-300">📧</span>
                <span className="text-white/90 group-hover:text-white transition-colors duration-300">Email: <a href="mailto:ngantin@polines.ac.id" className="text-white hover:text-green-200 transition-colors duration-300">ngantin@polines.ac.id</a></span>
              </p>
              <p className="flex items-center gap-2 group">
                <span className="transform group-hover:scale-110 transition-transform duration-300">📍</span>
                <span className="text-white/90 group-hover:text-white transition-colors duration-300">Kampus: Politeknik Negeri Semarang, Tembalang, Semarang</span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white hover:text-green-200 transition-colors duration-300">Navigasi</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/80 hover:text-green-200 transition-all duration-300 flex items-center gap-2 group">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">🏠</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Beranda</span>
                </Link>
              </li>
              <li>
                <Link href="/#fitur" className="text-white/80 hover:text-green-200 transition-all duration-300 flex items-center gap-2 group">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">⚡</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Fitur</span>
                </Link>
              </li>
              <li>
                <Link href="/#kantin" className="text-white/80 hover:text-green-200 transition-all duration-300 flex items-center gap-2 group">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">🏪</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Kantin Kami</span>
                </Link>
              </li>
              
              <li>
                <Link href="/#slogan" className="text-white/80 hover:text-green-200 transition-all duration-300 flex items-center gap-2 group">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">🌿</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Tagline</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Additional Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white hover:text-green-200 transition-colors duration-300">Lainnya</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/menu" className="text-white/80 hover:text-green-200 transition-all duration-300 flex items-center gap-2 group">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">🍽️</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Menu</span>
                </Link>
              </li>
              <li>
                <Link href="/my-orders" className="text-white/80 hover:text-green-200 transition-all duration-300 flex items-center gap-2 group">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">📦</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Pesanan Saya</span>
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-white/80 hover:text-green-200 transition-all duration-300 flex items-center gap-2 group">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">🛒</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Keranjang</span>
                </Link>
              </li>
              <li>
                <Link href="/trashback" className="text-white/80 hover:text-green-200 transition-all duration-300 flex items-center gap-2 group">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">♻️</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Trashback</span>
                </Link>
              </li>
              
              
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/20 bg-black/20 dark:bg-black/30 px-6 md:px-16 lg:px-32 py-8 relative z-10">
        <div className="text-center space-y-4">
          <p className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
            © 2025 Ngantin – Kantin Digital Polines.
          </p>
          <p className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
            Seluruh hak cipta dilindungi. Dibuat dengan semangat mahasiswa untuk perubahan kampus.
          </p>
          <p className="text-white font-medium text-sm flex items-center justify-center gap-2 group hover:text-green-200 transition-colors duration-300">
            <span className="transform group-hover:scale-110 transition-transform duration-300">💚</span>
            <span>Dari mahasiswa, oleh mahasiswa, untuk mahasiswa dan bumi yang lebih baik</span>
            <span className="transform group-hover:scale-110 transition-transform duration-300">🌍</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
