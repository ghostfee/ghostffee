"use client";

import { useMemo, useRef, useState } from "react";
import styles from "./signed-zero-line-lab.module.css";
import { useStaggeredEnter } from "@/hooks/use-staggered-enter";

const BOX_COUNT = 16;
type RepresentationMode = "unsigned" | "sign-bit" | "bias" | "ones" | "twos";
type ConversionDetails = {
  title: string;
  binary: string;
  decimal: string;
  steps: string[];
};

const MODE_OPTIONS: Array<{ value: RepresentationMode; label: string }> = [
  { value: "unsigned", label: "Sin signo" },
  { value: "sign-bit", label: "Bit de signo (MSB)" },
  { value: "bias", label: "Sesgo" },
  { value: "ones", label: "Complemento a 1" },
  { value: "twos", label: "Complemento a 2" },
];

const BINARY_LABELS = Array.from({ length: BOX_COUNT }, (_, index) =>
  index.toString(2).padStart(4, "0")
);

function toSignedLabel(index: number, mode: RepresentationMode, zeroIndex: number) {
  if (mode === "unsigned") {
    return String(index);
  }

  if (mode === "bias") {
    return String(index - zeroIndex);
  }

  if (mode === "sign-bit") {
    const sign = (index >> 3) & 1;
    const magnitude = index & 0b111;

    if (sign === 0) {
      return String(magnitude);
    }

    return magnitude === 0 ? "-0" : String(-magnitude);
  }

  if (mode === "ones") {
    if (index < 8) {
      return String(index);
    }

    const magnitude = (~index) & 0b1111;
    return magnitude === 0 ? "-0" : String(-magnitude);
  }

  if (index < 8) {
    return String(index);
  }

  return String(index - 16);
}

export function SignedZeroLineLab() {
  const [zeroIndex, setZeroIndex] = useState(0);
  const [mode, setMode] = useState<RepresentationMode>("unsigned");
  const [showExplainer, setShowExplainer] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredBinaryIndex, setHoveredBinaryIndex] = useState<number | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);
  const { cycle: caseAnimationCycle, getDelayStyle } = useStaggeredEnter(mode, {
    staggerMs: 40,
    skipInitial: false,
  });

  const signedValues = useMemo(
    () => Array.from({ length: BOX_COUNT }, (_, index) => toSignedLabel(index, mode, zeroIndex)),
    [mode, zeroIndex]
  );

  const sortedIndices = useMemo(() => {
    if (mode === "unsigned") {
      return Array.from({ length: BOX_COUNT }, (_, i) => i);
    }

    const indexed = Array.from({ length: BOX_COUNT }, (_, binaryIndex) => ({
      binaryIndex,
      value: toSignedLabel(binaryIndex, mode, zeroIndex),
    }));

    return indexed.sort((a, b) => {
      const aNum = parseInt(a.value, 10);
      const bNum = parseInt(b.value, 10);
      return aNum - bNum;
    }).map((item) => item.binaryIndex);
  }, [mode, zeroIndex]);

  function clampIndex(next: number) {
    return Math.max(0, Math.min(BOX_COUNT - 1, next));
  }

  function applyFromPointer(clientX: number) {
    if (!markerRef.current) return;

    const rect = markerRef.current.getBoundingClientRect();
    const relative = clientX - rect.left;
    const cellWidth = rect.width / BOX_COUNT;
    const next = clampIndex(Math.round(relative / cellWidth - 0.5));
    setZeroIndex(next);
  }

  function onMarkerPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (mode !== "bias") {
      return;
    }

    event.preventDefault();
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    applyFromPointer(event.clientX);
  }

  function onMarkerPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (mode !== "bias") {
      return;
    }

    if (!isDragging) return;
    applyFromPointer(event.clientX);
  }

  function onMarkerPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  }

  function hasExplicitSignBit(currentMode: RepresentationMode) {
    return currentMode === "sign-bit" || currentMode === "ones" || currentMode === "twos";
  }

  function getBinarySignBitClass(binary: string) {
    if (mode === "unsigned") {
      return styles.unsignedLeadingBit;
    }

    if (!hasExplicitSignBit(mode)) {
      return styles.inactiveSignBit;
    }

    return binary[0] === "1" ? styles.signBitNegative : styles.signBitPositive;
  }

  function renderBinaryLabel(binary: string) {
    if (mode === "unsigned") {
      return <span className={styles.binaryPlain}>{binary}</span>;
    }

    return (
      <>
        <span className={`${styles.binaryBit} ${getBinarySignBitClass(binary)}`}>
          {binary[0]}
        </span>
        <span className={styles.binaryTail}>{binary.slice(1)}</span>
      </>
    );
  }

  function renderValueLabel(value: string) {
    if (mode === "unsigned") {
      return <span className={styles.valueMagnitude}>{value}</span>;
    }

    if (value.startsWith("-")) {
      return (
        <>
          <span className={`${styles.valueSign} ${styles.valueNegative}`}>-</span>
          <span className={styles.valueMagnitude}>{value.slice(1)}</span>
        </>
      );
    }

    if (value !== "0") {
      return (
        <>
          <span className={`${styles.valueSign} ${styles.valuePositive}`}>+</span>
          <span className={styles.valueMagnitude}>{value}</span>
        </>
      );
    }

    return <span className={styles.valueMagnitude}>{value}</span>;
  }

  function getValueSign(value: string): "negative" | "zero" | "positive" {
    const num = parseInt(value, 10);
    if (Number.isNaN(num)) return "zero";
    if (num < 0) return "negative";
    if (num > 0) return "positive";
    return "zero";
  }

  function invertBinary(binary: string) {
    return binary
      .split("")
      .map((bit) => (bit === "0" ? "1" : "0"))
      .join("");
  }

  function getConversionDetails(binaryIndex: number): ConversionDetails {
    const binary = BINARY_LABELS[binaryIndex];
    const decimal = toSignedLabel(binaryIndex, mode, zeroIndex);
    const modeLabel = MODE_OPTIONS.find((option) => option.value === mode)?.label ?? "Caso";

    if (mode === "unsigned") {
      const b3 = Number(binary[0]);
      const b2 = Number(binary[1]);
      const b1 = Number(binary[2]);
      const b0 = Number(binary[3]);
      const value = parseInt(binary, 2);

      return {
        title: `${modeLabel}: 4 bits sin signo`,
        binary,
        decimal,
        steps: [
          `Tomas los 4 bits como magnitud pura: ${binary}.`,
          `${binary}₂ = (${b3}×8) + (${b2}×4) + (${b1}×2) + (${b0}×1).`,
          `Resultado decimal: ${value}.`,
        ],
      };
    }

    if (mode === "bias") {
      const unsignedValue = parseInt(binary, 2);

      return {
        title: `${modeLabel}: valor sin signo menos sesgo`,
        binary,
        decimal,
        steps: [
          `Lees ${binary} como sin signo: ${unsignedValue}.`,
          `El sesgo actual es la posicion del cero: ${zeroIndex} (caja ${zeroIndex + 1}).`,
          `Restas el sesgo: ${unsignedValue} - ${zeroIndex} = ${decimal}.`,
        ],
      };
    }

    if (mode === "sign-bit") {
      const signBit = binary[0];
      const magnitudeBits = binary.slice(1);
      const magnitude = parseInt(magnitudeBits, 2);

      return {
        title: `${modeLabel}: bit de signo + magnitud`,
        binary,
        decimal,
        steps: [
          `Bit de signo s=${signBit} (0 positivo, 1 negativo).`,
          `Magnitud m=${magnitudeBits}₂ = ${magnitude}.`,
          signBit === "0"
            ? `Como s=0, el valor final es +${magnitude} = ${decimal}.`
            : `Como s=1, el valor final es -${magnitude} = ${decimal}.`,
        ],
      };
    }

    if (mode === "ones") {
      const signBit = binary[0];

      if (signBit === "0") {
        const positive = parseInt(binary, 2);
        return {
          title: `${modeLabel}: si s=0, lectura directa`,
          binary,
          decimal,
          steps: [
            `Bit de signo s=0, asi que es positivo.`,
            `Lees directamente los 4 bits: ${binary}₂ = ${positive}.`,
            `Resultado decimal: ${decimal}.`,
          ],
        };
      }

      const inverted = invertBinary(binary);
      const magnitude = parseInt(inverted, 2);

      return {
        title: `${modeLabel}: invertir bits y aplicar signo`,
        binary,
        decimal,
        steps: [
          `Bit de signo s=1, asi que es negativo.`,
          `Inviertes todos los bits: ${binary} -> ${inverted}.`,
          `Magnitud: ${inverted}₂ = ${magnitude}; con signo queda ${decimal}.`,
        ],
      };
    }

    const signBit = binary[0];
    if (signBit === "0") {
      const positive = parseInt(binary, 2);
      return {
        title: `Complemento a 2: si s=0, lectura directa`,
        binary,
        decimal,
        steps: [
          `Bit de signo s=0, es un valor positivo.`,
          `Lees directo: ${binary}₂ = ${positive}.`,
          `Resultado decimal: ${decimal}.`,
        ],
      };
    }

    const inverted = invertBinary(binary);
    const plusOne = (parseInt(inverted, 2) + 1) & 0b1111;
    const plusOneBinary = plusOne.toString(2).padStart(4, "0");

    return {
      title: `Complemento a 2: invertir, sumar 1 y aplicar signo`,
      binary,
      decimal,
      steps: [
        `Bit de signo s=1, por tanto es negativo.`,
        `Inviertes bits: ${binary} -> ${inverted}.`,
        `Sumas 1: ${inverted} + 1 = ${plusOneBinary} (=${plusOne}).`,
        `Aplicas el signo negativo: ${decimal}.`,
      ],
    };
  }

  const hoveredDetails = useMemo(() => {
    if (hoveredBinaryIndex === null) {
      return null;
    }

    return getConversionDetails(hoveredBinaryIndex);
  }, [hoveredBinaryIndex, mode, zeroIndex]);

  const negativeBoxes = signedValues
    .map((value, index) => ({ value, index, binary: BINARY_LABELS[index], sign: getValueSign(value) }))
    .filter((item) => item.sign === "negative");

  const zeroBoxes = signedValues
    .map((value, index) => ({ value, index, binary: BINARY_LABELS[index], sign: getValueSign(value) }))
    .filter((item) => item.sign === "zero");

  const positiveBoxes = signedValues
    .map((value, index) => ({ value, index, binary: BINARY_LABELS[index], sign: getValueSign(value) }))
    .filter((item) => item.sign === "positive");

  const msbZeroBoxes = signedValues
    .map((value, index) => ({ value, index, binary: BINARY_LABELS[index] }))
    .filter((item) => item.binary[0] === "0");

  const msbOneBoxes = signedValues
    .map((value, index) => ({ value, index, binary: BINARY_LABELS[index] }))
    .filter((item) => item.binary[0] === "1");

  return (
    <section className={styles.lab}>
      <article className={styles.stage}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>simulacion fija para video</p>
            <h2 className={styles.title}>Linea de 16 cajas con cero desplazable</h2>
            <p className={styles.subtitle}>
              Cambia entre 5 representaciones. Los binarios de abajo se mantienen por caja y
              arriba ves su valor correcto segun el esquema activo.
            </p>
          </div>
          <div className={styles.controlsRight}>
            <p className={styles.pill}>16 cajas en una linea</p>
            <div className={styles.controlsRow}>
              <label className={styles.selectLabel}>
                caso
                <select
                  value={mode}
                  onChange={(event) => setMode(event.target.value as RepresentationMode)}
                  className={styles.select}
                >
                  {MODE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={showExplainer}
                  onChange={(event) => setShowExplainer(event.target.checked)}
                  className={styles.toggleInput}
                />
                <span className={styles.toggleTrack}>
                  <span className={styles.toggleKnob} />
                </span>
                <span className={styles.toggleText}>descripcion</span>
              </label>
            </div>
          </div>
        </header>

        <div className={styles.fixedArea}>
          <div className={`${styles.sliderZone} ${mode !== "bias" ? styles.sliderDisabled : ""}`}>
            <div className={styles.track} />

            <div
              ref={markerRef}
              className={styles.markers}
              onPointerDown={onMarkerPointerDown}
              onPointerMove={onMarkerPointerMove}
              onPointerUp={onMarkerPointerUp}
              onPointerCancel={onMarkerPointerUp}
            >
              {Array.from({ length: BOX_COUNT }, (_, index) => (
                <div
                  key={index}
                  className={styles.markerCell}
                  onClick={() => {
                    if (mode === "bias") {
                      setZeroIndex(index);
                    }
                  }}
                >
                  {index === zeroIndex ? <span className={styles.zeroHead}>0</span> : null}
                  <span className={styles.markerDot} />
                </div>
              ))}
            </div>
          </div>

          <div key={`${mode}-${caseAnimationCycle}`} className={styles.gridRow}>
            {sortedIndices.map((binaryIndex, displayPosition) => {
              const value = signedValues[binaryIndex];
              return (
                <div
                  key={binaryIndex}
                  className={`${styles.box} ${styles.boxEnter} ${
                    mode !== "unsigned" && (value === "0" || value === "-0") ? styles.zeroBox : ""
                  } ${
                    hoveredBinaryIndex === binaryIndex ? styles.boxHoveredExplain : ""
                  }`}
                  style={getDelayStyle(displayPosition)}
                  onMouseEnter={() => setHoveredBinaryIndex(binaryIndex)}
                  onMouseLeave={() => setHoveredBinaryIndex((current) => (current === binaryIndex ? null : current))}
                >
                  <p className={styles.value}>{renderValueLabel(value)}</p>
                  <p className={styles.binary}>{renderBinaryLabel(BINARY_LABELS[binaryIndex])}</p>
                </div>
              );
            })}
          </div>

          {showExplainer ? (
            <section className={styles.explainerPanel}>
              <div
                key={hoveredDetails ? `${mode}-${zeroIndex}-${hoveredDetails.binary}` : `idle-${mode}-${zeroIndex}`}
                className={styles.explainerContent}
              >
                {hoveredDetails ? (
                  <>
                    <header className={styles.explainerHeader}>
                      <p className={styles.explainerTitle}>{hoveredDetails.title}</p>
                      <p className={styles.explainerBadge}>
                        {hoveredDetails.binary} (base 2){" => "}{hoveredDetails.decimal}
                      </p>
                    </header>

                    <ol className={styles.explainerSteps}>
                      {hoveredDetails.steps.map((step, index) => (
                        <li key={`${hoveredDetails.binary}-${index}`}>{step}</li>
                      ))}
                    </ol>
                  </>
                ) : (
                  <p className={styles.explainerHint}>
                    Pasa el puntero por una caja para ver la conversion binario a decimal paso a paso en este caso.
                  </p>
                )}
              </div>
            </section>
          ) : null}
        </div>
      </article>

      <article className={styles.stageSeparated}>
        <header className={styles.headerSeparated}>
          <h3 className={styles.titleSeparated}>
            {mode === "unsigned" ? "Separada por bit alto (MSB)" : "Separada por signo"}
          </h3>
          <p className={styles.subtitleSeparated}>
            {mode === "unsigned"
              ? "Mismas cajas agrupadas por MSB=0 y MSB=1"
              : "Mismas cajas agrupadas por negativos y positivos"}
          </p>
        </header>

        <div className={styles.fixedAreaSeparated}>
          {mode === "unsigned" ? (
            <>
              <div className={styles.signSection}>
                <p className={styles.signLabel}>MSB = 0</p>
                <div className={styles.gridRowSeparated}>
                  {msbZeroBoxes.map((item) => (
                    <div
                      key={item.index}
                      className={`${styles.box} ${styles.boxEnter}`}
                      style={getDelayStyle(item.index)}
                    >
                      <p className={styles.value}>{renderValueLabel(item.value)}</p>
                      <p className={styles.binary}>{renderBinaryLabel(item.binary)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.signSection}>
                <p className={styles.signLabel}>MSB = 1</p>
                <div className={styles.gridRowSeparated}>
                  {msbOneBoxes.map((item) => (
                    <div
                      key={item.index}
                      className={`${styles.box} ${styles.boxEnter}`}
                      style={getDelayStyle(item.index)}
                    >
                      <p className={styles.value}>{renderValueLabel(item.value)}</p>
                      <p className={styles.binary}>{renderBinaryLabel(item.binary)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={`${styles.signSection} ${styles.signSectionUnified}`}>
                <div className={styles.signLane}>
                  <p className={styles.signLabel}>Negativos</p>
                  <div className={styles.gridRowSeparated}>
                    {negativeBoxes.map((item) => (
                      <div
                        key={item.index}
                        className={`${styles.box} ${styles.boxEnter}`}
                        style={getDelayStyle(item.index)}
                      >
                        <p className={styles.value}>{renderValueLabel(item.value)}</p>
                        <p className={styles.binary}>{renderBinaryLabel(item.binary)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.signDivider} />

                <div className={styles.signLane}>
                  <p className={styles.signLabel}>Cero</p>
                  <div className={styles.gridRowSeparated}>
                    {zeroBoxes.map((item) => (
                      <div
                        key={item.index}
                        className={`${styles.box} ${styles.boxEnter} ${styles.zeroBox}`}
                        style={getDelayStyle(item.index)}
                      >
                        <p className={styles.value}>{renderValueLabel(item.value)}</p>
                        <p className={styles.binary}>{renderBinaryLabel(item.binary)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.signDivider} />

                <div className={styles.signLane}>
                  <p className={styles.signLabel}>Positivos</p>
                  <div className={styles.gridRowSeparated}>
                    {positiveBoxes.map((item) => (
                      <div
                        key={item.index}
                        className={`${styles.box} ${styles.boxEnter}`}
                        style={getDelayStyle(item.index)}
                      >
                        <p className={styles.value}>{renderValueLabel(item.value)}</p>
                        <p className={styles.binary}>{renderBinaryLabel(item.binary)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </article>
    </section>
  );
}
