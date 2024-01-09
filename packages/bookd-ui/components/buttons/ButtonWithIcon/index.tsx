import { FC, ReactNode } from "react";
import "./index.css";
import { DefaultIcon } from "../../assets/icons/DefaultIcon";
import { DefaultIconDisabled } from "../../assets/icons/DefaultIconDisabled";

type ButtonWithIconPropTypes = {
  text: string;
  onClick: (_: unknown) => void;
  disabled?: boolean;
  icon?: ReactNode;
};

export const ButtonWithIcon: FC<ButtonWithIconPropTypes> = ({
  text,
  onClick,
  disabled = false,
}) => {
  const iconComponent = disabled ? <DefaultIconDisabled /> : <DefaultIcon />;

  return (
    <button
      onClick={onClick}
      className={`button-with-icon ${disabled ? "disabled" : ""}`}
    >
      <span>{iconComponent}</span>
      <p className="button-text">{text}</p>
    </button>
  );
};
