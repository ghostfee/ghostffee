"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type StaggerOptions = {
  staggerMs?: number;
  skipInitial?: boolean;
};

export function useStaggeredEnter(
  trigger: unknown,
  { staggerMs = 40, skipInitial = true }: StaggerOptions = {}
) {
  const [cycle, setCycle] = useState(0);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (skipInitial && isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    setCycle((prev) => prev + 1);
  }, [trigger, skipInitial]);

  const getDelayStyle = useCallback(
    (index: number): CSSProperties =>
      ({ ["--enter-delay" as string]: `${index * staggerMs}ms` }) as CSSProperties,
    [staggerMs]
  );

  return {
    cycle,
    getDelayStyle,
  };
}
