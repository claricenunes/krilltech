function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="13" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
      <path
        d="M20 20 L20 4 A16 16 0 0 1 33.8 12.2 Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <circle cx="20" cy="20" r="5.5" fill="currentColor" />
      <circle cx="20" cy="20" r="2" fill="var(--color-cream-50)" />
    </svg>
  )
}

export default Logo
