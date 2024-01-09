import { FC } from "react";
import "./index.css";

type ButtonSecondaryPropTypes = {
  text: string;
  onClick: (_: unknown) => void;
  disabled?: boolean;
};

export const ButtonSecondary: FC<ButtonSecondaryPropTypes> = ({
  text,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`button-secondary ${disabled ? "disabled" : ""}`}
    >
      <p className="button-text">{text}</p>
    </button>
  );
};
