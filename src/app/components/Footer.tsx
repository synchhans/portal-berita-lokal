import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { SiLine } from "react-icons/si";

const Footer: React.FC = () => {
  return (
    <footer className="footer w-full bg-[#212121] text-white py-8">
      <div className="container mx-auto px-4 max-w-[900px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-lg font-semibold mb-4">Informasi</p>
            <a href="#" className="block mb-2 text-sm hover:underline">
              Tentang Kami
            </a>
            <a href="#" className="block mb-2 text-sm hover:underline">
              Pedoman Media Siber
            </a>
            <a href="#" className="block mb-2 text-sm hover:underline">
              Pedoman Penggunaan Konten Terhadap AI
            </a>
            <a href="#" className="block mb-2 text-sm hover:underline">
              Kode Etik dan Pedoman Jurnalistik
            </a>
            <a href="#" className="block mb-2 text-sm hover:underline">
              Ketentuan Layanan
            </a>
            <a href="#" className="block mb-2 text-sm hover:underline">
              Beriklan
            </a>
            <p className="mt-4 text-sm">Berita Terpercaya</p>
          </div>

          <div>
            <p className="text-lg font-semibold mb-4">Jaringan Media</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <a href="#" className="block mb-2 text-sm hover:underline">
                  Port.co
                </a>
                <a href="#" className="block mb-2 text-sm hover:underline">
                  Koran Port
                </a>
                <a href="#" className="block mb-2 text-sm hover:underline">
                  Majalah Port
                </a>
                <a href="#" className="block mb-2 text-sm hover:underline">
                  Majalah Port Bahasa Inggris
                </a>
                <a href="#" className="block mb-2 text-sm hover:underline">
                  Port.co Bahasa Inggris
                </a>
                <a href="#" className="block mb-2 text-sm hover:underline">
                  Institut Waktu
                </a>
              </div>
              <div>
                <a href="#" className="block mb-2 text-sm hover:underline">
                  Indonesia
                </a>
                <a href="#" className="block mb-2 text-sm hover:underline">
                  Teras
                </a>
                <a href="#" className="block mb-2 text-sm hover:underline">
                  Ziliun
                </a>
                <a href="#" className="block mb-2 text-sm hover:underline">
                  Telusuri
                </a>
                <a href="#" className="block mb-2 text-sm hover:underline">
                  Cantika
                </a>
                <a href="#" className="block mb-2 text-sm hover:underline">
                  Toko Port
                </a>
              </div>
            </div>
          </div>

          <div>
            <p className="text-lg font-semibold mb-4">Media Sosial</p>
            <ul className="flex space-x-4 mb-4">
              <li>
                <a href="#" aria-label="Facebook" className="text-white">
                  <FaFacebookF size={24} />
                </a>
              </li>
              <li>
                <a href="#" aria-label="Twitter" className="text-white">
                  <FaTwitter size={24} />
                </a>
              </li>
              <li>
                <a href="#" aria-label="LINE" className="text-white">
                  <SiLine size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/synchhans"
                  target="_blank"
                  aria-label="Instagram"
                  className="text-white"
                >
                  <FaInstagram size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@codeworshipper"
                  target="_blank"
                  aria-label="YouTube"
                  className="text-white"
                >
                  <FaYoutube size={24} />
                </a>
              </li>
            </ul>
            <p className="text-lg font-semibold mb-4">Unduh Aplikasi PORT</p>
            <ul className="flex space-x-4">
              <li>
                <a href="#">
                  <img
                    src="/images/appstore.jpg"
                    alt="App Store"
                    className="w-24"
                  />
                </a>
              </li>
              <li>
                <a href="#">
                  <img
                    src="/images/playstore.jpg"
                    alt="Play Store"
                    className="w-24"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
