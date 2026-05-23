"use client";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-b-[var(--color-border-light)] bg-bg-primary">
      <div>
        <h1 className="text-h2 text-deep-orange">{title}</h1>
        {subtitle && (
          <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
