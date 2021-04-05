import { forwardRef } from "react";


/**
 * Prompt data
 */
interface PromptData {
  readonly user?: string;
  readonly host?: string;
  readonly path?: string;
}

/**
 * Propmt component properties
 */
interface PromptProps extends PromptData {
  readonly id?: string;
  readonly className?: string;
  readonly children?: string;
}


/**
 * Initial prompt data
 */
const initial: Required<PromptData> = {
  user: `user`,
  host: `localhost`,
  path: `~`
};


/**
 * Get the prompt component text only
 */
export const rawPrompt = ({ user = initial.user, host = initial.host, path = initial.path }: PromptData): string => (
  user === `root` ?
    `[${host} ${path}]# ` :
    `[${user}@${host} ${path}]$ `
);

/**
 * Prompt component
 *
 * @param props Prompt component properties
 */
export const Prompt = forwardRef<HTMLPreElement, PromptProps>(({ id, user = initial.user, host = initial.host, path = initial.path, className, children = `` }: PromptProps, ref): JSX.Element => {
  // Prompt content
  const content = user === `root` ? (
    <strong>
      <span className="text-red-light">{`[${host}`}</span>
      <span className="text-cyan-light">&nbsp;{path}</span>
      <span className="text-red-light">]#</span>
      &nbsp;
    </strong>
  ) : (
    <strong>
      <span className="text-green-light">{`[${user}@${host}`}</span>
      &nbsp;{path}
      <span className="text-green-light">]$</span>
      &nbsp;
    </strong>
  );


  // Return prompt component
  return <pre ref={ref} id={id} className={className}>{content}{children}</pre>;
});

Prompt.displayName = `Prompt`;
