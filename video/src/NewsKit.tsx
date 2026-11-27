import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useVideoConfig} from 'remotion';
import {BG, AMBER, WHITE, GRAY, BAR, PANEL, A, XB, SB, Text, Stage, Card, prog, useT, useFonts} from './Kit';
import {Overlay, SideCar, clamp01, easeOut} from './Sprites';

// Escenas genéricas (mismo estilo que V8Video / V2): gancho con número, versus, lista, línea de tiempo, barras, cierre.
// Se ajusta el tamaño de texto para que nunca se salga de la zona segura.
const fit = (txt: string, size: number, font: string, spacing: number, maxW: number) => {
  const k = font === A ? 0.5 : 0.7;
  const w = txt.length * (size * k + spacing);
  return w > maxW ? Math.floor(size * (maxW / w)) : size;
};
export const T: React.FC<{x?: number; y: number; size: number; color?: string; font?: string; align?: 'center' | 'left' | 'right'; spacing?: number; a?: number; dy?: number; w?: number; children: string}> =
({size, font = A, spacing = 0, w = 1000, children, ...r}) => (
  <Text {...r} font={font} spacing={spacing} w={w} size={fit(children, size, font, spacing, w - 20)}>{children}</Text>
);

// ---------- gancho (cuadro 0 = portada: first + t=9) ----------
export type HookSpec = {kicker: string; title: string; big: {from?: number; to: number; dec?: number; prefix?: string; suffix?: string} | {text: string}; sub: string; tag: string; bigSize?: number};
export const HookScene: React.FC<{dur: number; s: HookSpec}> = ({dur, s}) => {
  const t0 = useT();
  const t = t0 === 0 ? 9 : t0;
  let bigTxt: string;
  if ('text' in s.big) bigTxt = s.big.text;
  else {
    const b = s.big; const v = (b.from ?? 0) + (b.to - (b.from ?? 0)) * prog(t, 0.3, 1.5);
    bigTxt = `${b.prefix ?? ''}${v.toFixed(b.dec ?? 0)}${b.suffix ?? ''}`;
  }
  const pop = 1 + 0.05 * Math.sin(interpolate(t, [1.5, 1.9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * Math.PI);
  const finalTxt = 'text' in s.big ? s.big.text : `${s.big.prefix ?? ''}${s.big.to.toFixed(s.big.dec ?? 0)}${s.big.suffix ?? ''}`;
  const bs = fit(finalTxt, s.bigSize ?? 520, A, 0, 960);
  return (
    <Stage dur={dur} first>
      <T y={520} dy={(1 - prog(t, 0.1, 0.5)) * 40} size={46} color={GRAY} font={XB} spacing={8} a={prog(t, 0.1, 0.5)}>{s.kicker}</T>
      <T y={645} dy={(1 - prog(t, 0.25, 0.65)) * 40} size={128} spacing={6} a={prog(t, 0.25, 0.65)}>{s.title}</T>
      <T y={1010} size={bs * pop} color={AMBER}>{bigTxt}</T>
      <T y={1340} dy={(1 - prog(t, 1.2, 1.7)) * 40} size={110} spacing={8} a={prog(t, 1.2, 1.7)}>{s.sub}</T>
      <T y={1470} dy={(1 - prog(t, 1.7, 2.2)) * 40} size={50} color={AMBER} font={XB} spacing={4} a={prog(t, 1.7, 2.2)}>{s.tag}</T>
    </Stage>
  );
};

// ---------- versus (2 columnas) ----------
export type Col = {name: string; big: string; rows: string[]};
export type VsSpec = {title: string; sub?: string; left: Col; right: Col; badge?: string; footer: string};
export const VsScene: React.FC<{dur: number; s: VsSpec}> = ({dur, s}) => {
  const t = useT(); const D = dur / 30;
  const half = Math.max(2.5, D * 0.5);
  const col = (x: number, c: Col, t0: number) => (
    <React.Fragment>
      <Card x={x} y={575} w={460} h={700} a={prog(t, t0, t0 + 0.5)} />
      <T x={x + 230} y={655} size={52} color={AMBER} w={440} a={prog(t, t0, t0 + 0.5)}>{c.name}</T>
      <T x={x + 230} y={752} size={78} w={440} a={prog(t, t0 + 0.3, t0 + 0.8)}>{c.big}</T>
      {c.rows.map((r, i) => (
        <T key={i} x={x + 230} y={875 + i * 98} size={30} font={XB} spacing={1} w={440} color={WHITE} a={prog(t, t0 + 0.9 + i * 0.4, t0 + 1.3 + i * 0.4)}>{r}</T>
      ))}
    </React.Fragment>
  );
  return (
    <Stage dur={dur} footer={s.footer}>
      <T y={455} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={84} spacing={4} a={prog(t, 0.05, 0.45)}>{s.title}</T>
      {s.sub && <T y={525} size={30} color={GRAY} font={XB} spacing={5} a={prog(t, 0.2, 0.6)}>{s.sub}</T>}
      {col(60, s.left, 0.3)}
      {col(560, s.right, half)}
      {s.badge && (<>
        <div style={{position: 'absolute', left: 140, top: 1310, width: 800, height: 100, borderRadius: 50, background: AMBER, opacity: prog(t, D * 0.78, D * 0.78 + 0.5)}} />
        <T y={1360} size={40} color={BG} font={XB} spacing={2} a={prog(t, D * 0.78, D * 0.78 + 0.5)}>{s.badge}</T>
      </>)}
    </Stage>
  );
};

// ---------- lista de tarjetas ----------
export type ListSpec = {title: string; sub?: string; items: {k: string; v: string}[]; footer: string};
export const ListScene: React.FC<{dur: number; s: ListSpec}> = ({dur, s}) => {
  const t = useT(); const D = dur / 30; const n = s.items.length;
  const step = Math.max(0.7, (D - 2.4) / n);
  return (
    <Stage dur={dur} footer={s.footer}>
      <T y={455} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={90} spacing={4} a={prog(t, 0.05, 0.45)}>{s.title}</T>
      {s.sub && <T y={532} size={30} color={GRAY} font={XB} spacing={5} a={prog(t, 0.2, 0.6)}>{s.sub}</T>}
      {s.items.map((it, i) => {
        const t0 = 0.7 + i * step; const a = prog(t, t0, t0 + 0.45); const y = 595 + i * 172;
        return (
          <React.Fragment key={i}>
            <Card x={90} y={y + (1 - a) * 24} w={900} h={150} a={a} />
            <T x={120} y={y + 54 + (1 - a) * 24} size={54} color={AMBER} align="left" w={840} a={a}>{it.k}</T>
            <T x={120} y={y + 110 + (1 - a) * 24} size={29} font={XB} spacing={1} align="left" w={840} a={a}>{it.v}</T>
          </React.Fragment>
        );
      })}
    </Stage>
  );
};

// ---------- línea de tiempo ----------
export type TlSpec = {title: string; sub?: string; items: {when: string; what: string[]}[]; footer: string};
export const TimelineScene: React.FC<{dur: number; s: TlSpec}> = ({dur, s}) => {
  const t = useT(); const D = dur / 30; const n = s.items.length;
  const step = Math.max(0.7, (D - 2.4) / n);
  const y0 = 650, gap = 165;
  const lineH = (n - 1) * gap;
  return (
    <Stage dur={dur} footer={s.footer}>
      <T y={455} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={90} spacing={4} a={prog(t, 0.05, 0.45)}>{s.title}</T>
      {s.sub && <T y={532} size={30} color={GRAY} font={XB} spacing={5} a={prog(t, 0.2, 0.6)}>{s.sub}</T>}
      <div style={{position: 'absolute', left: 408, top: y0, width: 6, height: lineH * prog(t, 0.6, 0.6 + step * n), background: BAR}} />
      {s.items.map((it, i) => {
        const t0 = 0.7 + i * step; const a = prog(t, t0, t0 + 0.45); const y = y0 + i * gap;
        return (
          <React.Fragment key={i}>
            <T x={70} y={y} size={50} color={AMBER} align="left" w={320} a={a}>{it.when}</T>
            <div style={{position: 'absolute', left: 394, top: y - 17, width: 34, height: 34, borderRadius: 17, background: AMBER, opacity: a}} />
            {it.what.map((l, j) => (
              <T key={j} x={460} y={y - 18 + j * 42} size={32} font={XB} spacing={1} align="left" w={560} a={a} color={j === 0 ? WHITE : GRAY}>{l}</T>
            ))}
          </React.Fragment>
        );
      })}
    </Stage>
  );
};

// ---------- barras ----------
export type BarsSpec = {title: string; sub?: string; bars: {label: string; value: number; text: string}[]; max: number; note?: string; footer: string};
export const BarsScene: React.FC<{dur: number; s: BarsSpec}> = ({dur, s}) => {
  const t = useT(); const D = dur / 30; const n = s.bars.length;
  const step = Math.max(0.8, (D - 2.6) / n);
  return (
    <Stage dur={dur} footer={s.footer}>
      <T y={455} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={84} spacing={4} a={prog(t, 0.05, 0.45)}>{s.title}</T>
      {s.sub && <T y={525} size={30} color={GRAY} font={XB} spacing={5} a={prog(t, 0.2, 0.6)}>{s.sub}</T>}
      {s.bars.map((b, i) => {
        const t0 = 0.7 + i * step; const y = 640 + i * 230; const len = 900 * (b.value / s.max) * prog(t, t0, t0 + 1.0);
        return (
          <React.Fragment key={i}>
            <T x={90} y={y} size={36} font={XB} spacing={3} color={GRAY} align="left" w={900} a={prog(t, t0, t0 + 0.4)}>{b.label}</T>
            <div style={{position: 'absolute', left: 90, top: y + 40, width: 900, height: 96, borderRadius: 14, background: PANEL}} />
            <div style={{position: 'absolute', left: 90, top: y + 40, width: Math.max(len, 0), height: 96, borderRadius: 14, background: i === n - 1 ? AMBER : BAR}} />
            <T x={110} y={y + 90} size={64} color={i === n - 1 ? BG : WHITE} align="left" w={800} a={prog(t, t0 + 0.5, t0 + 0.9)}>{b.text}</T>
          </React.Fragment>
        );
      })}
      {s.note && <T y={1400} size={32} color={AMBER} font={XB} spacing={2} a={prog(t, D - 2.6, D - 2.0)}>{s.note}</T>}
    </Stage>
  );
};

// ---------- cierre ----------
export const CloseScene: React.FC<{dur: number; l1: string; l2: string}> = ({dur, l1, l2}) => {
  const t = useT();
  return (
    <Stage dur={dur}>
      <T y={600} dy={(1 - prog(t, 0.05, 0.5)) * 30} size={110} spacing={4} a={prog(t, 0.05, 0.5)}>{l1}</T>
      <T y={730} dy={(1 - prog(t, 0.2, 0.65)) * 30} size={110} color={AMBER} spacing={4} a={prog(t, 0.2, 0.65)}>{l2}</T>
      <Overlay a={prog(t, 0.3, 0.9)}><SideCar x={540} y={1130} s={1.4} t={t} body={AMBER} accent={WHITE} lines={false} /></Overlay>
      <div style={{position: 'absolute', left: 140, top: 1300, width: 800, height: 105, borderRadius: 52, background: AMBER, opacity: prog(t, 0.6, 1.1)}} />
      <T y={1353} size={35} color={BG} font={XB} spacing={2} a={prog(t, 0.6, 1.1)}>SÍGUENOS EN MOTOR SPECS</T>
    </Stage>
  );
};

// ---------- ensamblador ----------
export const Assemble: React.FC<{durFrames: number[]; scenes: React.FC<{dur: number}>[]}> = ({durFrames, scenes}) => {
  useFonts();
  const starts = durFrames.map((_, i) => durFrames.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <AbsoluteFill style={{background: BG}}>
      {scenes.map((S, i) => (<Sequence key={i} from={starts[i]} durationInFrames={durFrames[i]}><S dur={durFrames[i]} /></Sequence>))}
    </AbsoluteFill>
  );
};
export {clamp01, easeOut, SB};
