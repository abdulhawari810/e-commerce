import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Divider from "@mui/material/Divider";

export default function Footer() {
  const { user } = useAuth();
  return (
    <>
      <div className="p-10 w-full bg-slate-950 flex flex-col gap-5">
        <div className="w-full grid grid-cols-3 gap-5">
          <div className="flex flex-col w-full">
            <h1 className="text-slate-50 text-2xl font-bold mb-5">About Us</h1>
            <p className="text-slate-200 text-md font-medium">
              Morphy is a local brand from Indonesia and was founded in 2025,
              our brand provides products to suit your lifestyle, and we will
              continue to improve products so that you can choose products that
              suit your lifestyle needs. Immediately buy products on our
              official website or you can come to our offline shop
            </p>
          </div>
          <div className="flex flex-col w-full">
            <h1 className="text-slate-50 text-2xl font-bold mb-5">Site Map</h1>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Home
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Product
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                About Us
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Contact Us
              </Button>
            </NavLink>
          </div>
          <div className="flex flex-col w-full">
            <h1 className="text-slate-50 text-2xl font-bold mb-5">
              Kategori Produk
            </h1>
            <NavLink>
              <Button
                variant="text"
                className="flex items-start justify-start text-slate-400"
              >
                Tas
              </Button>
            </NavLink>
            <NavLink>
              <Button
                variant="text"
                className="flex items-start justify-start text-slate-400"
              >
                Baju
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Sepatu
              </Button>
            </NavLink>
            <NavLink>
              <Button
                variant="text"
                className="flex items-start justify-start text-slate-400"
              >
                Hijab
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Aksessoris
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Produk Terbaru
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Produk Diskon / Flash Sale
              </Button>
            </NavLink>
          </div>
          <div className="flex flex-col w-full">
            <h1 className="text-slate-50 text-2xl font-bold mb-5">
              Bantuan & Layanan Pelanggan
            </h1>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Pusat Bantuan
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Cara Pembayaran
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Cara Memesan
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Pengiriman
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Pengembalian & Refund
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Hubungi Kami
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Live Chat / WhatsApp
              </Button>
            </NavLink>
          </div>
          <div className="flex flex-col w-full">
            <h1 className="text-slate-50 text-2xl font-bold mb-5">
              Informasi Legal & Kebijakan
            </h1>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Syarat & Ketentuan
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Kebijakan Privasi
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Kebijakan Cookie
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Kebijakan Pengembalian
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Kebijakan Pengiriman
              </Button>
            </NavLink>
          </div>
          {user === undefined || user === null ? (
            <div className="flex flex-col w-full">
              <h1 className="text-slate-50 text-2xl font-bold mb-5">
                Akun & Pengguna
              </h1>
              <NavLink>
                <Button variant="text" className="text-slate-400">
                  Login
                </Button>
              </NavLink>
              <Divider className="text-slate-50 bg-slate-500 my-2.5" />
              <NavLink>
                <Button variant="text" className="text-slate-400">
                  Register
                </Button>
              </NavLink>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <h1 className="text-slate-50 text-2xl font-bold">
                Akun & Pengguna
              </h1>
              <NavLink>
                <Button variant="text" className="text-slate-400">
                  Pusat Bantuan
                </Button>
              </NavLink>
              <NavLink>
                <Button variant="text" className="text-slate-400">
                  Cara Pembayaran
                </Button>
              </NavLink>
              <NavLink>
                <Button variant="text" className="text-slate-400">
                  Cara Memesan
                </Button>
              </NavLink>
              <NavLink>
                <Button variant="text" className="text-slate-400">
                  Pengiriman
                </Button>
              </NavLink>
              <NavLink>
                <Button variant="text" className="text-slate-400">
                  Pengembalian & Refund
                </Button>
              </NavLink>
              <NavLink>
                <Button variant="text" className="text-slate-400">
                  Hubungi Kami
                </Button>
              </NavLink>
              <NavLink>
                <Button variant="text" className="text-slate-400">
                  Live Chat / WhatsApp
                </Button>
              </NavLink>
            </div>
          )}
          <div className="flex flex-col w-full">
            <h1 className="text-slate-50 text-2xl font-bold mb-5">
              Metode Pembayaran
            </h1>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Transfer Bank
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                E-wallet (DANA, Gopay, OVO)
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Kartu Kredit / Debit
              </Button>
            </NavLink>
            <NavLink>
              <Button
                variant="text"
                className="flex items-start justify-start text-slate-400"
              >
                COD
              </Button>
            </NavLink>
          </div>
          <div className="flex flex-col w-full">
            <h1 className="text-slate-50 text-2xl font-bold mb-5">
              Jasa & Pengiriman
            </h1>
            <NavLink>
              <Button
                variant="text"
                className="flex items-start justify-start text-slate-400"
              >
                Jne
              </Button>
            </NavLink>
            <NavLink>
              <Button
                variant="text"
                className="flex items-start justify-start text-slate-400"
              >
                j&t
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Sicepat
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                AnterAja
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Pos Indonesia
              </Button>
            </NavLink>
          </div>
          <div className="flex flex-col w-full">
            <h1 className="text-slate-50 text-2xl font-bold mb-5">
              Medial Social
            </h1>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Facebook
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Instagram
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Twitter
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Tiktok
              </Button>
            </NavLink>
            <NavLink>
              <Button variant="text" className="text-slate-400">
                Youtube
              </Button>
            </NavLink>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <span className="uppercase text-md mt-5 font-bold text-slate-300">© 2025 Morphy Store. All rights reserved.</span>
        </div>
      </div>
    </>
  );
}
