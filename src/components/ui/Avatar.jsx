// Avatar component with initials fallback
export default function Avatar({ name = '', photoURL, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-surface-700 ${className}`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold ring-2 ring-white dark:ring-surface-700 ${className}`}>
      {initials || '?'}
    </div>
  );
}
