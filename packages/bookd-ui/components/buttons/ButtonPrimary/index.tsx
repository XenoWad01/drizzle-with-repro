import { FC } from "react";
import "./index.css";

type ButtonPrimaryPropTypes = {
  text: string;
  onClick: (_: unknown) => void;
  disabled?: boolean;
};

export const ButtonPrimary: FC<ButtonPrimaryPropTypes> = ({
  text,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`button-primary ${disabled ? "disabled" : ""}`}
    >
      <p className="button-text">{text}</p>
    </button>
  );
};
