import React from 'react'
import './App.css'
import { ThemeProvider } from 'mayumi/theme'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'
import { Menu } from 'mayumi/menu'
import { Dot } from 'mayumi/dot'
import { Text } from 'mayumi/text'
import { Layout, Toolbar } from 'mayumi/layout'
import { Input } from 'mayumi/input'
import { Button } from 'mayumi/button'
import { Separator } from 'mayumi/separator'
import { Description } from 'mayumi/description'
import { Link } from 'mayumi/link'
import { Box } from 'mayumi/box'
import MenuBar from './components/menu-bar'
import { MenuBarDemo } from './components/menu-bar/mayumi'

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
          <Toolbar>
            <MenuBarDemo />
          </Toolbar>
          <img src="https://images.unsplash.com/photo-1515266591878-f93e32bc5937?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGJsdWV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" />
        </Layout.Main>
      </Layout>
    </AspectRatio.Root>
  </div>
)

function App() {
  return (
    <div className="bg-black w-screen h-screen">
      <MenuBar />
      <MenuBarDemo />
      <span className="mt-20 text-white">dsdsdsdsdsds</span>
    </div>
  )
  // return (
  //   <div className="w-screen h-[300vh] flex justify-center items-center gap-3 relative">
  //     <div className="bg-black w-full h-full absolute top-0 left-0 -z-1" />
  //     <div className="w-full h-full grid grid-cols-2 grid-rows-5 absolute top-0 left-0">
  //       <div className="row-start-1 row-end-2 flex justify-center items-center p-8">
  //         <FrameDemo />
  //       </div>
  //       <div className="row-start-1 row-end-2 p-8">
  //         {/* <DropdownDemo /> */}
  //         {/* <SelectDemo /> */}
  //         {/* <Button>button</Button> */}
  //         {/* <Input size="md" css={{ width: '200px' }} /> */}
  //         <Box
  //           bordered={false}
  //           className="w-full h-full flex flex-col gap-2 justify-center items-center shadow-xl bg-mayumi-gray-200 rounded-3xl"
  //         >
  //           <Input size="md" css={{ width: '200px' }} light={true} />
  //           <Input size="md" css={{ width: '200px' }} />
  //         </Box>
  //       </div>
  //       <div className="row-start-2 row-end-3 p-8">
  //         <Box
  //           bordered={false}
  //           className="w-full h-full flex flex-col gap-2 justify-center items-center shadow-xl bg-black rounded-3xl"
  //         >
  //           <Button size="md">Click me!</Button>
  //           <Button color="gray" size="md">
  //             Click me!
  //           </Button>
  //           <Button size="sm">Click me!</Button>
  //         </Box>
  //       </div>
  //       <div className="row-start-2 row-end-3 p-8">
  //         <Box
  //           bordered={false}
  //           className="w-full h-full flex flex-col gap-2 justify-center items-center shadow-xl bg-mayumi-gray-200 rounded-3xl"
  //         >
  //           <Link>Click me!</Link>
  //           <Link animation="reverse">Click me!</Link>
  //         </Box>
  //       </div>
  //       <div className="row-start-3 row-end-4 col-start-1 col-end-3 p-8">
  //         <Box
  //           bordered={false}
  //           className="w-full h-full flex flex-col gap-2 justify-center items-center shadow-xl bg-mayumi-gray-200 rounded-3xl"
  //         >
  //           <Text h1={true} type="secondary">
  //             Do not go gentle into that good night.
  //           </Text>
  //           <Text h2={true} type="tertiary">
  //             Do not go gentle into that good night.
  //           </Text>
  //           <Text h3={true} type="quaternary">
  //             Do not go gentle into that good night.
  //           </Text>
  //           <Text h4={true}>Do not go gentle into that good night.</Text>
  //           <Text h5={true}>Do not go gentle into that good night.</Text>
  //           <Text h6={true}>Do not go gentle into that good night.</Text>
  //           <Text p={true}>Do not go gentle into that good night.</Text>
  //           <Text span={true}>Do not go gentle into that good night.</Text>
  //         </Box>
  //       </div>
  //       <div className="row-start-4 row-end-5 p-8">
  //         <Box
  //           bordered={false}
  //           className="w-full h-full flex flex-col gap-2 justify-center items-center shadow-xl bg-mayumi-gray-200 rounded-3xl"
  //         >
  //           <Separator />
  //           <Separator type="vertical" />
  //         </Box>
  //       </div>
  //       <div className="row-start-4 row-end-5 p-8">
  //         <Box
  //           bordered={false}
  //           className="w-full h-full flex flex-col gap-2 justify-center items-center shadow-xl bg-mayumi-gray-200 rounded-3xl"
  //         >
  //           <Dot type="info" />
  //           <Dot type="success" />
  //           <Dot type="warning" />
  //           <Dot type="danger" />
  //           <Dot type="info" size="md" />
  //           <Dot type="success" size="md" />
  //           <Dot type="warning" size="md" />
  //           <Dot type="danger" size="md" />
  //         </Box>
  //       </div>
  //       <div className="row-start-5 row-end-6 p-8">
  //         <Box
  //           bordered={false}
  //           className="w-full h-full flex flex-col gap-2 justify-center items-center shadow-xl bg-mayumi-gray-200 rounded-3xl"
  //         >
  //           <Description title="description title">description content</Description>
  //         </Box>
  //       </div>
  //       <div className="row-start-5 row-end-6 p-8">
  //         <MenuBar />
  //         {/* <Box
  //           bordered={false}
  //           className="w-full h-full flex flex-col gap-2 justify-center items-center shadow-xl bg-mayumi-gray-200 rounded-3xl"
  //         >
  //         </Box> */}
  //       </div>
  //       {/* <div className="row-start-5 row-end-6 p-8">
  //         <div className="card shadow-md">
  //           <div className="card child-1 h-[400px]"></div>
  //           <div className="card child-2 h-[400px]"></div>
  //         </div>
  //       </div> */}
  //     </div>
  //   </div>
  // )
}

export default App
