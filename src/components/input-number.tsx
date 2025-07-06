"use client";

import { InputHTMLAttributes, useCallback, useRef } from "react";

export const NumberInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
  const wheelHandlerRef = useRef<(event: WheelEvent) => void>();

  // Store the same function reference
  if (!wheelHandlerRef.current) {
    wheelHandlerRef.current = (event: WheelEvent) => {
      event.preventDefault();
    };
  }

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.addEventListener("wheel", wheelHandlerRef.current!, { passive: false });
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.removeEventListener("wheel", wheelHandlerRef.current!);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return <input {...props} type="number" onFocus={handleFocus} onBlur={handleBlur} onKeyDown={handleKeyDown} />;
};
