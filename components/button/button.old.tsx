import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { animated } from '@react-spring/web'
import cx from 'classnames'

import { ButtonGroupContextProps, useButtonGroup } from '../button-group/button-group-context'
import { shadow } from '../theme/shadow'
import { ThemeContextValue } from '../theme/theme-context'

const inGroupMixin = css`
  @apply cursor-pointer border-none text-center rounded-sm appearance-none relative h-5 py-0 px-4;

  background-color: ${(props: StyledButtonProps) =>
    props.selected === props.itemKey ? 'var(--button-color)' : 'transparent'};
  box-shadow: ${(props: StyledButtonProps) =>
    props.selected === props.itemKey ? shadow.sm : undefined};

  &::before {
    @apply absolute m-auto right-0 bottom-0 top-0 w-px h-3;
    content: '';
    background-color: #e5e5e5;
  }

  &:last-child {
    &::before {
      @apply hidden;
    }
  }

  &:focus {
    @apply border-none outline-none;
  }

  &::before {
    @apply hidden;
  }
`

const notInGroupMixin = css`
  box-shadow: ${shadow.sm};
`

export type ButtonProps = {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  size?: 'sm' | 'lg'
  className?: string
  buttonTheme?: 'primary' | 'system'
  itemKey?: string
  style?: React.CSSProperties
}

type StyledButtonProps = ButtonProps & {
  isButtonGroup: ButtonGroupContextProps['isButtonGroup']
  selected: ButtonGroupContextProps['selected']
} & Partial<ThemeContextValue>

const focusMixin = css`
  background-color: ${() => 'var(--primary)'};
  color: ${() => 'var(--primary-text-color)'};
`

const unFocusMixin = css`
  color: ${(props: StyledButtonProps) =>
    props.buttonTheme === 'primary'
      ? props.theme?.color.primaryTextColor
      : 'var(--button-text-color)'};
  background-color: ${(props: StyledButtonProps) =>
    props.buttonTheme === 'primary' ? props.theme?.color.primary : 'var(--button-color)'};
`

const lgMixin = css`
  @apply py-1 px-4 h-7;
`

const StyledButton = styled(animated.button)`
  @apply cursor-pointer border-none text-center rounded appearance-none py-1 px-4 h-5;

  ${unFocusMixin};
  ${(props: StyledButtonProps) => (props.size === 'lg' ? lgMixin : undefined)};

  &:focus {
    @apply outline-none border-none;
    ${(props: StyledButtonProps) => (props.isButtonGroup ? unFocusMixin : focusMixin)};
  }
  ${(props: StyledButtonProps) => (props.isButtonGroup ? inGroupMixin : notInGroupMixin)}
`

export const Button = ({ onClick, size = 'lg', buttonTheme = 'system', ...props }: ButtonProps) => {
  const {
    onSelected,
    isButtonGroup,
    selected,
    buttonTheme: buttonGroupButtonTheme,
  } = useButtonGroup()
  const controlledButtonTheme = buttonGroupButtonTheme || buttonTheme

  const handleOnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onSelected?.(props.itemKey)
      onClick?.(e)
    },
    [onClick, onSelected, props.itemKey],
  )
  return (
    <StyledButton
      isButtonGroup={isButtonGroup}
      onClick={handleOnClick}
      size={size}
      data-role="button"
      className={cx('button', props.className)}
      buttonTheme={controlledButtonTheme}
      selected={selected}
      {...props}
    >
      {props.children}
    </StyledButton>
  )
}
