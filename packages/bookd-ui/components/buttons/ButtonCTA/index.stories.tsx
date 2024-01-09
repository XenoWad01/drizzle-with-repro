import type { Meta, StoryObj } from "@storybook/react";
import { ButtonCTA } from "./index";
import { CtaIcon } from "../../assets/icons/CtaIcon";

const meta: Meta<typeof ButtonCTA> = {
  component: ButtonCTA,
};

export default meta;
type Story = StoryObj<typeof ButtonCTA>;

const disabledButton = <CtaIcon fill={"#BDBDBD"} />;
const enabledButton = <CtaIcon fill={"#2E77D0"} />;

export const CTA: Story = {
  args: {
    disabled: false,
    text: "LABEL",
  },
  render: (props) => (
    <ButtonCTA
      {...props}
      icon={props?.disabled ? disabledButton : enabledButton}
    />
  ),
};
