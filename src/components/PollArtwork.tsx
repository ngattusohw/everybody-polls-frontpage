export type Artwork = 'sun' | 'moon' | 'sweet' | 'savory' | 'beach' | 'mountain';

export function PollArtwork({ kind, className = '' }: { kind: Artwork; className?: string }) {
  return (
    <svg className={`poll-art ${className}`} viewBox="0 0 180 140" fill="none" aria-hidden="true">
      {kind === 'sun' && <>
        <path d="M36 96h108M45 108h90" stroke="#7CBED8" strokeWidth="5" strokeLinecap="round" />
        <path d="M52 85a38 38 0 0 1 76 0" fill="#FFE49A" stroke="#E8B55B" strokeWidth="3" />
        <path d="M90 21v12M44 39l9 9M136 39l-9 9M27 77h13M140 77h13" stroke="#E8B55B" strokeWidth="5" strokeLinecap="round" />
        <circle cx="77" cy="70" r="3" fill="#8A6B37" /><circle cx="103" cy="70" r="3" fill="#8A6B37" />
        <path d="M83 81q7 6 14 0" stroke="#8A6B37" strokeWidth="3" strokeLinecap="round" />
        <path d="M29 60q-9-12-17 0M151 52q8-11 16 0" stroke="#6DACC6" strokeWidth="3" strokeLinecap="round" />
      </>}
      {kind === 'moon' && <>
        <path d="M110 24a48 48 0 1 0 29 77c-44 7-68-37-29-77Z" fill="#FFF1C8" stroke="#DAB57A" strokeWidth="3" strokeLinejoin="round" />
        <path d="m130 35 3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9ZM148 72l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" fill="#D795A3" />
        <circle cx="40" cy="36" r="3" fill="#D795A3" /><circle cx="143" cy="110" r="3" fill="#D795A3" />
        <path d="M65 84q4 4 8 0M88 88q4 4 8 0M75 98q6 5 12 0" stroke="#A08159" strokeWidth="3" strokeLinecap="round" />
      </>}
      {kind === 'sweet' && <>
        <path d="m42 67 87-9 8 53-86 10-9-54Z" fill="#FFF5D8" stroke="#D9A06E" strokeWidth="3" strokeLinejoin="round" />
        <path d="m42 67 32-27 55 18-87 9Z" fill="#FFCAD4" stroke="#D893A4" strokeWidth="3" strokeLinejoin="round" />
        <path d="m47 91 86-9" stroke="#EC9FB0" strokeWidth="10" />
        <circle cx="89" cy="43" r="11" fill="#EB7A89" /><path d="M88 34q-1-15 12-17" stroke="#7AAB88" strokeWidth="3" strokeLinecap="round" />
        <path d="m24 41 3-5M146 43l5 2M140 125l4 3" stroke="#D893A4" strokeWidth="3" strokeLinecap="round" />
      </>}
      {kind === 'savory' && <>
        <path d="m42 51 96-18-27 91-69-73Z" fill="#FFE19B" stroke="#D4A45E" strokeWidth="3" strokeLinejoin="round" />
        <path d="m42 51 96-18" stroke="#D89964" strokeWidth="14" strokeLinecap="round" />
        <circle cx="78" cy="65" r="9" fill="#E9958B" /><circle cx="110" cy="57" r="8" fill="#E9958B" /><circle cx="104" cy="93" r="8" fill="#E9958B" />
        <path d="m86 42 5 6M114 76l7-3M78 89l4 6" stroke="#77A68A" strokeWidth="4" strokeLinecap="round" />
        <path d="m35 92-8 2M142 98l7 4" stroke="#D4A45E" strokeWidth="3" strokeLinecap="round" />
      </>}
      {kind === 'beach' && <>
        <circle cx="130" cy="36" r="15" fill="#FFD98A" />
        <path d="M20 104q34-35 75-11t65 7v25H20v-21Z" fill="#F6DDAA" />
        <path d="M20 82q18-12 35 0t35 0 35 0 35 0M20 94q18-12 35 0t35 0" stroke="#75BCD2" strokeWidth="5" strokeLinecap="round" />
        <path d="m80 99 9-62M55 54q25-37 55-1l-55 1Z" fill="#E6A9B8" stroke="#B7839B" strokeWidth="3" strokeLinejoin="round" />
      </>}
      {kind === 'mountain' && <>
        <circle cx="39" cy="35" r="13" fill="#FFE1A3" />
        <path d="m25 115 57-85 62 85H25Z" fill="#82AFB8" stroke="#608E9E" strokeWidth="3" strokeLinejoin="round" />
        <path d="m57 67 25-37 28 39-20-8-11 13-10-14-12 7Z" fill="#F7FCFC" />
        <path d="m100 115 27-43 31 43h-58Z" fill="#B6CDD0" stroke="#8EAFB4" strokeWidth="3" strokeLinejoin="round" />
        <path d="M18 121h144" stroke="#9FBBB2" strokeWidth="4" strokeLinecap="round" />
      </>}
    </svg>
  );
}
