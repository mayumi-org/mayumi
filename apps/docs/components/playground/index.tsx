import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import React, { useState, useRef, useEffect } from 'react'
import { styled } from 'mayumi/theme'
import { Box } from 'mayumi/box'
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

const LiveCodePreviewWrapper = styled('div', {
  minHeight: '100px',
  padding: '$6',
  linearGradient: 'to right, #243949 0%, #517fa4 100%',
  borderRadius: '$md',
  flexBox: 'center',
})

const LiveCodePreviewContainer = styled(Box, {
  padding: '$6',
})

const LiveCodeEditor = styled(LiveEditor, {
  borderRadius: '$md',
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
      <LiveCodePreviewWrapper>
        <LiveCodePreviewContainer>
          <LivePreview />
        </LiveCodePreviewContainer>
      </LiveCodePreviewWrapper>
      <LiveCodeEditor onChange={onChange} />
      <LiveError />
    </LiveProvider>
  )
}
