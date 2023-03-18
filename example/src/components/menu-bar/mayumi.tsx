import React from 'react'
import { Menubar } from 'mayumi/menu-bar'

export const MenuBarDemo = () => {
  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content align="start" sideOffset={5} alignOffset={-3}>
            <Menubar.Item>
              New Tab <Menubar.ItemRightSlot>⌘ T</Menubar.ItemRightSlot>
            </Menubar.Item>
            {/* <Menubar.Separator className="h-[1px] bg-gray6 m-[5px]" /> */}
            <Menubar.Sub>
              <Menubar.SubTrigger>Share</Menubar.SubTrigger>
              <Menubar.Portal>
                <Menubar.SubContent>
                  <Menubar.Item>Email Link</Menubar.Item>
                </Menubar.SubContent>
              </Menubar.Portal>
            </Menubar.Sub>
            {/* <Menubar.Separator className="h-[1px] bg-gray6 m-[5px]" /> */}
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  )
}
