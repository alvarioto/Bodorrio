"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";

const commonProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "hsl(140, 8%, 25%)",
  strokeWidth: "2.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const RingsIcon = ({ className }: { className?: string }) => {
  const heartLRef = useRef<SVGGElement>(null);
  const heartRRef = useRef<SVGGElement>(null);
  const ringLRef = useRef<SVGGElement>(null);
  const ringRRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const elRingL  = ringLRef.current;
    const elRingR  = ringRRef.current;
    const elHeartL = heartLRef.current;
    const elHeartR = heartRRef.current;

    if (!elRingL || !elRingR || !elHeartL || !elHeartR){
      return;
    }

    const fr = 25;
    const op = 104;
    const durationMs = (op / fr) * 1000;

    const KF_LEFT_RING = [
      { t: 0,   s: [40.013, 98.582] }, { t: 10,  s: [60.013, 98.582] },
      { t: 13,  s: [50.013, 98.582] }, { t: 16,  s: [60.013, 98.582] },
      { t: 19,  s: [54.013, 98.582] }, { t: 22,  s: [60.013, 98.582] },
      { t: 25,  s: [58.013, 98.582] }, { t: 28,  s: [60.013, 98.582] },
      { t: 67,  s: [60.013, 98.582] }, { t: 82,  s: [70.013, 98.582] },
      { t: 104, s: [40.013, 98.582] },
    ];

    const KF_RIGHT_RING = [
      { t: -1,  s: [113.062, 101.128] }, { t: 0,   s: [112.911, 101.128] },
      { t: 10,  s: [93.062,  101.128] }, { t: 13,  s: [103.062, 101.128] },
      { t: 16,  s: [93.062,  101.128] }, { t: 19,  s: [99.062,  101.128] },
      { t: 22,  s: [93.062,  101.128] }, { t: 25,  s: [95.062,  101.128] },
      { t: 28,  s: [93.062,  101.128] }, { t: 67,  s: [93.062,  101.128] },
      { t: 82,  s: [83.062,  101.128] }, { t: 103, s: [113.062, 101.128] },
    ];

    const KF_RIGHT_HEART_POS = [ { t: 10, s: [82.934, 62.468] }, { t: 36, s: [92.943, 33.68] }, { t: 66, s: [93.443, 39.68] }, ];
    const KF_RIGHT_HEART_OPA = [ { t: 10, s: 0 }, { t: 41, s: 100 }, { t: 66, s: 0 }, ];
    const KF_LEFT_HEART_POS = [ { t: 25, s: [78.253, 67.332] }, { t: 41, s: [63.253, 31.332] }, { t: 100, s: [62.753, 44.832] }, ];
    const KF_LEFT_HEART_OPA = [ { t: 25, s: 0 }, { t: 41, s: 100 }, { t: 100, s: 0 }, ];

    const A_RING_L  = [39.72,  40.464];
    const A_RING_R  = [37.234, 37.918];
    const A_HEART_L = [15.862, 18.206];
    const A_HEART_R = [12.479, 14.141];

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    function easeInOut(t: number){ return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2; }

    function findSegment(kfs: {t: number, s: any}[], frame: number){
      if (frame <= kfs[0].t) return [kfs[0], kfs[0], 0];
      for (let i = 0; i < kfs.length - 1; i++){
        const k0 = kfs[i], k1 = kfs[i+1];
        if (frame >= k0.t && frame <= k1.t){
          const span = (k1.t - k0.t) || 1;
          const tn = (frame - k0.t) / span;
          return [k0, k1, tn];
        }
      }
      return [kfs[kfs.length - 1], kfs[kfs.length - 1], 0];
    }

    function sampleVec2(kfs: {t: number, s: number[]}[], frame: number){
      const [k0, k1, tn0] = findSegment(kfs, frame);
      const tn = easeInOut(tn0 as number);
      const x = lerp(k0.s[0], k1.s[0], tn);
      const y = lerp(k0.s[1], k1.s[1], tn);
      return [x,y];
    }

    function sampleScalar(kfs: {t: number, s: number}[], frame: number){
      const [k0, k1, tn0] = findSegment(kfs, frame);
      const tn = easeInOut(tn0 as number);
      return lerp(k0.s, k1.s, tn);
    }

    function lottiePosToTranslate(pos: number[], anchor: number[]){ return [pos[0] - anchor[0], pos[1] - anchor[1]]; }
    function setTranslate(el: SVGGElement, tx: number, ty: number){ el.setAttribute("transform", `matrix(1,0,0,1,${tx},${ty})`); }
    function setOpacity(el: SVGGElement, o01: number){ el.setAttribute("opacity", String(o01)); }

    const t0 = performance.now();
    let animationFrameId: number;

    function tick(now: number){
      const elapsed = (now - t0) % durationMs;
      const frame = (elapsed / 1000) * fr;

      const pL = sampleVec2(KF_LEFT_RING, frame);
      const [txL, tyL] = lottiePosToTranslate(pL, A_RING_L);
      setTranslate(elRingL, txL, tyL);

      const pR = sampleVec2(KF_RIGHT_RING, frame);
      const [txR, tyR] = lottiePosToTranslate(pR, A_RING_R);
      setTranslate(elRingR, txR, tyR);
      
      const pHeartR = sampleVec2(KF_RIGHT_HEART_POS, frame);
      const [txHeartR, tyHeartR] = lottiePosToTranslate(pHeartR, A_HEART_R);
      setTranslate(elHeartR, txHeartR, tyHeartR);
      const oHeartR = sampleScalar(KF_RIGHT_HEART_OPA, frame) / 100;
      setOpacity(elHeartR, oHeartR);

      const pHeartL = sampleVec2(KF_LEFT_HEART_POS, frame);
      const [txHeartL, tyHeartL] = lottiePosToTranslate(pHeartL, A_HEART_L);
      setTranslate(elHeartL, txHeartL, tyHeartL);
      const oHeartL = sampleScalar(KF_LEFT_HEART_OPA, frame) / 100;
      setOpacity(elHeartL, oHeartL);

      animationFrameId = requestAnimationFrame(tick);
    }

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 150 150"
      preserveAspectRatio="xMidYMid meet"
      className={cn("w-14 h-14", className)}
      style={{ overflow: "visible" }}
    >
      <g stroke="hsl(140, 8%, 25%)" fill="none">
        <g ref={heartLRef} style={{ display: "block" }} transform="matrix(1,0,0,1,62.1048583984375,48.56318664550781)" opacity="1">
          <g opacity="1" transform="matrix(1,0,0,1,15.862000465393066,18.20599937438965)">
            <path strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeOpacity="1" strokeWidth="1.69" d="M5.723999977111816,13.821000099182129 C5.0320000648498535,13.980999946594238 4.348999977111816,13.571000099182129 3.8429999351501465,13.267999649047852 C3.746000051498413,13.208999633789062 3.6540000438690186,13.154000282287598 3.5880000591278076,13.119999885559082 C1.1929999589920044,11.869000434875488 -0.9959999918937683,10.317999839782715 -2.9170000553131104,8.51099967956543 C-3.372999906539917,8.081999778747559 -3.819999933242798,7.631999969482422 -4.247000217437744,7.172999858856201 C-7.150000095367432,4.053999900817871 -9.331000328063965,0.3230000138282776 -10.729000091552734,-3.9159998893737793 C-11.215999603271484,-5.392000198364258 -11.63700008392334,-6.964000225067139 -10.984000205993652,-8.532999992370605 C-10.770000457763672,-9.045000076293945 -10.244999885559082,-9.968999862670898 -9.12399959564209,-10.395999908447266 C-7.9720001220703125,-10.833999633789062 -6.633999824523926,-10.58899974822998 -5.252999782562256,-9.685999870300293 C-2.2239999771118164,-7.705999851226807 -0.42800000309944153,-4.798999786376953 0.972000002861023,-1.7589999437332153 C1.1929999589920044,-4.679999828338623 1.7610000371932983,-7.297999858856201 2.690000057220459,-9.704000473022461 C3.0209999084472656,-10.557000160217285 3.4240000247955322,-11.456000328063965 4.142000198364258,-12.244999885559082 C4.9730000495910645,-13.157999992370605 6.098999977111816,-13.744000434875488 7.230000019073486,-13.85200023651123 C8.588000297546387,-13.980999946594238 10.378000259399414,-13.345000267028809 11.100000381469727,-11.642999649047852 C11.63700008392334,-10.37399959564209 11.4350004196167,-8.961999893188477 11.20199966430664,-7.738999843597412 C10.869000434875488,-5.986000061035156 10.404000282287598,-4.21999979019165 9.954000473022461,-2.51200008392334 C9.50100040435791,-0.7910000085830688 9.032999992370605,0.9869999885559082 8.704000473022461,2.73799991607666 C8.505000114440918,3.802999973297119 8.354000091552734,4.892000198364258 8.208000183105469,5.945000171661377 C8.135000228881836,6.478000164031982 8.057999610900879,7.03000020980835 7.97599983215332,7.572999954223633 C7.785999774932861,8.835000038146973 7.5329999923706055,10.321999549865723 7.103000164031982,11.795000076293945 C7.083000183105469,11.861000061035156 7.064000129699707,11.942000389099121 7.043000221252441,12.031000137329102 C6.9019999504089355,12.621999740600586 6.690000057220459,13.513999938964844 5.836999893188477,13.789999961853027 C5.798999786376953,13.802000045776367 5.76200008392334,13.812999725341797 5.723999977111816,13.821000099182129z" />
          </g>
        </g>
        <g ref={heartRRef} style={{ display: "block" }} transform="matrix(1,0,0,1,80.56175231933594,22.657032012939453)" opacity="1">
          <g opacity="1" transform="matrix(1,0,0,1,12.479000091552734,14.140999794006348)">
            <path strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeOpacity="1" strokeWidth="1.69" d="M-4.139999866485596,9.779000282287598 C-4.744999885559082,9.583000183105469 -4.895999908447266,8.951000213623047 -4.994999885559082,8.531999588012695 C-5.011000156402588,8.468999862670898 -5.021999835968018,8.411999702453613 -5.035999774932861,8.364999771118164 C-5.3420000076293945,7.320000171661377 -5.521999835968018,6.264999866485596 -5.6570000648498535,5.370999813079834 C-5.715000152587891,4.985000133514404 -5.769999980926514,4.593999862670898 -5.821000099182129,4.216000080108643 C-5.925000190734863,3.4690001010894775 -6.0320000648498535,2.696000099182129 -6.173999786376953,1.940999984741211 C-6.406000137329102,0.699999988079071 -6.738999843597412,-0.5619999766349792 -7.059999942779541,-1.781999945640564 C-7.379000186920166,-2.993000030517578 -7.709000110626221,-4.245999813079834 -7.945000171661377,-5.488999843597412 C-8.109000205993652,-6.35699987411499 -8.253999710083008,-7.357999801635742 -7.872000217437744,-8.258000373840332 C-7.360000133514404,-9.46500015258789 -6.091000080108643,-9.916000366210938 -5.127999782562256,-9.824999809265137 C-4.324999809265137,-9.74899959564209 -3.5269999504089355,-9.333000183105469 -2.937999963760376,-8.6850004196167 C-2.428999900817871,-8.125 -2.1429998874664307,-7.48799991607666 -1.9079999923706055,-6.882999897003174 C-1.2489999532699585,-5.176000118255615 -0.847000002861023,-3.319999933242798 -0.6890000104904175,-1.2489999532699585 C0.30399999022483826,-3.4040000438690186 1.5779999494552612,-5.465000152587891 3.7269999980926514,-6.870999813079834 C4.705999851226807,-7.511000156402588 5.6539998054504395,-7.684999942779541 6.4710001945495605,-7.374000072479248 C7.265999794006348,-7.071000099182129 7.638999938964844,-6.415999889373779 7.789999961853027,-6.052999973297119 C8.253000259399414,-4.939000129699707 7.954999923706055,-3.825000047683716 7.609000205993652,-2.7780001163482666 C6.617000102996826,0.2280000001192093 5.070000171661377,2.875 3.01200008392334,5.086999893188477 C2.7090001106262207,5.4120001792907715 2.3919999599456787,5.730999946594238 2.068000078201294,6.035999774932861 C0.7059999704360962,7.316999912261963 -0.8460000157356262,8.416999816894531 -2.5450000762939453,9.303999900817871 C-2.5920000076293945,9.329000473022461 -2.6570000648498535,9.368000030517578 -2.7260000705718994,9.409000396728516 C-3.0850000381469727,9.625 -3.569000005722046,9.916000366210938 -4.059999942779541,9.802000045776367 C-4.085999965667725,9.795000076293945 -4.11299991607666,9.788000106811523 -4.139999866485596,9.779000282287598z" />
          </g>
        </g>
        <g ref={ringLRef} transform="matrix(1,0,0,1,18.97797393798828,58.11800003051758)" opacity="1" style={{ display: "block" }}>
          <g opacity="1" transform="matrix(1,0,0,1,39.720001220703125,40.4640007019043)">
            <path strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeOpacity="1" strokeWidth="3.437" d="M31.128000259399414,0 C31.128000259399414,17.60300064086914 17.191999435424805,31.871999740600586 0,31.871999740600586 C-17.19099998474121,31.871999740600586 -31.128000259399414,17.60300064086914 -31.128000259399414,0 C-31.128000259399414,-17.601999282836914 -17.19099998474121,-31.871999740600586 0,-31.871999740600586 C17.191999435424805,-31.871999740600586 31.128000259399414,-17.601999282836914 31.128000259399414,0z" />
          </g>
        </g>
        <g ref={ringRRef} transform="matrix(1,0,0,1,57.105621337890625,63.209999084472656)" opacity="1" style={{ display: "block" }}>
          <g opacity="1" transform="matrix(1,0,0,1,37.23400115966797,37.917999267578125)">
            <path strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeOpacity="1" strokeWidth="3.437" d="M28.642000198364258,0 C28.642000198364258,16.195999145507812 15.817999839782715,29.326000213623047 -0.0010000000474974513,29.326000213623047 C-15.819000244140625,29.326000213623047 -28.641000747680664,16.195999145507812 -28.641000747680664,0 C-28.641000747680664,-16.195999145507812 -15.819000244140625,-29.326000213623047 -0.0010000000474974513,-29.326000213623047 C15.817999839782715,-29.326000213623047 28.642000198364258,-16.195999145507812 28.642000198364258,0z" />
          </g>
        </g>
      </g>
    </svg>
  );
};


export const PartyHatIcon = ({ className }: { className?: string }) => (
  <svg {...commonProps} className={cn("w-14 h-14", className)}>
    <style>{`
      .hat { animation: party-hat-bounce 2.6s ease-in-out infinite; }
      .confetti { animation: confetti-fade 2.6s ease-in-out infinite; }
    `}</style>
    <path className="hat" d="M23 48L32 20L41 48Z" />
    <path className="hat" d="M23 48C25 50 29 50 32 48S39 46 41 48" />
    <path className="confetti" d="M45 28L48 25" style={{ animationDelay: '0.2s' }} />
    <path className="confetti" d="M19 28L16 25" />
  </svg>
);

export const CameraIcon = ({ className }: { className?: string }) => (
  <svg {...commonProps} className={cn("w-14 h-14", className)}>
    <style>{`
      .flash { animation: camera-flash 2.8s ease-in-out infinite; opacity: 0; }
      .lens { animation: camera-lens-pulse 2.8s ease-in-out infinite; transform-origin: center; }
    `}</style>
    <rect x="12" y="24" width="40" height="24" rx="4" />
    <circle className="lens" cx="32" cy="36" r="8" />
    <path className="flash" d="M28 20L24 14L32 14L28 20Z" fill="hsl(140, 8%, 25%)" stroke="none" />
    <path d="M18 24V22" />
  </svg>
);

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-secondary border border-primary shadow-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
    {children}
  </div>
);

export const BusIcon = () => (
    <IconWrapper>
        <svg {...commonProps} width="28" height="28" className="animate-[bus-move_2s_ease-in-out_infinite]">
            <rect x="12" y="24" width="40" height="18" rx="4" />
            <path d="M12 32H52" />
            <circle cx="20" cy="48" r="4" className="animate-[wheels-rotate_1s_linear_infinite]" />
            <circle cx="44" cy="48" r="4" className="animate-[wheels-rotate_1s_linear_infinite]" />
        </svg>
    </IconWrapper>
);

export const DrinksIcon = () => (
    <IconWrapper>
        <svg {...commonProps} width="28" height="28">
            <path d="M20 28L30 18L40 28" className="animate-[cup-clink_2s_ease-in-out_infinite]" style={{'--cup-rotate': '-5deg'} as React.CSSProperties}/>
            <path d="M30 28V46" />
            <path d="M24 46H36" />
            <path d="M44 28L34 18L24 28" className="animate-[cup-clink_2s_ease-in-out_infinite]" style={{'--cup-rotate': '5deg'} as React.CSSProperties}/>
            <path d="M34 28V46" />
            <path d="M28 46H40" />
            <path d="M32 16L32 12" className="animate-[confetti-fade_2s_ease-in-out_infinite]"/>
        </svg>
    </IconWrapper>
);

export const DinnerIcon = () => (
    <IconWrapper>
        <svg {...commonProps} width="28" height="28">
            <circle cx="32" cy="36" r="14" />
            <path d="M20,20 L44,44" strokeDasharray="40" className="animate-[shine-effect_2s_ease-in-out_infinite]"/>
            <path d="M18 20V52" />
            <path d="M46 20V52" />
        </svg>
    </IconWrapper>
);

export const PartyIcon = () => (
    <IconWrapper>
        <svg {...commonProps} width="28" height="28" className="animate-[disco-rotate_5s_linear_infinite]">
            <circle cx="32" cy="32" r="14" />
            <path d="M18 32H46" />
            <path d="M32 18V46" />
            <path d="M21.6 21.6L42.4 42.4" />
            <path d="M21.6 42.4L42.4 21.6" />
        </svg>
    </IconWrapper>
);

export const EndOfPartyIcon = () => (
    <IconWrapper>
        <svg {...commonProps} width="28" height="28">
             <path d="M22 22 L42 42 M22 42 L42 22" className="animate-[confetti-fade_3s_ease-in-out_infinite_reverse]"/>
        </svg>
    </IconWrapper>
);


export const NightBusIcon = () => (
    <IconWrapper>
        <svg {...commonProps} width="28" height="28" className="animate-[bus-move_4s_ease-in-out_infinite]">
            <path d="M48 20 A10 10 0 1 0 48 21" stroke="hsl(130, 20%, 65%)" />
            <rect x="12" y="24" width="40" height="18" rx="4" />
            <path d="M12 32H52" />
            <circle cx="20" cy="48" r="4" className="animate-[wheels-rotate_2s_linear_infinite]" />
            <circle cx="44" cy="48" r="4" className="animate-[wheels-rotate_2s_linear_infinite]" />
        </svg>
    </IconWrapper>
);

export const BusAwayIcon = () => (
     <IconWrapper>
        <svg {...commonProps} width="28" height="28" className="animate-[bus-away_4s_ease-in-out_forwards]">
            <rect x="12" y="24" width="40" height="18" rx="4" />
            <path d="M12 32H52" />
            <circle cx="20" cy="48" r="4" />
            <circle cx="44" cy="48" r="4" />
        </svg>
    </IconWrapper>
)
