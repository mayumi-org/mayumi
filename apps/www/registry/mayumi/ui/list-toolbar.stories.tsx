import type { Meta, StoryObj } from "@storybook/react-vite"
import { Ellipsis, Minus, Plus } from "lucide-react"
import { GroupedList, GroupedListItem } from "./grouped-list"
import {
  ListToolbar,
  ListToolbarButton,
  ListToolbarSeparator,
  ListToolbarSpacer,
} from "./list-toolbar"

const meta: Meta<typeof ListToolbar> = {
  title: "ui/ListToolbar",
  component: ListToolbar,
}
export default meta

export const SourceListFooter: StoryObj<typeof ListToolbar> = {
  render: () => (
    <div className="w-96 p-6">
      <GroupedList>
        <GroupedListItem label="截屏" value="已允许" />
        <GroupedListItem label="Kap" value="已允许" />
        <ListToolbar aria-label="列表操作">
          <ListToolbarButton aria-label="添加">
            <Plus aria-hidden="true" />
          </ListToolbarButton>
          <ListToolbarButton aria-label="移除">
            <Minus aria-hidden="true" />
          </ListToolbarButton>
          <ListToolbarSeparator />
          <ListToolbarSpacer />
          <ListToolbarButton aria-label="更多">
            <Ellipsis aria-hidden="true" />
          </ListToolbarButton>
        </ListToolbar>
      </GroupedList>
    </div>
  ),
}
