function HeroIllustration({ className = 'h-full w-full' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 420"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef6e6" />
          <stop offset="100%" stopColor="#d9e8cc" />
        </linearGradient>
        <linearGradient id="hero-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3d896" />
          <stop offset="100%" stopColor="#e0a63f" />
        </linearGradient>
        <linearGradient id="hero-hill-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fac7f" />
          <stop offset="100%" stopColor="#6d9061" />
        </linearGradient>
        <linearGradient id="hero-hill-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f6b41" />
          <stop offset="100%" stopColor="#26472a" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="640" height="420" fill="url(#hero-sky)" />

      <circle cx="500" cy="270" r="86" fill="url(#hero-sun)" opacity="0.85" />

      <ellipse cx="120" cy="90" rx="46" ry="14" fill="#ffffff" opacity="0.55" />
      <ellipse cx="155" cy="82" rx="30" ry="11" fill="#ffffff" opacity="0.5" />
      <ellipse cx="430" cy="60" rx="38" ry="12" fill="#ffffff" opacity="0.5" />

      <path
        d="M0 260 C 100 220 200 300 320 250 C 440 205 520 260 640 230 L640 420 L0 420 Z"
        fill="url(#hero-hill-back)"
      />

      <path
        d="M0 330 C 90 290 190 350 300 315 C 420 278 520 330 640 300 L640 420 L0 420 Z"
        fill="url(#hero-hill-front)"
      />

      <g opacity="0.35" stroke="#eef6e6" strokeWidth="2.5" strokeLinecap="round">
        <path d="M20 360 C 120 340 220 385 340 350" />
        <path d="M10 380 C 130 360 240 405 360 372" />
        <path d="M40 400 C 160 382 260 418 380 392" />
      </g>

      <g transform="translate(410, 240) scale(1.15)">
        <ellipse cx="40" cy="112" rx="46" ry="8" fill="#14301e" opacity="0.18" />
        <line x1="0" y1="0" x2="80" y2="0" stroke="#f3efe2" strokeWidth="4" strokeLinecap="round" />
        <line x1="40" y1="-20" x2="40" y2="20" stroke="#f3efe2" strokeWidth="4" strokeLinecap="round" />
        <circle cx="0" cy="0" r="11" fill="#f8f6ee" stroke="#f3efe2" strokeWidth="3" />
        <circle cx="80" cy="0" r="11" fill="#f8f6ee" stroke="#f3efe2" strokeWidth="3" />
        <circle cx="40" cy="-20" r="11" fill="#f8f6ee" stroke="#f3efe2" strokeWidth="3" />
        <circle cx="40" cy="20" r="11" fill="#f8f6ee" stroke="#f3efe2" strokeWidth="3" />
        <rect x="22" y="10" width="36" height="26" rx="9" fill="#f3efe2" />
        <rect x="32" y="34" width="16" height="14" rx="4" fill="#c17a49" />
        <circle cx="40" cy="41" r="3.4" fill="#26472a" />
      </g>

      <g transform="translate(60, 250)" opacity="0.9">
        <path
          d="M0 40 Q 20 -10 40 40"
          stroke="#1b3d27"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M40 40 Q 60 -6 80 40"
          stroke="#234c31"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M80 40 Q 100 -14 120 40"
          stroke="#1b3d27"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export default HeroIllustration
