import { forwardRef } from "react";

/**
 * Propmt component properties
 */
interface PromptProps {
  readonly id?: string;
  readonly user?: string;
  readonly host?: string;
  readonly path?: string;
  readonly className?: string;
  readonly children?: string;
}


/**
 * Prompt component
 *
 * @param props Prompt component properties
 */
export const Prompt = forwardRef<HTMLPreElement, PromptProps>(({ id, user = `user`, host = `localhost`, path = `~`, className, children = `` }: PromptProps, ref): JSX.Element => {
  // Prompt content
  const content = user === `root` ? (
    <strong>
      <span className="text-red-light">[{host}</span>
      <span className="text-cyan-light">&nbsp;{path}</span>
      <span className="text-red-light">]#</span>
      &nbsp;
    </strong>
  ) : (
    <strong>
      <span className="text-green-light">[{user}@{host}</span>
      &nbsp;{path}
      <span className="text-green-light">]$</span>
      &nbsp;
    </strong>
  );


  // Return prompt component
  return <pre ref={ref} id={id} className={className}>{content}{children}</pre>;
});

Prompt.displayName = `Prompt`;
