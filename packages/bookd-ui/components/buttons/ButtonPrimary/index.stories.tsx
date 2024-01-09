import type { Meta, StoryObj } from "@storybook/react";
import { ButtonPrimary } from "./index";

const meta: Meta<typeof ButtonPrimary> = {
  component: ButtonPrimary,
};

export default meta;
type Story = StoryObj<typeof ButtonPrimary>;

export const Primary: Story = {
  args: {
    disabled: false,
    text: "Label",
  },
  render: (props) => <ButtonPrimary {...props} />,
};
