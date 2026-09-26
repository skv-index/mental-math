'use client';

interface QuickNavProps {
  sections: { id: string; color: string; title: string }[];
}

export function QuickNav({ sections }: QuickNavProps) {
  return (
    <nav className="mb-10 rounded-2xl p-5 border border-slate-200/80 bg-white shadow-sm">
      <p className="text-xs font-700 uppercase tracking-widest text-[#9CA3AF] mb-3">Jump to Section</p>
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full px-3 py-1 text-xs font-600 transition-all duration-200"
            style={{ background: `${s.color}15`, color: s.color }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = s.color;
              el.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = `${s.color}15`;
              el.style.color = s.color;
            }}
          >
            {s.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
