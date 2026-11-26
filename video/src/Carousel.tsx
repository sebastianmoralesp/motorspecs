import React from 'react';
import {AbsoluteFill, staticFile, delayRender, continueRender} from 'remotion';

// Carrusel de Instagram 1080x1350 (4:5): portada + 1-2 láminas de texto. Sin fotos de coches (solo tipografía y datos).
export type Dato = {valor: string; etiqueta: string};
export type Slide = {
  tipo: 'portada' | 'texto';
  categoria?: string;            // portada: p.ej. "F1 · BREAKING"
  titulo?: string;               // portada: titular (<= 80 caracteres)
  destacado?: Dato;              // portada: dato grande opcional
  encabezado?: string;           // texto: encabezado corto (<= 28 caracteres)
  parrafos?: string[];           // texto: 1-3 párrafos (<= 300 caracteres en total)
  datos?: Dato[];                // texto: hasta 3 tarjetas de dato
  cierre?: boolean;              // texto: muestra "SÍGUENOS EN MOTOR SPECS"
  fuente?: string;               // texto: línea de fuentes
};

const BG = '#0B0D10', AMBER = '#FFC400', WHITE = '#F5F7FA', GRAY = '#8A949E', DIM = '#5C646E', PANEL = '#181C22';
const A = 'Anton, Impact, sans-serif', XB = 'InterXB, sans-serif', SB = 'InterSB, sans-serif';

const useFonts = () => {
  const [h] = React.useState(() => delayRender('fonts-carrusel'));
  React.useEffect(() => {
    const defs: [string, string, string][] = [['Anton', 'Anton-Regular.ttf', '400'], ['InterXB', 'Inter-ExtraBold.otf', '800'], ['InterSB', 'Inter-SemiBold.otf', '600']];
    Promise.all(defs.map(async ([n, f, w]) => {
      const ff = new FontFace(n, `url(${staticFile(f)})`, {weight: w});
      await ff.load();
      (document as any).fonts.add(ff);
    })).then(() => continueRender(h));
  }, [h]);
};

export const Carrusel: React.FC<{slides: Slide[]; i: number}> = ({slides, i}) => {
  useFonts();
  const s = slides[i];
  if (!s) return <AbsoluteFill style={{background: BG}} />;
  const lines = [];
  for (let k = -6; k < 10; k++) lines.push(<line key={k} x1={k * 220} y1={0} x2={k * 220 - 560} y2={1350} stroke="#13161B" strokeWidth={3} />);
  const tl = (s.titulo || '').length;
  const tSize = tl <= 30 ? 150 : tl <= 44 ? 116 : 96;
  return (
    <AbsoluteFill style={{background: BG}}>
      <svg width={1080} height={1350} style={{position: 'absolute'}}>{lines}</svg>
      <div style={{position: 'absolute', left: 70, top: 70, fontFamily: XB, fontSize: 30, letterSpacing: 8, color: GRAY}}>MOTOR SPECS</div>
      <div style={{position: 'absolute', left: 70, top: 116, width: 110, height: 5, background: AMBER}} />
      <div style={{position: 'absolute', right: 70, top: 70, fontFamily: XB, fontSize: 30, letterSpacing: 4, color: GRAY}}>{i + 1}/{slides.length}</div>

      {s.tipo === 'portada' && (<>
        {s.categoria && <div style={{position: 'absolute', left: 70, top: 230, padding: '10px 22px', background: AMBER, color: BG, fontFamily: XB, fontSize: 32, letterSpacing: 4}}>{s.categoria}</div>}
        <div style={{position: 'absolute', left: 70, top: 320, width: 940, fontFamily: A, fontSize: tSize, lineHeight: 1.02, color: WHITE, textTransform: 'uppercase'}}>{s.titulo}</div>
        {s.destacado && (<>
          <div style={{position: 'absolute', left: 70, top: 870, width: 940, fontFamily: A, fontSize: 220, lineHeight: 1, color: AMBER}}>{s.destacado.valor}</div>
          <div style={{position: 'absolute', left: 74, top: 1100, width: 940, fontFamily: XB, fontSize: 32, letterSpacing: 3, color: GRAY}}>{s.destacado.etiqueta}</div>
        </>)}
        <div style={{position: 'absolute', right: 70, top: 1235, fontFamily: XB, fontSize: 34, letterSpacing: 4, color: AMBER}}>DESLIZA →</div>
      </>)}

      {s.tipo === 'texto' && (<>
        <div style={{position: 'absolute', left: 70, top: 220, width: 940, fontFamily: A, fontSize: 96, lineHeight: 1.02, color: AMBER, textTransform: 'uppercase'}}>{s.encabezado}</div>
        <div style={{position: 'absolute', left: 70, top: 360, width: 930, fontFamily: SB, fontSize: 46, lineHeight: 1.36, color: WHITE}}>
          {(s.parrafos || []).map((p, k) => <p key={k} style={{margin: '0 0 26px 0'}}>{p}</p>)}
        </div>
        {(s.datos || []).length > 0 && (
          <div style={{position: 'absolute', left: 70, top: 880, width: 940, display: 'flex', gap: 20}}>
            {(s.datos || []).map((d, k) => (
              <div key={k} style={{flex: 1, background: PANEL, borderRadius: 18, padding: '22px 20px', borderTop: `6px solid ${AMBER}`}}>
                <div style={{fontFamily: A, fontSize: 96, lineHeight: 1, color: AMBER}}>{d.valor}</div>
                <div style={{fontFamily: XB, fontSize: 26, letterSpacing: 2, color: GRAY, marginTop: 10}}>{d.etiqueta}</div>
              </div>
            ))}
          </div>
        )}
        {s.cierre && <div style={{position: 'absolute', left: 70, top: 1120, width: 940, height: 100, borderRadius: 50, background: AMBER, color: BG, fontFamily: XB, fontSize: 34, letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>SÍGUENOS EN MOTOR SPECS</div>}
        {s.fuente && <div style={{position: 'absolute', left: 70, top: 1262, width: 940, fontFamily: SB, fontSize: 26, color: DIM}}>{s.fuente}</div>}
      </>)}
    </AbsoluteFill>
  );
};
