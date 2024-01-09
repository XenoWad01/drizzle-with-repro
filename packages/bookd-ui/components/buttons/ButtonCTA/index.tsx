import { FC } from "react";
import "./index.css";

type ButtonWithIconPropTypes = {
  text?: string;
  onClick: (_: unknown) => void;
  disabled?: boolean;
  icon?: JSX.Element;
};

export const ButtonCTA: FC<ButtonWithIconPropTypes> = ({
  text,
  onClick,
  disabled,
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      className={`button-CTA ${disabled ? "disabled" : ""} ${
        text ? "padded" : ""
      }`}
    >
      <span className="button-cta-icon">{icon}</span>
      {text ? <p className="button-text">{text}</p> : null}
    </button>
  );
};
