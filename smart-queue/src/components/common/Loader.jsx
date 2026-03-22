export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-surface-600" />
        <div className="w-12 h-12 rounded-full border-2 border-t-accent-cyan absolute inset-0 animate-spin" />
      </div>
      <span className="text-sm text-slate-500 font-mono">{text}</span>
    </div>
  );
}
