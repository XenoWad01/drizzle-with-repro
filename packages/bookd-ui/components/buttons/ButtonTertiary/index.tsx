import { FC } from "react";
import "./index.css";

type ButtonTertiaryPropTypes = {
  text: string;
  onClick: (_: unknown) => void;
  disabled?: boolean;
};

export const ButtonTertiary: FC<ButtonTertiaryPropTypes> = ({
  text,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`button-tertiary ${disabled ? "disabled" : ""}`}
    >
      <p className="button-text"> {text} </p>
    </button>
  );
};
