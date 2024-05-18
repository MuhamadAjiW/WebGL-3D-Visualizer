interface ButtonProps {
  id: string;
  text: string;
  disable?: boolean;
  handleClick: () => void;
  className?: string;
  textClassName?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  id,
  text,
  disable = false,
  className,
  handleClick,
  textClassName,
  type = 'button'
}) => {
  return (
    <button
      id={id}
      type = {type}
      disabled={disable}
      className={className}
      onClick={handleClick}
    >
      <div className={textClassName}>{text}</div>
    </button>
  );
};

export default Button;
