import Card from "../components/ui/Card";

export default function Tests() {
  return (
    <div className="p-6 text-white space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Teorijski testovi</h1>
        <p className="text-slate-300">
          Ovde možete započeti test i videti rezultate.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Polaganje testova"
          description="Lista dostupnih testova koje možete polagati."
          to="/polaganje-testova"
        />
        <Card
          title="Moji rezultati"
          description="Pregled vaših prethodnih rezultata i prolaznosti."
          to="/moji-rezultati"
        />
      </div>
    </div>
  );
}
