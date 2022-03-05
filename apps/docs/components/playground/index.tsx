import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import React, { useState, useRef, useEffect } from 'react'
import { styled } from 'mayumi/theme'
import * as components from 'mayumi'
import CodeTheme from 'prism-react-renderer/themes/nightOwl'
import { Language } from 'prism-react-renderer'

type CodeBlockProps = {
  className: string
  manual: boolean
  render: any
  code: string
}

const scope = {
  React,
  useState,
  useRef,
  useEffect,
  ...components,
}

const StyledPlayground = styled('div', {
  $$gridLineColor: '$colors$textBackgroundColor', // or d7f1fc
  $$gridBgColor: '$colors$gridColor', // or windowFrameTextColor
  border: '4px solid $selectedControlColor',
  rounded: '$xl',
  my: '$6',
  overflow: 'hidden',
  '& .playground-preview': {
    minHeight: '200px',
    p: '$6',
    backgroundColor: '$gridBgColor',
    borderBottom: '2px solid $selectedControlColor',
    flexBox: 'center',
    backgroundImage:
      'linear-gradient($$gridLineColor 3.4px, transparent 3.4px), linear-gradient(90deg, $$gridLineColor 3.4px, transparent 3.4px), linear-gradient($$gridLineColor 1.7px, transparent 1.7px), linear-gradient(90deg, $$gridLineColor 1.7px, $$gridBgColor 1.7px);',
    backgroundSize: '85px 85px, 85px 85px, 17px 17px, 17px 17px',
    backgroundPosition: '-3.4 -3.4, -3.4 -3.4, -1.7px -1.7px, -1.7px -1.7px',
  },
})

const LiveCodeEditor = styled(LiveEditor, {
  roundedB: '$md',
  textAlign: 'left',
  overflow: 'auto',
  fonts: '$mono',
})

export const Playground = ({ code, className, manual, ...props }: CodeBlockProps) => {
  const [editorCode, setEditorCode] = useState(code?.trim())
  const language = className?.replace(/language-/, '')
  const onChange = (newCode: string) => setEditorCode(newCode.trim())
  const liveProviderProps = {
    theme: CodeTheme,
    language: language as Language,
    code: editorCode,
    scope,
    noInline: manual,
    ...props,
  }
  return (
    <LiveProvider {...liveProviderProps}>
      <StyledPlayground>
        <div className="playground-preview">
          <LivePreview />
        </div>
        <LiveCodeEditor onChange={onChange} />
        <LiveError />
      </StyledPlayground>
    </LiveProvider>
  )
}
