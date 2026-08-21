import { TrendingUp } from "lucide-react";

const toneStyles = {
  emerald: {
    icon: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },

  brand: {
    icon: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },

  amber: {
    icon: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
};

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon = TrendingUp,
  iconTone = "brand",
}) {
  const tone = toneStyles[iconTone] || toneStyles.brand;

  return (
    <div className="card p-5 bg-[#15151a] border border-base-border">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-zinc-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            {sub}
          </p>
        </div>

        <div
          className={`
            w-10 h-10
            rounded-xl
            flex
            items-center
            justify-center
            shrink-0
            ${tone.bg}
            ${tone.border}
            border
          `}
        >
          <Icon
            size={20}
            className={tone.icon}
          />
        </div>
      </div>
    </div>
  );
}
