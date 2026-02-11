interface StatusCardProps {
  title: string;
  value: string;
  description: string;
}

export function StatusCard({ title, value, description }: StatusCardProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-sm">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-xl font-semibold text-emerald-400">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
    </div>
  );
}
