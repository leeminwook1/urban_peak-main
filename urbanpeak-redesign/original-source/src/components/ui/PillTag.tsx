interface PillTagProps {
  children: React.ReactNode;
  className?: string;
}

export default function PillTag({ children, className = "" }: PillTagProps) {
  return (
    <span
      className={`inline-block rounded-pill bg-text-primary/5 px-4 py-1.5 text-xs font-medium tracking-widest text-text-muted uppercase ${className}`}
    >
      {children}
    </span>
  );
}
