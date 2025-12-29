import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <div className="flex flex-col w-full bg-primary-dark pt-10 lg:pb-5 md:pb-5 pb-20 lg:mt-20 md:mt-20 mt-10 lg:px-10 md:px-10 px-5">
        <div className="flex lg:items-start md:items-start lg:justify-between md:justify-between flex-wrap w-full lg:gap-0 md:gap-0 gap-5">
          <div className="flex lg:w-[40%] md:w-[40%] w-full flex-col text-neutral-light/80 font-medium font-tiktok gap-2.5">
            <h1 className="text-2xl font-tiktok font-black text-neutral-light">
              E-commerce
            </h1>
            <p className="w-[80%]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. In saepe
              aliquam praesentium necessitatibus repudiandae sapiente reiciendis
              animi a nesciunt corrupti doloribus, pariatur hic vitae maiores,
              minima natus impedit facilis quam?
            </p>

            <div className="flex flex-col font-normal gap-2">
              <h3 className="text-lg text-neutral-light font-tiktok font-black">
                Informasi Layanan kami:
              </h3>
              <div className="flex items-center gap-2.5">
                <span>Email: </span>
                <span> E-commerce.co.id@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span>No Telp: </span>
                <span> +62 8389 9513 983</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span>Whatsapp: </span>
                <span> +62 8389 9513 983</span>
              </div>
            </div>
          </div>
          <div className="flex lg:w-[20%] md:w-[20%] flex-col">
            <h1 className="text-2xl font-tiktok font-black text-neutral-light mb-2.5">
              Informasi
            </h1>
            <NavLink className="text-neutral-light/80 text-lg hover:underline hover:text-neutral-light">
              <span>Tentang Kami</span>
            </NavLink>
            <NavLink className="text-neutral-light/80 text-lg hover:underline hover:text-neutral-light">
              <span>Pers & Media</span>
            </NavLink>
            <NavLink className="text-neutral-light/80 text-lg hover:underline hover:text-neutral-light">
              <span>Down To Earth</span>
            </NavLink>
            <NavLink className="text-neutral-light/80 text-lg hover:underline hover:text-neutral-light">
              <span>Toko E-commerce</span>
            </NavLink>
          </div>
          <div className="flex lg:w-[20%] md:w-[20%] flex-col">
            <h1 className="text-2xl font-tiktok font-black text-neutral-light mb-2.5">
              Bantuan
            </h1>
            <NavLink className="text-neutral-light/80 text-lg hover:underline hover:text-neutral-light">
              <span>Pengiriman</span>
            </NavLink>
            <NavLink className="text-neutral-light/80 text-lg hover:underline hover:text-neutral-light">
              <span>Penukaran Barang</span>
            </NavLink>
            <NavLink className="text-neutral-light/80 text-lg hover:underline hover:text-neutral-light">
              <span>FAQ</span>
            </NavLink>
          </div>
          <div className="flex lg:w-[20%] md:w-[20%] flex-col">
            <h1 className="text-2xl font-tiktok font-black text-neutral-light mb-2.5">
              Social Media
            </h1>
            <NavLink className="text-neutral-light/80 text-lg hover:underline hover:text-neutral-light">
              <span>Facebook</span>
            </NavLink>
            <NavLink className="text-neutral-light/80 text-lg hover:underline hover:text-neutral-light">
              <span>Instagram</span>
            </NavLink>
            <NavLink className="text-neutral-light/80 text-lg hover:underline hover:text-neutral-light">
              <span>Twitter</span>
            </NavLink>
            <NavLink className="text-neutral-light/80 text-lg hover:underline hover:text-neutral-light">
              <span>Telegram</span>
            </NavLink>
            <NavLink className="text-neutral-light/80 text-lg hover:underline hover:text-neutral-light">
              <span>whatsapp</span>
            </NavLink>
          </div>
        </div>
        <div className="flex lg:items-center md:items-center flex-col lg:flex-row md:flex-row lg:justify-between md:justify-between  mt-10">
          <span className="text-neutral-light">
            © 2023 - 2025 E-commerce.co.id
          </span>

          <div className="flex items-center lg:justify-center md:justify-center justify-between gap-2.5 text-neutral-light">
            <NavLink className="hover:underline">Privasi & Cookies</NavLink>
            <span>|</span>
            <NavLink className="hover:underline">Pengaturan Cookies</NavLink>
            <span>|</span>
            <NavLink className="hover:underline">Syarat & Kententuan </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
