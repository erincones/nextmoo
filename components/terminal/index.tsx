import { useRef, useContext, useReducer, useMemo, useCallback, useEffect, ChangeEvent, KeyboardEvent, SyntheticEvent, ReactNode } from "react";

import { moo } from "cowsayjs";
import { CowContext, CowData } from "../../contexts/cow";

import { Prompt, rawPrompt } from "./prompt";
import { Help } from "./help";
import { History } from "./history";
import { Ls } from "./ls";
import { Share } from "./share";
import { Bad } from "./bad";

import { line } from "./utils";


/**
 * History
 */
interface CommandHistory {
  [key: string]: [ ReadonlyArray<string>, ReadonlyArray<string> ];
}

/**
 * Terminal environment
 */
interface Environment {
  readonly user: string;
  readonly index: number;
  readonly history: Readonly<CommandHistory>;
  readonly output: ReactNode[];
}


/** Scroll history action */
interface ScrollHistoryAction {
  readonly type: `HISTORY_FORWARD` | `HISTORY_BACKWARD`;
}

/** Command actions */
interface HandleCommandAction {
  readonly type: `HANDLE_COMMAND`;
  readonly command: string;
  readonly cowData: CowData;
  readonly run?: boolean;
}

/** Command actions */
interface ExecCommandAction {
  readonly type: `EXEC_COMMAND`;
  readonly cowData: CowData;
}

/** Action */
type Action = ScrollHistoryAction | HandleCommandAction | ExecCommandAction;


/**
 * Initial environment
 */
const initial: Environment = {
  user: `user`,
  index: 0,
  history: { user: [ [ `` ], [ `` ] ] },
  output: []
};

/**
 * Break line regular expression
 */
const breakline = /\r\n|[\n\r\f\v\u2028\u2029\u0085]/;


/**
 * End the session for the gived user
 */
const endSession = (fullHistory: CommandHistory, user: string, history: string[], workspace: string[], index: number): CommandHistory => {
  // Restore workspace
  if (index < workspace.length) {
    workspace.splice(index, 1, history[index]);
  }

  // Update history
  workspace.push(``);
  history.push(``);
  fullHistory[user] = [ workspace, history ];
  return fullHistory;
};



/**
 * Scroll the history
 *
 * @param env Current environment
 * @param action Scroll history action
 */
const scrollHistory = (env: Environment, { type }: ScrollHistoryAction): Environment => {
  const size = env.history[env.user][0].length;
  const index = env.index + (type === `HISTORY_BACKWARD` ? -1 : 1);

  return ((index < 0) || (index >= size)) ? env : { ...env, index };
};

/**
 * Update the command
 *
 * @param env Current environment
 * @param action Handle command action
 */
const handleCommand = (env: Environment, { command, cowData, run = false }: HandleCommandAction): Environment => {
  const [ workspace, history ] = env.history[env.user];

  const nextEnv: Environment = {
    ...env,
    history: {
      ...env.history,
      [env.user]: [
        [ ...workspace.slice(0, env.index), command, ...workspace.slice(env.index + 1) ],
        [ ...history ]
      ]
    }
  };

  // Updated environment
  return run || breakline.test(command) ?
    execCommand(nextEnv, { cowData } as ExecCommandAction) :
    nextEnv;
};

/**
 * Execute the command
 *
 * @param env Current environment
 * @param action Execute command action
 */
const execCommand = (env: Environment, { cowData }: ExecCommandAction): Environment => {
  // Parse input
  const fullHistory = { ...env.history };
  let [ workspace, history ] = env.history[env.user].map(list => list.slice(0, -1));
  const input = env.history[env.user][0][env.index].split(breakline);
  const output = [ ...env.output ];
  let user = env.user;
  let index = env.index;

  // Remove last empty command
  if ((input.length > 1) && (input[input.length - 1].length === 0)) {
    input.pop();
  }


  // Interprete input
  input.forEach(command => {
    // Parse command
    let match = command.trimLeft().match(/^\s*(\S+)(?:\s+(.+))?\s*$/);
    let key = output.length;
    output.push(<Prompt key={key++} user={user} path="moo" className={line}>{command}</Prompt>);

    if (match === null) {
      return;
    }

    // Update history
    history.push(command);
    workspace.push(command);


    // Check sudo
    let [, bin, args = `` ] = match;
    const sudo = bin === `sudo`;

    if (sudo) {
      while (bin === `sudo`) {
        match = args.trimLeft().match(/^\s*(\S+)(?:\s+(.+))?\s*$/);

        if (match !== null) ([, bin, args = `` ] = match);
        else return;
      }
    }


    // Execute command
    switch (bin) {
      // Simple commands
      case `clear`: output.splice(0, output.length); return;
      case `echo`:  output.push(<pre key={key} className={line}>{/\S/.test(args) ? args.trim() : `\n`}</pre>); return;
      case `help`:  output.push(<Help key={key} />); return;
      case `ls`:    output.push(<Ls key={key} />); return;
      case `share`: output.push(<Share key={key} data={cowData} />); return;

      // History
      case `history`:
        if (args.split(/\s+/)[0] === `-c`) {
          workspace.splice(0, workspace.length);
          history.splice(0, history.length);

          workspace.push(``);
          history.push(``);
        }
        else output.push(<History key={key} workspace={workspace} history={history} />);
        return;

      // Super user
      case `su`:
        if (sudo) {
          // End session and change to the root user
          endSession(fullHistory, user, history, workspace, index);

          user = `root`;
          [ workspace, history ] = (fullHistory[user] || [ [ `` ], [ `` ] ]).map(list => list.slice(0, -1));
          index = workspace.length;
        }
        else output.push(<Bad key={key} shell="nextmoo" command={bin} message="Permission denied" />);
        return;

      // End session and change to the initial user
      case `exit`:
        if (user !== initial.user) {
          endSession(fullHistory, user, history, workspace, index);

          user = initial.user;
          [ workspace, history ] = (fullHistory[user] || [ [ `` ], [ `` ] ]).map(list => list.slice(0, -1));
          index = workspace.length;
        }
        return;

      // Unknown
      default: output.push(<Bad key={key} shell="nextmoo" command={bin} message="Command not found" />);
    }
  });


  // Updated environment
  endSession(fullHistory, user, history, workspace, index);

  return {
    user,
    index: fullHistory[user][0].length - 1,
    history: fullHistory,
    output
  };
};


/**
 * Environment reducer function
 *
 * @param state Current Environment
 * @param action Action
 * @returns New environment
 */
const reducer = (state: Environment, action: Action): Environment => {
  switch (action.type) {
    case `HISTORY_BACKWARD`:
    case `HISTORY_FORWARD`: return scrollHistory(state, action);
    case `HANDLE_COMMAND`: return handleCommand(state, action);
    case `EXEC_COMMAND`: return execCommand(state, action);
  }
};

/**
 * Initialize environment
 *
 * @param state Initial environment
 */
const initializer = (env: Environment): Environment => {
  return handleCommand(env, { command: `help`, run: true } as HandleCommandAction);
};


/**
 * Terminal component
 *
 * @param props Terminal component properties
 */
export const Terminal = (): JSX.Element => {
  const first = useRef({ input: true, output: true });
  const terminal = useRef<HTMLDivElement>(null);
  const prompt = useRef<HTMLPreElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);

  const [ cowData ] = useContext(CowContext);
  const [ { user, output, index, history }, dispatch ] = useReducer(reducer, initial, initializer);


  // Terminal output
  const path = `moo`;
  const command = `${` `.repeat(rawPrompt({ user, path }).length)}${history[user][0][index]}`;

  // Cow message and options
  const { message, ...options } = useMemo(() => ({
    ...cowData,
    mode: undefined,
    eyes: cowData.eyes.padEnd(2),
    tongue: cowData.tongue.padEnd(2),
    wrap: cowData.noWrap ? false : cowData.wrap,
    noWrap: undefined
  }), [ cowData ]);


  // Scroll to bottom
  const scrollBottom = useCallback(() => {
    const main = screen.width < 768 ? document.documentElement : terminal.current as HTMLElement;
    main.scrollTop = main.scrollHeight;
  }, []);

  // Change Handler
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const cursor = e.currentTarget.selectionStart;
    let value = e.currentTarget.value;

    if (breakline.test(value[cursor - 1]) && (value.length !== cursor)) {
      value = `${value.slice(0, cursor - 1)}${value.slice(cursor)}\n`;
    }

    const padding = (prompt.current as HTMLPreElement).innerText.length;
    dispatch({ type: `HANDLE_COMMAND`, command: value.slice(padding), cowData });
  }, [ cowData ]);

  // Key down handler
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.key) {
      case `ArrowUp`:
        e.preventDefault();
        dispatch({ type: `HISTORY_BACKWARD` });
        return;

      case `ArrowDown`:
        e.preventDefault();
        dispatch({ type: `HISTORY_FORWARD` });
    }
  }, []);

  // Select handler
  const handleSelect = useCallback((e: SyntheticEvent<HTMLTextAreaElement>) => {
    const padding = (prompt.current as HTMLPreElement).innerText.length;

    // Fix selection start
    if (e.currentTarget.selectionStart < padding) {
      e.currentTarget.selectionStart = padding;
    }

    // Scroll to bottom if is in the end
    if ((e.currentTarget.value.length > padding) && (e.currentTarget.value.length === e.currentTarget.selectionStart)) {
      scrollBottom();
    }
  }, [ scrollBottom ]);


  // Fix input height
  useEffect(() => {
    // First render
    if (first.current.input) {
      first.current.input = false;
      const ps1 = prompt.current as HTMLPreElement;
      const input = textArea.current as HTMLTextAreaElement;
      const main = screen.width < 768 ? document.documentElement : terminal.current as HTMLElement;

      // Fit height
      if (main.clientHeight < main.scrollHeight) {
        const lineHeight = ps1.clientHeight;
        input.style.height = `${lineHeight}px`;
      }

      // Force initial pad
      input.value = ` `.repeat(ps1.innerText.length);
    }

    // Other renders
    else {
      const input = textArea.current as HTMLTextAreaElement;
      const main = screen.width < 768 ? document.documentElement : terminal.current as HTMLElement;

      // Container overflow
      if ((main.clientHeight < main.scrollHeight) || (input.clientHeight < input.scrollHeight)) {
        const ps1 = prompt.current as HTMLPreElement;

        // Shrink
        if (command.length <= ps1.innerText.length) {
          input.style.height = `${ps1.clientHeight}px`;
        }

        // Grow
        else {
          const height = Math.ceil(input.scrollHeight / ps1.clientHeight) * ps1.clientHeight;
          input.style.height = `${height}px`;
        }
      }

      // Release
      else input.style.height = ``;
    }
  });

  // Scroll to bottom when output changes
  useEffect(() => {
    if (first.current.output) first.current.output = false;
    else scrollBottom();
  }, [ scrollBottom, output.length ]);


  // Return terminal component
  return (
    <section ref={terminal} className="flex flex-col flex-grow cursor-text overflow-auto px-px w-full md:w-7/12">
      {/* Cow */}
      <pre className="md:flex-shrink-0 select-all whitespace-pre overflow-x-auto">
        {moo(message, options)}
      </pre>

      {/* Terminal */}
      <div id="terminal" className="flex flex-col flex-grow">
        {/* Output */}
        {output}

        {/* Input */}
        <div className="relative flex flex-grow">
          <Prompt ref={prompt} user={user} path={path} className="absolute top-0 left-0 bg-black break-all whitespace-pre-wrap" />
          <textarea ref={textArea} rows={1} value={command} autoCapitalize="none" spellCheck={false} onChange={handleChange} onKeyDown={handleKeyDown} onSelect={handleSelect} aria-label="input" className="flex-grow bg-black text-white break-all whitespace-pre-wrap overflow-visible focus:outline-none resize-none w-full" />
        </div>
      </div>
    </section>
  );
};
