export default function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      {title && <h2 className="font-semibold text-lg mb-2 text-white">{title}</h2>}
      {children}
    </div>
  );
}
