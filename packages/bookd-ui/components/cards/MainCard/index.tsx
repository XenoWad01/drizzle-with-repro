import { FC } from "react";
import "./index.css";
import { ButtonCTA } from "../../buttons/ButtonCTA/index";
import { XIcon } from "../../assets/icons/XIcon";

type CardPropTypes = {
  title: string;
  children: JSX.Element;
  onClose?: () => void;
  button?: JSX.Element;
  subhead?: string;
};

export const MainCard: FC<CardPropTypes> = ({
  title,
  onClose,
  children,
  button,
  subhead,
}) => {
  return (
    <div className="card">
      <div className="cardHeader">
        <div className="title-container">
          <div className="title">{title}</div>
        </div>
        {subhead ? <div className="subhead">{subhead}</div> : null}
        {onClose ? (
          <div className="close-button">
            <ButtonCTA icon={<XIcon />} onClick={onClose} />
          </div>
        ) : null}
      </div>

      <div className="cardBody">{children}</div>

      {button ? <footer className="cardFooter">{button}</footer> : null}
    </div>
  );
};

export default MainCard;
