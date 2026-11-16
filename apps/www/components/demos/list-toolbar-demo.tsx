"use client"

import { Ellipsis, Minus, Plus } from "lucide-react"

import { GroupedList, GroupedListItem } from "@/registry/mayumi/ui/grouped-list"
import {
  ListToolbar,
  ListToolbarButton,
  ListToolbarSeparator,
  ListToolbarSpacer,
} from "@/registry/mayumi/ui/list-toolbar"

export function ListToolbarDemo() {
  return (
    <GroupedList className="w-full max-w-sm">
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
  )
}
