"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";

const commonProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const RingsIcon = ({ className }: { className?: string }) => {
  const heartLRef = React.useRef<SVGGElement>(null);
  const heartRRef = React.useRef<SVGGElement>(null);
  const ringLRef = React.useRef<SVGGElement>(null);
  const ringRRef = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
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
      className={cn("w-24 h-24", className)}
      style={{ overflow: "visible" }}
    >
      <g stroke="currentColor" fill="none">
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


export const PartyHatIcon = ({ className }: { className?: string }) => {
  const cornetaRef = React.useRef<SVGGElement>(null);
  const expRef = React.useRef<SVGGElement>(null);
  const ciRef = React.useRef<SVGGElement>(null);
  const csRef = React.useRef<SVGGElement>(null);
  const stRef = React.useRef<SVGGElement>(null);
  const p1Ref = React.useRef<SVGPathElement>(null);
  const p2Ref = React.useRef<SVGPathElement>(null);
  const p3Ref = React.useRef<SVGPathElement>(null);
  const p4Ref = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    const elCorneta = cornetaRef.current;
    const elExp = expRef.current;
    const elCI = ciRef.current;
    const elCS = csRef.current;
    const elST = stRef.current;
    const p1 = p1Ref.current;
    const p2 = p2Ref.current;
    const p3 = p3Ref.current;
    const p4 = p4Ref.current;

    if (!elCorneta || !elExp || !elCI || !elCS || !elST || !p1 || !p2 || !p3 || !p4) {
      return;
    }

    const fr = 25;
    const op = 105;
    const durationMs = (op / fr) * 1000;

    const KF_CORNETA_S = [
        { t: 0, s: [92.078, 83.406] }, { t: 3, s: [51.366, 51.366] },
        { t: 6, s: [83.406, 83.406] }, { t: 8, s: [51.366, 51.366] },
        { t: 10, s: [83.406, 83.406] }, { t: 12, s: [71.897, 71.897] },
        { t: 14, s: [92.042, 83.000] },
    ];
    const KF_TRIM_C1 = [{ t: 13, s: 100 }, { t: 19, s: 0 }, { t: 77, s: 0 }, { t: 78, s: 0 }, { t: 86, s: 100 },];
    const KF_TRIM_C2 = [{ t: 26, s: 0 }, { t: 30, s: 99 }, { t: 60, s: 99 }, { t: 61, s: 99 }, { t: 67, s: 0 },];
    const KF_TRIM_C3 = [{ t: 22, s: 0 }, { t: 29, s: 100 }, { t: 67, s: 100 }, { t: 68, s: 100 }, { t: 77, s: 0 },];
    const KF_TRIM_C4 = [{ t: 22, s: 0 }, { t: 29, s: 100 }, { t: 71, s: 100 }, { t: 72, s: 100 }, { t: 79, s: 0 },];
    const KF_EXP_O = [{ t: 28, s: 0 }, { t: 35, s: 100 }, { t: 60, s: 100 }, { t: 61, s: 100 }, { t: 77, s: 0 },];
    const KF_EXP_R = [{ t: 35, s: 0 }, { t: 38, s: 2 }, { t: 41, s: -2 }, { t: 44, s: 0 },];
    const KF_CI_P = [{ t: 28, s: [54.397, 61.531] }, { t: 39, s: [63.147, 67.781] },];
    const KF_CI_O = [{ t: 28, s: 0 }, { t: 39, s: 100 }, { t: 71, s: 100 }, { t: 79, s: 0 },];
    const KF_CS_P = [{ t: 21, s: [44.647, 44.781] }, { t: 25, s: [42.647, 40.281] },];
    const KF_CS_O = [{ t: 21, s: 0 }, { t: 25, s: 100 }, { t: 78, s: 100 }, { t: 85, s: 0 },];
    const KF_ST_P = [{ t: 28, s: [54.647, 77.031] }, { t: 35, s: [61.647, 70.031] },];
    const KF_ST_O = [{ t: 28, s: 0 }, { t: 35, s: 100 }, { t: 55, s: 100 }, { t: 62, s: 0 },];

    const A_MAIN = [55.147, 60.281];
    const P_MAIN = [64.647, 64.781];
    const A_COR = [10, 112];
    const P_COR = [18, 117.5];

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    function findSegment(kfs: { t: number, s: any }[], frame: number) {
        if (frame <= kfs[0].t) return [kfs[0], kfs[0], 0];
        for (let i = 0; i < kfs.length - 1; i++) {
            const k0 = kfs[i], k1 = kfs[i + 1];
            if (frame >= k0.t && frame <= k1.t) {
                const span = (k1.t - k0.t) || 1;
                return [k0, k1, (frame - k0.t) / span];
            }
        }
        return [kfs[kfs.length - 1], kfs[kfs.length - 1], 0];
    }

    function sampleVec2(kfs: { t: number, s: number[] }[], frame: number) {
        const [k0, k1, tn0] = findSegment(kfs, frame);
        const tn = easeInOut(tn0 as number);
        return [lerp(k0.s[0], k1.s[0], tn), lerp(k0.s[1], k1.s[1], tn)];
    }

    function sampleScalar(kfs: { t: number, s: number }[], frame: number) {
        const [k0, k1, tn0] = findSegment(kfs, frame);
        return lerp(k0.s, k1.s, easeInOut(tn0 as number));
    }

    function setLottieMatrix(el: SVGElement, p: number[], a: number[], s: number[], rDeg: number) {
        const sx = s[0], sy = s[1];
        const rad = (rDeg || 0) * Math.PI / 180;
        const cos = Math.cos(rad), sin = Math.sin(rad);
        const mA = cos * sx, mB = sin * sx, mC = -sin * sy, mD = cos * sy;
        const e = p[0] - mA * a[0] - mC * a[1];
        const f = p[1] - mB * a[0] - mD * a[1];
        el.setAttribute("transform", `matrix(${mA},${mB},${mC},${mD},${e},${f})`);
    }

    function setOpacity(el: SVGElement, o01: number) { el.setAttribute("opacity", String(o01)); }
    function forceShow(el: SVGElement) { if (el) el.style.display = "block"; }

    type SVGPathElementWithLen = SVGPathElement & { __len?: number };
    function prepTrim(path: SVGPathElementWithLen | null) {
        if (!path) return;
        const len = path.getTotalLength();
        path.__len = len;
        path.style.strokeDasharray = `${len} ${len}`;
        path.style.strokeDashoffset = String(len);
    }
    function applyTrim(path: SVGPathElementWithLen | null, endPercent: number) {
        if (!path || !path.__len) return;
        const e = Math.max(0, Math.min(100, endPercent));
        path.style.strokeDashoffset = String(path.__len * (1 - e / 100));
    }

    [elExp, elCI, elCS, elST].forEach(el => forceShow(el as SVGElement));

    if (p1) p1.setAttribute("d", "M -0.436 -17.264 L -4.621 17.264");
    if (p2) p2.setAttribute("d", "M 8.632 -7.673 L -8.632 7.673");
    if (p3) p3.setAttribute("d", "M -17.339 8.195 L 17.339 -8.195");
    if (p4) p4.setAttribute("d", "M -17.038 2.071 L 17.038 4.185");

    [p1, p2, p3, p4].forEach(prepTrim);

    const t0 = performance.now();
    let animationFrameId: number;

    function tick(now: number) {
        const elapsed = (now - t0) % durationMs;
        const frame = (elapsed / 1000) * fr;

        if (elCorneta) {
            const sc = sampleVec2(KF_CORNETA_S, frame);
            setLottieMatrix(elCorneta, P_COR, A_COR, [sc[0] / 100, sc[1] / 100], 0);
        }
        applyTrim(p1, sampleScalar(KF_TRIM_C1, frame));
        applyTrim(p2, sampleScalar(KF_TRIM_C2, frame));
        applyTrim(p3, sampleScalar(KF_TRIM_C3, frame));
        applyTrim(p4, sampleScalar(KF_TRIM_C4, frame));

        if (elExp) {
            setOpacity(elExp, sampleScalar(KF_EXP_O, frame) / 100);
            setLottieMatrix(elExp, P_MAIN, A_MAIN, [1, 1], sampleScalar(KF_EXP_R, frame));
        }
        if (elCI) {
            setOpacity(elCI, sampleScalar(KF_CI_O, frame) / 100);
            setLottieMatrix(elCI, sampleVec2(KF_CI_P, frame), A_MAIN, [1, 1], 0);
        }
        if (elCS) {
            setOpacity(elCS, sampleScalar(KF_CS_O, frame) / 100);
            setLottieMatrix(elCS, sampleVec2(KF_CS_P, frame), A_MAIN, [1, 1], 0);
        }
        if (elST) {
            setOpacity(elST, sampleScalar(KF_ST_O, frame) / 100);
            setLottieMatrix(elST, sampleVec2(KF_ST_P, frame), A_MAIN, [1, 1], 0);
        }

        animationFrameId = requestAnimationFrame(tick);
    }
    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" preserveAspectRatio="xMidYMid meet" className={cn("w-24 h-24", className)} style={{ overflow: "visible" }}>
        <defs>
            <clipPath id="__lottie_element_party_popper">
                <rect width="130" height="130" x="0" y="0"></rect>
            </clipPath>
        </defs>
        <g clipPath="url(#__lottie_element_party_popper)">
            <g ref={stRef} className="estrella" style={{ display: 'none' }} transform="matrix(1,0,0,1,6.5,9.75)" opacity="0.0009470262240579075">
                <g opacity="1" transform="matrix(1,0,0,1,75.55999755859375,23.030000686645508)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M9.35200023651123,-2.2809998989105225 C9.166999816894531,-2.8489999771118164 8.673999786376953,-3.26200008392334 8.083000183105469,-3.3480000495910645 C8.083000183105469,-3.3480000495910645 3.4709999561309814,-4.019999980926514 3.4709999561309814,-4.019999980926514 C3.4709999561309814,-4.019999980926514 1.4149999618530273,-8.197999954223633 1.4149999618530273,-8.197999954223633 C0.9570000171661377,-8.97700023651123 -0.04600000008940697,-9.236000061035156 -0.824999988079071,-8.777000427246094 C-1.0640000104904175,-8.63599967956543 -1.2630000114440918,-8.437999725341797 -1.4049999713897705,-8.197999954223633 C-1.4049999713897705,-8.197999954223633 -3.4709999561309814,-4.019999980926514 -3.4709999561309814,-4.019999980926514 C-3.4709999561309814,-4.019999980926514 -8.083000183105469,-3.3480000495910645 -8.083000183105469,-3.3480000495910645 C-8.942000389099121,-3.2239999771118164 -9.536999702453613,-2.427999973297119 -9.413000106811523,-1.5700000524520874 C-9.36299991607666,-1.2280000448226929 -9.204000473022461,-0.9120000004768372 -8.956999778747559,-0.6700000166893005 C-8.956999778747559,-0.6700000166893005 -5.619999885559082,2.5829999446868896 -5.619999885559082,2.5829999446868896 C-5.619999885559082,2.5829999446868896 -6.406000137329102,7.176000118255615 -6.406000137329102,7.176000118255615 C-6.557000160217285,8.029999732971191 -5.986999988555908,8.845000267028809 -5.131999969482422,8.996000289916992 C-4.788000106811523,9.057000160217285 -4.433000087738037,9.001999855041504 -4.125,8.83899974822998 C-4.125,8.83899974822998 0.0010000000474974513,6.663000106811523 0.0010000000474974513,6.663000106811523 C0.0010000000474974513,6.663000106811523 4.125999927520752,8.833000183105469 4.125999927520752,8.833000183105469 C4.894000053405762,9.237000465393066 5.8429999351501465,8.940999984741211 6.247000217437744,8.17300033569336 C6.4079999923706055,7.867000102996826 6.464000225067139,7.515999794006348 6.406000137329102,7.176000118255615 C6.406000137329102,7.176000118255615 5.619999885559082,2.5829999446868896 5.619999885559082,2.5829999446868896 C5.619999885559082,2.5829999446868896 8.956000328063965,-0.6700000166893005 8.956000328063965,-0.6700000166893005 C9.383999824523926,-1.0889999866485596 9.538000106811523,-1.7130000591278076 9.35200023651123,-2.2809998989105225z" />
                </g>
            </g>
            <g ref={csRef} className="circuloSuperior" style={{ display: 'none' }} transform="matrix(1,0,0,1,-12.5,-20)" opacity="0.0021741716021035982">
                <g opacity="1" transform="matrix(1,0,0,1,56.909000396728516,38.75400161743164)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M5.057000160217285,0 C5.057000160217285,2.7929999828338623 2.7929999828338623,5.057000160217285 0,5.057000160217285 C-2.7929999828338623,5.057000160217285 -5.057000160217285,2.7929999828338623 -5.057000160217285,0 C-5.057000160217285,-2.7920000553131104 -2.7929999828338623,-5.057000160217285 0,-5.057000160217285 C2.7929999828338623,-5.057000160217285 5.057000160217285,-2.7920000553131104 5.057000160217285,0z" />
                </g>
            </g>
            <g ref={ciRef} className="circuloInferior" style={{ display: 'none' }} transform="matrix(1,0,0,1,8,7.5)" opacity="0.00003543801187376516">
                <g opacity="1" transform="matrix(1,0,0,1,98.23699951171875,85.31300354003906)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M5.057000160217285,0 C5.057000160217285,2.7929999828338623 2.7929999828338623,5.057000160217285 0,5.057000160217285 C-2.7929999828338623,5.057000160217285 -5.057000160217285,2.7929999828338623 -5.057000160217285,0 C-5.057000160217285,-2.7929999828338623 -2.7929999828338623,-5.057000160217285 0,-5.057000160217285 C2.7929999828338623,-5.057000160217285 5.057000160217285,-2.7929999828338623 5.057000160217285,0z" />
                </g>
            </g>
            <g ref={expRef} className="explosion" style={{ display: 'none' }} transform="matrix(1,-0.0000067019091147813015,0.0000067019091147813015,1,9.49959945678711,4.500370025634766)" opacity="0.00015453941849258968">
                <g opacity="1" transform="matrix(1,0,0,1,85.64399719238281,46.60100173950195)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M-0.9639999866485596,-0.871999979019165 C-0.9639999866485596,-0.871999979019165 0.9639999866485596,0.871999979019165 0.9639999866485596,0.871999979019165" />
                </g>
                <g opacity="1" transform="matrix(1,0,0,1,91.30599975585938,43.941001892089844)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M-0.04399999976158142,-1.7879999876022339 C-0.04399999976158142,-1.7879999876022339 0.04399999976158142,1.7879999876022339 0.04399999976158142,1.7879999876022339" />
                </g>
                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M91.3479995727539,58.45899963378906 C91.3479995727539,58.45899963378906 91.3479995727539,61.78499984741211 91.3479995727539,61.78499984741211" />
                </g>
                <g opacity="1" transform="matrix(1,0,0,1,96.86199951171875,57.849998474121094)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M-1.1540000438690186,-1.1349999904632568 C-1.1540000438690186,-1.1349999904632568 1.1540000438690186,1.1349999904632568 1.1540000438690186,1.1349999904632568" />
                </g>
                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M97.88800048828125,52.356998443603516 C97.88800048828125,52.356998443603516 100.50399780273438,52.356998443603516 100.50399780273438,52.356998443603516" />
                </g>
                <g opacity="1" transform="matrix(1,0,0,1,96.9729995727539,46.66899871826172)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M-1.003000020980835,0.9779999852180481 C-1.003000020980835,0.9779999852180481 1.003000020980835,-0.9779999852180481 1.003000020980835,-0.9779999852180481" />
                </g>
            </g>
            <g className="confeti04" transform="matrix(1,0,0,1,9.500003814697266,4.5)" opacity="1" style={{ display: 'block' }}>
                <g opacity="1" transform="matrix(1,0,0,1,69.16699981689453,74.1520004272461)">
                    <path ref={p4Ref} strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531" d="M0 0"></path>
                </g>
            </g>
            <g className="confeti03" transform="matrix(1,0,0,1,9.500003814697266,4.5)" opacity="1" style={{ display: 'block' }}>
                <g opacity="1" transform="matrix(1,0,0,1,72.7030029296875,60.55099868774414)">
                    <path ref={p3Ref} strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531" d="M0 0"></path>
                </g>
            </g>
            <g className="confeti02" transform="matrix(1,0,0,1,9.500003814697266,4.5)" opacity="1" style={{ display: 'block' }}>
                <g opacity="1" transform="matrix(-0.9933285713195801,0.11531856656074524,-0.11531856656074524,-0.9933285713195801,53.858001708984375,59.505001068115234)">
                    <path ref={p2Ref} strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531" d="M0 0"></path>
                </g>
            </g>
            <g className="confeti01" transform="matrix(1,0,0,1,9.500003814697266,4.5)" opacity="1" style={{ display: 'block' }}>
                <g opacity="1" transform="matrix(1,0,0,1,43.04600143432617,48.16999816894531)">
                    <path ref={p1Ref} strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531" d="M0 0"></path>
                </g>
            </g>
            <g ref={cornetaRef} className="corneta" transform="matrix(0.5200349688529968,0,0,0.5200349688529968,12.799650192260742,59.25608444213867)" opacity="1" style={{ display: 'block' }}>
                <g opacity="1" transform="matrix(1,0,0,1,47.23099899291992,67.61399841308594)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M-15.63599967956543,-22.611000061035156 C-15.63599967956543,-22.611000061035156 -27.988000869750977,-24.674999237060547 -21.011999130249023,-10.725000381469727 C-21.011999130249023,-10.725000381469727 -8.109000205993652,18.570999145507812 17.177000045776367,23.628000259399414 C17.177000045776367,23.628000259399414 27.988000869750977,24.674999237060547 21.542999267578125,11.519000053405762" />
                </g>
                <g opacity="1" transform="matrix(1,0,0,1,33.63600158691406,79.23300170898438)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M-15.468999862670898,-18.809999465942383 C-15.468999862670898,-18.809999465942383 -12.083000183105469,10.090999603271484 15.468999862670898,18.809999465942383" />
                </g>
                <g opacity="1" transform="matrix(1,0,0,1,20.20199966430664,92.8290023803711)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M-4.409999847412109,-13.758999824523926 C-4.409999847412109,-13.758999824523926 -6.888000011444092,7.829999923706055 6.888000011444092,13.758999824523926" />
                </g>
                <g opacity="1" transform="matrix(1,0,0,1,37.63999938964844,102.40299987792969)">
                    <path strokeLinecap="round" strokeLinejoin="miter" fill="none" strokeMiterlimit="10" stroke="currentColor" strokeOpacity="1" strokeWidth="3.531"
                        d=" M-26.767000198364258,-2.0920000076293945 C-26.767000198364258,-2.0920000076293945 -29.382999420166016,11.16100025177002 -29.382999420166016,11.16100025177002 C-29.382999420166016,11.16100025177002 29.382999420166016,-11.16100025177002 29.382999420166016,-11.16100025177002" />
                </g>
            </g>
        </g>
    </svg>
  );
};

export const CameraIcon = ({ className }: { className?: string }) => (
  <svg {...commonProps} className={cn("w-14 h-14", className)}>
    <style>{`
      .flash { animation: camera-flash 2.8s ease-in-out infinite; opacity: 0; }
      .lens { animation: camera-lens-pulse 2.8s ease-in-out infinite; transform-origin: center; }
    `}</style>
    <rect x="12" y="24" width="40" height="24" rx="4" />
    <circle className="lens" cx="32" cy="36" r="8" />
    <path className="flash" d="M28 20L24 14L32 14L28 20Z" fill="currentColor" stroke="none" />
    <path d="M18 24V22" />
  </svg>
);

export const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary border border-primary shadow-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
    {children}
  </div>
);

export const ClinkingGlassesIcon = ({ className }: { className?: string }) => {
  const glassLeftRef = React.useRef<SVGGElement>(null);
  const glassRightRef = React.useRef<SVGGElement>(null);
  const sparklesRef = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    const elL = glassLeftRef.current;
    const elR = glassRightRef.current;
    const elS = sparklesRef.current;

    if (!elL || !elR || !elS) return;

    const fr = 25;
    const op = 105;
    const durationMs = (op / fr) * 1000;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

    function easeInOut(t: number) {
      t = clamp01(t);
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function findSegment(kfs: {t: number, s: any}[], frame: number): [any, any, number] {
      if (frame <= kfs[0].t) return [kfs[0], kfs[0], 0];
      for (let i = 0; i < kfs.length - 1; i++) {
        const k0 = kfs[i],
          k1 = kfs[i + 1];
        if (frame >= k0.t && frame <= k1.t) {
          const span = (k1.t - k0.t) || 1;
          const tn = (frame - k0.t) / span;
          return [k0, k1, tn];
        }
      }
      return [kfs[kfs.length - 1], kfs[kfs.length - 1], 0];
    }

    function sampleVec2(kfs: {t: number, s: number[]}[], frame: number) {
      const [k0, k1, tn0] = findSegment(kfs, frame);
      const tn = easeInOut(tn0 as number);
      return [lerp(k0.s[0], k1.s[0], tn), lerp(k0.s[1], k1.s[1], tn)];
    }

    function sampleScalar(kfs: {t: number, s: number}[], frame: number) {
      const [k0, k1, tn0] = findSegment(kfs, frame);
      const tn = easeInOut(tn0 as number);
      return lerp(k0.s, k1.s, tn);
    }

    const BASE_L = { x: 42, y: 8, rot: -14 };
    const BASE_R = { x: 88, y: 6, rot: 14 };
    const AX = 0, AY = 110;

    const KF_L_POS = [ { t: 0, s: [0, 0] }, { t: 10, s: [0, 0] }, { t: 14, s: [3, -2] }, { t: 17, s: [-1, 1] }, { t: 24, s: [0, 0] }, { t: 105, s: [0, 0] }, ];
    const KF_R_POS = [ { t: 0, s: [0, 0] }, { t: 10, s: [0, 0] }, { t: 14, s: [-3, -2] }, { t: 17, s: [1, 1] }, { t: 24, s: [0, 0] }, { t: 105, s: [0, 0] }, ];
    const KF_L_ROT = [ { t: 0, s: 0 }, { t: 10, s: 0 }, { t: 14, s: 10 }, { t: 17, s: -3 }, { t: 24, s: 0 }, { t: 105, s: 0 }, ];
    const KF_R_ROT = [ { t: 0, s: 0 }, { t: 10, s: 0 }, { t: 14, s: -10 }, { t: 17, s: 3 }, { t: 24, s: 0 }, { t: 105, s: 0 }, ];
    const KF_SPARK_O = [ { t: 0, s: 0 }, { t: 12, s: 0 }, { t: 14, s: 1 }, { t: 20, s: 1 }, { t: 28, s: 0 }, { t: 105, s: 0 }, ];
    const KF_SPARK_S = [ { t: 0, s: 0.9 }, { t: 14, s: 1.15 }, { t: 20, s: 1.0 }, { t: 28, s: 0.9 }, { t: 105, s: 0.9 }, ];

    function setGlassTransform(el: SVGGElement, base: {x:number, y:number, rot:number}, dxy: number[], rotDelta: number) {
      const x = base.x + dxy[0];
      const y = base.y + dxy[1];
      const rot = base.rot + rotDelta;
      el.setAttribute("transform", `translate(${x},${y}) translate(${AX},${AY}) rotate(${rot}) translate(${-AX},${-AY})`);
    }

    function setSparkles(frame: number) {
      const o = sampleScalar(KF_SPARK_O, frame);
      const s = sampleScalar(KF_SPARK_S, frame);
      elS.setAttribute("opacity", String(o));
      elS.setAttribute("transform", `translate(65,22) scale(${s}) translate(-65,-22)`);
    }

    const t0 = performance.now();
    let animationFrameId: number;

    function tick(now: number) {
      const elapsed = (now - t0) % durationMs;
      const frame = (elapsed / 1000) * fr;
      const dL = sampleVec2(KF_L_POS, frame);
      const dR = sampleVec2(KF_R_POS, frame);
      const rL = sampleScalar(KF_L_ROT, frame);
      const rR = sampleScalar(KF_R_ROT, frame);
      setGlassTransform(elL, BASE_L, dL, rL);
      setGlassTransform(elR, BASE_R, dR, rR);
      setSparkles(frame);
      animationFrameId = requestAnimationFrame(tick);
    }
    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" aria-label="Copas brindando" className={cn("w-14 h-14", className)}>
      <g ref={sparklesRef} className="sparkles" opacity="0" transform="translate(65,22) scale(0.9) translate(-65,-22)" fill="currentColor" stroke="none">
        <path d="M65 13 L66.5 18.5 L72 20 L66.5 21.5 L65 27 L63.5 21.5 L58 20 L63.5 18.5 Z"></path>
        <path d="M52 22 L52.8 24.6 L55.4 25.4 L52.8 26.2 L52 28.8 L51.2 26.2 L48.6 25.4 L51.2 24.6 Z"></path>
        <path d="M78 24 L78.7 26.2 L80.9 26.9 L78.7 27.6 L78 29.8 L77.3 27.6 L75.1 26.9 L77.3 26.2 Z"></path>
        <path d="M60 33 L60.6 35 L62.6 35.6 L60.6 36.2 L60 38.2 L59.4 36.2 L57.4 35.6 L59.4 35 Z"></path>
        <path d="M70 34 L70.6 36 L72.6 36.6 L70.6 37.2 L70 39.2 L69.4 37.2 L67.4 36.6 L69.4 36 Z"></path>
      </g>
      <g
        ref={glassLeftRef}
        className="glassLeft"
        transform="translate(42,8) translate(0,110) rotate(-14) translate(0,-110)"
        stroke="currentColor"
        fill="none"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M-16 10 L16 10 L12 44 Q8 72 0 76 Q-8 72 -12 44 Z"></path>
        <line x1="-13" y1="24" x2="13" y2="27"></line>
        <line x1="0" y1="76" x2="0" y2="110"></line>
        <path d="M-18 110 L18 110"></path>
        <circle className="cap" cx="-13" cy="24" r="2.0" fill="currentColor" stroke="none"></circle>
        <circle className="cap" cx="13"  cy="27" r="2.0" fill="currentColor" stroke="none"></circle>
        <circle className="cap" cx="0" cy="76" r="2.05" fill="currentColor" stroke="none"></circle>
        <circle className="cap" cx="0" cy="110" r="2.05" fill="currentColor" stroke="none"></circle>
      </g>
      <g
        ref={glassRightRef}
        className="glassRight"
        transform="translate(88,6) translate(0,110) rotate(14) translate(0,-110)"
        stroke="currentColor"
        fill="none"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M-16 10 L16 10 L12 44 Q8 72 0 76 Q-8 72 -12 44 Z"></path>
        <line x1="-13" y1="24" x2="13" y2="27"></line>
        <line x1="0" y1="76" x2="0" y2="110"></line>
        <path d="M-18 110 L18 110"></path>
        <circle className="cap" cx="-13" cy="24" r="2.0" fill="currentColor" stroke="none"></circle>
        <circle className="cap" cx="13" cy="27" r="2.0" fill="currentColor" stroke="none"></circle>
        <circle className="cap" cx="0" cy="76" r="2.05" fill="currentColor" stroke="none"></circle>
        <circle className="cap" cx="0" cy="110" r="2.05" fill="currentColor" stroke="none"></circle>
      </g>
    </svg>
  );
};

export const DinnerIcon = ({ className }: { className?: string }) => (
    <svg {...commonProps} className={cn("w-14 h-14", className)}>
        <circle cx="32" cy="36" r="14" />
        <path d="M20,20 L44,44" strokeDasharray="40" className="animate-[shine-effect_2s_ease-in-out_infinite]"/>
        <path d="M18 20V52" />
        <path d="M46 20V52" />
    </svg>
);

export const PartyIcon = ({ className }: { className?: string }) => (
    <svg {...commonProps} className={cn("w-14 h-14 animate-[disco-rotate_5s_linear_infinite]", className)}>
        <circle cx="32" cy="32" r="14" />
        <path d="M18 32H46" />
        <path d="M32 18V46" />
        <path d="M21.6 21.6L42.4 42.4" />
        <path d="M21.6 42.4L42.4 21.6" />
    </svg>
);

export const EndOfPartyIcon = ({ className }: { className?: string }) => (
    <svg {...commonProps} className={cn("w-14 h-14", className)}>
         <path d="M22 22 L42 42 M22 42 L42 22" className="animate-[confetti-fade_3s_ease-in-out_infinite_reverse]"/>
    </svg>
);

export const AnimatedBusIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("icon-bus", className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-20 -20 552 552"
    preserveAspectRatio="xMidYMid meet"
    aria-label="Autobús animado"
    role="img"
  >
    <g className="busMove">
      <g transform="translate(0,512) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
        <path d="M89 3931 c-31 -19 -53 -44 -68 -73 l-21 -45 2 -1021 3 -1020 30 -43 c51 -72 86 -83 266 -87 l155 -4 12 -54 c39 -186 208 -359 398 -408 78 -20 212 -21 287 -1 200 52 354 212 407 423 l11 42 852 0 853 0 11 -53 c39 -188 208 -362 399 -411 78 -20 212 -21 287 -1 200 52 354 212 407 423 l11 42 192 0 c110 0 209 5 232 11 55 15 120 82 135 139 9 33 11 136 7 385 -5 377 -13 444 -74 645 -65 212 -153 513 -153 522 0 4 33 8 73 8 l73 0 52 -164 c54 -172 69 -196 120 -196 28 0 72 42 72 68 0 11 -27 104 -60 208 -78 244 -67 234 -245 234 -119 0 -134 2 -139 18 -40 140 -71 225 -94 262 -39 61 -103 117 -171 149 l-56 26 -2110 3 -2111 2 -45 -29z m4248 -136 c52 -22 100 -61 118 -96 l16 -29 -2161 0 -2160 0 0 58 c0 32 5 63 12 70 9 9 484 12 2075 12 1830 0 2068 -2 2100 -15z m-3727 -630 l0 -355 -230 0 -230 0 0 355 0 355 230 0 230 0 0 -355z m290 0 l0 -355 -70 0 -70 0 0 355 0 355 70 0 70 0 0 -355z m660 0 l0 -355 -255 0 -255 0 0 355 0 355 255 0 255 0 0 -355z m280 0 l0 -355 -65 0 -65 0 0 355 0 355 65 0 65 0 0 -355z m668 3 l-3 -353 -255 0 -255 0 -3 353 -2 352 260 0 260 0 -2 -352z m282 253 c0 -55 3 -107 6 -116 10 -24 60 -46 89 -39 45 11 55 39 55 151 l0 103 255 0 255 0 0 -355 0 -355 -255 0 -255 0 0 102 c0 91 -2 104 -22 125 -30 33 -80 31 -107 -3 -18 -23 -21 -41 -21 -125 l0 -99 -65 0 -65 0 0 355 0 355 65 0 65 0 0 -99z m950 -256 l0 -356 -67 3 -68 3 -3 353 -2 352 70 0 70 0 0 -355z m799 288 c11 -38 61 -207 112 -378 122 -410 138 -473 146 -572 l6 -83 -214 0 c-181 0 -220 3 -250 18 -20 9 -129 91 -243 182 l-206 165 0 368 0 367 315 0 314 0 20 -67z m-698 -822 c24 -15 64 -47 89 -69 l45 -41 -719 -1 -720 0 -23 -22 c-28 -26 -30 -67 -4 -99 l19 -24 821 -3 821 -2 46 -35 c75 -57 119 -65 371 -65 l223 0 0 -218 c0 -181 -3 -221 -16 -240 -15 -21 -20 -22 -209 -22 l-195 0 -6 28 c-26 124 -74 214 -160 298 -202 201 -529 217 -746 37 -94 -77 -166 -193 -193 -308 l-12 -50 -851 -3 -852 -2 -6 27 c-18 83 -51 159 -95 222 -170 242 -492 310 -752 158 -112 -66 -222 -218 -252 -349 l-11 -53 -136 -3 c-114 -2 -139 0 -152 13 -14 14 -16 53 -16 291 l0 274 1035 0 c736 0 1041 3 1058 11 24 11 47 47 47 73 0 7 -9 25 -21 40 l-20 26 -1050 0 -1049 0 0 70 0 70 1823 0 1823 0 45 -29z m-2726 -517 c119 -30 216 -111 269 -224 39 -83 48 -208 21 -291 -36 -113 -116 -204 -224 -256 -79 -38 -220 -45 -302 -14 -166 63 -264 193 -276 367 -9 125 36 234 132 322 109 100 240 133 380 96z m2820 0 c120 -31 215 -110 268 -222 30 -63 32 -74 32 -177 0 -101 -2 -115 -29 -170 -38 -77 -124 -163 -201 -200 -84 -40 -223 -47 -307 -15 -161 60 -263 193 -275 360 -10 126 36 241 132 328 109 100 240 133 380 96z" />
        <path className="wheel" d="M931 2025 c-70 -20 -111 -46 -160 -101 -135 -154 -86 -393 102 -491 45 -24 64 -28 137 -28 73 0 93 4 142 28 63 31 116 86 150 156 33 65 32 185 -1 258 -27 61 -103 136 -164 163 -61 27 -142 32 -206 15z m121 -145 c148 -41 172 -236 38 -307 -71 -38 -138 -28 -196 29 -87 83 -53 233 61 273 49 17 51 17 97 5z" />
        <path className="wheel" d="M3751 2025 c-70 -20 -111 -46 -160 -101 -135 -154 -85 -393 102 -492 45 -23 64 -27 137 -27 73 0 93 4 142 28 63 31 116 86 150 156 33 65 32 185 -1 258 -27 61 -103 136 -164 163 -61 27 -142 32 -206 15z m122 -146 c50 -13 103 -61 118 -106 25 -77 -14 -172 -85 -204 -72 -33 -136 -22 -192 33 -87 83 -53 233 61 273 49 17 51 17 98 4z" />
      </g>
    </g>
  </svg>
);
    

