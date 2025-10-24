export const buttonClass = (variant: 'primary' | 'secondary' = 'primary') => {
  const base =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

  const primary = 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600';
  const secondary = 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus-visible:outline-slate-400';

  return `${base} ${variant === 'primary' ? primary : secondary}`;
};
