"use client"

import { Button } from "@/registry/mayumi/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/mayumi/ui/card"

export function CardDemo() {
  return (
    <div className="grid w-full max-w-xl gap-3 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>flat</CardTitle>
          <CardDescription>中性 tint 填充，用于并列的次级卡片。</CardDescription>
        </CardHeader>
        <CardContent className="text-ui text-fg-secondary">
          叠在毛玻璃或实色面上都不会浑浊。
        </CardContent>
      </Card>
      <Card variant="raised">
        <CardHeader>
          <CardTitle>raised</CardTitle>
          <CardDescription>实色面加投影，抬离窗口一层。</CardDescription>
        </CardHeader>
        <CardContent className="text-ui text-fg-secondary">
          用作内容岛，承载主要信息。
        </CardContent>
        <CardFooter>
          <Button variant="secondary" size="sm">
            了解更多
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
