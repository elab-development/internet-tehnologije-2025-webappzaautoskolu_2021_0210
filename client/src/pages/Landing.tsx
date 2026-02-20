import { useNavigate } from "react-router-dom";
import hero from "../assets/hero1.jpeg";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      
      <div className="w-full px-10 py-6 flex justify-between items-center border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-wide">
          AUTO ŠKOLA <span className="text-blue-500">SmartDrive</span>
        </h1>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate("/login")}
          >
            Log in
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </Button>
        </div>
      </div>

   
      <div className="w-full grid md:grid-cols-2 items-center px-10 py-20 gap-16">

      
        <div className="space-y-7">
          <h2 className="text-5xl font-extrabold leading-tight">
            Nauči da voziš <br />
            <span className="text-blue-400">pametno i bez stresa</span>
          </h2>

          <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
            SmartDrive je moderna digitalna auto-škola koja ti omogućava da sve
            organizuješ online: časove vožnje, pregled lekcija, rad testova i rezultate.
            Bez papira. Bez haosa.
          </p>
        </div>

        <div className="relative">
          <img
            src={hero}
            alt="Auto škola"
            className="rounded-2xl shadow-2xl w-full h-[520px] object-cover"
          />
        </div>
      </div>

     
      <div className="w-full bg-slate-900/60 px-10 py-16">
        <div className="grid md:grid-cols-3 gap-8">

          <Card title="Plan obuke">
            <p className="text-slate-300">
              Struktuisan program: učenje teorije, praktična vožnja i priprema za ispit.
              Sve aktivnosti jasno organizovane kroz aplikaciju.
            </p>
          </Card>

          <Card title="Podrška instruktora">
            <p className="text-slate-300">
              Fleksibilno zakazivanje časova - kandidat šalje zahtev za termin,
              a instruktor potvrđuje. Bez konflikata u rasporedu.
            </p>
          </Card>

          <Card title="Napredak i rezultati">
            <p className="text-slate-300">
              Prati odrađene časove, statistiku, rezultate testova i svoj napredak
              u realnom vremenu na jednom mestu.
            </p>
          </Card>

        </div>
      </div>
    </div>
  );
}