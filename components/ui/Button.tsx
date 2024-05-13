interface ButtonProps {
  id: string;
  text: string;
  disable?: boolean;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  textClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  id,
  text,
  disable = false,
  className,
  handleClick,
  textClassName,
}) => {
  return (
    <button
      id={id}
      disabled={disable}
      className={className}
      onClick={handleClick}
    >
      <div className={textClassName}>{text}</div>
    </button>
  );
};

export default Button;
