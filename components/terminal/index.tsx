import { useRef, useState, useContext, useMemo, useCallback, useEffect, ChangeEvent, KeyboardEvent, SyntheticEvent, ReactNode } from "react";

import { Prompt } from "./prompt";
import { Help } from "./help";
import { History } from "./history";
import { Ls } from "./ls";
import { Share } from "./share";
import { Bad } from "./bad";

import { line } from "./utils";

import { useHistory } from "../../hooks/history";
import { moo } from "cowsayjs";
import { store } from "../../contexts/store";


/**
 * Terminal component
 *
 * @param props Terminal component properties
 */
export const Terminal = (): JSX.Element => {
  const user = useRef(`user`);
  const [ height, setHeight ] = useState<number>();
  const [ padding, setPadding ] = useState(``);
  const [ command, setCommand ] = useState(``);
  const [ output, setOutput ] = useState<ReactNode[]>([]);
  const history = useHistory({ [user.current]: { stack: [ `help` ], current: 1 } });
  const { state } = useContext(store);


  // Cow message and options
  const { message, ...options } = useMemo(() => ({
    ...state,
    mode: undefined,
    eyes: state.eyes.padEnd(2),
    tongue: state.tongue.padEnd(2),
    noWrap: undefined
  }), [ state ]);

  // Execute command
  const execCommand = useCallback((input: string, key: number) => {
    // Empty command
    if (input.length === 0) {
      return undefined;
    }


    // Parse command
    let sudo = false;
    let space = input.search(/\s/);
    let command = space > 0 ? input.slice(0, space) : input;

    // Parse sudo
    if (command === `sudo`) {
      command = input.slice(space + 1).trimLeft();
      space = command.search(/\s/);
      const shift = command.length;

      command = space > 0 ? command.slice(0, space) : command;
      space += input.length - shift;

      sudo = true;
      user.current = command === `su` ? `root` : `user`;
    }

    // Get arguments
    const args = space > 0 ? input.slice(space + 1).trim() : ``;


    // Execute commands
    switch (command) {
      // Clear terminal
      case `clear`: return null;

      // Echo
      case `echo`: return <pre key={key}>{args.length === 0 ? `\n` : args}</pre>;

      // Exit from super user
      case `exit`:
        user.current = `user`;
        return undefined;

      // Help
      case `help`: return <Help key={key} />;

      // Show or clear history
      case `history`:
        if (/^-c$|^-c\s/.test(args)) {
          history.clear(user.current);
          return undefined;
        }
        else {
          return <History key={key} stack={history.stack(user.current)} />;
        }

      // List current folder files
      case `ls`: return <Ls key={key} />;

      // Share custom cow
      case `share`: return <Share key={key} data={state} />;

      // Sudo without command
      case `sudo`: return undefined;

      // Enable super user
      case `su`: return sudo ? undefined : <Bad key={key} shell="moo!" command={command} locked />;

      // Unknown command
      default: return <Bad key={key} shell="moo!" command={command} />;
    }
  }, [ state, history ]);


  // Chang eHandler
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    // Update command
    if (!/\r\n|[\n\r\f\v\u2028\u2029\u0085]/.test(e.currentTarget.value)) {
      const value = e.currentTarget.value;
      setCommand(command => value.startsWith(padding) ? value : command);
    }

    // Process command
    else {
      e.currentTarget.value
        .slice(padding.length, e.currentTarget.value.length - 1)
        .split(/\r\n|[\n\r\f\v\u2028\u2029\u0085]/g)
        .forEach(command => {
          setOutput(output => {
            // Store and execute command
            history.push(user.current, command);

            const key = output.length;
            const prompt = <Prompt key={key} user={user.current} path="moo" className={line}>{command}</Prompt>;
            const out = execCommand(command.trim(), key + 1);

            // Store output
            return out === null ? [] : output.concat([ prompt, out ]);
          });
        });

      setCommand(``);
      setHeight(undefined);
    }
  }, [ user, padding, history, execCommand ]);

  // Key down handler
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.key) {
      case `ArrowUp`:
        e.preventDefault();
        setCommand(`${padding}${history.prev(user.current)}`);
        return;

      case `ArrowDown`:
        e.preventDefault();
        setCommand(`${padding}${history.next(user.current)}`);
        return;

      case `Enter`:
        e.currentTarget.selectionStart = e.currentTarget.value.length;
        e.currentTarget.selectionEnd = e.currentTarget.selectionStart;
        return;
    }
  }, [ padding, history ]);

  // Select handler
  const handleSelect = useCallback((e: SyntheticEvent<HTMLTextAreaElement>) => {
    if (e.currentTarget.selectionStart < padding.length) {
      e.currentTarget.selectionStart = padding.length;
    }
  }, [ padding ]);


  // Update command padding
  useEffect(() => {
    const padding = ` `.repeat(document.getElementById(`prompt`)?.innerText.length || 0);

    setPadding(padding);
    setCommand(padding);
  }, [ output ]);

  // Adjust the command height
  useEffect(() => {
    const command = document.getElementById(`command`);
    const clientHeight = command?.clientHeight || 0;
    const scrollHeight = command?.scrollHeight || 0;

    setHeight(height => (height !== undefined) || (clientHeight < scrollHeight) ? scrollHeight : height);
  }, [ command ]);

  // Execute help by default
  useEffect(() => {
    setOutput([
      <Prompt key={0} path="moo" className={line}>help</Prompt>,
      <Help key={1} />
    ]);
  }, []);


  // Return terminal component
  return (
    <div className="flex flex-col flex-grow cursor-text px-px w-full md:w-7/12">
      {/* Cow */}
      <pre className="md:flex-shrink-0 select-all whitespace-pre overflow-x-auto overflow-y-visible">
        {moo(message, options)}
      </pre>

      {/* Terminal */}
      <div id="terminal" className="flex flex-col flex-grow overflow-y-auto md:min-h-55">
        {/* Output */}
        {output}

        {/* Input */}
        <div className="relative flex flex-grow">
          <Prompt id="prompt" user={user.current} path="moo" className="absolute top-0 left-0 bg-black break-all whitespace-pre-wrap" />
          <textarea id="command" value={command} rows={1} autoCapitalize="none" spellCheck={false} onChange={handleChange} onKeyDown={handleKeyDown} onSelect={handleSelect} className="flex-grow bg-black text-white break-all whitespace-pre-wrap focus:outline-none resize-none w-full" style={{ height }} />
        </div>
      </div>
    </div>
  );
};
