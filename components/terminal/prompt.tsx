

/**
 * Propmt component properties
 */
interface PromptProps {
  readonly root?: boolean;
  readonly className?: string;
  readonly children?: string;
}


/**
 * Prompt component
 *
 * @param props Prompt component properties
 */
export const Prompt = ({ root = false, className, children = `` }: PromptProps): JSX.Element => {
  return root ? (
    <pre className={className}>
      <strong>
        <span className="text-red-light">[localhost</span>
        <span className="text-cyan-light">&nbsp;moo</span>
        <span className="text-red-light">]#</span>
        &nbsp;
      </strong>
      {children}
    </pre>
  ) : (
    <pre className={className}>
      <strong>
        <span className="text-green-light">[user@localhost</span>
        &nbsp;moo
        <span className="text-green-light">]$</span>
        &nbsp;
      </strong>
      {children}
    </pre>
  );
};