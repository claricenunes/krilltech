function ArmadilloIllustration({ className = 'h-full w-full' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="150" cy="176" rx="98" ry="14" fill="#14301e" opacity="0.08" />

      <path
        d="M18 150 Q 10 96 62 78 Q 40 40 88 24 Q 132 8 172 28 Q 210 46 208 92 Q 236 100 232 132 Q 228 158 196 160 L 40 160 Q 20 158 18 150 Z"
        fill="#7bad86"
      />

      <g stroke="#4f8f61" strokeWidth="2.5" opacity="0.9">
        <path d="M62 78 Q 90 66 120 70" fill="none" />
        <path d="M75 58 Q 100 46 128 50" fill="none" />
        <path d="M92 38 Q 118 28 146 34" fill="none" />
        <path d="M118 28 Q 150 20 176 30" fill="none" />
        <path d="M146 34 Q 176 30 198 48" fill="none" />
        <path d="M128 50 Q 162 44 190 62" fill="none" />
        <path d="M120 70 Q 158 62 196 80" fill="none" />
        <path d="M110 88 Q 156 80 204 96" fill="none" />
      </g>

      <path
        d="M18 150 Q 6 118 22 96 Q 8 122 18 150 Z"
        fill="#5c9868"
      />

      <ellipse cx="34" cy="86" rx="20" ry="16" fill="#7bad86" />
      <path d="M18 78 Q 24 62 40 66" stroke="#4f8f61" strokeWidth="2.5" fill="none" />
      <circle cx="24" cy="84" r="3.2" fill="#14301e" />
      <path
        d="M8 82 Q -2 80 4 70"
        stroke="#4f8f61"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      <g transform="translate(196, 118)">
        <path
          d="M0 30 Q -6 6 14 -6 Q 34 -18 46 2"
          stroke="#39754c"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="46" cy="-4" rx="16" ry="11" fill="#39754c" transform="rotate(-20 46 -4)" />
        <ellipse cx="30" cy="6" rx="13" ry="9" fill="#4f8f61" transform="rotate(-8 30 6)" />
      </g>

      <rect x="30" y="158" width="14" height="16" rx="6" fill="#4f8f61" />
      <rect x="150" y="158" width="14" height="16" rx="6" fill="#4f8f61" />
      <rect x="190" y="158" width="14" height="16" rx="6" fill="#4f8f61" />
    </svg>
  )
}

export default ArmadilloIllustration
