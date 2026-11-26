import React from 'react';
import {AbsoluteFill, Sequence, interpolate} from 'remotion';
import props from '../public/props-boom.json';
import {BG, AMBER, WHITE, GRAY, BAR, PANEL, XB, SB, Text, Stage, Card, Jet, prog, useT, useFonts} from './Kit';
import {Overlay, clamp01} from './Sprites';

const FOOT = 'Datos: Boom Supersonic · Aviation Week · AvWeb · New Atlas';
const fmt = (n: number) => n.toLocaleString('en-US');

// ---------- 1: gancho (cuadro 0 = portada) ----------
const S1: React.FC<{dur: number}> = ({dur}) => {
  const f0 = (useT() === 0);
  const t0 = useT();
  const t = f0 ? 9 : t0;
  const n = Math.round(6500 * prog(t, 0.3, 1.8));
  const pop = 1 + 0.04 * Math.sin(interpolate(t, [1.8, 2.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * Math.PI);
  return (
    <Stage dur={dur} first>
      <Text y={520} dy={(1 - prog(t, 0.1, 0.5)) * 40} size={50} color={GRAY} font={XB} spacing={10} a={prog(t, 0.1, 0.5)}>UNA STARTUP ENCENDIÓ</Text>
      <Text y={645} dy={(1 - prog(t, 0.25, 0.65)) * 40} size={104} spacing={4} a={prog(t, 0.25, 0.65)}>SU MOTOR SUPERSÓNICO</Text>
      <Text y={1010} size={360 * pop} color={AMBER}>{fmt(n)}</Text>
      <Text y={1290} dy={(1 - prog(t, 1.4, 1.9)) * 40} size={140} spacing={12} a={prog(t, 1.4, 1.9)}>RPM</Text>
      <Text y={1420} dy={(1 - prog(t, 1.9, 2.4)) * 40} size={38} color={AMBER} font={XB} spacing={3} a={prog(t, 1.9, 2.4)}>PERO SU 1ER CLIENTE NO ES UNA AEROLÍNEA</Text>
    </Stage>
  );
};

// ---------- 2: el núcleo ----------
const Core: React.FC<{t: number}> = ({t}) => {
  const parts: React.ReactNode[] = [];
  for (let i = 0; i < 14; i++) {
    const ph = (t * 0.55 + i / 14) % 1;
    const x = 70 + ph * 940;
    // altura del canal en cada zona (comprimiendo -> combustión -> expandiendo)
    let half = 70;
    if (x < 340) half = 120 - ((x - 70) / 270) * 50; else if (x < 700) half = 60; else half = 60 + ((x - 700) / 310) * 40;
    const y = 910 + Math.sin(i * 2.3 + t * 3) * half * 0.6;
    const hot = x > 360;
    parts.push(<circle key={i} cx={x} cy={y} r={hot ? 9 : 7} fill={hot ? AMBER : WHITE} opacity={0.85} />);
  }
  const pulse = 0.55 + 0.35 * Math.sin(t * 10);
  const blades = [0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1={95 + k * 42} y1={910 - (118 - k * 9)} x2={95 + k * 42} y2={910 + (118 - k * 9)} stroke={BAR} strokeWidth={6} />);
  return (
    <g>
      <line x1={70} y1={910} x2={1010} y2={910} stroke={GRAY} strokeWidth={12} strokeLinecap="round" />
      <polygon points="70,790 340,850 340,970 70,1030" fill={PANEL} stroke={BAR} strokeWidth={8} strokeLinejoin="round" />
      {blades}
      <rect x={360} y={850} width={320} height={120} rx={18} fill={PANEL} stroke={AMBER} strokeWidth={8} />
      <ellipse cx={520} cy={910} rx={120} ry={34} fill={AMBER} opacity={pulse * 0.55} />
      <polygon points="700,850 1010,790 1010,1030 700,970" fill={PANEL} stroke={BAR} strokeWidth={8} strokeLinejoin="round" />
      <line x1={860} y1={830} x2={860} y2={990} stroke={AMBER} strokeWidth={8} />
      {parts}
    </g>
  );
};

const S2: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  return (
    <Stage dur={dur} footer={FOOT}>
      <Text y={455} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={84} spacing={4} a={prog(t, 0.05, 0.45)}>EL NÚCLEO DEL MOTOR</Text>
      <Text y={535} size={34} color={GRAY} font={XB} spacing={7} a={prog(t, 0.2, 0.6)}>SPRINT CORE · 21 NOV 2026</Text>
      <Overlay a={prog(t, 0.3, 0.9)}><Core t={t} /></Overlay>
      <Text x={205} y={1100} size={34} font={XB} spacing={2} w={300} a={prog(t, 0.9, 1.3)}>COMPRESOR</Text>
      <Text x={205} y={1145} size={26} font={SB} color={GRAY} w={300} a={prog(t, 0.9, 1.3)}>6 ETAPAS</Text>
      <Text x={520} y={1100} size={34} font={XB} spacing={2} w={300} a={prog(t, 1.2, 1.6)}>COMBUSTOR</Text>
      <Text x={520} y={1145} size={26} font={SB} color={GRAY} w={300} a={prog(t, 1.2, 1.6)}>AQUÍ ARDE EL FUEL</Text>
      <Text x={855} y={1100} size={34} font={XB} spacing={2} w={300} a={prog(t, 1.5, 1.9)}>TURBINA</Text>
      <Text x={855} y={1145} size={26} font={SB} color={GRAY} w={300} a={prog(t, 1.5, 1.9)}>1 ETAPA</Text>
      <div style={{position: 'absolute', left: 190, top: 1270, width: 700, height: 90, borderRadius: 45, background: AMBER, opacity: prog(t, 3.2, 3.7)}} />
      <Text y={1315} size={34} color={BG} font={XB} spacing={2} a={prog(t, 3.2, 3.7)}>IGNICIÓN EN EL 2º INTENTO</Text>
      <Overlay a={clamp01(t, 0.6, 1.0)}><Jet x={-250 + 1600 * prog(t, 0.5, 5.2)} y={1700} s={0.7} t={t} /></Overlay>
    </Stage>
  );
};

// ---------- 3: la prueba ----------
const S3: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  const g = prog(t, 0.5, 2.6);
  const rpm = Math.round(6500 * g);
  const cx = 540, cy = 870, r = 210;
  const ang = -135 + 270 * (rpm / 8000);
  const ticks = [];
  for (let k = 0; k <= 8; k++) {
    const a = ((-135 + 270 * (k / 8)) * Math.PI) / 180;
    ticks.push(<line key={k} x1={cx + (r - 12) * Math.sin(a)} y1={cy - (r - 12) * Math.cos(a)} x2={cx + (r - 36) * Math.sin(a)} y2={cy - (r - 36) * Math.cos(a)} stroke={k >= 7 ? AMBER : GRAY} strokeWidth={8} strokeLinecap="round" />);
  }
  return (
    <Stage dur={dur} footer={FOOT}>
      <Text y={460} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={80} spacing={4} a={prog(t, 0.05, 0.45)}>LA PRIMERA PRUEBA</Text>
      <Overlay a={prog(t, 0.2, 0.7)}>
        <circle cx={cx} cy={cy} r={r} fill={PANEL} stroke={BAR} strokeWidth={10} />
        {ticks}
        <line x1={cx} y1={cy} x2={cx + (r - 50) * Math.sin((ang * Math.PI) / 180)} y2={cy - (r - 50) * Math.cos((ang * Math.PI) / 180)} stroke={AMBER} strokeWidth={14} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={20} fill={AMBER} />
      </Overlay>
      <Text y={1165} size={130} color={AMBER} a={prog(t, 0.4, 0.8)}>{fmt(rpm)}</Text>
      <Text y={1265} size={38} color={GRAY} font={XB} spacing={8} a={prog(t, 0.4, 0.8)}>REVOLUCIONES POR MINUTO</Text>
      <div style={{position: 'absolute', left: 140, top: 1330, width: 800, height: 90, borderRadius: 45, background: PANEL, opacity: prog(t, 2.6, 3.1)}} />
      <Text y={1375} size={38} font={XB} spacing={2} a={prog(t, 2.6, 3.1)}>CASI 2,000 SENSORES · CORRIDA CORTA</Text>
    </Stage>
  );
};

// ---------- 4: un núcleo, dos motores ----------
const S4: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  const col = (x: number, name: string, kind: string, use: string, big: string, a: number) => (
    <React.Fragment>
      <Card x={x} y={560} w={460} h={720} a={a} />
      <Text x={x + 230} y={650} size={72} color={AMBER} w={440} a={a}>{name}</Text>
      <Text x={x + 230} y={725} size={30} color={GRAY} font={XB} spacing={3} w={440} a={a}>{kind}</Text>
      <Text x={x + 230} y={900} size={110} w={440} a={a}>{big}</Text>
      <Text x={x + 230} y={1010} size={34} font={XB} spacing={2} w={440} color={GRAY} a={a}>{use}</Text>
    </React.Fragment>
  );
  return (
    <Stage dur={dur} footer={FOOT}>
      <Text y={460} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={84} spacing={4} a={prog(t, 0.05, 0.45)}>UN NÚCLEO, DOS MOTORES</Text>
      {col(60, 'SYMPHONY', 'TURBOFÁN', 'AVIÓN OVERTURE', 'MACH 1.7', prog(t, 0.6, 1.1))}
      {col(560, 'SUPERPOWER', 'TURBINA DE GAS', 'CENTROS DE DATOS', '42 MW', prog(t, 1.6, 2.1))}
      <div style={{position: 'absolute', left: 160, top: 1340, width: 760, height: 80, borderRadius: 40, background: PANEL, opacity: prog(t, 3.0, 3.5)}} />
      <Text y={1380} size={32} font={XB} spacing={2} color={AMBER} a={prog(t, 3.0, 3.5)}>MISMO COMPRESOR, COMBUSTOR Y TURBINA</Text>
    </Stage>
  );
};

// ---------- 5: calendario ----------
const S5: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  const line = prog(t, 0.3, 2.6);
  const dot = (x: number, a: number, on: boolean) => <circle cx={x} cy={900} r={on ? 22 : 18} fill={on ? AMBER : PANEL} stroke={on ? AMBER : BAR} strokeWidth={6} opacity={a} />;
  return (
    <Stage dur={dur} footer={FOOT}>
      <Text y={460} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={84} spacing={4} a={prog(t, 0.05, 0.45)}>PRIMERO LA TURBINA</Text>
      <Overlay a={prog(t, 0.2, 0.6)}>
        <line x1={150} y1={900} x2={930} y2={900} stroke={PANEL} strokeWidth={10} />
        <line x1={150} y1={900} x2={150 + 780 * line} y2={900} stroke={AMBER} strokeWidth={10} />
        {dot(150, prog(t, 0.3, 0.7), true)}{dot(540, prog(t, 1.3, 1.7), true)}{dot(930, prog(t, 2.4, 2.8), false)}
      </Overlay>
      <Text x={150} y={800} size={52} w={300} a={prog(t, 0.3, 0.7)}>NOV 2026</Text>
      <Text x={150} y={990} size={26} font={XB} spacing={1} color={GRAY} w={300} a={prog(t, 0.3, 0.7)}>PRIMER ENCENDIDO</Text>
      <Text x={540} y={800} size={52} color={AMBER} w={300} a={prog(t, 1.3, 1.7)}>MEDIADOS 2027</Text>
      <Text x={540} y={990} size={26} font={XB} spacing={1} color={GRAY} w={300} a={prog(t, 1.3, 1.7)}>PRIMERAS TURBINAS</Text>
      <Text x={930} y={800} size={52} color={GRAY} w={300} a={prog(t, 2.4, 2.8)}>2029</Text>
      <div style={{position: 'absolute', left: 840, top: 800, width: 180 * prog(t, 3.3, 3.8), height: 6, background: AMBER, transform: 'translateY(-50%)'}} />
      <Text x={930} y={990} size={26} font={XB} spacing={1} color={GRAY} w={300} a={prog(t, 2.4, 2.8)}>META DEL AVIÓN</Text>
      <div style={{position: 'absolute', left: 120, top: 1130, width: 840, height: 110, borderRadius: 55, background: PANEL, opacity: prog(t, 3.6, 4.1)}} />
      <Text y={1185} size={38} font={XB} spacing={1} color={AMBER} a={prog(t, 3.6, 4.1)}>UNITED: «NO SERÁ EN 2029»</Text>
      <Overlay a={clamp01(t, 0.6, 1.0)}><Jet x={-250 + 1600 * prog(t, 0.5, 6.2)} y={1700} s={0.7} t={t} /></Overlay>
    </Stage>
  );
};

// ---------- 6: cierre ----------
const S6: React.FC<{dur: number}> = ({dur}) => {
  const t = useT();
  return (
    <Stage dur={dur}>
      <Text y={600} dy={(1 - prog(t, 0.05, 0.5)) * 30} size={100} spacing={3} a={prog(t, 0.05, 0.5)}>PRIMERO, ELECTRICIDAD</Text>
      <Text y={730} dy={(1 - prog(t, 0.2, 0.65)) * 30} size={100} color={AMBER} spacing={3} a={prog(t, 0.2, 0.65)}>DESPUÉS, MACH 1.7</Text>
      <Overlay a={prog(t, 0.3, 0.9)}><Jet x={540} y={1050} s={1.25} t={t} /></Overlay>
      <div style={{position: 'absolute', left: 140, top: 1300, width: 800, height: 105, borderRadius: 52, background: AMBER, opacity: prog(t, 0.6, 1.1)}} />
      <Text y={1353} size={35} color={BG} font={XB} spacing={2} a={prog(t, 0.6, 1.1)}>SÍGUENOS EN MOTOR SPECS</Text>
    </Stage>
  );
};

export const BoomVideo: React.FC = () => {
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
export const boomTotal = props.durFrames.reduce((a, b) => a + b, 0);
