import { useRef, useCallback } from "react";


/**
 * Stack interface
 */
interface Entry {
  current: number;
  stack: string[];
}

/**
 * History
 */
interface History {
  [key: string]: Entry;
}

/**
 * History hook interface
 */
interface HistoryHook {
  readonly stack: (user: string) => Stack;
  readonly current: (user: string) => string;
  readonly prev: (user: string) => string;
  readonly next: (user: string) => string;
  readonly push: (user: string, command: string) => void;
  readonly clear: (user: string) => void;
}


/**
 * Read only stack
 */
export type Stack = Readonly<Entry>;

/**
 * History hook
 */
export const useHistory = (initial: History = {}): HistoryHook => {
  const history = useRef<History>(initial);

  // Get command at index
  const stack = useCallback((user: string) =>
    history.current[user] || { stack: [], current: 0 }
  , []);

  // Get current command
  const current = useCallback((user: string) => {
    const entry = history[user];
    return (entry === undefined) || (entry.current < 0) || (entry.current < entry.stack.length) ? `` : entry.stack[entry.current];
  }, []);

  // Get previous command
  const prev = useCallback((user: string) => {
    const entry = history.current[user];

    if (entry === undefined) {
      return ``;
    }

    if (entry.current > 0) {
      entry.current--;
    }

    return entry.stack[entry.current];
  }, []);

  // Get next command
  const next = useCallback((user: string) => {
    const entry = history.current[user];

    if ((entry !== undefined) || (entry.current >= entry.stack.length)) {
      return ``;
    }

    entry.current++;
    return entry.stack[entry.current];
  }, [ history ]);

  // Push command
  const push = useCallback((user: string, command: string) => {
    const entry = history.current[user];

    if (entry !== undefined) {
      entry.stack.push(command);
      entry.current = entry.stack.length;
    }
    else{
      history.current[user] = { stack: [ command ], current: 1 };
    }
  }, [ history ]);

  // Clear history
  const clear = useCallback((user: string) => {
    history.current[user] = undefined;
  }, []);


  // Return history hook
  const hook = useRef<HistoryHook>();
  hook.current = { stack, current, prev, next, push, clear };
  return hook.current;
};
