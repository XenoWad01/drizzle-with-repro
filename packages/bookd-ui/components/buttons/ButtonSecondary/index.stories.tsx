import type { Meta, StoryObj } from "@storybook/react";
import { ButtonSecondary } from "./index";

const meta: Meta<typeof ButtonSecondary> = {
  component: ButtonSecondary,
};

export default meta;
type Story = StoryObj<typeof ButtonSecondary>;

export const Secondary: Story = {
  args: {
    disabled: false,
    text: "LABEL",
  },
  render: (props) => <ButtonSecondary {...props} />,
};
