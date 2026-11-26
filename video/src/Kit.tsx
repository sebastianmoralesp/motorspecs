import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile, delayRender, continueRender} from 'remotion';

// Utilidades compartidas por los videos (misma estética que Root.tsx / V2).
export const BG = '#0B0D10', AMBER = '#FFC400', WHITE = '#F5F7FA', GRAY = '#8A949E', DIM = '#5C646E', BAR = '#606974', PANEL = '#181C22';
export const A = 'Anton, Impact, sans-serif', XB = 'InterXB, sans-serif', SB = 'InterSB, sans-serif';

export const useFonts = () => {
  const [h] = React.useState(() => delayRender('fonts-kit'));
  React.useEffect(() => {
    const defs: [string, string, string][] = [['Anton', 'Anton-Regular.ttf', '400'], ['InterXB', 'Inter-ExtraBold.otf', '800'], ['InterSB', 'Inter-SemiBold.otf', '600']];
    Promise.all(defs.map(async ([n, f, w]) => {
      const ff = new FontFace(n, `url(${staticFile(f)})`, {weight: w});
      await ff.load();
      (document as any).fonts.add(ff);
    })).then(() => continueRender(h));
  }, [h]);
};

const ease = Easing.out(Easing.cubic);
export const prog = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
export const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return f / fps; };

export const Text: React.FC<{
  x?: number; y: number; size: number; color?: string; font?: string; align?: 'center' | 'left' | 'right';
  spacing?: number; a?: number; dy?: number; children: React.ReactNode; w?: number;
}> = ({x = 540, y, size, color = WHITE, font = A, align = 'center', spacing = 0, a = 1, dy = 0, children, w = 1000}) => {
  const left = align === 'center' ? x - w / 2 : align === 'left' ? x : x - w;
  return (
    <div style={{position: 'absolute', left, top: y + dy, width: w, textAlign: align, fontFamily: font, fontSize: size,
      color, letterSpacing: spacing, opacity: a, lineHeight: 1, transform: 'translateY(-50%)', whiteSpace: 'nowrap'}}>{children}</div>
  );
};

export const Stage: React.FC<{dur: number; footer?: string; first?: boolean; children: React.ReactNode}> = ({dur, footer, first = false, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const fadeIn = interpolate(t, [0, 0.18], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(f, [dur - 5, dur], [1, 0], {extrapolateLeft: 'clamp'});
  const o = first && f === 0 ? 1 : Math.min(fadeIn, fadeOut);
  const off = (t * 90) % 220;
  const lines = [];
  for (let i = -10; i < 14; i++) { const x = i * 220 + off; lines.push(<line key={i} x1={x} y1={0} x2={x - 700} y2={1920} stroke="#13161B" strokeWidth={3} />); }
  return (
    <AbsoluteFill style={{background: BG, opacity: o}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>{lines}</svg>
      <Text y={262} size={32} color={GRAY} font={XB} spacing={9}>MOTOR SPECS</Text>
      <div style={{position: 'absolute', left: 480, top: 296, width: 120, height: 5, background: AMBER}} />
      {children}
      {footer && <Text y={1490} size={28} color={DIM} font={SB} a={prog(t, 0.5, 1.0)}>{footer}</Text>}
    </AbsoluteFill>
  );
};

export const Card: React.FC<{x: number; y: number; w: number; h: number; a?: number}> = ({x, y, w, h, a = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 20, background: PANEL, borderTop: `6px solid ${AMBER}`, opacity: a}} />
);

// Avión genérico de perfil (silueta propia, sin librea ni marca). (x,y) = centro.
export const Jet: React.FC<{x: number; y: number; s?: number; t?: number}> = ({x, y, s = 1, t = 0}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => {
      const ph = (t * 3 + i * 0.33) % 1;
      return <line key={i} x1={-150 - ph * 50} y1={-8 + i * 14} x2={-210 - ph * 120} y2={-8 + i * 14} stroke={WHITE} strokeOpacity={0.35 * (1 - ph)} strokeWidth={6} strokeLinecap="round" />;
    })}
    <path d="M-150 6 L-40 -10 L150 -6 L250 6 L150 18 L-40 18 Z" fill={GRAY} />
    <path d="M-150 6 L-170 -48 L-120 -48 L-60 -8 Z" fill={BAR} />
    <path d="M-10 14 L-90 70 L-30 70 L70 16 Z" fill={BAR} />
    <path d="M150 -6 L200 -2 L220 6 L150 8 Z" fill={AMBER} />
    <circle cx={-110} cy={14} r={9} fill={AMBER} opacity={0.6 + 0.4 * Math.sin(t * 12)} />
  </g>
);
