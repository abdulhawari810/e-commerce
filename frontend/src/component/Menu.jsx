import Button from "@mui/material/Button";
import menu1 from "../assets/menu1.png";
import menu2 from "../assets/menu2.jpg";
import menu3 from "../assets/menu3.jpg";
import menu4 from "../assets/menu4.jpg";
import menu5 from "../assets/menu5.jpeg";
import menu6 from "../assets/menu6.webp";

export default function Menu() {
  return (
    <>
      <div className="flex px-10 flex-col w-full bg-slate-50">
        <h1 className="text-3xl font-bold mt-20 my-5">Category Highlight</h1>
        <div className="grid grid-cols-5 gap-10">
          <Button variant="text" className="bg-slate-50 p-5 text-lg font-bold rounded-4xl shadow-2xl gap-5 text-slate-950 relative w-full flex flex-col items-center justify-center">
            <img src={menu1} alt="Tas" className="rounded-3xl object-cover w-full h-[200px]"/>
            <span>Tas</span>
          </Button>
          <Button variant="text" className="bg-slate-50 p-5 text-lg font-bold rounded-4xl shadow-2xl gap-5 text-slate-950 relative w-full flex flex-col items-center justify-center">
            <img src={menu2} alt="Baju" className="rounded-3xl object-cover w-full h-[200px]"/>
            <span>Baju</span>
          </Button>
          <Button variant="text" className="bg-slate-50 p-5 text-lg font-bold rounded-4xl shadow-2xl gap-5 text-slate-950 relative w-full flex flex-col items-center justify-center">
            <img src={menu3} alt="Sepatu" className="rounded-3xl object-cover w-full h-[200px]"/>
            <span>Sepatu</span>
          </Button>
          <Button variant="text" className="bg-slate-50 p-5 text-lg font-bold rounded-4xl shadow-2xl gap-5 text-slate-950 relative w-full flex flex-col items-center justify-center">
            <img src={menu4} alt="Hijab" className="rounded-3xl object-cover w-full h-[200px]"/>
            <span>Hijab</span>
          </Button>
          <Button variant="text" className="bg-slate-50 p-5 text-lg font-bold rounded-4xl shadow-2xl gap-5 text-slate-950 relative w-full flex flex-col items-center justify-center">
            <img src={menu5} alt="Celana" className="rounded-3xl object-cover w-full h-[200px]"/>
            <span>Celana</span>
          </Button>
          <Button variant="text" className="bg-slate-50 p-5 text-lg font-bold rounded-4xl shadow-2xl gap-5 text-slate-950 relative w-full flex flex-col items-center justify-center">
            <img src={menu6} alt="Aksessoris" className="rounded-3xl object-cover w-full h-[200px]"/>
            <span>Aksessoris</span>
          </Button>
        </div>
      </div>
    </>
  );
}
