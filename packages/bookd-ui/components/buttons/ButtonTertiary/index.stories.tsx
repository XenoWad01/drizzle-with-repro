import type { Meta, StoryObj } from "@storybook/react";
import { ButtonTertiary } from "./index";

const meta: Meta<typeof ButtonTertiary> = {
  component: ButtonTertiary,
};

export default meta;
type Story = StoryObj<typeof ButtonTertiary>;

export const Tertiary: Story = {
  args: {
    disabled: false,
    text: "Label",
  },
  render: (props) => <ButtonTertiary {...props} />,
};
