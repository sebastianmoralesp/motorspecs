import React from 'react';
import {Easing, interpolate} from 'remotion';

// Sprites tipo "PNG recortado": sin fondo ni marco, en la paleta del video, para que el board no se rompa.
const AMBER = '#FFC400', WHITE = '#F5F7FA', GRAY = '#8A949E', BAR = '#606974', DARK = '#0B0D10';
const mod = (n: number, m: number) => ((n % m) + m) % m;
export const clamp01 = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
export const easeOut = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const Overlay: React.FC<{a?: number; children: React.ReactNode}> = ({a = 1, children}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: a}}>{children}</svg>
);

// Coche genérico de perfil. (x,y) = centro y suelo (base de las ruedas).
export const SideCar: React.FC<{x: number; y: number; s?: number; t: number; body?: string; accent?: string; lines?: boolean}> =
({x, y, s = 0.5, t, body = GRAY, accent = WHITE, lines = true}) => {
  const rot = t * 700;
  const wheel = (cx: number) => (
    <g transform={`translate(${cx},104) rotate(${rot})`}>
      <circle r={34} fill="#2A3038" />
      <circle r={34} fill="none" stroke={BAR} strokeWidth={5} />
      <circle r={10} fill={body} />
      <line x1={-24} y1={0} x2={24} y2={0} stroke={BAR} strokeWidth={5} />
      <line x1={0} y1={-24} x2={0} y2={24} stroke={BAR} strokeWidth={5} />
    </g>
  );
  const ln = [];
  if (lines) {
    for (let i = 0; i < 3; i++) {
      const ph = mod(t * 3 + i * 0.33, 1);
      ln.push(<line key={i} x1={-30 - ph * 60} y1={55 + i * 22} x2={-90 - ph * 140} y2={55 + i * 22} stroke={WHITE} strokeOpacity={0.35 * (1 - ph)} strokeWidth={6} strokeLinecap="round" />);
    }
  }
  return (
    <g transform={`translate(${x},${y}) scale(${s}) translate(-200,-138)`}>
      {ln}
      <rect x={0} y={38} width={42} height={9} rx={2} fill={accent} />
      <path d="M20 47 L30 84" stroke={BAR} strokeWidth={5} fill="none" />
      <path d="M20 105 L60 70 L170 60 L230 40 L290 62 L360 88 L395 100 L395 112 L20 112 Z" fill={body} />
      <rect x={362} y={108} width={40} height={10} rx={2} fill={accent} />
      <path d="M214 46 Q250 12 288 52" fill="none" stroke={BAR} strokeWidth={6} />
      <circle cx={246} cy={40} r={13} fill={WHITE} />
      {wheel(80)}
      {wheel(320)}
    </g>
  );
};

// Bandera de cuadros ondeando.
export const Flag: React.FC<{x: number; y: number; t: number; s?: number}> = ({x, y, t, s = 1}) => {
  const cells = [];
  for (let c = 0; c < 6; c++) for (let r = 0; r < 4; r++) {
    const dy = Math.sin(c * 0.9 - t * 9) * 9 * (c / 5);
    cells.push(<rect key={`${c}-${r}`} x={c * 36} y={r * 36 + dy} width={37} height={37} fill={(c + r) % 2 ? WHITE : DARK} stroke={BAR} strokeWidth={1} />);
  }
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-8} y={-10} width={10} height={210} rx={4} fill={GRAY} />
      <g transform="translate(2,0)">{cells}</g>
    </g>
  );
};

// Casco genérico (visor oscuro, franja ámbar) con destellos.
export const Helmet: React.FC<{x: number; y: number; t: number; s?: number}> = ({x, y, t, s = 1}) => {
  const bob = Math.sin(t * 5) * 7;
  const star = (cx: number, cy: number, r: number, ph: number) => {
    const k = 0.5 + 0.5 * Math.sin(t * 6 + ph);
    const rr = r * k;
    return <path key={ph} d={`M${cx} ${cy - rr} L${cx + rr * 0.28} ${cy - rr * 0.28} L${cx + rr} ${cy} L${cx + rr * 0.28} ${cy + rr * 0.28} L${cx} ${cy + rr} L${cx - rr * 0.28} ${cy + rr * 0.28} L${cx - rr} ${cy} L${cx - rr * 0.28} ${cy - rr * 0.28} Z`} fill={AMBER} />;
  };
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {star(-150, -40, 26, 0)}{star(160, -70, 20, 2)}{star(-110, 60, 16, 4)}{star(130, 50, 24, 1)}
      <g transform={`translate(0,${bob})`}>
        <circle r={78} fill={WHITE} />
        <path d="M-78 -8 A78 78 0 0 1 78 -8 Z" fill={AMBER} opacity={0.0} />
        <path d="M-66 -34 Q0 -62 66 -34 L70 -14 Q0 -36 -70 -14 Z" fill={AMBER} />
        <path d="M-8 -12 Q70 -14 76 24 Q70 54 -8 50 Q-28 20 -8 -12 Z" fill="#1B2330" />
        <path d="M6 4 L52 0" stroke={GRAY} strokeWidth={5} strokeLinecap="round" />
        <path d="M-60 70 Q0 96 60 70 L52 92 Q0 112 -52 92 Z" fill={BAR} />
      </g>
    </g>
  );
};

// Trofeo con confeti.
export const Trophy: React.FC<{x: number; y: number; t: number; s?: number}> = ({x, y, t, s = 1}) => {
  const bounce = Math.abs(Math.sin(t * 4)) * 14;
  const conf = [];
  for (let i = 0; i < 18; i++) {
    const cx = ((i * 83) % 560) - 280;
    const cy = mod(i * 47 + t * 120, 220) - 150;
    conf.push(<rect key={i} x={cx} y={cy} width={13} height={8} fill={[AMBER, WHITE, GRAY][i % 3]} transform={`rotate(${(i * 40 + t * 220) % 360} ${cx} ${cy})`} />);
  }
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {conf}
      <g transform={`translate(0,${-bounce})`}>
        <path d="M-60 -120 L60 -120 L44 -40 Q0 -4 -44 -40 Z" fill={AMBER} />
        <path d="M-60 -108 Q-104 -104 -72 -62 M60 -108 Q104 -104 72 -62" fill="none" stroke={AMBER} strokeWidth={10} strokeLinecap="round" />
        <rect x={-9} y={-6} width={18} height={34} fill={AMBER} />
        <rect x={-46} y={28} width={92} height={22} rx={5} fill={AMBER} />
        <path d="M-34 -108 L-26 -56" stroke={WHITE} strokeOpacity={0.5} strokeWidth={8} strokeLinecap="round" />
      </g>
    </g>
  );
};
