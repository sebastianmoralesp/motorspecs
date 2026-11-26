import React from 'react';
import {AbsoluteFill, Sequence, interpolate} from 'remotion';
import props from '../public/props-v8.json';
import {BG, AMBER, WHITE, GRAY, BAR, PANEL, XB, SB, Text, Stage, Card, prog, useT, useFonts} from './Kit';
import {Overlay, SideCar, clamp01, easeOut} from './Sprites';

const FOOT = 'Datos: Autocar · Hagerty · Jalopnik · OnAllCylinders';

// ---------- 1: gancho (cuadro 0 = portada) ----------
const S1: React.FC<{dur: number}> = ({dur}) => {
  const t0 = useT();
  const t = t0 === 0 ? 9 : t0;
  const n = Math.round(8 * prog(t, 0.3, 1.4));
  const pop = 1 + 0.05 * Math.sin(interpolate(t, [1.4, 1.8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * Math.PI);
  return (
    <Stage dur={dur} first>
      <Text y={520} dy={(1 - prog(t, 0.1, 0.5)) * 40} size={50} color={GRAY} font={XB} spacing={10} a={prog(t, 0.1, 0.5)}>LOS MISMOS 8 CILINDROS</Text>
      <Text y={645} dy={(1 - prog(t, 0.25, 0.65)) * 40} size={128} spacing={6} a={prog(t, 0.25, 0.65)}>DOS SONIDOS</Text>
      <Text y={1010} size={520 * pop} color={AMBER}>{`V${n}`}</Text>
      <Text y={1340} dy={(1 - prog(t, 1.2, 1.7)) * 40} size={150} spacing={10} a={prog(t, 1.2, 1.7)}>¿POR QUÉ?</Text>
      <Text y={1470} dy={(1 - prog(t, 1.7, 2.2)) * 40} size={52} color={AMBER} font={XB} spacing={4} a={prog(t, 1.7, 2.2)}>UN RETUMBO · UN GRITO</Text>
    </Stage>
  );
};

// ---------- 2: el cigüeñal visto de frente ----------
const Crank: React.FC<{cx: number; cy: number; t: number; angles: number[]}> = ({cx, cy, t, angles}) => {
  const rot = t * 50;
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={190} fill={PANEL} stroke={BAR} strokeWidth={8} />
      <g transform={`rotate(${rot})`}>
        {angles.map((a, i) => {
          const x = 120 * Math.sin((a * Math.PI) / 180), y = -120 * Math.cos((a * Math.PI) / 180);
          return (
            <g key={i}>
              <line x1={0} y1={0} x2={x} y2={y} stroke={AMBER} strokeWidth={14} strokeLinecap="round" />
              <circle cx={x} cy={y} r={30} fill={i % 2 ? WHITE : AMBER} />
            </g>
          );
        })}
      </g>
      <circle r={20} fill={GRAY} />
    </g>
  );
};

const S2: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  return (
    <Stage dur={dur} footer={FOOT}>
      <Text y={455} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={84} spacing={4} a={prog(t, 0.05, 0.45)}>EL CIGÜEÑAL</Text>
      <Text y={535} size={34} color={GRAY} font={XB} spacing={7} a={prog(t, 0.2, 0.6)}>VISTO DE FRENTE</Text>
      <Overlay a={prog(t, 0.3, 0.9)}>
        <Crank cx={290} cy={900} t={t} angles={[0, 90, 180, 270]} />
        <Crank cx={790} cy={900} t={t} angles={[0, 180]} />
      </Overlay>
      <Text x={290} y={1170} size={58} color={AMBER} w={460} a={prog(t, 1.2, 1.6)}>CROSS-PLANE</Text>
      <Text x={290} y={1230} size={28} font={XB} spacing={2} color={GRAY} w={460} a={prog(t, 1.2, 1.6)}>90° · FORMA UNA CRUZ</Text>
      <Text x={790} y={1170} size={58} color={AMBER} w={460} a={prog(t, 3.4, 3.8)}>FLAT-PLANE</Text>
      <Text x={790} y={1230} size={28} font={XB} spacing={2} color={GRAY} w={460} a={prog(t, 3.4, 3.8)}>180° · UN SOLO PLANO</Text>
      <Overlay a={clamp01(t, 0.6, 1.0)}><SideCar x={-260 + 1700 * easeOut(t, 0.5, 6.5)} y={1700} s={0.8} t={t} body={AMBER} accent={WHITE} /></Overlay>
    </Stage>
  );
};

// ---------- 3 y 4: orden de disparo por bancada ----------
const Fire: React.FC<{pattern: string; t: number; t0: number; step: number}> = ({pattern, t, t0, step}) => {
  const cur = Math.floor((t - t0) / step);
  const els: React.ReactNode[] = [];
  const ys: Record<string, number> = {R: 820, L: 1010};
  pattern.split('').forEach((lane, k) => {
    const x = 160 + k * 105;
    const on = cur === k, past = cur > k;
    const dup = k > 0 && pattern[k - 1] === lane;
    els.push(<rect key={`b${k}`} x={x} y={ys[lane]} width={84} height={84} rx={14} fill={on ? AMBER : past ? '#7A6210' : PANEL} stroke={dup && cur >= k ? WHITE : BAR} strokeWidth={dup && cur >= k ? 7 : 4} />);
    els.push(<text key={`n${k}`} x={x + 42} y={ys[lane] + 58} textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize={46} fill={on ? BG : past ? WHITE : GRAY}>{k + 1}</text>);
  });
  return <g>{els}</g>;
};

const FireScene: React.FC<{dur: number; title: string; sub: string; pattern: string; note: string; noteAt: number}> = ({dur, title, sub, pattern, note, noteAt}) => {
  const t = useT();
  return (
    <Stage dur={dur} footer={FOOT}>
      <Text y={455} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={100} color={AMBER} spacing={4} a={prog(t, 0.05, 0.45)}>{title}</Text>
      <Text y={535} size={34} color={GRAY} font={XB} spacing={5} a={prog(t, 0.2, 0.6)}>{sub}</Text>
      <Text x={90} y={800} size={26} font={XB} color={GRAY} spacing={2} w={90} a={prog(t, 0.4, 0.8)}>DER.</Text>
      <Text x={90} y={990} size={26} font={XB} color={GRAY} spacing={2} w={90} a={prog(t, 0.4, 0.8)}>IZQ.</Text>
      <Overlay a={prog(t, 0.3, 0.8)}>
        <text x={160} y={790} fontFamily="InterXB, sans-serif" fontSize={26} fill={GRAY} letterSpacing={3}>BANCADA DERECHA</text>
        <text x={160} y={980} fontFamily="InterXB, sans-serif" fontSize={26} fill={GRAY} letterSpacing={3}>BANCADA IZQUIERDA</text>
        <Fire pattern={pattern} t={t} t0={1.0} step={0.6} />
      </Overlay>
      <Text y={1250} size={42} color={AMBER} font={XB} spacing={2} a={prog(t, noteAt, noteAt + 0.5)}>{note}</Text>
    </Stage>
  );
};

const S3: React.FC<{dur: number}> = ({dur}) => (
  <FireScene dur={dur} title="FLAT-PLANE" sub="DISPARA ALTERNANDO: D-I-D-I-D-I-D-I" pattern="RLRLRLRL" note="ESCAPE ORDENADO → SONIDO AGUDO" noteAt={5.6} />
);
const S4: React.FC<{dur: number}> = ({dur}) => (
  <FireScene dur={dur} title="CROSS-PLANE" sub="A VECES DOS SEGUIDOS DEL MISMO LADO" pattern="RLLRLRRL" note="PULSOS AMONTONADOS → RETUMBO" noteAt={4.6} />
);

// ---------- 5: comparación ----------
const S5: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  const col = (x: number, name: string, rows: string[], a: number) => (
    <React.Fragment>
      <Card x={x} y={540} w={460} h={720} a={a} />
      <Text x={x + 230} y={625} size={64} color={AMBER} w={440} a={a}>{name}</Text>
      {rows.map((r, i) => (
        <Text key={r} x={x + 230} y={760 + i * 120} size={34} font={XB} spacing={1} w={440} a={prog(t, 0.9 + i * 0.35 + (x > 500 ? 3 : 0), 1.3 + i * 0.35 + (x > 500 ? 3 : 0))}>{r}</Text>
      ))}
    </React.Fragment>
  );
  return (
    <Stage dur={dur} footer={FOOT}>
      <Text y={455} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={84} spacing={4} a={prog(t, 0.05, 0.45)}>CADA UNO, SU CARÁCTER</Text>
      {col(60, 'FLAT-PLANE', ['MÁS LIGERO', 'SUBE MÁS DE VUELTAS', 'VIBRA MÁS', 'SONIDO AGUDO'], prog(t, 0.4, 0.9))}
      {col(560, 'CROSS-PLANE', ['MÁS SUAVE', 'CONTRAPESOS PESADOS', 'SUBE MENOS', 'RETUMBO GRAVE'], prog(t, 3.2, 3.7))}
    </Stage>
  );
};

// ---------- 6: cierre ----------
const S6: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  return (
    <Stage dur={dur}>
      <Text y={600} dy={(1 - prog(t, 0.05, 0.5)) * 30} size={110} spacing={4} a={prog(t, 0.05, 0.5)}>8 CILINDROS,</Text>
      <Text y={730} dy={(1 - prog(t, 0.2, 0.65)) * 30} size={110} color={AMBER} spacing={4} a={prog(t, 0.2, 0.65)}>2 PERSONALIDADES</Text>
      <Overlay a={prog(t, 0.3, 0.9)}><SideCar x={540} y={1130} s={1.4} t={t} body={AMBER} accent={WHITE} lines={false} /></Overlay>
      <div style={{position: 'absolute', left: 140, top: 1300, width: 800, height: 105, borderRadius: 52, background: AMBER, opacity: prog(t, 0.6, 1.1)}} />
      <Text y={1353} size={35} color={BG} font={XB} spacing={2} a={prog(t, 0.6, 1.1)}>SÍGUENOS EN MOTOR SPECS</Text>
    </Stage>
  );
};

export const V8Video: React.FC = () => {
  useFonts();
  const d = props.durFrames;
  const starts = d.map((_, i) => d.slice(0, i).reduce((a, b) => a + b, 0));
  const scenes = [S1, S2, S3, S4, S5, S6];
  return (
    <AbsoluteFill style={{background: BG}}>
      {scenes.map((S, i) => (<Sequence key={i} from={starts[i]} durationInFrames={d[i]}><S dur={d[i]} /></Sequence>))}
    </AbsoluteFill>
  );
};
export const v8Total = props.durFrames.reduce((a, b) => a + b, 0);
