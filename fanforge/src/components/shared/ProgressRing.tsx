"use client";

interface ProgressRingProps {
  size?: number;
  stroke?: number;
  progress?: number;
  className?: string;
}

export function ProgressRing({
  size = 48,
  stroke = 4,
  progress,
  className,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const indeterminate = progress === undefined;

  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={indeterminate ? { animation: "spin 1.2s linear infinite" } : undefined}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-border-light)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={
          indeterminate
            ? circumference * 0.75
            : circumference - (circumference * (progress ?? 0)) / 100
        }
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.3s ease" }}
      />
    </svg>
  );
}
