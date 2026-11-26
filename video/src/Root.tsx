import React from 'react';
import {
  Composition, AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing,
  staticFile, delayRender, continueRender,
} from 'remotion';
import props from '../public/props.json';
import {Carrusel} from './Carousel';
import {Overlay, SideCar, Flag, Helmet, Trophy, clamp01, easeOut} from './Sprites';

const BG = '#0B0D10';
const AMBER = '#FFC400';
const WHITE = '#F5F7FA';
const GRAY = '#8A949E';
const DIM = '#5C646E';
const BAR = '#606974';
const PANEL = '#181C22';

const useFonts = () => {
  const [h] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    const defs: [string, string, string][] = [
      ['Anton', 'Anton-Regular.ttf', '400'],
      ['InterXB', 'Inter-ExtraBold.otf', '800'],
      ['InterSB', 'Inter-SemiBold.otf', '600'],
    ];
    Promise.all(defs.map(async ([n, f, w]) => {
      const ff = new FontFace(n, `url(${staticFile(f)})`, {weight: w});
      await ff.load();
      (document as any).fonts.add(ff);
    })).then(() => continueRender(h));
  }, [h]);
};

const A = 'Anton, Impact, sans-serif';
const XB = 'InterXB, sans-serif';
const SB = 'InterSB, sans-serif';

const ease = Easing.out(Easing.cubic);
const prog = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

// t en segundos dentro de la escena
const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};

const Text: React.FC<{
  x?: number; y: number; size: number; color?: string; font?: string; align?: 'center' | 'left' | 'right';
  spacing?: number; a?: number; dy?: number; children: React.ReactNode; w?: number;
}> = ({x = 540, y, size, color = WHITE, font = A, align = 'center', spacing = 0, a = 1, dy = 0, children, w = 1000}) => {
  const left = align === 'center' ? x - w / 2 : align === 'left' ? x : x - w;
  return (
    <div style={{
      position: 'absolute', left, top: y + dy, width: w, textAlign: align, fontFamily: font, fontSize: size,
      color, letterSpacing: spacing, opacity: a, lineHeight: 1, transform: 'translateY(-50%)', whiteSpace: 'nowrap',
    }}>{children}</div>
  );
};

const Stage: React.FC<{dur: number; footer?: boolean; first?: boolean; children: React.ReactNode}> = ({dur, footer = true, first = false, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const fadeIn = interpolate(t, [0, 0.18], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(f, [dur - 5, dur], [1, 0], {extrapolateLeft: 'clamp'});
  const o = first && f === 0 ? 1 : Math.min(fadeIn, fadeOut);
  const off = (t * 90) % 220;
  const lines = [];
  for (let i = -10; i < 14; i++) {
    const x = i * 220 + off;
    lines.push(<line key={i} x1={x} y1={0} x2={x - 700} y2={1920} stroke="#13161B" strokeWidth={3} />);
  }
  return (
    <AbsoluteFill style={{background: BG, opacity: o}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>{lines}</svg>
      <Text y={262} size={32} color={GRAY} font={XB} spacing={9}>MOTOR SPECS</Text>
      <div style={{position: 'absolute', left: 480, top: 296, width: 120, height: 5, background: AMBER}} />
      {children}
      {footer && <Text y={1490} size={28} color={DIM} font={SB} a={prog(t, 0.5, 1.0)}>
        Datos: GP de Ciudad de México 2026 · F1
      </Text>}
    </AbsoluteFill>
  );
};

// ---------- Escena 1 ----------
const S1: React.FC<{dur: number}> = ({dur}) => {
  const f0 = useCurrentFrame();
  const t0 = useT();
  const t = f0 === 0 ? 9 : t0; // cuadro 0 = portada (estado final); IG lo usa como cover
  
  const n = Math.round(20 * prog(t, 0.3, 1.4));
  const pop = 1 + 0.05 * Math.sin(interpolate(t, [1.4, 1.8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * Math.PI);
  return (
    <Stage dur={dur} footer={false} first>
      <Text y={520} dy={(1 - prog(t, 0.1, 0.5)) * 40} size={50} color={GRAY} font={XB} spacing={10} a={prog(t, 0.1, 0.5)}>KIMI ANTONELLI</Text>
      <Text y={640} dy={(1 - prog(t, 0.25, 0.65)) * 40} size={120} spacing={8} a={prog(t, 0.25, 0.65)}>A LOS</Text>
      <Text y={950} size={500 * pop} color={AMBER}>{n}</Text>
      <Text y={1300} dy={(1 - prog(t, 1.2, 1.7)) * 40} size={150} spacing={12} a={prog(t, 1.2, 1.7)}>AÑOS</Text>
      <Text y={1420} dy={(1 - prog(t, 1.7, 2.2)) * 40} size={56} color={AMBER} font={XB} spacing={4} a={prog(t, 1.7, 2.2)}>Y 68 DÍAS · CAMPEÓN DE F1</Text>
      <Overlay a={clamp01(t, 0.3, 0.6)}><SideCar x={-260 + 1700 * easeOut(t, 0.4, 3.0)} y={1680} s={0.8} t={t} /></Overlay>
    </Stage>
  );
};

// ---------- Escena 2: tabla del campeonato ----------
const DRIVERS: [string, number][] = [
  ['ANTONELLI', 380], ['VERSTAPPEN', 261], ['HAMILTON', 259], ['RUSSELL', 250],
  ['LECLERC', 245], ['NORRIS', 221], ['PIASTRI', 150],
];
const S2: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  return (
    <Stage dur={dur} footer={false}>
      <Text y={455} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={84} spacing={4} a={prog(t, 0.05, 0.45)}>ASÍ QUEDÓ EL MUNDIAL</Text>
      <Text y={535} size={34} color={GRAY} font={XB} spacing={7} a={prog(t, 0.2, 0.6)}>TRAS EL GP DE MÉXICO · PUNTOS</Text>
      {DRIVERS.map(([name, pts], i) => {
        const s0 = 0.5 + i * 0.22;
        const a = prog(t, s0, s0 + 0.3);
        const g = prog(t, s0 + 0.05, s0 + 1.1);
        const y = 665 + i * 118;
        const champ = i === 0;
        const w = 520 * (pts / 380) * g;
        return (
          <React.Fragment key={name}>
            <Text x={90} y={y} size={36} font={XB} spacing={3} align="left" w={300} color={champ ? WHITE : GRAY} a={a}>{name}</Text>
            <div style={{position: 'absolute', left: 390, top: y - 28, width: 520, height: 56, borderRadius: 14, background: PANEL, opacity: a}} />
            <div style={{position: 'absolute', left: 390, top: y - 28, width: Math.max(0, w), height: 56, borderRadius: 14, background: champ ? AMBER : BAR}} />
            <Text x={390 + w + 14} y={y} size={52} align="left" w={160} color={champ ? AMBER : WHITE} a={a}>{Math.round(pts * g)}</Text>
          </React.Fragment>
        );
      })}
      <Text y={1530} dy={(1 - prog(t, 2.6, 3.1)) * 30} size={44} color={AMBER} font={XB} spacing={3} a={prog(t, 2.6, 3.1)}>+119 PUNTOS SOBRE VERSTAPPEN</Text>
      <Overlay a={clamp01(t, 3.0, 3.4)}><Flag x={440} y={1600} t={t} s={0.85} /></Overlay>
    </Stage>
  );
};

// ---------- Escena 3: 365 + 15 = 380 ----------
const S3: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  const n1 = Math.round(365 * prog(t, 0.3, 1.3));
  const lineW = 700 * prog(t, 2.3, 2.8);
  const n3 = Math.round(365 + 15 * prog(t, 2.9, 3.4));
  return (
    <Stage dur={dur} footer={false}>
      <Text y={480} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={46} color={GRAY} font={XB} spacing={6} a={prog(t, 0.05, 0.45)}>LLEGÓ A MÉXICO CON</Text>
      <Text y={690} size={280} color={WHITE} a={prog(t, 0.2, 0.5)}>{n1}</Text>
      <Text y={985} dy={(1 - prog(t, 1.6, 2.1)) * 40} size={280} color={AMBER} a={prog(t, 1.6, 2.1)}>+15</Text>
      <Text y={1150} dy={(1 - prog(t, 1.9, 2.3)) * 20} size={40} color={GRAY} font={XB} spacing={5} a={prog(t, 1.9, 2.3)}>POR TERMINAR 3.º</Text>
      <div style={{position: 'absolute', left: 540 - lineW / 2, top: 1210, width: lineW, height: 8, background: AMBER, borderRadius: 4}} />
      <Text y={1370} size={280} color={AMBER} a={prog(t, 2.7, 3.0)}>{n3}</Text>
      <Text y={1530} size={28} color={DIM} font={SB} a={prog(t, 3.0, 3.5)}>Datos: GP de Ciudad de México 2026 · F1</Text>
      <Overlay a={clamp01(t, 1.2, 1.5)}>
        <SideCar x={620 + 70 * clamp01(t, 1.5, 6)} y={1625} s={0.55} t={t} body={BAR} accent={GRAY} />
        <SideCar x={-260 + 1100 * easeOut(t, 1.8, 4.6)} y={1745} s={0.55} t={t} body={AMBER} accent={WHITE} />
      </Overlay>
    </Stage>
  );
};

// ---------- Escena 4: el más joven ----------
const S4: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  const bars: [string, number, string, string, number, number][] = [
    ['ANTONELLI · 2026', 20, AMBER, '#0B0D10', 920, 0.6],
    ['VETTEL · 2010', 23, BAR, WHITE, 1200, 1.3],
  ];
  return (
    <Stage dur={dur}>
      <Text y={470} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={100} spacing={4} a={prog(t, 0.05, 0.45)}>EL CAMPEÓN MÁS JOVEN</Text>
      <Text y={585} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={100} color={AMBER} spacing={4} a={prog(t, 0.05, 0.45)}>DE LA HISTORIA</Text>
      {bars.map(([label, age, col, tcol, y, s0]) => {
        const a = prog(t, s0, s0 + 0.35);
        const g = prog(t, s0 + 0.1, s0 + 1.2);
        const w = 900 * age / 25 * g;
        return (
          <React.Fragment key={label}>
            <Text x={90} y={y - 95} size={44} font={XB} spacing={4} align="left" color={col === AMBER ? WHITE : GRAY} a={a}>{label}</Text>
            <div style={{position: 'absolute', left: 90, top: y - 55, width: Math.max(0, w), height: 130, borderRadius: 14, background: col}} />
            {w > 260 && <Text x={90 + w - 40} y={y + 10} size={100} align="right" w={400} color={tcol}>{Math.round(age * g)} años</Text>}
          </React.Fragment>
        );
      })}
      <Text y={1405} dy={(1 - prog(t, 2.8, 3.3)) * 30} size={44} color={AMBER} font={XB} a={prog(t, 2.8, 3.3)}>Récord anterior: Vettel, 23 años</Text>
      <Overlay a={clamp01(t, 3.1, 3.6)}><Helmet x={540} y={1650} t={t} s={1.1} /></Overlay>
    </Stage>
  );
};

// ---------- Escena 5: 73 años ----------
const S5: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  const n = Math.round(73 * prog(t, 0.3, 1.9));
  const p = prog(t, 2.2, 3.6);
  const x0 = 170, x1 = 910, y = 1345;
  const a2 = prog(t, 3.55, 3.95);
  return (
    <Stage dur={dur} footer={false}>
      <Text y={470} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={76} spacing={4} a={prog(t, 0.05, 0.45)}>PRIMER CAMPEÓN ITALIANO EN</Text>
      <Text y={850} size={560} color={AMBER}>{n}</Text>
      <Text y={1190} dy={(1 - prog(t, 1.5, 2.0)) * 40} size={170} spacing={14} a={prog(t, 1.5, 2.0)}>AÑOS</Text>
      <div style={{position: 'absolute', left: x0 - 16, top: y - 16, width: 32, height: 32, borderRadius: 16, background: GRAY, opacity: prog(t, 2.0, 2.4)}} />
      <Text x={x0} y={y + 55} size={54} a={prog(t, 2.0, 2.4)}>1953</Text>
      <Text x={x0} y={y + 108} size={32} color={GRAY} font={XB} spacing={5} a={prog(t, 2.0, 2.4)}>ASCARI</Text>
      <div style={{position: 'absolute', left: x0, top: y - 4, width: (x1 - x0) * p, height: 8, background: AMBER, borderRadius: 4}} />
      <div style={{position: 'absolute', left: x1 - 16, top: y - 16, width: 32, height: 32, borderRadius: 16, background: AMBER, opacity: a2}} />
      <Text x={x1} y={y + 55} size={54} color={AMBER} a={a2}>2026</Text>
      <Text x={x1} y={y + 108} size={32} font={XB} spacing={5} a={a2}>ANTONELLI</Text>
      <Overlay a={clamp01(t, 2.0, 2.4)}><SideCar x={x0 + (x1 - x0) * p} y={y - 14} s={0.5} t={t} body={AMBER} accent={WHITE} lines={p < 0.99} /></Overlay>
    </Stage>
  );
};

// ---------- Escena 6: constructores + cierre ----------
const TEAMS: [string, number, string][] = [
  ['MERCEDES', 630, 'mercedes'], ['FERRARI', 504, 'ferrari'], ['RED BULL', 380, 'redbull'], ['MCLAREN', 371, 'mclaren'],
];
const S6: React.FC<{dur: number; logos: Record<string, string>}> = ({dur, logos}) => {
  const t = useT();
  return (
    <Stage dur={dur} footer={false}>
      <Text y={455} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={84} spacing={4} a={prog(t, 0.05, 0.45)}>CONSTRUCTORES</Text>
      <Text y={535} size={34} color={GRAY} font={XB} spacing={7} a={prog(t, 0.2, 0.6)}>TRAS EL GP DE MÉXICO · PUNTOS</Text>
      {TEAMS.map(([name, pts, key], i) => {
        const s0 = 0.5 + i * 0.3;
        const a = prog(t, s0, s0 + 0.3);
        const g = prog(t, s0 + 0.05, s0 + 1.1);
        const y = 700 + i * 150;
        const champ = i === 0;
        const w = 520 * (pts / 630) * g;
        const logo = logos[key];
        const nameX = logo ? 200 : 90;
        return (
          <React.Fragment key={name}>
            {logo && <img src={staticFile(logo)} style={{position: 'absolute', left: 90, top: y - 48, width: 96, height: 96, objectFit: 'contain', opacity: a}} />}
            <Text x={nameX} y={y - 52} size={34} font={XB} spacing={3} align="left" w={500} color={champ ? WHITE : GRAY} a={a}>{name}</Text>
            <div style={{position: 'absolute', left: nameX, top: y - 12, width: 520, height: 44, borderRadius: 12, background: PANEL, opacity: a}} />
            <div style={{position: 'absolute', left: nameX, top: y - 12, width: Math.max(0, w), height: 44, borderRadius: 12, background: champ ? AMBER : BAR}} />
            <Text x={nameX + w + 14} y={y + 10} size={52} align="left" w={200} color={champ ? AMBER : WHITE} a={a}>{Math.round(pts * g)}</Text>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: 140, top: 1355, width: 800, height: 105, borderRadius: 52, background: AMBER, opacity: prog(t, 2.4, 2.9)}} />
      <Text y={1408} size={35} color={BG} font={XB} spacing={2} a={prog(t, 2.4, 2.9)}>SÍGUENOS EN MOTOR SPECS</Text>
      <Text y={1490} size={28} color={DIM} font={SB} a={prog(t, 0.5, 1.0)}>Datos: GP de Ciudad de México 2026 · F1</Text>
      <Overlay a={clamp01(t, 3.0, 3.4)}><Trophy x={540} y={1700} t={t} s={1.0} /></Overlay>
    </Stage>
  );
};

const V2: React.FC<{logos: Record<string, string>}> = ({logos}) => {
  useFonts();
  const d = props.durFrames;
  const starts = d.map((_, i) => d.slice(0, i).reduce((a, b) => a + b, 0));
  const scenes = [S1, S2, S3, S4, S5, S6];
  return (
    <AbsoluteFill style={{background: BG}}>
      {scenes.map((S, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={d[i]}>
          <S dur={d[i]} logos={logos} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const total = props.durFrames.reduce((a, b) => a + b, 0);
export const Root: React.FC = () => (
  <>
  <Composition id="Carrusel" component={Carrusel as any} durationInFrames={1} fps={30} width={1080} height={1350}
    defaultProps={{i: 0, slides: [] as any[]}} />
  <Composition id="V2" component={V2 as any} durationInFrames={total} fps={30} width={1080} height={1920}
    defaultProps={{logos: {} as Record<string, string>}} />
  </>
);
