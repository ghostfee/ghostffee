"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./pick-a-box.module.css";

type SearchMode = "individual" | "teoria" | "pregunta";
type CoinPlacement = "random" | "especifica";
type FeedbackState = "" | "si" | "no";

type BoxState = {
  id: number;
  open: boolean;
  hasCoin: boolean;
  hiddenState: boolean;
  selectedGroup: boolean;
  hoverGroup: boolean;
  discardedGroup: boolean;
  wrongSelection: boolean;
  hiding: boolean;
  boxEnter: boolean;
  showHidingCoin: boolean;
  moneda: boolean;
  monedaEncontrada: boolean;
};

type ConfettiPiece = {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
};

const CONFETTI_COLORS = ["#f97316", "#4f46e5", "#22c55e", "#ec4899", "#eab308"];

function makeBoxes(count: number, coinPos: number, animate = false): BoxState[] {
  return Array.from({ length: count }, (_, idx) => ({
    id: idx + 1,
    open: false,
    hasCoin: idx + 1 === coinPos,
    hiddenState: false,
    selectedGroup: false,
    hoverGroup: false,
    discardedGroup: false,
    wrongSelection: false,
    hiding: false,
    boxEnter: animate,
    showHidingCoin: false,
    moneda: false,
    monedaEncontrada: false,
  }));
}

export function PickABox() {
  const [numBoxes, setNumBoxes] = useState(8);
  const [coinPlacement, setCoinPlacement] = useState<CoinPlacement>("random");
  const [specificBox, setSpecificBox] = useState(1);
  const [mode, setMode] = useState<SearchMode>("individual");

  const [boxes, setBoxes] = useState<BoxState[]>(() => makeBoxes(8, -1, true));
  const [coinPosition, setCoinPosition] = useState(-1);
  const [gameActive, setGameActive] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [boxesOpened, setBoxesOpened] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [roundsTotal, setRoundsTotal] = useState(0);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(0);

  const [instructions, setInstructions] = useState(
    'Haz clic en "Esconder moneda" para comenzar. Luego haz clic en las cajas para buscarla.'
  );
  const [statusText, setStatusText] = useState("Esperando para iniciar");
  const [feedback, setFeedback] = useState<FeedbackState>("");
  const [coinFoundLabel, setCoinFoundLabel] = useState("-");

  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  const yesAudioRef = useRef<HTMLAudioElement | null>(null);
  const noAudioRef = useRef<HTMLAudioElement | null>(null);
  const coinAudioRef = useRef<HTMLAudioElement | null>(null);

  const maxAttempts = useMemo(
    () => (mode === "individual" ? numBoxes - 1 : Math.ceil(Math.log2(numBoxes))),
    [mode, numBoxes]
  );

  useEffect(() => {
    yesAudioRef.current = new Audio("/sounds/yes.mp3");
    noAudioRef.current = new Audio("/sounds/no.mp3");
    coinAudioRef.current = new Audio("/sounds/coin.mp3");
  }, []);

  useEffect(() => {
    if (gameActive) return;

    setBoxes(makeBoxes(numBoxes, -1, true));
    setRangeStart(1);
    setRangeEnd(0);
  }, [numBoxes, gameActive]);

  useEffect(() => {
    if (gameActive) return;

    if (mode === "teoria" || mode === "pregunta") {
      setInstructions(
        mode === "pregunta"
          ? 'Pasa el puntero por un grupo, haz clic, o pulsa "Izquierda" para preguntar por la mitad izquierda.'
          : "Pasa el puntero por un grupo y haz clic para preguntar por esa mitad."
      );
    } else {
      setInstructions('Haz clic en "Esconder moneda" para comenzar. Luego haz clic en las cajas para buscarla.');
    }
  }, [mode, gameActive]);

  function playYesSound() {
    try {
      if (!yesAudioRef.current) return;
      yesAudioRef.current.currentTime = 0;
      yesAudioRef.current.play();
    } catch {}
  }

  function playNoSound() {
    try {
      if (!noAudioRef.current) return;
      noAudioRef.current.currentTime = 0;
      noAudioRef.current.play();
    } catch {}
  }

  function playCoinSound() {
    try {
      if (!coinAudioRef.current) return;
      coinAudioRef.current.currentTime = 0;
      coinAudioRef.current.play();
    } catch {}
  }

  function launchConfetti() {
    const pieces: ConfettiPiece[] = Array.from({ length: 140 }, (_, idx) => ({
      id: idx,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[idx % CONFETTI_COLORS.length],
      delay: Math.random() * 0.4,
      duration: 1.8 + Math.random() * 0.9,
    }));

    setConfettiPieces(pieces);
    setTimeout(() => setConfettiPieces([]), 2600);
  }

  function getSideForBox(id: number, start: number, end: number): "izquierda" | "derecha" | null {
    const total = end - start + 1;
    const half = Math.floor(total / 2);
    if (half === 0) return null;

    const leftStart = start;
    const leftEnd = start + half - 1;
    const rightStart = leftEnd + 1;
    const rightEnd = end;

    if (id >= leftStart && id <= leftEnd) return "izquierda";
    if (id >= rightStart && id <= rightEnd) return "derecha";
    return null;
  }

  function updateSelectedRange(start: number, end: number) {
    setBoxes((prev) =>
      prev.map((box) => ({
        ...box,
        selectedGroup: !box.open && box.id >= start && box.id <= end,
      }))
    );
  }

  function clearHoverGroup() {
    setBoxes((prev) => prev.map((box) => ({ ...box, hoverGroup: false })));
  }

  function applyHoverForSide(side: "izquierda" | "derecha", start: number, end: number) {
    const total = end - start + 1;
    const half = Math.floor(total / 2);
    if (half === 0) return;

    const leftStart = start;
    const leftEnd = start + half - 1;
    const rightStart = leftEnd + 1;
    const rightEnd = end;

    setBoxes((prev) =>
      prev.map((box) => {
        if (box.open) return { ...box, hoverGroup: false };

        const inLeft = box.id >= leftStart && box.id <= leftEnd;
        const inRight = box.id >= rightStart && box.id <= rightEnd;

        return {
          ...box,
          hoverGroup: (side === "izquierda" && inLeft) || (side === "derecha" && inRight),
        };
      })
    );
  }

  function animateHideCoins(showSpecificOnly: boolean, coinPos: number) {
    if (showSpecificOnly) {
      setBoxes((prev) =>
        prev.map((box) =>
          box.id === coinPos
            ? { ...box, hiding: true, showHidingCoin: true }
            : box
        )
      );

      setTimeout(() => {
        setBoxes((prev) =>
          prev.map((box) => ({
            ...box,
            hiding: false,
            showHidingCoin: false,
            hiddenState: true,
          }))
        );
      }, 800);

      return;
    }

    setBoxes((prev) => prev.map((box) => ({ ...box, hiding: true, showHidingCoin: true })));

    setTimeout(() => {
      setBoxes((prev) =>
        prev.map((box) => ({
          ...box,
          hiding: false,
          showHidingCoin: false,
          hiddenState: true,
        }))
      );
    }, 800);
  }

  function startSimulation() {
    if (numBoxes < 2 || numBoxes > 20) {
      return;
    }

    const newCoinPos =
      coinPlacement === "random"
        ? Math.floor(Math.random() * numBoxes) + 1
        : Math.max(1, Math.min(specificBox, numBoxes));

    setCoinPosition(newCoinPos);
    setBoxes(makeBoxes(numBoxes, newCoinPos, false));

    setBoxesOpened(0);
    setAttempts(0);
    setGameActive(true);
    setRoundsTotal((prev) => prev + 1);
    setRangeStart(1);
    setRangeEnd(numBoxes);
    setStatusText("Buscando moneda...");
    setCoinFoundLabel("-");
    setFeedback("");

    if (mode === "teoria" || mode === "pregunta") {
      setInstructions(
        mode === "pregunta"
          ? 'Pasa el puntero por un grupo, haz clic, o pulsa "Izquierda" para preguntar por la mitad izquierda.'
          : "Pasa el puntero por un grupo y haz clic para preguntar por esa mitad."
      );
      setTimeout(() => updateSelectedRange(1, numBoxes), 0);
    } else {
      setInstructions(`Haz clic en las cajas para buscar la moneda. Hay ${numBoxes} cajas en total.`);
    }

    setTimeout(() => animateHideCoins(coinPlacement === "especifica", newCoinPos), 0);
  }

  function revealFinalCoin(id: number, message: string) {
    setBoxes((prev) =>
      prev.map((box) =>
        box.id === id
          ? {
              ...box,
              open: true,
              hiddenState: false,
              moneda: true,
              monedaEncontrada: true,
              selectedGroup: false,
              hoverGroup: false,
            }
          : box
      )
    );

    setGameActive(false);
    setStatusText("¡Moneda encontrada!");
    setCoinFoundLabel(String(id));
    setRoundsCompleted((prev) => prev + 1);
    setInstructions(message);
    setFeedback("si");
    playCoinSound();
    launchConfetti();
  }

  function openBox(id: number) {
    if (!gameActive) return;

    const target = boxes.find((box) => box.id === id);
    if (!target || target.open) return;

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (target.hasCoin) {
      revealFinalCoin(
        id,
        `¡Felicidades! Encontraste la moneda en la caja ${id} después de ${nextAttempts} intentos.`
      );
      return;
    }

    setBoxes((prev) =>
      prev.map((box) =>
        box.id === id
          ? {
              ...box,
              open: true,
              hiddenState: false,
              discardedGroup: true,
              wrongSelection: true,
              selectedGroup: false,
              hoverGroup: false,
            }
          : box
      )
    );

    setBoxesOpened((prev) => prev + 1);
    setFeedback("no");
    playNoSound();

    setTimeout(() => {
      setBoxes((prev) =>
        prev.map((box) =>
          box.id === id ? { ...box, wrongSelection: false } : box
        )
      );
    }, 450);

    const unopened = boxes.filter((box) => !box.open && box.id !== id);
    if (unopened.length === 1 && unopened[0].hasCoin) {
      const finalBox = unopened[0];
      setTimeout(() => {
        revealFinalCoin(
          finalBox.id,
          `Al descartar todas las demás, sabemos que la moneda está en la caja ${finalBox.id}.`
        );
      }, 120);
    }
  }

  function discardRange(start: number, end: number, wrong = false) {
    let discarded = 0;

    setBoxes((prev) =>
      prev.map((box) => {
        if (!box.open && box.id >= start && box.id <= end) {
          discarded += 1;
          return {
            ...box,
            open: true,
            hiddenState: false,
            discardedGroup: true,
            wrongSelection: wrong,
            selectedGroup: false,
            hoverGroup: false,
          };
        }
        return box;
      })
    );

    if (discarded > 0) {
      setBoxesOpened((prev) => prev + discarded);
    }

    if (wrong) {
      setTimeout(() => {
        setBoxes((prev) => prev.map((box) => ({ ...box, wrongSelection: false })));
      }, 450);
    }
  }

  function askGroup(side: "izquierda" | "derecha") {
    if (!gameActive) return;

    let start = rangeStart;
    let end = rangeEnd;

    if (end < start) {
      start = 1;
      end = numBoxes;
    }

    const total = end - start + 1;
    const half = Math.floor(total / 2);
    if (total <= 1 || half === 0) return;

    const leftStart = start;
    const leftEnd = start + half - 1;
    const rightStart = leftEnd + 1;
    const rightEnd = end;

    const askedStart = side === "izquierda" ? leftStart : rightStart;
    const askedEnd = side === "izquierda" ? leftEnd : rightEnd;
    const discardedStart = side === "izquierda" ? rightStart : leftStart;
    const discardedEnd = side === "izquierda" ? rightEnd : leftEnd;

    const containsCoin = coinPosition >= askedStart && coinPosition <= askedEnd;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    let newStart: number;
    let newEnd: number;

    if (containsCoin) {
      discardRange(discardedStart, discardedEnd, false);
      newStart = askedStart;
      newEnd = askedEnd;
      setStatusText(`Respuesta: SÍ, la moneda está en la mitad ${side}.`);
      setFeedback("si");
    } else {
      discardRange(askedStart, askedEnd, true);
      newStart = discardedStart;
      newEnd = discardedEnd;
      setStatusText(`Respuesta: NO, la moneda no está en la mitad ${side}.`);
      setFeedback("no");
    }

    setRangeStart(newStart);
    setRangeEnd(newEnd);
    clearHoverGroup();
    updateSelectedRange(newStart, newEnd);

    const remaining = newEnd - newStart + 1;
    if (remaining > 1) {
      if (containsCoin) playYesSound();
      else playNoSound();
    }

    if (remaining === 1) {
      setTimeout(() => revealFinalCoin(newStart, `Al dividir por mitades, aislamos la caja ${newStart}.`), 120);
    }
  }

  function handleBoxClick(id: number) {
    if (!gameActive) return;

    if (mode === "teoria" || mode === "pregunta") {
      const side = getSideForBox(id, rangeStart, rangeEnd < rangeStart ? numBoxes : rangeEnd);
      if (!side) return;
      askGroup(side);
      return;
    }

    openBox(id);
  }

  function handleBoxHover(id: number, entering: boolean) {
    if ((mode !== "teoria" && mode !== "pregunta") || !gameActive) return;

    if (!entering) {
      clearHoverGroup();
      return;
    }

    const side = getSideForBox(id, rangeStart, rangeEnd < rangeStart ? numBoxes : rangeEnd);
    if (!side) return;

    applyHoverForSide(side, rangeStart, rangeEnd < rangeStart ? numBoxes : rangeEnd);
  }

  function resetSimulation() {
    setGameActive(false);
    setCoinPosition(-1);
    setAttempts(0);
    setBoxesOpened(0);
    setRangeStart(1);
    setRangeEnd(0);
    setStatusText("Esperando para iniciar");
    setCoinFoundLabel("-");
    setFeedback("");
    setConfettiPieces([]);
    setBoxes(makeBoxes(numBoxes, -1, true));
    setInstructions('Haz clic en "Esconder moneda" para comenzar. Luego haz clic en las cajas para buscarla.');
  }

  return (
    <>
      <div className={styles.mainContent}>
        <div className={styles.configPanel}>
          <div className={styles.controlGroup}>
            <label className={styles.label} htmlFor="numCajas">
              Número de cajas:
            </label>
            <input
              id="numCajas"
              type="number"
              min={2}
              max={20}
              value={numBoxes}
              onChange={(event) => {
                const parsed = Number(event.target.value);
                if (!Number.isFinite(parsed)) return;
                setNumBoxes(Math.max(2, Math.min(20, parsed)));
              }}
              className={styles.numberInput}
            />
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label}>Ubicación de la moneda:</label>
            <div className={styles.radioGroup}>
              <div className={styles.radioOption}>
                <input
                  id="random"
                  name="ubicacion"
                  type="radio"
                  value="random"
                  checked={coinPlacement === "random"}
                  onChange={() => setCoinPlacement("random")}
                />
                <label htmlFor="random">Aleatoria</label>
              </div>
              <div className={styles.radioOption}>
                <input
                  id="especifica"
                  name="ubicacion"
                  type="radio"
                  value="especifica"
                  checked={coinPlacement === "especifica"}
                  onChange={() => setCoinPlacement("especifica")}
                />
                <label htmlFor="especifica">Específica</label>
              </div>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label}>Modo de búsqueda:</label>
            <div className={styles.radioGroup}>
              <div className={styles.radioOption}>
                <input
                  id="modo-individual"
                  name="modo"
                  type="radio"
                  value="individual"
                  checked={mode === "individual"}
                  onChange={() => setMode("individual")}
                />
                <label htmlFor="modo-individual">Caja</label>
              </div>
              <div className={styles.radioOption}>
                <input
                  id="modo-teoria"
                  name="modo"
                  type="radio"
                  value="teoria"
                  checked={mode === "teoria"}
                  onChange={() => setMode("teoria")}
                />
                <label htmlFor="modo-teoria">Grupo</label>
              </div>
              <div className={styles.radioOption}>
                <input
                  id="modo-pregunta"
                  name="modo"
                  type="radio"
                  value="pregunta"
                  checked={mode === "pregunta"}
                  onChange={() => setMode("pregunta")}
                />
                <label htmlFor="modo-pregunta">Pregunta</label>
              </div>
            </div>
          </div>

          <div
            className={styles.controlGroup}
            style={{
              visibility: coinPlacement === "especifica" ? "visible" : "hidden",
              opacity: coinPlacement === "especifica" ? 1 : 0,
              pointerEvents: coinPlacement === "especifica" ? "auto" : "none",
              transition: "opacity 0.25s ease",
            }}
          >
            <label className={styles.label} htmlFor="cajaEspecifica">
              Caja específica:
            </label>
            <input
              id="cajaEspecifica"
              type="number"
              min={1}
              max={numBoxes}
              value={specificBox}
              onChange={(event) => {
                const parsed = Number(event.target.value);
                if (!Number.isFinite(parsed)) return;
                setSpecificBox(Math.max(1, Math.min(numBoxes, parsed)));
              }}
              className={styles.numberInput}
            />
          </div>

          <button className={styles.button} onClick={startSimulation} disabled={gameActive}>
            Esconder moneda
          </button>
          <button className={`${styles.button} ${styles.resetButton}`} onClick={resetSimulation}>
            Reiniciar
          </button>
        </div>

        <div className={styles.simulationPanel}>
          {confettiPieces.length > 0 && (
            <div className={styles.confettiContainer}>
              {confettiPieces.map((piece) => (
                <div
                  key={piece.id}
                  className={styles.confettiPiece}
                  style={{
                    backgroundColor: piece.color,
                    left: `${piece.left}%`,
                    animationDelay: `${piece.delay}s`,
                    animationDuration: `${piece.duration}s`,
                  }}
                />
              ))}
            </div>
          )}

          <h2 className={styles.sectionTitle}>Busca la moneda</h2>
          <p className={styles.instructions}>{instructions}</p>

          <div className={`${styles.respuestaVisual} ${feedback === "si" ? styles.respuestaSi : ""} ${feedback === "no" ? styles.respuestaNo : ""}`}>
            {feedback === "si" ? "SÍ" : feedback === "no" ? "NO" : ""}
          </div>

          <div className={styles.boxesContainer}>
            {boxes.map((box) => {
              const className = [
                styles.box,
                box.boxEnter ? styles.boxEnter : "",
                box.open ? styles.opened : "",
                box.hiddenState ? styles.hiddenState : "",
                box.moneda ? styles.moneda : "",
                box.monedaEncontrada ? styles.monedaEncontrada : "",
                box.selectedGroup ? styles.selectedGroup : "",
                box.hoverGroup ? styles.hoverGroup : "",
                box.discardedGroup ? styles.discardedGroup : "",
                box.wrongSelection ? styles.wrongSelection : "",
                box.hiding ? styles.hiding : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={box.id}
                  className={className}
                  style={box.boxEnter ? { animationDelay: `${(box.id - 1) * 40}ms` } : undefined}
                  onAnimationEnd={() => {
                    setBoxes((prev) =>
                      prev.map((item) =>
                        item.id === box.id ? { ...item, boxEnter: false } : item
                      )
                    );
                  }}
                  onClick={() => handleBoxClick(box.id)}
                  onMouseEnter={() => handleBoxHover(box.id, true)}
                  onMouseLeave={() => handleBoxHover(box.id, false)}
                  type="button"
                >
                  {box.showHidingCoin && <span className={styles.hidingCoin}>🪙</span>}
                  <span>{box.monedaEncontrada ? <span className={styles.monedaIcon}>🪙</span> : box.id}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.groupButtonsRow}>
            <button className={`${styles.button} ${styles.inlineButton}`} style={{ display: "none" }} type="button">
              ¿izquierda?
            </button>
            <button className={`${styles.button} ${styles.inlineButton}`} style={{ display: "none" }} type="button">
              ¿derecha?
            </button>
          </div>

          <div className={styles.maxRow}>
            <button
              className={`${styles.button} ${styles.smallPrompt}`}
              style={{
                visibility: mode === "pregunta" ? "visible" : "hidden",
                pointerEvents: mode === "pregunta" ? "auto" : "none",
              }}
              type="button"
              onClick={() => askGroup("izquierda")}
            >
              ¿Izquierda?
            </button>
            <p className={styles.maxText}>Intento actual: {attempts} de {maxAttempts}</p>
          </div>

          <div className={styles.hiddenMetrics}>
            <span>{statusText}</span>
            <span>{coinFoundLabel}</span>
            <span>{roundsCompleted}/{roundsTotal}</span>
            <span>{boxesOpened}</span>
            <span>{attempts}</span>
          </div>
        </div>
      </div>

      <div className={styles.infoPanel}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Estado:</span>
          <span className={styles.infoValue}>{statusText}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Moneda encontrada:</span>
          <span className={styles.infoValue}>{coinFoundLabel}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Historial:</span>
          <span className={styles.infoValue}>{roundsCompleted}/{roundsTotal}</span>
        </div>
      </div>

      <section className={styles.conceptExplanation}>
        <h3 className={styles.conceptTitle}>¿Qué enseña esta simulación?</h3>
        <p>
          En búsqueda secuencial, cada intento descarta muy poca incertidumbre. En cambio,
          al dividir por mitades, cada respuesta binaria elimina gran parte del espacio de
          posibilidades.
        </p>
        <div className={styles.formula}>
          H(X) = log2(n) bits &nbsp; → &nbsp; cada pregunta ideal reduce ~1 bit de incertidumbre
        </div>
        <p>
          Por eso en modo <span className={styles.highlight}>Grupo/Pregunta</span> puedes encontrar
          la moneda en aproximadamente <span className={styles.highlight}>⌈log2(n)⌉</span> intentos,
          mientras que en modo caja a caja puedes llegar a <span className={styles.highlight}>n - 1</span>.
        </p>
      </section>
    </>
  );
}
