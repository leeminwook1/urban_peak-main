import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  href,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
  onClick,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-pill px-7 py-3 text-sm font-medium transition-all duration-200";
  const variants = {
    primary:
      "bg-text-primary text-white hover:bg-text-primary/90 active:scale-[0.98]",
    secondary:
      "bg-white text-text-primary border border-border hover:border-text-muted active:scale-[0.98]",
  };

  const classes = cn(base, variants[variant], disabled && "opacity-50 cursor-not-allowed", className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
