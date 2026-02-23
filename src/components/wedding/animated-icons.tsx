"use client";

import React from "react";
import { cn } from "@/lib/utils";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        trigger?: string;
        delay?: string | number;
        stroke?: string;
        state?: string;
        colors?: string;
      };
      'animated-icons': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        trigger?: string;
        attributes?: string;
        height?: string | number;
        width?: string | number;
      };
    }
  }
}

export type BaseIconProps = {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
  title?: string;
};

/* =======================================================================================
 * 1) WRAPPERS CDN (Lordicon / DotLottie / LottiePlayer)
 * ======================================================================================= */

/* ------------------------ LORDICON ------------------------ */

type LordIconEl = HTMLElement & {
  playerInstance?: any;
};

type LordIconProps = React.HTMLAttributes<HTMLElement> & {
  src?: string;
  trigger?: string;
  stroke?: string;
  colors?: string;
  state?: string;
};

let lordiconScriptPromise: Promise<void> | null = null;

function ensureLordiconScript(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (lordiconScriptPromise) return lordiconScriptPromise;

  lordiconScriptPromise = new Promise<void>((resolve) => {
    const exists = document.querySelector('script[data-lordicon="1"]');
    if (exists) return resolve();

    const s = document.createElement("script");
    s.src = "https://cdn.lordicon.com/lordicon.js";
    s.async = true;
    s.setAttribute("data-lordicon", "1");
    s.onload = () => resolve();
    document.head.appendChild(s);
  });

  return lordiconScriptPromise;
}

const LordIcon = React.forwardRef<LordIconEl, LordIconProps>((props, ref) => {
  React.useEffect(() => {
    ensureLordiconScript();
  }, []);

  return React.createElement("lord-icon", { ...props, ref } as any);
});
LordIcon.displayName = "LordIcon";

/* ------------------------ DOTLOTTIE ------------------------ */

type DotLottieWcEl = HTMLElement & {
  dotLottie?: any;
};

type DotLottieProps = React.HTMLAttributes<HTMLElement> & {
  src?: string;
  autoplay?: boolean;
  loop?: boolean;
  speed?: number;
};

let dotlottieScriptPromise: Promise<void> | null = null;

function ensureDotLottieScript(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (dotlottieScriptPromise) return dotlottieScriptPromise;

  dotlottieScriptPromise = new Promise<void>((resolve) => {
    const exists = document.querySelector('script[data-dotlottie="1"]');
    if (exists) return resolve();

    const s = document.createElement("script");
    s.src =
      "https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.11/dist/dotlottie-wc.js";
    s.type = "module";
    s.async = true;
    s.setAttribute("data-dotlottie", "1");
    s.onload = () => resolve();
    document.head.appendChild(s);
  });

  return dotlottieScriptPromise;
}

export const DotLottie = React.forwardRef<DotLottieWcEl, DotLottieProps>(
  (props, ref) => {
    React.useEffect(() => {
      ensureDotLottieScript();
    }, []);

    return React.createElement("dotlottie-wc", { ...props, ref } as any);
  }
);
DotLottie.displayName = "DotLottie";

/* ------------------------ ANIMATED ICONS (AnimatedIcons.co) ------------------------ */

export const AnimatedIconWc = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & {
  src?: string;
  trigger?: string;
  attributes?: string;
  height?: string | number;
  width?: string | number;
  stroke?: string;
  colors?: string;
}>(({ src, trigger, attributes, stroke, colors, height, width, style, className, ...props }, ref) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => {
    return containerRef.current?.firstElementChild as HTMLElement;
  });

  // Construct the HTML string safely to bypass React's attribute handling issues with custom elements
  // We use single quotes for 'attributes' to allow the JSON (which uses double quotes) to be inside.
  const html = `
    <animated-icons
        src="${src || ''}"
        trigger="${trigger || 'loop'}"
        attributes='${attributes || ''}'
        stroke="${stroke || ''}"
        colors="${colors || ''}"
        style="width: 100%; height: 100%; display: block; margin: 0 auto;"
    ></animated-icons>
  `;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: width || '100%',
        height: height || '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        margin: '0 auto',
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
});
AnimatedIconWc.displayName = "AnimatedIconWc";

/* ------------------------ LordIconWc (Safe Wrapper) ------------------------ */

export const LordIconWc = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & {
  src?: string;
  trigger?: string;
  colors?: string;
  stroke?: string;
  delay?: string | number;
  state?: string;
  target?: string;
  width?: string | number;
  height?: string | number;
}>(({ src, trigger, colors, stroke, delay, state, target, height, width, style, className, ...props }, ref) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => {
    return containerRef.current?.firstElementChild as HTMLElement;
  });

  const html = `
    <lord-icon
        src="${src || ''}"
        trigger="${trigger || 'hover'}"
        ${delay ? `delay="${delay}"` : ''}
        ${stroke ? `stroke="${stroke}"` : ''}
        ${state ? `state="${state}"` : ''}
        ${target ? `target="${target}"` : ''}
        colors="${colors || ''}"
        style="width: 100%; height: 100%; display: block; margin: 0 auto;"
    ></lord-icon>
  `;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: width || '100%',
        height: height || '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        margin: '0 auto',
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
});
LordIconWc.displayName = "LordIconWc";

/* =======================================================================================
 * 2) COMMONS (para SVG simples)
 * ======================================================================================= */

const commonProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "#063b0d",
  strokeWidth: "2.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

type Vec2 = readonly [number, number];
type KFVec2 = { t: number; s: Vec2 };
type KFScalar = { t: number; s: number };

/* =======================================================================================
 * 3) ICONOS
 * ======================================================================================= */

/* ------------------------ CEREMONY (Lordicon) ------------------------ */

export const CeremonyIcon: React.FC<BaseIconProps> = ({
  className,
  size = 96,
  style,
  title,
}) => {
  return (
    <LordIcon
      src="https://cdn.lordicon.com/fshosubk.json"
      trigger="loop"
      stroke="light"
      colors="primary:#063b0d,secondary:#063b0d"
      className={className}
      style={{ width: size, height: size, ...(style ?? {}) }}
      aria-label={title ?? "Ceremonia"}
    />
  );
};

/* ------------------------ RINGS (TU SVG + TU ANIMACIÓN) ✅ ------------------------ */

export const RingsIcon: React.FC<BaseIconProps> = ({
  className,
  size = 120,
  style,
  title,
}) => {
  const heartLRef = React.useRef<SVGGElement | null>(null);
  const heartRRef = React.useRef<SVGGElement | null>(null);
  const ringLRef = React.useRef<SVGGElement | null>(null);
  const ringRRef = React.useRef<SVGGElement | null>(null);

  React.useEffect(() => {
    const elRingL = ringLRef.current;
    const elRingR = ringRRef.current;
    const elHeartL = heartLRef.current;
    const elHeartR = heartRRef.current;
    if (!elRingL || !elRingR || !elHeartL || !elHeartR) return;

    const ringL = elRingL;
    const ringR = elRingR;
    const heartL = elHeartL;
    const heartR = elHeartR;

    const fr = 25;
    const op = 104;
    const durationMs = (op / fr) * 1000;

    const KF_LEFT_RING: KFVec2[] = [
      { t: 0, s: [40.013, 98.582] },
      { t: 10, s: [60.013, 98.582] },
      { t: 13, s: [50.013, 98.582] },
      { t: 16, s: [60.013, 98.582] },
      { t: 19, s: [54.013, 98.582] },
      { t: 22, s: [60.013, 98.582] },
      { t: 25, s: [58.013, 98.582] },
      { t: 28, s: [60.013, 98.582] },
      { t: 67, s: [60.013, 98.582] },
      { t: 82, s: [70.013, 98.582] },
      { t: 104, s: [40.013, 98.582] },
    ];

    const KF_RIGHT_RING: KFVec2[] = [
      { t: -1, s: [113.062, 101.128] },
      { t: 0, s: [112.911, 101.128] },
      { t: 10, s: [93.062, 101.128] },
      { t: 13, s: [103.062, 101.128] },
      { t: 16, s: [93.062, 101.128] },
      { t: 19, s: [99.062, 101.128] },
      { t: 22, s: [93.062, 101.128] },
      { t: 25, s: [95.062, 101.128] },
      { t: 28, s: [93.062, 101.128] },
      { t: 67, s: [93.062, 101.128] },
      { t: 82, s: [83.062, 101.128] },
      { t: 103, s: [113.062, 101.128] },
    ];

    const KF_RIGHT_HEART_POS: KFVec2[] = [
      { t: 10, s: [82.934, 62.468] },
      { t: 36, s: [92.943, 33.68] },
      { t: 66, s: [93.443, 39.68] },
    ];
    const KF_RIGHT_HEART_OPA: KFScalar[] = [
      { t: 10, s: 0 },
      { t: 41, s: 100 },
      { t: 66, s: 0 },
    ];
    const KF_LEFT_HEART_POS: KFVec2[] = [
      { t: 25, s: [78.253, 67.332] },
      { t: 41, s: [63.253, 31.332] },
      { t: 100, s: [62.753, 44.832] },
    ];
    const KF_LEFT_HEART_OPA: KFScalar[] = [
      { t: 25, s: 0 },
      { t: 41, s: 100 },
      { t: 100, s: 0 },
    ];

    const A_RING_L: Vec2 = [39.72, 40.464] as const;
    const A_RING_R: Vec2 = [37.234, 37.918] as const;
    const A_HEART_L: Vec2 = [15.862, 18.206] as const;
    const A_HEART_R: Vec2 = [12.479, 14.141] as const;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    function findSegment<T extends { t: number; s: any }>(
      kfs: T[],
      frame: number
    ): [T, T, number] {
      if (frame <= kfs[0].t) return [kfs[0], kfs[0], 0];
      for (let i = 0; i < kfs.length - 1; i++) {
        const k0 = kfs[i];
        const k1 = kfs[i + 1];
        if (frame >= k0.t && frame <= k1.t) {
          const span = k1.t - k0.t || 1;
          return [k0, k1, (frame - k0.t) / span];
        }
      }
      return [kfs[kfs.length - 1], kfs[kfs.length - 1], 0];
    }

    function sampleVec2(kfs: KFVec2[], frame: number): Vec2 {
      const [k0, k1, tn0] = findSegment(kfs, frame);
      const tn = easeInOut(tn0);
      return [
        lerp(k0.s[0], k1.s[0], tn),
        lerp(k0.s[1], k1.s[1], tn),
      ] as const;
    }

    function sampleScalar(kfs: KFScalar[], frame: number): number {
      const [k0, k1, tn0] = findSegment(kfs, frame);
      const tn = easeInOut(tn0);
      return lerp(k0.s, k1.s, tn);
    }

    function lottiePosToTranslate(pos: Vec2, anchor: Vec2): Vec2 {
      return [pos[0] - anchor[0], pos[1] - anchor[1]] as const;
    }

    function setTranslate(el: SVGGElement, tx: number, ty: number) {
      el.setAttribute("transform", `matrix(1,0,0,1,${tx},${ty})`);
    }

    function setOpacity(el: SVGGElement, o01: number) {
      el.setAttribute("opacity", String(o01));
    }

    const t0 = performance.now();
    let raf = 0;
    let alive = true;

    function tick(now: number) {
      if (!alive) return;

      const elapsed = (now - t0) % durationMs;
      const frame = (elapsed / 1000) * fr;

      const pL = sampleVec2(KF_LEFT_RING, frame);
      const [txL, tyL] = lottiePosToTranslate(pL, A_RING_L);
      setTranslate(ringL, txL, tyL);

      const pR = sampleVec2(KF_RIGHT_RING, frame);
      const [txR, tyR] = lottiePosToTranslate(pR, A_RING_R);
      setTranslate(ringR, txR, tyR);

      const pHeartR = sampleVec2(KF_RIGHT_HEART_POS, frame);
      const [txHeartR, tyHeartR] = lottiePosToTranslate(pHeartR, A_HEART_R);
      setTranslate(heartR, txHeartR, tyHeartR);
      setOpacity(heartR, sampleScalar(KF_RIGHT_HEART_OPA, frame) / 100);

      const pHeartL = sampleVec2(KF_LEFT_HEART_POS, frame);
      const [txHeartL, tyHeartL] = lottiePosToTranslate(pHeartL, A_HEART_L);
      setTranslate(heartL, txHeartL, tyHeartL);
      setOpacity(heartL, sampleScalar(KF_LEFT_HEART_OPA, frame) / 100);

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 150 150"
      preserveAspectRatio="xMidYMid meet"
      className={cn(className)}
      style={{ width: size, height: size, color: "#063b0d", overflow: "visible", ...(style ?? {}) }}
      role="img"
      aria-label={title ?? "Anillos"}
    >
      <g>
        {/* ❤️ corazonIzquierda */}
        <g
          ref={heartLRef}
          className="corazonIzquierda"
          style={{ display: "block" }}
          opacity="0"
        >
          <g
            opacity="1"
            transform="matrix(1,0,0,1,15.862000465393066,18.20599937438965)"
          >
            <path
              strokeLinecap="butt"
              strokeLinejoin="miter"
              fillOpacity="0"
              strokeMiterlimit="10"
              stroke="currentColor"
              strokeOpacity="1"
              strokeWidth="1.69"
              d="M5.723999977111816,13.821000099182129 C5.0320000648498535,13.980999946594238 4.348999977111816,13.571000099182129 3.8429999351501465,13.267999649047852 C3.746000051498413,13.208999633789062 3.6540000438690186,13.154000282287598 3.5880000591278076,13.119999885559082 C1.1929999589920044,11.869000434875488 -0.9959999918937683,10.317999839782715 -2.9170000553131104,8.51099967956543 C-3.372999906539917,8.081999778747559 -3.819999933242798,7.631999969482422 -4.247000217437744,7.172999858856201 C-7.150000095367432,4.053999900817871 -9.331000328063965,0.3230000138282776 -10.729000091552734,-3.9159998893737793 C-11.215999603271484,-5.392000198364258 -11.63700008392334,-6.964000225067139 -10.984000205993652,-8.532999992370605 C-10.770000457763672,-9.045000076293945 -10.244999885559082,-9.968999862670898 -9.12399959564209,-10.395999908447266 C-7.9720001220703125,-10.833999633789062 -6.633999824523926,-10.58899974822998 -5.252999782562256,-9.685999870300293 C-2.2239999771118164,-7.705999851226807 -0.42800000309944153,-4.798999786376953 0.972000002861023,-1.7589999437332153 C1.1929999589920044,-4.679999828338623 1.7610000371932983,-7.297999858856201 2.690000057220459,-9.704000473022461 C3.0209999084472656,-10.557000160217285 3.4240000247955322,-11.456000328063965 4.142000198364258,-12.244999885559082 C4.9730000495910645,-13.157999992370605 6.098999977111816,-13.744000434875488 7.230000019073486,-13.85200023651123 C8.588000297546387,-13.980999946594238 10.378000259399414,-13.345000267028809 11.100000381469727,-11.642999649047852 C11.63700008392334,-10.37399959564209 11.4350004196167,-8.961999893188477 11.20199966430664,-7.738999843597412 C10.869000434875488,-5.986000061035156 10.404000282287598,-4.21999979019165 9.954000473022461,-2.51200008392334 C9.50100040435791,-0.7910000085830688 9.032999992370605,0.9869999885559082 8.704000473022461,2.73799991607666 C8.505000114440918,3.802999973297119 8.354000091552734,4.892000198364258 8.208000183105469,5.945000171661377 C8.135000228881836,6.478000164031982 8.057999610900879,7.03000020980835 7.97599983215332,7.572999954223633 C7.785999774932861,8.835000038146973 7.5329999923706055,10.321999549865723 7.103000164031982,11.795000076293945 C7.083000183105469,11.861000061035156 7.064000129699707,11.942000389099121 7.043000221252441,12.031000137329102 C6.9019999504089355,12.621999740600586 6.690000057220459,13.513999938964844 5.836999893188477,13.789999961853027 C5.798999786376953,13.802000045776367 5.76200008392334,13.812999725341797 5.723999977111816,13.821000099182129z"
            />
          </g>
        </g>

        {/* ❤️ corazonDerecha */}
        <g
          ref={heartRRef}
          className="corazonDerecha"
          style={{ display: "block" }}
          opacity="0"
        >
          <g
            opacity="1"
            transform="matrix(1,0,0,1,12.479000091552734,14.140999794006348)"
          >
            <path
              strokeLinecap="butt"
              strokeLinejoin="miter"
              fillOpacity="0"
              strokeMiterlimit="10"
              stroke="currentColor"
              strokeOpacity="1"
              strokeWidth="1.69"
              d="M-4.139999866485596,9.779000282287598 C-4.744999885559082,9.583000183105469 -4.895999908447266,8.951000213623047 -4.994999885559082,8.531999588012695 C-5.011000156402588,8.468999862670898 -5.021999835968018,8.411999702453613 -5.035999774932861,8.364999771118164 C-5.3420000076293945,7.320000171661377 -5.521999835968018,6.264999866485596 -5.6570000648498535,5.370999813079834 C-5.715000152587891,4.985000133514404 -5.769999980926514,4.593999862670898 -5.821000099182129,4.216000080108643 C-5.925000190734863,3.4690001010894775 -6.0320000648498535,2.696000099182129 -6.173999786376953,1.940999984741211 C-6.406000137329102,0.699999988079071 -6.738999843597412,-0.5619999766349792 -7.059999942779541,-1.781999945640564 C-7.379000186920166,-2.993000030517578 -7.709000110626221,-4.245999813079834 -7.945000171661377,-5.488999843597412 C-8.109000205993652,-6.35699987411499 -8.253999710083008,-7.357999801635742 -7.872000217437744,-8.258000373840332 C-7.360000133514404,-9.46500015258789 -6.091000080108643,-9.916000366210938 -5.127999782562256,-9.824999809265137 C-4.324999809265137,-9.74899959564209 -3.5269999504089355,-9.333000183105469 -2.937999963760376,-8.6850004196167 C-2.428999900817871,-8.125 -2.1429998874664307,-7.48799991607666 -1.9079999923706055,-6.882999897003174 C-1.2489999532699585,-5.176000118255615 -0.847000002861023,-3.319999933242798 -0.6890000104904175,-1.2489999532699585 C0.30399999022483826,-3.4040000438690186 1.5779999494552612,-5.465000152587891 3.7269999980926514,-6.870999813079834 C4.705999851226807,-7.511000156402588 5.6539998054504395,-7.684999942779541 6.4710001945495605,-7.374000072479248 C7.265999794006348,-7.071000099182129 7.638999938964844,-6.415999889373779 7.789999961853027,-6.052999973297119 C8.253000259399414,-4.939000129699707 7.954999923706055,-3.825000047683716 7.609000205993652,-2.7780001163482666 C6.617000102996826,0.2280000001192093 5.070000171661377,2.875 3.01200008392334,5.086999893188477 C2.7090001106262207,5.4120001792907715 2.3919999599456787,5.730999946594238 2.068000078201294,6.035999774932861 C0.7059999704360962,7.316999912261963 -0.8460000157356262,8.416999816894531 -2.5450000762939453,9.303999900817871 C-2.5920000076293945,9.329000473022461 -2.6570000648498535,9.368000030517578 -2.7260000705718994,9.409000396728516 C-3.0850000381469727,9.625 -3.569000005722046,9.916000366210938 -4.059999942779541,9.802000045776367 C-4.085999965667725,9.795000076293945 -4.11299991607666,9.788000106811523 -4.139999866485596,9.779000282287598z"
            />
          </g>
        </g>

        {/* 💍 anilloIzquierda */}
        <g
          ref={ringLRef}
          className="anilloIzquierda"
          opacity="1"
          style={{ display: "block" }}
        >
          <g
            opacity="1"
            transform="matrix(1,0,0,1,39.720001220703125,40.4640007019043)"
          >
            <path
              strokeLinecap="butt"
              strokeLinejoin="miter"
              fillOpacity="0"
              strokeMiterlimit="10"
              stroke="currentColor"
              strokeOpacity="1"
              strokeWidth="2"
              d="M31.128000259399414,0 C31.128000259399414,17.60300064086914 17.191999435424805,31.871999740600586 0,31.871999740600586 C-17.19099998474121,31.871999740600586 -31.128000259399414,17.60300064086914 -31.128000259399414,0 C-31.128000259399414,-17.601999282836914 -17.19099998474121,-31.871999740600586 0,-31.871999740600586 C17.191999435424805,-31.871999740600586 31.128000259399414,-17.601999282836914 31.128000259399414,0z"
            />
          </g>
        </g>

        {/* 💍 anilloDerecha */}
        <g
          ref={ringRRef}
          className="anilloDerecha"
          opacity="1"
          style={{ display: "block" }}
        >
          <g
            opacity="1"
            transform="matrix(1,0,0,1,37.23400115966797,37.917999267578125)"
          >
            <path
              strokeLinecap="butt"
              strokeLinejoin="miter"
              fillOpacity="0"
              strokeMiterlimit="10"
              stroke="currentColor"
              strokeOpacity="1"
              strokeWidth="2"
              d="M28.642000198364258,0 C28.642000198364258,16.195999145507812 15.817999839782715,29.326000213623047 -0.0010000000474974513,29.326000213623047 C-15.819000244140625,29.326000213623047 -28.641000747680664,16.195999145507812 -28.641000747680664,0 C-28.641000747680664,-16.195999145507812 -15.819000244140625,-29.326000213623047 -0.0010000000474974513,-29.326000213623047 C15.817999839782715,-29.326000213623047 28.642000198364258,-16.195999145507812 28.642000198364258,0z"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

/* ------------------------ PARTY HAT (was placeholder) ------------------------ */

export const PartyHatIcon: React.FC<BaseIconProps> = ({
  className,
  size = 96,
  style,
  title,
}) => {
  return (
    <LordIcon
      src="https://cdn.lordicon.com/ohcuigqh.json"
      trigger="loop"
      state="hover-pinch"
      stroke="light"
      colors="primary:#063b0d,secondary:#063b0d"
      className={className}
      style={{ width: size, height: size, ...(style ?? {}) }}
      aria-label={title ?? "Celebración"}
    />
  );
};



/* ------------------------ CAMERA (Lordicon) ------------------------ */

export const CameraIcon: React.FC<BaseIconProps> = ({
  className,
  size = 96,
  style,
  title = "Cámara",
}) => {
  return (
    <span
      className={cn("inline-block", className)}
      style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", ...(style ?? {}) }}
      role="img"
      aria-label={title}
    >
      <div
        style={{ width: "100%", height: "100%" }}
        dangerouslySetInnerHTML={{
          __html: `
            <lord-icon
                src="https://cdn.lordicon.com/wsaaegar.json"
                trigger="loop"
                delay="2000"
                speed="0.6"
                stroke="light"
                colors="primary:#063b0d,secondary:#063b0d"
                style="width:70%;height:70%">
            </lord-icon>
          `,
        }}
      />
    </span>
  );
};
/* ------------------------ IconWrapper ------------------------ */

export const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary border border-primary shadow-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
    {children}
  </div>
);

/* ------------------------ COPAS + CORAZONES ------------------------ */

export const ClinkingGlassesIcon: React.FC<BaseIconProps & { color?: string }> = ({
  className,
  size = 97,
  style,
  title,
  color = "#063b0d",
}) => {
  const cupsRef = React.useRef<LordIconEl | null>(null);
  const heartIconRefs = React.useRef<(LordIconEl | null)[]>([]);
  const heartFxRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    function playFromStart(player: any) {
      if (!player) return;
      if (typeof player.playFromStart === "function") return player.playFromStart();
      if (typeof player.playFromBeginning === "function")
        return player.playFromBeginning();
      if (typeof player.goToFirstFrame === "function") player.goToFirstFrame();
      if (typeof player.play === "function") return player.play();
    }

    function popHearts() {
      heartFxRefs.current.forEach((fx) => {
        if (!fx) return;
        fx.classList.remove("show");
        void fx.offsetWidth;
        fx.classList.add("show");
      });

      heartIconRefs.current.forEach((heart) => {

      });
    }

    function mountFrameListener(p: any) {
      if (!p) return;

      let clinkFrame = Number(localStorage.getItem("clinkFrame"));
      if (!clinkFrame || !Number.isFinite(clinkFrame)) {
        clinkFrame = Math.round((p.frames || 100) * 0.45);
      }

      let fired = false;
      let lastFrame = 0;

      const onFrame = () => {
        const f = p.frame ?? 0;
        if (f < lastFrame) fired = false;
        lastFrame = f;

        if (!fired && f >= clinkFrame) {
          fired = true;
          popHearts();
        }
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (!e?.key) return;
        if (e.key.toLowerCase() !== "c") return;
        clinkFrame = Math.round(p.frame ?? clinkFrame);
        localStorage.setItem("clinkFrame", String(clinkFrame));
      };

      p.addEventListener("frame", onFrame);
      document.addEventListener("keydown", onKeyDown);

      cleanup = () => {
        p.removeEventListener("frame", onFrame);
        document.removeEventListener("keydown", onKeyDown);
      };
    }

    (async () => {
      await ensureLordiconScript();
      if (disposed) return;

      const cupsEl = cupsRef.current;
      if (!cupsEl) return;

      const onReady = () => {
        if (disposed) return;
        const p = cupsEl.playerInstance;
        if (p) mountFrameListener(p);
      };
      cupsEl.addEventListener("ready", onReady);

      const maxWaitMs = 2000;
      const start = Date.now();

      const tick = () => {
        if (disposed) return;
        const p = cupsEl.playerInstance;
        if (p) {
          cupsEl.removeEventListener("ready", onReady);
          mountFrameListener(p);
          return;
        }
        if (Date.now() - start < maxWaitMs) {
          requestAnimationFrame(tick);
        }
      };
      tick();

      const prev = cleanup;
      cleanup = () => {
        prev?.();
        cupsEl.removeEventListener("ready", onReady);
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  const cupsPx = Math.round(size * 0.92);
  const heartPx = Math.round(size * 0.3);
  const heartPxCenter = heartPx;
  const heartPxSide = Math.max(10, Math.round(heartPx * 0.72));

  return (
    <div
      className={cn("relative inline-block overflow-visible", className)}
      style={{ width: size, height: size, ...(style ?? {}) }}
      role="img"
      aria-label={title ?? "Cin cin"}
    >
      <style>{`
        .heart{
          position:absolute;
          left:50%;
          top:10%;
          --hx: 0px;
          --delay: 0ms;
          transform: translate(calc(-50% + var(--hx)), 0);
          opacity:0;
          visibility:hidden;
          pointer-events:none;
          z-index:9999;
        }
        .heart.show{
          visibility:visible;
          animation: floatUp 1800ms ease-out forwards;
          animation-delay: var(--delay);
        }
        @keyframes floatUp{
          0%   { opacity:0; transform:translate(calc(-50% + var(--hx)), 12px) scale(0.9); }
          10%  { opacity:1; transform:translate(calc(-50% + var(--hx)), 0px)  scale(1); }
          80%  { opacity:1; transform:translate(calc(-50% + var(--hx)), -55px) scale(1); }
          100% { opacity:0; transform:translate(calc(-50% + var(--hx)), -70px) scale(1); }
        }
      `}</style>

      <div
        ref={(el) => {
          heartFxRefs.current[0] = el;
        }}
        className="heart"
        style={
          { ["--hx" as any]: "-22px", ["--delay" as any]: "140ms" } as React.CSSProperties
        }
      >
        <LordIcon
          ref={(el) => {
            heartIconRefs.current[0] = el;
          }}
          src="https://cdn.lordicon.com/nvsfzbop.json"
          trigger="loop"
          stroke="light"
          colors={`primary:${color},secondary:${color}`}
          style={{ width: heartPxSide, height: heartPxSide }}
        />
      </div>

      <div
        ref={(el) => {
          heartFxRefs.current[1] = el;
        }}
        className="heart"
        style={
          { ["--hx" as any]: "0px", ["--delay" as any]: "0ms" } as React.CSSProperties
        }
      >
        <LordIcon
          ref={(el) => {
            heartIconRefs.current[1] = el;
          }}
          src="https://cdn.lordicon.com/nvsfzbop.json"
          trigger="loop"
          stroke="regular"
          colors={`primary:${color},secondary:${color}`}
          style={{ width: heartPxCenter, height: heartPxCenter }}
        />
      </div>

      <div
        ref={(el) => {
          heartFxRefs.current[2] = el;
        }}
        className="heart"
        style={
          { ["--hx" as any]: "22px", ["--delay" as any]: "200ms" } as React.CSSProperties
        }
      >
        <LordIcon
          ref={(el) => {
            heartIconRefs.current[2] = el;
          }}
          src="https://cdn.lordicon.com/nvsfzbop.json"
          trigger="loop"
          stroke="regular"
          colors={`primary:${color},secondary:${color}`}
          style={{ width: heartPxSide, height: heartPxSide }}
        />
      </div>

      <div style={{ position: "absolute", inset: 0 }}>
        <LordIcon
          ref={cupsRef}
          src="https://cdn.lordicon.com/yvgmrqny.json"
          trigger="loop"
          stroke="regular"
          colors={`primary:${color},secondary:${color}`}
          style={{
            width: cupsPx,
            height: cupsPx,
            display: "block",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
};

export const LordiconClinkingGlasses = ClinkingGlassesIcon;

/* ------------------------ DINNER (PNG) ------------------------ */

export const DinnerIcon: React.FC<BaseIconProps> = ({
  className,
  size = 180,
  style,
  title,
}) => {
  return (
    <span
      className={cn("inline-block", className)}
      style={{ width: size, height: size, display: "block", ...(style ?? {}) }}
      role="img"
      aria-label={title ?? "Cena"}
    >
      <style>{`
        .__dinnerFade { animation: __dinnerFade 3s linear infinite; }
        .__dinnerPulse { animation: __dinnerPulse 3s ease-in-out infinite; transform-origin: 50% 50%; }
        @keyframes __dinnerFade { 0% { opacity: 0; } 11.12% { opacity: 1; } 100% { opacity: 1; } }
        @keyframes __dinnerPulse {
          0% { transform: scale(1); }
          16.67% { transform: scale(1.03); }
          33.33% { transform: scale(1); }
          50% { transform: scale(1.03); }
          66.67% { transform: scale(1); }
          83.33% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce){
          .__dinnerFade, .__dinnerPulse { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>
      <img
        src="/cena-romantica.png"
        alt={title ?? "Cena"}
        className="__dinnerFade __dinnerPulse"
        style={{ width: "100%", height: "100%", display: "block" }}
        draggable={false}
      />
    </span>
  );
};

/* ------------------------ PARTY (Lordicon) ------------------------ */

export const PartyIcon: React.FC<BaseIconProps & { color?: string }> = ({
  className,
  size = 96,
  style,
  color = "currentColor",
}) => (
  <LordIcon
    src="https://cdn.lordicon.com/jjqwsavk.json"
    trigger="loop"
    stroke="light"
    colors="primary:#063b0d,secondary:#063b0d"
    className={className}
    style={{ width: size, height: size, ...(style ?? {}) }}
  />
);

/* ------------------------ FADING PARTY (Lordicon) ------------------------ */

export const FadingPartyIcon: React.FC<BaseIconProps & { color?: string }> = ({
  className,
  size = 96,
  style,
  color = "currentColor",
}) => {
  return (
    <div
      className={cn("fading-party-icon", className)}
      style={{ width: size, height: size, ...(style ?? {}) }}
    >
      <style>{`
        .fading-party-icon {
          animation: fadeOutAndShrink 4s ease-in-out infinite;
        }
        @keyframes fadeOutAndShrink {
          0%, 50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.7);
          }
        }
        @media (prefers-reduced-motion: reduce){
          .fading-party-icon { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>
      <LordIcon
        src="https://cdn.lordicon.com/jjqwsavk.json"
        trigger="loop"
        stroke="light"
        colors="primary:#063b0d,secondary:#063b0d"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

/* ------------------------ END (SVG simple) ------------------------ */

export const EndOfPartyIcon: React.FC<BaseIconProps> = ({
  className,
  size = 64,
  style,
}) => (
  <svg
    {...commonProps}
    className={cn(className)}
    style={{ width: size, height: size, ...(style ?? {}) }}
  >
    <path d="M22 22 L42 42 M22 42 L42 22" />
  </svg>
);

/* ------------------------ BUS (SVG + CSS) ------------------------ */

export const AnimatedBusIcon: React.FC<BaseIconProps> = ({
  className,
  size = 120,
  style,
  title = "Autobús",
}) => {
  return (
    <span
      className={cn("inline-block", className)}
      style={{ width: size, height: size * (84 / 170), color: "#063b0d", ...(style ?? {}) }}
      aria-label={title}
      role="img"
    >
      <style>{`
        .bus-bob {
          animation: bus-bob 0.4s ease-in-out infinite;
          transform-origin: center;
        }
        .bus-road {
          stroke-dasharray: 10, 8;
          animation: bus-road 0.6s linear infinite;
        }
        @keyframes bus-bob {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(1.5px); }
        }
        @keyframes bus-road {
          to { stroke-dashoffset: 18; }
        }
        @media (prefers-reduced-motion: reduce){
          .bus-bob, .bus-road { animation: none !important; }
        }
      `}</style>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 170 84"
        className="w-full h-full"
      >
        <defs>
          <clipPath id="bus-clip"><rect width="170" height="84" x="0" y="0"></rect></clipPath>
        </defs>

        <g clipPath="url(#bus-clip)">

          {/* suelo */}
          <g style={{ display: "block" }}>
            <path className="bus-road" strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10"
              stroke="currentColor" strokeOpacity="1" strokeWidth="2.5"
              d="M16.042999267578125,78.33300018310547 H149.37600708007812" />
          </g>

          <g transform="translate(-8, 0)">
            {/* coche (bote) */}
            <g className="bus-bob" transform="translate(0, 1.123)" style={{ display: "block" }}>
              <g>
                <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10"
                  stroke="currentColor" strokeOpacity="1" strokeWidth="2.5"
                  d="M107.336,68.555 H71.78" />
              </g>

              <g transform="translate(90.521, 40.333)">
                <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10"
                  stroke="currentColor" strokeOpacity="1" strokeWidth="2.5"
                  d="M-44.519,28.222 H-48.489 C-51.328,28.222 -53.63,25.716 -53.63,22.625 V-22.626 C-53.63,-25.717 -51.328,-28.222 -48.489,-28.222 H43.895 C46.735,-28.222 49.037,-25.717 49.037,-22.626 V-1.532 V22.625 C49.037,25.716 46.735,28.222 43.895,28.222 H43.481" />
              </g>

              <g transform="translate(58.669, 30.819)">
                <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10"
                  stroke="currentColor" strokeOpacity="1" strokeWidth="2.5"
                  d="M11.43,11.128 H-11.43 C-13.094,11.128 -14.445,9.778 -14.445,8.113 V-8.113 C-14.445,-9.778 -13.094,-11.128 -11.43,-11.128 H11.43 C13.095,-11.128 14.445,-9.778 14.445,-8.113 V8.113 C14.445,9.778 13.095,11.128 11.43,11.128" />
              </g>

              <g transform="translate(94.447, 30.819)">
                <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10"
                  stroke="currentColor" strokeOpacity="1" strokeWidth="2.5"
                  d="M11.431,11.128 H-11.43 C-13.094,11.128 -14.445,9.778 -14.445,8.113 V-8.113 C-14.445,-9.778 -13.094,-11.128 -11.43,-11.128 H11.431 C13.096,-11.128 14.445,-9.778 14.445,-8.113 V8.113 C14.445,9.778 13.096,11.128 11.431,11.128" />
              </g>

              <g transform="translate(129.892, 33.238)">
                <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10"
                  stroke="currentColor" strokeOpacity="1" strokeWidth="2.5"
                  d="M14.111,13.546 C14.111,13.546 -10.977,8.708 -10.977,8.708 C-12.708,8.708 -14.111,7.18 -14.111,5.296 V-10.135 C-14.111,-12.019 -12.708,-13.547 -10.977,-13.547 H9.667" />
              </g>

              <g>
                <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10"
                  stroke="currentColor" strokeOpacity="1" strokeWidth="2.5"
                  d="M58.891,20.175 V41.463" />
              </g>

              <g>
                <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10"
                  stroke="currentColor" strokeOpacity="1" strokeWidth="2.5"
                  d="M94.447,20.175 V41.463" />
              </g>

              <g>
                <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10"
                  stroke="currentColor" strokeOpacity="1" strokeWidth="2.5"
                  d="M114.669,48.645 H120.225" />
              </g>
            </g>

            {/* ruedas (quietas) */}
            <g style={{ display: "block" }}>
              <g id="wheel1" transform="translate(58.826, 68.222)">
                <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10"
                  stroke="currentColor" strokeOpacity="1" strokeWidth="2.5"
                  d="M8.778,0 C8.778,4.848 4.848,8.778 0,8.778 C-4.848,8.778 -8.778,4.848 -8.778,0 C-8.778,-4.848 -4.848,-8.778 0,-8.778 C4.848,-8.778 8.778,-4.848 8.778,0z" />
              </g>

              <g id="wheel2" transform="translate(121.188, 68.222)">
                <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10"
                  stroke="currentColor" strokeOpacity="1" strokeWidth="2.5"
                  d="M8.778,0 C8.778,4.848 4.848,8.778 0,8.778 C-4.848,8.778 -8.778,4.848 -8.778,0 C-8.778,-4.848 -4.848,-8.778 0,-8.778 C4.848,-8.778 8.778,-4.848 8.778,0z" />
              </g>
            </g>
          </g>

        </g>
      </svg>
    </span>
  );
};



/* ------------------------ TIPS & NOTES (AnimatedIcons.co) ------------------------ */

export const TipsIcon: React.FC<BaseIconProps> = ({
  className,
  size = 96,
  style,
  title = "Tips y Notas",
}) => {
  return (
    <div
      className={cn("flex justify-center items-center", className)}
      style={{ width: size, height: size, color: "#063b0d", margin: "0 auto", transform: "translateX(-10px)", ...(style ?? {}) }}
      role="img"
      aria-label={title}
    >
      <AnimatedIconWc
        src="https://animatedicons.co/get-icon?name=note&style=minimalistic&token=cb234c69-9f56-4cf2-844e-2c2109b81513"
        trigger="loop"
        attributes='{"variationThumbColour":"#FFFFFF","variationName":"Normal","variationNumber":1,"numberOfGroups":1,"backgroundIsGroup":false,"strokeWidth":0.88,"defaultColours":{"group-1":"#063b0d","background":"#FFFFFF"}}'
        height="100%"
        width="100%"
        stroke="light"
        colors="primary:#063b0d,secondary:#063b0d"
        style={{ width: "98%", height: "98%" }}
      />
    </div>
  );
};



/* ------------------------ HOTEL (Lordicon) ------------------------ */

export const HotelIcon: React.FC<BaseIconProps> = ({
  className,
  size = 96,
  style,
  title = "Hoteles",
}) => {
  return (
    <div
      className={cn("flex justify-center items-center", className)}
      style={{ width: size, height: size, color: "#063b0d", margin: "10 auto", ...(style ?? {}) }}
      role="img"
      aria-label={title}
    >
      <LordIconWc
        src="https://cdn.lordicon.com/moridxxu.json"
        trigger="loop"
        stroke="light"
        colors="primary:#063b0d,secondary:#063b0d"
        style={{ width: "98%", height: "98%" }}
      />
    </div>
  );
};



/* ------------------------ DRESSCODE (AnimatedIcons.co) ------------------------ */

export const DresscodeIcon: React.FC<BaseIconProps> = ({
  className,
  size = 96,
  style,
  title = "Dresscode",
}) => {
  return (
    <div
      className={cn("flex justify-center items-center", className)}
      style={{ width: size, stroke: "light", height: size, color: "#063b0d", margin: "0 auto", transform: "translateX(-6px)", ...(style ?? {}) }}
      role="img"
      aria-label={title}
    >
      <AnimatedIconWc
        src="https://animatedicons.co/get-icon?name=Neck%20Tie&style=minimalistic&token=762fea02-68a8-43f8-9153-42da75726e8c"
        trigger="loop"
        attributes='{"variationThumbColour":"#FFFFFF","variationName":"Normal","variationNumber":1,"numberOfGroups":1,"backgroundIsGroup":false,"strokeWidth":1,"defaultColours":{"group-1":"#063b0d","background":"#FFFFFF"}}'
        height="100%"
        width="100%"
        stroke="light"
        colors="primary:#063b0d,secondary:#063b0d"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
