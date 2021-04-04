import { useEffect, useLayoutEffect } from "react";

/**
 * Server side generation effect
 */
export const useNextEffect = typeof window === `undefined` ? useEffect : useLayoutEffect;
