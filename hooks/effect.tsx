import { useEffect as ssr, useLayoutEffect as csr } from "react";


/**
 * Returns the right effect hook
 *
 * @returns Right effect hook
 */
export const useLayoutEffect = typeof window === `undefined` ? ssr : csr;
