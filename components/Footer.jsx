import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-t border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo Kantin Polines" />
          <p className="mt-6 text-sm">
            Kantin Polines menyediakan berbagai pilihan menu makanan sehat dan bergizi untuk mendukung kegiatan akademik Anda. Nikmati hidangan lezat dengan harga terjangkau hanya di Kantin Polines!
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Tentang Kami</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">Beranda</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Menu Kami</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Hubungi Kami</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Kebijakan Privasi</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Hubungi Kami</h2>
            <div className="text-sm space-y-2">
              <p>+62-123-456-789</p>
              <p>kantin@polines.ac.id</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Kantin Polines. Semua Hak Cipta Dilindungi.
      </p>
    </footer>
  );
};

export default Footer;
