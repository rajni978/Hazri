export default function Btn({ children, type = 'button', variant = 'primary', disabled, ...props }) {
  const base =
    'px-4 py-2.5 text-sm font-medium rounded border transition disabled:opacity-60 disabled:pointer-events-none';
  const variants = {
    primary: `${base} bg-terracotta border-terracotta text-cream hover:opacity-90`,
    secondary: `${base} border-sand text-charcoal dark:border-sand/40 dark:text-cream hover:bg-sand/100 dark:hover:bg-sand/30`,
    danger: `${base} border-terracotta bg-transparent text-terracotta hover:bg-terracotta/10`,
  };
  return (
    <button type={type} disabled={disabled} className={variants[variant]} {...props}>
      {children}
    </button>
  );
}
