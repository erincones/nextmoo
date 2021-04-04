import { useRef, useReducer, useContext, useMemo, useCallback, ChangeEvent, KeyboardEvent, SyntheticEvent, ReactNode } from "react";

import { moo } from "cowsayjs";
import { CowContext, CowData } from "../../contexts/cow";

import { Prompt } from "./prompt";
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
  readonly [key: string]: [ ReadonlyArray<string>, ReadonlyArray<string> ];
}

/**
 * Terminal environment
 */
interface Environment {
  readonly user: string;
  readonly index: number;
  readonly history: CommandHistory;
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
const initialEnv: Environment = {
  user: `user`,
  index: 0,
  history: { user: [ [ `` ], [ `` ] ] },
  output: []
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
  return run || /\r\n|[\n\r\f\v\u2028\u2029\u0085]/.test(command) ?
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
  const [ workspace, history ] = env.history[env.user].map(list => [ ...list ]);
  const input = workspace[env.index].split(/\r\n|[\n\r\f\v\u2028\u2029\u0085]/g);
  const output = [ ...env.output ];
  let user = env.user;


  // Interprete input
  input.forEach(command => {
    // Parse command
    let match = command.trimLeft().match(/^\s*(\S+)(?:\s+(.+))?\s*$/);
    let key = output.length -1;
    output.push(<Prompt key={key++} user={user} path="moo" className={line}>{command}</Prompt>);

    if (match === null) {
      return;
    }

    // Update history
    history[history.length - 1] = command;
    workspace[workspace.length - 1] = command;
    history.push(``);
    workspace.push(``);


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
      case `exit`:  user = initialEnv.user; return;
      case `clear`: output.splice(0, output.length); return;
      case `echo`:  output.push(<pre key={key}>{/\S/.test(args) ? args.trim() : `\n`}</pre>); return;
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
        if (sudo) user = `root`;
        else output.push(<Bad key={key} shell="nextmoo" command={bin} message="Permission denied" />);
        return;

      // Unknown
      default: output.push(<Bad key={key} shell="nextmoo" command={bin} message="Command not found" />);
    }
  });


  // Update workspace
  if (env.index < (workspace.length - 1)) {
    workspace.splice(env.index, 1, history[env.index]);
  }

  // Updated environment
  return {
    user,
    index: workspace.length - 1,
    history: {
      ...env.history,
      [env.user]: [ workspace, history ]
    },
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
  const terminal = useRef<HTMLDivElement>(null);
  const prompt = useRef<HTMLPreElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);

  const [ { user, output, index, history }, dispatch ] = useReducer(reducer, initialEnv, initializer);
  const [ cowData ] = useContext(CowContext);


  // Terminal output
  const command = `${` `.repeat(prompt.current?.innerText.length || 0)}${history[user][0][index]}`;

  // Cow message and options
  const { message, ...options } = useMemo(() => ({
    ...cowData,
    mode: undefined,
    eyes: cowData.eyes.padEnd(2),
    tongue: cowData.tongue.padEnd(2),
    wrap: cowData.noWrap ? false : cowData.wrap,
    noWrap: undefined
  }), [ cowData ]);

  // Change Handler
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const padding = (prompt.current as HTMLPreElement).innerText.length;
    dispatch({ type: `HANDLE_COMMAND`, command: e.currentTarget.value.slice(padding), cowData });
  }, [ cowData ]);

  // Key down handler
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    const container = terminal.current as HTMLDivElement;

    switch (e.key) {
      case `ArrowUp`:
        e.preventDefault();
        dispatch({ type: `HISTORY_BACKWARD` });
        return;

      case `ArrowDown`:
        e.preventDefault();
        dispatch({ type: `HISTORY_FORWARD` });
        return;

      case `Enter`:
        e.preventDefault();
        container.scrollTop = container.scrollHeight;
        dispatch({ type: `EXEC_COMMAND`, cowData });
    }
  }, [ cowData ]);

  // Select handler
  const handleSelect = useCallback((e: SyntheticEvent<HTMLTextAreaElement>) => {
    const padding = (prompt.current as HTMLPreElement).innerText.length;

    if (e.currentTarget.selectionStart < padding) {
      e.currentTarget.selectionStart = padding;
    }
  }, []);


  // Return terminal component
  return (
    <div ref={terminal} className="flex flex-col flex-grow cursor-text overflow-auto px-px w-full md:w-7/12">
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
          <Prompt ref={prompt} user={user} path="moo" className="absolute top-0 left-0 bg-black break-all whitespace-pre-wrap" />
          <textarea ref={textArea} value={command} rows={1} autoCapitalize="none" spellCheck={false} onChange={handleChange} onKeyDown={handleKeyDown} onSelect={handleSelect} className="flex-grow bg-black text-white break-all whitespace-pre-wrap overflow-visible focus:outline-none resize-none w-full" />
        </div>
      </div>
    </div>
  );
};
