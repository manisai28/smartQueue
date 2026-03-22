import { clsx } from 'clsx';

const variants = {
  green: 'badge-green',
  red: 'badge-red',
  amber: 'badge-amber',
  cyan: 'badge-cyan',
  purple: 'badge-purple',
};

export default function Badge({ children, variant = 'cyan', dot = true }) {
  const dotColors = {
    green: 'bg-accent-green',
    red: 'bg-accent-red',
    amber: 'bg-accent-amber',
    cyan: 'bg-accent-cyan',
    purple: 'bg-accent-purple',
  };

  return (
    <span className={clsx(variants[variant] || variants.cyan)}>
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse-slow', dotColors[variant] || dotColors.cyan)} />
      )}
      {children}
    </span>
  );
}
