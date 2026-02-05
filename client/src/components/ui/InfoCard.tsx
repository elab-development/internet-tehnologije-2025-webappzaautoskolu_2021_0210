import { Link } from "react-router-dom";

type Props = {
  title: string;
  description: string;
  imageUrl: string;
  badge?: string;
  to?: string; // ako postoji, kartica je klikabilna (Link)
};

export default function InfoCard({ title, description, imageUrl, badge, to }: Props) {
  const content = (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-500 transition">
      <div className="h-36 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover opacity-90"
          loading="lazy"
        />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {badge && (
            <span className="text-xs px-2 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-200">
              {badge}
            </span>
          )}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{description}</p>

        {to && (
          <div className="pt-2 text-sm text-blue-300">
            Otvori →
          </div>
        )}
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}
