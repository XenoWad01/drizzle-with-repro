import type { Meta, StoryObj } from "@storybook/react";
import { MainCard } from "./index";
import { ButtonTertiary } from "../../buttons/ButtonTertiary";

const meta: Meta<typeof MainCard> = {
  component: MainCard,
};

export default meta;

type Story = StoryObj<typeof MainCard>;

const testButton = () => {
  return <ButtonTertiary onClick={() => {}} text="go to the next page ➔" />;
};

export const Card: Story = {
  args: {
    title: "Information Card ",
    button: testButton(),
    subhead: "Subhead text ",
  },

  render: (props) => (
    <MainCard {...props}>
      <div>
        Some random content
        <iframe src="https://google.com" />
      </div>
    </MainCard>
  ),
};
