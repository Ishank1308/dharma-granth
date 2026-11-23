import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export function StressIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="stress-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#0d9488" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="stress-wave" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="85" fill="url(#stress-glow)" />
      {/* Concentric calming ripples */}
      <circle cx="100" cy="115" r="60" stroke="#2dd4bf" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 3" />
      <circle cx="100" cy="115" r="42" stroke="#5eead4" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="100" cy="115" r="24" stroke="#99f6e4" strokeWidth="1.5" strokeOpacity="0.6" />
      {/* Serene water waves turning flat */}
      <path
        d="M35 135 C 60 120, 80 145, 100 132 C 120 120, 140 142, 165 130"
        stroke="url(#stress-wave)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M45 150 C 70 140, 90 155, 105 148 C 125 140, 145 152, 155 145"
        stroke="#2dd4bf"
        strokeWidth="2"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
      {/* Calming moon & lotus bud */}
      <circle cx="100" cy="65" r="16" fill="#ccfbf1" fillOpacity="0.85" />
      <circle cx="106" cy="61" r="14" fill="#0f766e" fillOpacity="0.35" />
      <path
        d="M100 90 C 92 102, 94 112, 100 118 C 106 112, 108 102, 100 90 Z"
        fill="#99f6e4"
      />
      <path
        d="M100 96 C 86 104, 86 115, 94 120 C 97 114, 101 106, 100 96 Z"
        fill="#5eead4"
        fillOpacity="0.8"
      />
      <path
        d="M100 96 C 114 104, 114 115, 106 120 C 103 114, 99 106, 100 96 Z"
        fill="#5eead4"
        fillOpacity="0.8"
      />
    </svg>
  );
}

export function FearIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="fear-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="95" r="75" fill="url(#fear-sun)" />
      {/* Rays of abhaya */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="100"
          y1="95"
          x2={100 + Math.cos((angle * Math.PI) / 180) * 65}
          y2={95 + Math.sin((angle * Math.PI) / 180) * 65}
          stroke="#fef08a"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          strokeDasharray="4 4"
        />
      ))}
      {/* Mountain peak of unshakeable presence */}
      <polygon points="100,60 155,160 45,160" fill="#78350f" fillOpacity="0.6" />
      <polygon points="100,60 145,160 100,160" fill="#b45309" fillOpacity="0.5" />
      <polygon points="100,60 100,160 55,160" fill="#d97706" fillOpacity="0.7" />
      {/* Steadfast Abhaya Flame */}
      <path
        d="M100 45 C 92 65, 88 78, 100 90 C 112 78, 108 65, 100 45 Z"
        fill="url(#shield-grad)"
      />
      <circle cx="100" cy="74" r="5" fill="#fef08a" />
    </svg>
  );
}

export function AngerIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="anger-cool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#anger-cool)" />
      {/* Cooling water reservoir */}
      <ellipse cx="100" cy="140" rx="65" ry="20" fill="#0284c7" fillOpacity="0.3" />
      <ellipse cx="100" cy="140" rx="45" ry="12" stroke="#38bdf8" strokeWidth="1.5" />
      {/* Water droplet transforming fire */}
      <path
        d="M100 55 C 80 85, 75 110, 100 130 C 125 110, 120 85, 100 55 Z"
        fill="#38bdf8"
        fillOpacity="0.85"
      />
      {/* Inner cooling flame turned lotus petal */}
      <path
        d="M100 75 C 90 95, 90 110, 100 120 C 110 110, 110 95, 100 75 Z"
        fill="#e0f2fe"
      />
      <circle cx="100" cy="105" r="4" fill="#0284c7" />
      {/* Side calming leaves */}
      <path d="M72 135 C 60 125, 62 110, 78 118" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      <path d="M128 135 C 140 125, 138 110, 122 118" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function GriefIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="grief-dawn" cx="50%" cy="75%" r="65%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
          <stop offset="45%" stopColor="#818cf8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="85" fill="url(#grief-dawn)" />
      {/* Gentle horizon and golden sunrise of immortality */}
      <path d="M25 145 Q 100 135 175 145" stroke="#a5b4fc" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="100" cy="140" r="28" fill="#fbbf24" fillOpacity="0.9" />
      {/* The drifting autumn leaf transforming into light */}
      <path
        d="M75 75 C 65 60, 90 50, 105 65 C 120 80, 110 100, 95 95 C 80 90, 85 90, 75 75 Z"
        fill="#fef08a"
        fillOpacity="0.85"
      />
      <path d="M85 70 Q 98 80 108 95" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
      {/* Sparkles of timeless spirit */}
      <circle cx="135" cy="65" r="2.5" fill="#fef08a" />
      <circle cx="65" cy="105" r="2" fill="#c7d2fe" />
      <circle cx="145" cy="115" r="2" fill="#fef08a" />
    </svg>
  );
}

export function DutyIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wheel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
      {/* Dharmachakra wheel of ethical cosmic order */}
      <circle cx="100" cy="95" r="55" stroke="url(#wheel-grad)" strokeWidth="4" />
      <circle cx="100" cy="95" r="45" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="100" cy="95" r="14" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2.5" />
      <circle cx="100" cy="95" r="5" fill="#dbeafe" />
      {/* Eight spokes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1={100 + Math.cos((angle * Math.PI) / 180) * 14}
          y1={95 + Math.sin((angle * Math.PI) / 180) * 14}
          x2={100 + Math.cos((angle * Math.PI) / 180) * 55}
          y2={95 + Math.sin((angle * Math.PI) / 180) * 55}
          stroke="#93c5fd"
          strokeWidth="2"
        />
      ))}
      {/* Symmetrical scale balance base */}
      <path d="M50 165 L 150 165" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
      <path d="M100 150 L 100 165" stroke="#3b82f6" strokeWidth="3" />
      <polygon points="100,140 106,150 94,150" fill="#60a5fa" />
    </svg>
  );
}

export function DisciplineIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="tapas-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fdba74" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ea580c" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="75" fill="url(#tapas-glow)" />
      {/* Sacred archer's bow */}
      <path
        d="M60 45 C 45 80, 45 120, 60 155"
        stroke="#ea580c"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line x1="60" y1="45" x2="60" y2="155" stroke="#fed7aa" strokeWidth="1.5" />
      {/* Arrow of concentrated will */}
      <line x1="55" y1="100" x2="145" y2="100" stroke="#f97316" strokeWidth="2.5" />
      <polygon points="145,95 158,100 145,105" fill="#ea580c" />
      {/* Steady flame of Tapas */}
      <path
        d="M100 65 C 90 85, 92 95, 100 105 C 108 95, 110 85, 100 65 Z"
        fill="#fdba74"
        fillOpacity="0.9"
      />
      <circle cx="100" cy="90" r="4" fill="#ffffff" />
    </svg>
  );
}

export function ConcentrationIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="dhyana-beam" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#0891b2" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#164e63" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#dhyana-beam)" />
      {/* Concentric rings of stillness */}
      <circle cx="100" cy="100" r="60" stroke="#0891b2" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
      <circle cx="100" cy="100" r="44" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" />
      <circle cx="100" cy="100" r="28" stroke="#a5f3fc" strokeWidth="2" opacity="0.85" />
      {/* Unwavering flame in windless sanctuary (Nivatastha deepa) */}
      <path
        d="M100 60 C 93 80, 93 92, 100 102 C 107 92, 107 80, 100 60 Z"
        fill="#ecfeff"
      />
      <circle cx="100" cy="90" r="3.5" fill="#0891b2" />
      {/* Base lamp diya */}
      <path
        d="M80 120 C 80 135, 120 135, 120 120 Z"
        fill="#0e7490"
        stroke="#67e8f9"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function LeadershipIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="lead-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#ca8a04" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#713f12" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#lead-glow)" />
      {/* The majestic protective banyan canopy (Loka-sangraha) */}
      <path
        d="M100 45 C 65 45, 45 70, 55 95 C 40 105, 55 125, 75 120 C 85 130, 115 130, 125 120 C 145 125, 160 105, 145 95 C 155 70, 135 45, 100 45 Z"
        fill="#a16207"
        fillOpacity="0.5"
      />
      <path
        d="M100 55 C 75 55, 60 75, 70 95 C 60 105, 70 118, 85 115 C 95 122, 110 122, 118 115 C 130 118, 140 105, 130 95 C 140 75, 125 55, 100 55 Z"
        fill="#eab308"
        fillOpacity="0.75"
      />
      {/* Sturdy trunk grounding in dharma */}
      <path
        d="M93 118 L 88 160 L 112 160 L 107 118 Z"
        fill="#713f12"
      />
      <circle cx="100" cy="85" r="7" fill="#fef08a" />
    </svg>
  );
}

export function FamilyIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="family-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#db2777" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#831843" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#family-glow)" />
      {/* Sheltering hearth hands / roof of mutual care */}
      <path
        d="M50 115 C 50 75, 100 60, 100 60 C 100 60, 150 75, 150 115"
        stroke="#f472b6"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Domestic sacred Diya flame */}
      <path
        d="M100 85 C 92 100, 94 110, 100 118 C 106 110, 108 100, 100 85 Z"
        fill="#fbcfe8"
      />
      <circle cx="100" cy="105" r="3.5" fill="#be185d" />
      {/* Hearth bowl */}
      <path
        d="M80 120 C 80 138, 120 138, 120 120 Z"
        fill="#9d174d"
        stroke="#f472b6"
        strokeWidth="2"
      />
      <circle cx="75" cy="148" r="6" fill="#fbcfe8" fillOpacity="0.7" />
      <circle cx="125" cy="148" r="6" fill="#fbcfe8" fillOpacity="0.7" />
      <path d="M70 160 Q 100 152 130 160" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function DevotionIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bhakti-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#e11d48" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#881337" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#bhakti-glow)" />
      {/* Offering hands cradling a sacred blossom */}
      <path
        d="M60 145 C 65 125, 80 115, 95 125"
        stroke="#fcd34d"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M140 145 C 135 125, 120 115, 105 125"
        stroke="#fcd34d"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* The pure flower of devotion (Patram Pushpam Phalam Toyam) */}
      <path
        d="M100 70 C 88 88, 90 102, 100 112 C 110 102, 112 88, 100 70 Z"
        fill="#f43f5e"
      />
      <path
        d="M100 80 C 82 92, 80 108, 92 112 C 95 104, 100 95, 100 80 Z"
        fill="#fb7185"
      />
      <path
        d="M100 80 C 118 92, 120 108, 108 112 C 105 104, 100 95, 100 80 Z"
        fill="#fb7185"
      />
      <circle cx="100" cy="98" r="4.5" fill="#fef08a" />
      {/* Rays of divine receiving grace */}
      <path d="M100 40 L 100 55" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
      <path d="M75 50 L 85 60" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
      <path d="M125 50 L 115 60" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SelfKnowledgeIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="atman-light" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b0764" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#atman-light)" />
      {/* Sacred mirror frame */}
      <circle cx="100" cy="100" r="55" stroke="#c084fc" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="46" stroke="#e9d5ff" strokeWidth="1" strokeDasharray="3 3" />
      {/* Radiant inner sun / Atma-Jyoti */}
      <circle cx="100" cy="100" r="22" fill="#faf5ff" />
      <circle cx="100" cy="100" r="14" fill="#a855f7" />
      <circle cx="100" cy="100" r="7" fill="#ffffff" />
      {/* 12 rays of pure consciousness */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1={100 + Math.cos((angle * Math.PI) / 180) * 25}
          y1={100 + Math.sin((angle * Math.PI) / 180) * 25}
          x2={100 + Math.cos((angle * Math.PI) / 180) * 38}
          y2={100 + Math.sin((angle * Math.PI) / 180) * 38}
          stroke="#e9d5ff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function MeaningOfLifeIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="moksha-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#9333ea" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3b0764" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="82" fill="url(#moksha-core)" />
      {/* Four Purushartha petals (Dharma, Artha, Kama, Moksha) */}
      <path
        d="M100 35 C 120 65, 120 85, 100 100 C 80 85, 80 65, 100 35 Z"
        fill="#facc15"
        fillOpacity="0.85"
      />
      <path
        d="M165 100 C 135 120, 115 120, 100 100 C 115 80, 135 80, 165 100 Z"
        fill="#38bdf8"
        fillOpacity="0.85"
      />
      <path
        d="M100 165 C 80 135, 80 115, 100 100 C 120 115, 120 135, 100 165 Z"
        fill="#f43f5e"
        fillOpacity="0.85"
      />
      <path
        d="M35 100 C 65 80, 85 80, 100 100 C 85 120, 65 120, 35 100 Z"
        fill="#a855f7"
        fillOpacity="0.85"
      />
      {/* Central jewel of Moksha / Asato Ma Sadgamaya */}
      <circle cx="100" cy="100" r="16" fill="#ffffff" stroke="#eab308" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="6" fill="#9333ea" />
    </svg>
  );
}

export function RelationshipsIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="rel-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#db2777" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#831843" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="85" fill="url(#rel-glow)" />
      {/* Two interlinked sacred rings of Maitri and mutual honoring */}
      <circle cx="82" cy="100" r="42" stroke="#f472b6" strokeWidth="2" strokeOpacity="0.8" />
      <circle cx="118" cy="100" r="42" stroke="#fb7185" strokeWidth="2" strokeOpacity="0.8" />
      {/* Central lotus of empathy and compassion */}
      <circle cx="100" cy="100" r="14" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
      <path
        d="M100 88 C 94 95, 96 105, 100 112 C 104 105, 106 95, 100 88 Z"
        fill="#f43f5e"
      />
      <circle cx="100" cy="100" r="5" fill="#fef08a" />
    </svg>
  );
}

export function TopicIllustration({
  topicId,
  className = '',
  size = 140,
}: {
  topicId: string;
  className?: string;
  size?: number;
}) {
  switch (topicId) {
    case 'stress-and-worry':
      return <StressIllustration className={className} size={size} />;
    case 'fear-and-courage':
      return <FearIllustration className={className} size={size} />;
    case 'anger':
      return <AngerIllustration className={className} size={size} />;
    case 'grief-and-loss':
      return <GriefIllustration className={className} size={size} />;
    case 'duty-and-decision-making':
      return <DutyIllustration className={className} size={size} />;
    case 'discipline':
      return <DisciplineIllustration className={className} size={size} />;
    case 'concentration':
      return <ConcentrationIllustration className={className} size={size} />;
    case 'leadership':
      return <LeadershipIllustration className={className} size={size} />;
    case 'family-responsibilities':
      return <FamilyIllustration className={className} size={size} />;
    case 'relationships':
      return <RelationshipsIllustration className={className} size={size} />;
    case 'devotion':
      return <DevotionIllustration className={className} size={size} />;
    case 'self-knowledge':
      return <SelfKnowledgeIllustration className={className} size={size} />;
    case 'meaning-of-life':
      return <MeaningOfLifeIllustration className={className} size={size} />;
    default:
      return <StressIllustration className={className} size={size} />;
  }
}
