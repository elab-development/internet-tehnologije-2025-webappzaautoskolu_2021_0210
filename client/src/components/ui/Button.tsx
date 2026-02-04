type Variant = "primary" | "secondary" | "danger";

export default function Button({
  children,
  onClick,
  type = "button",
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: Variant;
}) {
  const base =
    "px-4 py-2 rounded font-semibold transition disabled:opacity-60";
  const styles: Record<Variant, string> = {
    primary: "bg-blue-600 hover:bg-blue-500",
    secondary: "bg-slate-800 border border-slate-700 hover:bg-slate-700",
    danger: "bg-red-600 hover:bg-red-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} text-white`}
    >
      {children}
    </button>
  );
}
