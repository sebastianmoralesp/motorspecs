import React from 'react';
import {
  Composition, AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing,
  staticFile, delayRender, continueRender,
} from 'remotion';
import props from '../public/props.json';
import {Carrusel} from './Carousel';
import {BoomVideo, boomTotal} from './BoomVideo';
import {V8Video, v8Total} from './V8Video';
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
        Datos: Britannica · Mazda · Le Mans 1991
      </Text>}
    </AbsoluteFill>
  );
};

// ---------- Rotor (sprite animado): rotor triangular + cámara epitrocoide ----------
const Rotor: React.FC<{x: number; y: number; t: number; s?: number; rps?: number}> = ({x, y, t, s = 1, rps = 0.7}) => {
  const R = 330, e = 55;
  const phi = t * rps * Math.PI * 2; // giro del eje de salida
  const hp: string[] = [];
  for (let k = 0; k <= 360; k++) {
    const p = (k / 360) * 6 * Math.PI;
    hp.push(`${k === 0 ? 'M' : 'L'}${(e * Math.cos(p) + R * Math.cos(p / 3)).toFixed(1)},${(e * Math.sin(p) + R * Math.sin(p / 3)).toFixed(1)}`);
  }
  const cx = e * Math.cos(phi), cy = e * Math.sin(phi);
  const ap = [0, 1, 2].map((k) => {
    const a = phi / 3 + (k * 2 * Math.PI) / 3;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a), a] as [number, number, number];
  });
  let d = '';
  let best = 0, bestScore = -9;
  for (let k = 0; k < 3; k++) {
    const [x0, y0] = ap[k];
    const [x1, y1, a1] = ap[(k + 1) % 3];
    const am = ap[k][2] + Math.PI / 3;
    const qx = cx + 0.62 * R * Math.cos(am), qy = cy + 0.62 * R * Math.sin(am);
    d += `${k === 0 ? 'M' : 'L'}${x0.toFixed(1)},${y0.toFixed(1)} Q${qx.toFixed(1)},${qy.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} `;
    const score = -Math.sin(am); // cara que mira hacia arriba (bujías)
    if (score > bestScore) { bestScore = score; best = k; }
  }
  const am = ap[best][2] + Math.PI / 3;
  const gx = cx + 0.74 * R * Math.cos(am), gy = cy + 0.74 * R * Math.sin(am);
  const pulse = 0.45 + 0.35 * Math.sin(t * 9);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={hp.join(' ')} fill="none" stroke={BAR} strokeWidth={9} strokeLinejoin="round" />
      <path d={d + 'Z'} fill={PANEL} stroke={AMBER} strokeWidth={8} strokeLinejoin="round" />
      <circle cx={gx} cy={gy} r={52} fill={AMBER} opacity={pulse * (0.4 + 0.6 * clamp01(bestScore, 0.2, 0.9))} />
      <line x1={0} y1={0} x2={cx} y2={cy} stroke={AMBER} strokeWidth={9} strokeLinecap="round" />
      <circle cx={0} cy={0} r={20} fill={GRAY} />
      <circle cx={cx} cy={cy} r={22} fill={AMBER} />
      <circle cx={cx} cy={cy} r={8} fill={BG} />
    </g>
  );
};

const Dial: React.FC<{x: number; y: number; r: number; ang: number; col: string}> = ({x, y, r, ang, col}) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r} fill={PANEL} stroke={BAR} strokeWidth={8} />
    <line x1={0} y1={0} x2={(r - 18) * Math.sin((ang * Math.PI) / 180)} y2={-(r - 18) * Math.cos((ang * Math.PI) / 180)} stroke={col} strokeWidth={12} strokeLinecap="round" />
    <circle r={14} fill={col} />
    <circle r={6} cy={-r + 14} fill={GRAY} />
  </g>
);

// ---------- Escena 1: gancho ----------
const S1: React.FC<{dur: number}> = ({dur}) => {
  const f0 = useCurrentFrame();
  const t0 = useT();
  const t = f0 === 0 ? 9 : t0; // cuadro 0 = portada (estado final); IG lo usa como cover
  const n = Math.round(9 * (1 - prog(t, 0.3, 1.4)));
  const pop = 1 + 0.05 * Math.sin(interpolate(t, [1.4, 1.8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * Math.PI);
  return (
    <Stage dur={dur} footer={false} first>
      <Text y={520} dy={(1 - prog(t, 0.1, 0.5)) * 40} size={50} color={GRAY} font={XB} spacing={10} a={prog(t, 0.1, 0.5)}>ASÍ FUNCIONA EL</Text>
      <Text y={645} dy={(1 - prog(t, 0.25, 0.65)) * 40} size={128} spacing={6} a={prog(t, 0.25, 0.65)}>MOTOR ROTATIVO</Text>
      <Text y={1010} size={520 * pop} color={AMBER}>{n}</Text>
      <Text y={1340} dy={(1 - prog(t, 1.2, 1.7)) * 40} size={150} spacing={12} a={prog(t, 1.2, 1.7)}>PISTONES</Text>
      <Text y={1440} dy={(1 - prog(t, 1.7, 2.2)) * 40} size={52} color={AMBER} font={XB} spacing={4} a={prog(t, 1.7, 2.2)}>NI BIELAS NI VÁLVULAS</Text>
    </Stage>
  );
};

// ---------- Escena 2: el rotor ----------
const CHIPS = ['ADMISIÓN', 'COMPRESIÓN', 'EXPLOSIÓN', 'ESCAPE'];
const S2: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  const act = Math.floor(t / 0.9) % 4;
  return (
    <Stage dur={dur}>
      <Text y={455} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={84} spacing={4} a={prog(t, 0.05, 0.45)}>UN ROTOR TRIANGULAR</Text>
      <Text y={535} size={34} color={GRAY} font={XB} spacing={7} a={prog(t, 0.2, 0.6)}>3 CÁMARAS · 4 TIEMPOS</Text>
      <Overlay a={prog(t, 0.3, 0.9)}><Rotor x={540} y={930} t={t} s={1.0} /></Overlay>
      {CHIPS.map((c, i) => (
        <React.Fragment key={c}>
          <div style={{position: 'absolute', left: 60 + i * 242, top: 1330, width: 226, height: 74, borderRadius: 37, background: i === act ? AMBER : PANEL, opacity: prog(t, 0.8 + i * 0.12, 1.2 + i * 0.12)}} />
          <Text x={60 + i * 242 + 113} y={1368} size={25} font={XB} spacing={1} w={226} color={i === act ? BG : GRAY} a={prog(t, 0.8 + i * 0.12, 1.2 + i * 0.12)}>{c}</Text>
        </React.Fragment>
      ))}
    </Stage>
  );
};

// ---------- Escena 3: 1 vuelta del rotor = 3 del eje ----------
const S3: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  const g = prog(t, 0.5, 3.6);
  const eje = 3 * g;
  return (
    <Stage dur={dur}>
      <Text y={470} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={46} color={GRAY} font={XB} spacing={6} a={prog(t, 0.05, 0.45)}>RELACIÓN ROTOR : EJE</Text>
      <Text y={650} size={250} color={AMBER} a={prog(t, 0.2, 0.6)}>1 : 3</Text>
      <Overlay a={prog(t, 0.3, 0.7)}>
        <Dial x={300} y={1010} r={150} ang={360 * g} col={WHITE} />
        <Dial x={780} y={1010} r={150} ang={360 * eje} col={AMBER} />
      </Overlay>
      <Text x={300} y={1230} size={34} font={XB} spacing={4} color={GRAY} w={400} a={prog(t, 0.5, 0.9)}>ROTOR</Text>
      <Text x={300} y={1290} size={70} w={400} a={prog(t, 0.5, 0.9)}>{g.toFixed(1)} vueltas</Text>
      <Text x={780} y={1230} size={34} font={XB} spacing={4} color={GRAY} w={400} a={prog(t, 0.5, 0.9)}>EJE DE SALIDA</Text>
      <Text x={780} y={1290} size={70} color={AMBER} w={400} a={prog(t, 0.5, 0.9)}>{eje.toFixed(1)} vueltas</Text>
      <Text y={1400} dy={(1 - prog(t, 3.2, 3.7)) * 30} size={46} color={AMBER} font={XB} spacing={2} a={prog(t, 3.2, 3.7)}>UNA EXPLOSIÓN POR VUELTA DEL EJE</Text>
    </Stage>
  );
};

// ---------- Escena 4: Le Mans 1991 ----------
const S4: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  const stats: [string, string][] = [['4', 'ROTORES'], ['700', 'PS'], ['362', 'VUELTAS']];
  return (
    <Stage dur={dur}>
      <Text y={470} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={50} color={GRAY} font={XB} spacing={8} a={prog(t, 0.05, 0.45)}>24 HORAS DE LE MANS</Text>
      <Text y={680} size={330} color={AMBER} a={prog(t, 0.2, 0.6)}>1991</Text>
      <Text y={870} size={100} spacing={4} a={prog(t, 0.6, 1.0)}>MAZDA 787B</Text>
      {stats.map(([v, l], i) => {
        const a = prog(t, 1.0 + i * 0.3, 1.4 + i * 0.3);
        const cx = 210 + i * 330;
        return (
          <React.Fragment key={l}>
            <div style={{position: 'absolute', left: cx - 140, top: 990, width: 280, height: 250, borderRadius: 20, background: PANEL, borderTop: `6px solid ${AMBER}`, opacity: a}} />
            <Text x={cx} y={1100} size={130} color={AMBER} w={280} a={a}>{v}</Text>
            <Text x={cx} y={1195} size={32} font={XB} spacing={3} color={GRAY} w={280} a={a}>{l}</Text>
          </React.Fragment>
        );
      })}
      <Overlay a={clamp01(t, 0.4, 0.7)}><SideCar x={-260 + 1700 * easeOut(t, 0.5, 4.2)} y={1700} s={0.8} t={t} body={AMBER} accent={WHITE} /></Overlay>
    </Stage>
  );
};

// ---------- Escena 5: único rotativo ----------
const S5: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  return (
    <Stage dur={dur}>
      <Text y={470} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={92} spacing={4} a={prog(t, 0.05, 0.45)}>PRIMER JAPONÉS</Text>
      <Text y={575} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={92} spacing={4} a={prog(t, 0.05, 0.45)}>EN GANAR LE MANS</Text>
      <Text y={850} dy={(1 - prog(t, 1.2, 1.7)) * 40} size={150} color={AMBER} spacing={4} a={prog(t, 1.2, 1.7)}>EL ÚNICO</Text>
      <Text y={990} dy={(1 - prog(t, 1.4, 1.9)) * 40} size={150} color={AMBER} spacing={4} a={prog(t, 1.4, 1.9)}>ROTATIVO</Text>
      <Text y={1180} size={44} color={GRAY} font={XB} spacing={2} a={prog(t, 3.0, 3.6)}>Al año siguiente, las reglas</Text>
      <Text y={1245} size={44} color={GRAY} font={XB} spacing={2} a={prog(t, 3.0, 3.6)}>solo admitieron pistones</Text>
      <Overlay a={clamp01(t, 0.8, 1.2)}><Trophy x={540} y={1700} t={t} s={1.0} /></Overlay>
    </Stage>
  );
};

// ---------- Escena 6: cierre ----------
const S6: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  return (
    <Stage dur={dur}>
      <Text y={600} dy={(1 - prog(t, 0.05, 0.5)) * 30} size={110} spacing={4} a={prog(t, 0.05, 0.5)}>SIN PISTONES,</Text>
      <Text y={730} dy={(1 - prog(t, 0.2, 0.65)) * 30} size={110} color={AMBER} spacing={4} a={prog(t, 0.2, 0.65)}>CON HISTORIA</Text>
      <Overlay a={prog(t, 0.3, 0.9)}><Rotor x={540} y={1070} t={t} s={0.45} /></Overlay>
      <div style={{position: 'absolute', left: 140, top: 1300, width: 800, height: 105, borderRadius: 52, background: AMBER, opacity: prog(t, 0.6, 1.1)}} />
      <Text y={1353} size={35} color={BG} font={XB} spacing={2} a={prog(t, 0.6, 1.1)}>SÍGUENOS EN MOTOR SPECS</Text>
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
  <Composition id="Boom" component={BoomVideo as any} durationInFrames={boomTotal} fps={30} width={1080} height={1920} />
  <Composition id="V8Video" component={V8Video as any} durationInFrames={v8Total} fps={30} width={1080} height={1920} />
  </>
);
