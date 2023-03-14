import React from 'react'
import './App.css'
import { ThemeProvider } from 'mayumi/theme'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'
import { Menu } from 'mayumi/menu'
import { Dot } from 'mayumi/dot'
import { Text } from 'mayumi/text'
import { Layout } from 'mayumi/layout'
import { Dropdown } from 'mayumi/dropdown'
import { Input } from 'mayumi/input'
import { Button } from 'mayumi/button'
import { Box } from 'mayumi/box'
import * as Select from '@radix-ui/react-select'
import classnames from 'clsx'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

const FrameDemo = () => (
  <div className="Container rounded-xl overflow-hidden shadow-xl bg-slate-900">
    <AspectRatio.Root ratio={16 / 9}>
      <div className="w-ful h-9 flex items-center border-dark border-b bg-[#363636]">
        <div className="flex gap-2 px-4">
          {/* TODO: size: 10px */}
          <Dot type="danger" size="md" />
          <Dot type="warning" size="md" />
          <Dot type="success" size="md" />
        </div>
      </div>
      {/* non-transparent box will make menu hover style wired */}
      <Layout>
        <Layout.Aside open={true} width={200} className="box-border">
          <div className="w-full box-border p-4 pb-2">
            <Input size="sm" />
          </div>
          <Menu size="md" ghost={true} css={{ minWidth: '150px', pt: '$0' }}>
            <Menu.SubMenu title="Actions">
              <Menu.Item itemKey="button">
                <i
                  className="gg-search"
                  style={{ '--ggs': 0.5, color: 'white', fontWeight: 'bold' }}
                />
                <Text size="sm" css={{ ml: '$2' }}>
                  Button
                </Text>
              </Menu.Item>
              <Menu.Item itemKey="input">Input</Menu.Item>
              <Menu.Item itemKey="tooltip">Tooltip</Menu.Item>
              <Menu.Item itemKey="dropdown">Dropdown</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu title="Display">
              <Menu.Item itemKey="avatar">Avatar</Menu.Item>
              <Menu.Item itemKey="box">Box</Menu.Item>
              <Menu.Item itemKey="description">Description</Menu.Item>
              <Menu.Item itemKey="separator">Separator</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Layout.Aside>
        <Layout.Main css={{ p: '$0' }}>
          <img src="https://images.unsplash.com/photo-1515266591878-f93e32bc5937?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGJsdWV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" />
        </Layout.Main>
      </Layout>
    </AspectRatio.Root>
  </div>
)

const DropdownDemo = () => {
  const DropdownCollapsedMenu1 = (
    <Dropdown.Menu>
      <Dropdown.SubMenu title="iCloud3">
        <Dropdown.Item itemKey="iCloud3.1">3.1</Dropdown.Item>
        <Dropdown.Item itemKey="iCloud3.2">3.2</Dropdown.Item>
      </Dropdown.SubMenu>
    </Dropdown.Menu>
  )
  const DropdownCollapsedMenu = (
    <Dropdown.Menu>
      <Dropdown.SubMenu title="iCloud2">
        <Dropdown.Item collapsedMenu={DropdownCollapsedMenu1} itemKey="iCloud2/1">
          2.1
        </Dropdown.Item>
        <Dropdown.Item itemKey="iCloud2.2">2.2</Dropdown.Item>
      </Dropdown.SubMenu>
    </Dropdown.Menu>
  )
  const DropdownMenu = (
    <Dropdown.Menu>
      <Dropdown.SubMenu title="iCloud">
        <Dropdown.Item>1.2</Dropdown.Item>
        <Dropdown.Item collapsedMenu={DropdownCollapsedMenu} itemKey="test1.1">
          1.1
        </Dropdown.Item>
      </Dropdown.SubMenu>
    </Dropdown.Menu>
  )
  return (
    <Dropdown glassmorphism={true} content={DropdownMenu} placement="bottom">
      dropdown
    </Dropdown>
  )
}

const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item className={classnames('SelectItem', className)} {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="SelectItemIndicator">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  )
})

SelectItem.displayName = 'SelectItem'

const SelectDemo = () => (
  <Select.Root>
    <Select.Trigger className="SelectTrigger" aria-label="Food">
      <Select.Value placeholder="Select a fruit…" />
      <Select.Icon className="SelectIcon">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="SelectContent">
        <Select.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="SelectViewport">
          <Select.Group>
            <Select.Label className="SelectLabel">Fruits</Select.Label>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </Select.Group>

          <Select.Separator className="SelectSeparator" />

          <Select.Group>
            <Select.Label className="SelectLabel">Vegetables</Select.Label>
            <SelectItem value="aubergine">Aubergine</SelectItem>
            <SelectItem value="broccoli">Broccoli</SelectItem>
            <SelectItem value="carrot" disabled>
              Carrot
            </SelectItem>
            <SelectItem value="courgette">Courgette</SelectItem>
            <SelectItem value="leek">Leek</SelectItem>
          </Select.Group>

          <Select.Separator className="SelectSeparator" />

          <Select.Group>
            <Select.Label className="SelectLabel">Meat</Select.Label>
            <SelectItem value="beef">Beef</SelectItem>
            <SelectItem value="chicken">Chicken</SelectItem>
            <SelectItem value="lamb">Lamb</SelectItem>
            <SelectItem value="pork">Pork</SelectItem>
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className="SelectScrollButton">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
)

function App() {
  return (
    // <ThemeProvider>
    <div className="w-screen h-[200vh] flex justify-center items-center gap-3 bg-slate-900 relative">
      <div className="bg-black w-full h-full absolute top-0 left-0 -z-1" />
      <div className="w-full h-full grid grid-cols-2 grid-rows-4 absolute top-0 left-0 z-10">
        <div className="row-start-1 row-end-2 flex justify-center items-center p-8">
          <FrameDemo />
        </div>
        <div className="row-start-1 row-end-2 p-8">
          {/* <DropdownDemo /> */}
          {/* <SelectDemo /> */}
          {/* <Button>button</Button> */}
          {/* <Input size="md" css={{ width: '200px' }} /> */}
          <Box
            bordered={false}
            className="w-full h-full flex flex-col gap-2 justify-center items-center shadow-xl bg-[#1e1e1e] rounded-3xl"
          >
            <Input size="md" css={{ width: '200px' }} light={true} />
            <Input size="md" css={{ width: '200px' }} />
          </Box>
        </div>
        <div className="row-start-2 row-end-3 flex flex-col gap-2 justify-center items-center">
          <Button>Click me!</Button>
        </div>
      </div>
    </div>
    // </ThemeProvider>
  )
}

export default App
