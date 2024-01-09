import type { Meta, StoryObj } from "@storybook/react";
import { ButtonWithIcon } from "./index";
const meta: Meta<typeof ButtonWithIcon> = {
  component: ButtonWithIcon,
};

export default meta;
type Story = StoryObj<typeof ButtonWithIcon>;

export const WithIcon: Story = {
  args: {
    disabled: false,
    text: "LABEL",
  },
  render: (props) => <ButtonWithIcon {...props} />,
};
