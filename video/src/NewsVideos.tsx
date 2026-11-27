import React from 'react';
import xiaomiProps from '../public/props-xiaomi.json';
import fordProps from '../public/props-ford.json';
import stellantisProps from '../public/props-stellantis.json';
import aeroProps from '../public/props-aero.json';
import {Assemble, HookScene, VsScene, ListScene, TimelineScene, BarsScene, CloseScene, T} from './NewsKit';
import {Stage, prog, useT, AMBER, WHITE, GRAY, BAR, PANEL, BG, XB} from './Kit';
import {Overlay} from './Sprites';

type S = React.FC<{dur: number}>;
const sum = (d: number[]) => d.reduce((a, b) => a + b, 0);

// ===================== XIAOMI SU7 ULTRA vs PORSCHE =====================
const XF = 'Datos: Auto Express · WhichCar · Carscoops · Nürburgring';
const xiaomiScenes: S[] = [
  ({dur}) => <HookScene dur={dur} s={{kicker: 'XIAOMI VS PORSCHE · NÜRBURGRING', title: 'LA DIFERENCIA', big: {from: 0, to: 9.4, dec: 1, suffix: ' s'}, bigSize: 440, sub: '¿SE PUEDE?', tag: 'RÉCORD DE ELÉCTRICOS DE SERIE'}} />,
  ({dur}) => <VsScene dur={dur} s={{title: 'EL DUELO', sub: 'VUELTA AL NORDSCHLEIFE', footer: XF,
    left: {name: 'XIAOMI SU7 ULTRA', big: '7:04.957', rows: ['AÑO 2025', '3 MOTORES', '≈1,526 HP', '0-100 EN 1.98 S']},
    right: {name: 'PORSCHE TAYCAN', big: '6:55.533', rows: ['AÑO 2026', '2 MOTORES', 'TURBO GT + KIT MANTHEY', 'RÉCORD ACTUAL']},
    badge: 'DIFERENCIA: 9.4 SEGUNDOS'}} />,
  ({dur}) => <ListScene dur={dur} s={{title: 'LO QUE CAMBIA', sub: 'SU7 ULTRA RENOVADO (REGISTRO MIIT)', footer: XF, items: [
    {k: 'AERODINÁMICA', v: 'Parachoques y entradas de aire nuevos'},
    {k: 'PAQUETE OPCIONAL', v: 'Divisor frontal grande y alerón enorme'},
    {k: 'LLANTAS MÁS ANCHAS', v: '295 mm delante · 325 mm detrás'},
    {k: 'VERSIÓN 2 PLAZAS', v: 'Opción sin asientos traseros'},
    {k: 'MOTOR: IGUAL', v: 'Mismos 3 motores, mismos ≈1,526 hp'}]}} />,
  ({dur}) => <TimelineScene dur={dur} s={{title: 'EL CAMINO', sub: 'DE 6:46 A 6:55', footer: XF, items: [
    {when: '2024', what: ['Prototipo extremo: 6:46.87', 'Con slicks · no legal en calle']},
    {when: '2025', what: ['SU7 Ultra de serie: 7:04.957', 'Récord eléctrico de serie']},
    {when: '2026', what: ['Porsche responde: 6:55.533', 'Taycan Turbo GT + Manthey']},
    {when: 'NOV 2026', what: ['Xiaomi presenta la versión', 'con nueva aerodinámica']}]}} />,
  ({dur}) => <ListScene dur={dur} s={{title: 'POR CONFIRMAR', sub: 'TODAVÍA NO HAY RÉCORD', footer: XF, items: [
    {k: 'SIN TIEMPO OFICIAL', v: 'Xiaomi no ha publicado ningún resultado'},
    {k: 'AVISTADO EN EL RING', v: 'Un SU7 con alerón, hace unas semanas'},
    {k: 'POTENCIA: SIN CAMBIOS', v: 'Rumores de 4 motores no se confirmaron'}]}} />,
  ({dur}) => <CloseScene dur={dur} l1="EL DUELO" l2="SIGUE ABIERTO" />,
];
export const XiaomiVideo: React.FC = () => <Assemble durFrames={xiaomiProps.durFrames} scenes={xiaomiScenes} />;
export const xiaomiTotal = sum(xiaomiProps.durFrames);

// ===================== FORD GT41 =====================
const FF = 'Datos: Ford Racing · Motorsport.com · Motor Sport · RACER';
const fordScenes: S[] = [
  ({dur}) => <HookScene dur={dur} s={{kicker: 'FORD VUELVE A LE MANS', title: 'NO ES AL AZAR', big: {from: 0, to: 41}, sub: 'PULGADAS', tag: 'EL NOMBRE ES UNA MEDIDA'}} />,
  ({dur}) => <VsScene dur={dur} s={{title: 'GT40 → GT41', sub: 'DE DÓNDE SALE EL NOMBRE', footer: FF,
    left: {name: 'FORD GT40', big: '40 IN', rows: ['40 PULGADAS DE ALTURA', '1966: 1-2-3 EN LE MANS', '4 VICTORIAS SEGUIDAS', 'DE 1966 A 1969']},
    right: {name: 'FORD GT41', big: '41 IN', rows: ['SUELO A TOMA DE AIRE', 'HYPERCAR LMDH', 'CORRE EN 2027', 'EN EL WEC Y LE MANS']},
    badge: 'EL NOMBRE ES UNA MEDIDA'}} />,
  ({dur}) => <ListScene dur={dur} s={{title: 'LO QUE LLEVA', sub: 'FORD GT41 · LMDH', footer: FF, items: [
    {k: 'CHASIS ORECA', v: 'Base común de la categoría LMDh'},
    {k: 'V8 DE 5.4 L', v: 'Atmosférico, basado en el Coyote, hecho por Ford'},
    {k: 'SISTEMA HÍBRIDO', v: 'Componente estándar de la categoría'},
    {k: '2 AUTOS EN 2027', v: 'Equipo operado por Ford Racing'}]}} />,
  ({dur}) => <TimelineScene dur={dur} s={{title: 'EL REGRESO', sub: 'DE LA GLORIA A LA PARRILLA', footer: FF, items: [
    {when: '1966', what: ['1-2-3 en Le Mans', 'Inicio de 4 victorias seguidas']},
    {when: 'AGO 2026', what: ['Primer rodaje de pruebas', 'Circuito Paul Ricard']},
    {when: '26 NOV 2026', what: ['Presentación en Detroit', 'Ford Field']},
    {when: '27 MAR 2027', what: ['Debut en el WEC', 'Lusail, Qatar']},
    {when: 'JUN 2027', what: ['24 Horas de Le Mans']}]}} />,
  ({dur}) => <ListScene dur={dur} s={{title: 'EL RETO', sub: 'TODAVÍA FALTA CAMINO', footer: FF, items: [
    {k: '+14,000 KM', v: 'De pruebas en 6 sesiones en Europa'},
    {k: 'RIVALES FUERTES', v: 'Ferrari · Toyota · BMW · Cadillac · Genesis'},
    {k: 'AÚN SIN VERSIÓN FINAL', v: 'La aerodinámica y la librea siguen en prueba'}]}} />,
  ({dur}) => <CloseScene dur={dur} l1="60 AÑOS" l2="DESPUÉS" />,
];
export const FordVideo: React.FC = () => <Assemble durFrames={fordProps.durFrames} scenes={fordScenes} />;
export const fordTotal = sum(fordProps.durFrames);

// ===================== STELLANTIS =====================
const SF = 'Datos: Motorsport.com · Sportscar365 · Stellantis';
const stellantisScenes: S[] = [
  ({dur}) => <HookScene dur={dur} s={{kicker: 'STELLANTIS APAGA SU MOTORSPORT', title: 'ADIÓS PEUGEOT', big: {from: 0, to: 8}, sub: 'MARCAS EN EL WEC 2027', tag: 'PEUGEOT SALE DE INMEDIATO'}} />,
  ({dur}) => <VsScene dur={dur} s={{title: 'QUIÉN SE VA Y QUIÉN NO', footer: SF,
    left: {name: 'SE VAN', big: '3 MARCAS', rows: ['PEUGEOT: WEC, YA', 'CITROËN: FÓRMULA E', 'OPEL: FÓRMULA E', 'SALEN EN JUL 2027']},
    right: {name: 'SE QUEDAN', big: '2', rows: ['LANCIA: RALLY DE CLIENTES', 'DODGE: NASCAR CUP 2027', 'ESTE LO LLEVA STELLANTIS NA']},
    badge: 'FIN DEL MOTORSPORT DE FÁBRICA'}} />,
  ({dur}) => <ListScene dur={dur} s={{title: 'LO QUE SE PIERDE', footer: SF, items: [
    {k: '9X8 RENOVADO', v: 'Estaba por presentarse y no correría oficial'},
    {k: 'PILOTOS EN EL AIRE', v: 'Duval · Cassidy · Vergne · Pourchaire'},
    {k: 'CIENTOS DE EMPLEOS', v: 'Personal de la división de Satory (Francia)'}]}} />,
  ({dur}) => <TimelineScene dur={dur} s={{title: 'CÓMO FUE', footer: SF, items: [
    {when: 'FEB 2026', what: ['Alpine ya había dejado el WEC']},
    {when: '23 NOV 2026', what: ['Stellantis confirma el cierre', 'Tras reunir a sus trabajadores']},
    {when: 'INMEDIATO', what: ['Peugeot sale del WEC']},
    {when: 'JUL 2027', what: ['Citroën y Opel dejan la', 'Fórmula E (fin temporada Gen4)']}]}} />,
  ({dur}) => <ListScene dur={dur} s={{title: 'EL PORQUÉ', sub: 'SEGÚN STELLANTIS', footer: SF, items: [
    {k: 'PLAN FASTLANE 2030', v: '50 productos nuevos en Europa antes de 2030'},
    {k: 'NUEVO ENFOQUE', v: 'Carreras de clientes y deportivos de calle'},
    {k: 'RECORTE DE COSTOS', v: 'Parte de un ajuste más amplio del grupo'}]}} />,
  ({dur}) => <CloseScene dur={dur} l1="UN CAPÍTULO" l2="QUE SE CIERRA" />,
];
export const StellantisVideo: React.FC = () => <Assemble durFrames={stellantisProps.durFrames} scenes={stellantisScenes} />;
export const stellantisTotal = sum(stellantisProps.durFrames);

// ===================== AERODINÁMICA F1 =====================
const AF = 'Datos: Formula1.com · Raceteq · The Athletic';
const Venturi: S = ({dur}) => {
  const t = useT();
  const streak = (y: number, i: number) => (
    <g key={y}>
      <line x1={100} y1={y} x2={330} y2={y} stroke={GRAY} strokeWidth={6} strokeLinecap="round" strokeDasharray="36 44" strokeDashoffset={-t * 220 - i * 15} />
      <line x1={330} y1={y} x2={750} y2={y} stroke={AMBER} strokeWidth={6} strokeLinecap="round" strokeDasharray="36 44" strokeDashoffset={-t * 700 - i * 15} />
      <line x1={750} y1={y} x2={980} y2={y} stroke={GRAY} strokeWidth={6} strokeLinecap="round" strokeDasharray="36 44" strokeDashoffset={-t * 220 - i * 15} />
    </g>
  );
  return (
    <Stage dur={dur} footer={AF}>
      <T y={455} dy={(1 - prog(t, 0.05, 0.45)) * 30} size={90} spacing={4} a={prog(t, 0.05, 0.45)}>EFECTO SUELO</T>
      <T y={532} size={30} color={GRAY} font={XB} spacing={5} a={prog(t, 0.2, 0.6)}>AIRE RÁPIDO = PRESIÓN BAJA</T>
      <Overlay a={prog(t, 0.3, 0.9)}>
        <path d="M130 700 H950 V840 Q540 1040 130 840 Z" fill={PANEL} stroke={BAR} strokeWidth={6} />
        <rect x={100} y={1070} width={880} height={22} rx={6} fill={BAR} />
      </Overlay>
      <Overlay a={prog(t, 1.0, 1.6)}>{[985, 1022, 1050].map(streak)}</Overlay>
      <Overlay a={prog(t, 3.0, 3.6)}>
        <path d="M540 735 V815" stroke={AMBER} strokeWidth={16} strokeLinecap="round" />
        <path d="M505 790 L540 830 L575 790 Z" fill={AMBER} />
      </Overlay>
      <T x={215} y={1170} size={34} font={XB} spacing={2} color={GRAY} w={300} a={prog(t, 1.4, 1.9)}>AIRE LENTO</T>
      <T x={540} y={1170} size={34} font={XB} spacing={2} color={AMBER} w={300} a={prog(t, 2.2, 2.7)}>AIRE RÁPIDO</T>
      <T x={865} y={1170} size={34} font={XB} spacing={2} color={GRAY} w={300} a={prog(t, 1.4, 1.9)}>AIRE LENTO</T>
      <T y={1260} size={64} color={AMBER} a={prog(t, 3.6, 4.2)}>MENOS PRESIÓN = MÁS CARGA</T>
      <T y={1335} size={30} font={XB} spacing={2} color={WHITE} a={prog(t, 4.4, 4.9)}>EL COCHE SE PEGA AL ASFALTO</T>
    </Stage>
  );
};
const aeroScenes: S[] = [
  ({dur}) => <HookScene dur={dur} s={{kicker: 'AERODINÁMICA DE F1', title: 'DOBLA LA VELOCIDAD', big: {text: '×4'}, sub: 'LA CARGA AERODINÁMICA', tag: 'SE MULTIPLICA POR CUATRO'}} />,
  Venturi,
  ({dur}) => <BarsScene dur={dur} s={{title: 'LA CARGA CRECE AL CUADRADO', sub: 'REFERENCIA: 100 KM/H = 1', max: 9, footer: AF,
    bars: [{label: 'A 100 KM/H', value: 1, text: '×1'}, {label: 'A 200 KM/H', value: 4, text: '×4'}, {label: 'A 300 KM/H', value: 9, text: '×9'}], note: 'POR ESO EN RECTA SE PEGA MÁS'}} />,
  ({dur}) => <VsScene dur={dur} s={{title: 'EL CAMBIO DE 2026', footer: AF,
    left: {name: '2022 – 2025', big: 'TÚNELES', rows: ['TÚNELES VENTURI EN EL PISO', 'EL PISO DA LA MAYOR CARGA', 'SOLO SE MUEVE EL ALA TRASERA', 'ESTELA TURBULENTA']},
    right: {name: '2026', big: 'ACTIVA', rows: ['PISO MÁS PLANO', 'DIFUSOR MÁS GRANDE', 'ALAS MÓVILES AL FRENTE Y ATRÁS', 'CARGA −15 A −30 %']},
    badge: 'ARRASTRE: HASTA −40 %'}} />,
  ({dur}) => <ListScene dur={dur} s={{title: 'DOS MODOS', sub: 'AERODINÁMICA ACTIVA', footer: AF, items: [
    {k: 'MODO CURVA', v: 'Alas cerradas: máxima carga'},
    {k: 'MODO RECTA', v: 'Alas abiertas: menos arrastre, más velocidad'},
    {k: 'LAS DOS ALAS A LA VEZ', v: 'Delantera y trasera, para mantener el equilibrio'},
    {k: 'SE CIERRAN SOLAS', v: 'Al frenar o soltar el acelerador'}]}} />,
  ({dur}) => <CloseScene dur={dur} l1="AIRE QUE" l2="PEGA AL PISO" />,
];
export const AeroVideo: React.FC = () => <Assemble durFrames={aeroProps.durFrames} scenes={aeroScenes} />;
export const aeroTotal = sum(aeroProps.durFrames);
