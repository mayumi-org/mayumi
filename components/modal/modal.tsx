import React, { useCallback, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { animated, Transition, config } from '@react-spring/web'
import cx from 'clsx'
import { useHotkeys } from 'react-hotkeys-hook'

import { useOnClickOutside } from '@/hooks/use-click-outside'
import { CloseIcon } from '@/icons/close'
import { Container } from './styles'
import { ModalContext, useModal } from './modal-context'

export type ModalProps = React.PropsWithChildren<{
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  visible?: boolean
  /**
   * Trigger on open modal
   */
  onOpen?(): void
  /**
   * Trigger on click close icon
   */
  onClose?(): void
  /**
   * Trigger on click mask
   */
  onClickMask?(): void
  /**
   * Custom or disable default close icon
   * - disable default close icon pass `false`
   */
  closeIcon?: React.Component
  title?: React.ReactNode
  /**
   * Display modal mask
   */
  maskable?: boolean
  bodyStyle?: React.CSSProperties
}>

const ModalWrapper = React.forwardRef<
  HTMLDivElement,
  Pick<ModalProps, 'visible' | 'children' | 'maskable'>
>((props, ref) => {
  const { handleClickOutside } = useModal()
  if (typeof window === 'undefined') {
    return null
  }
  return (
    <Transition
      items={props.visible}
      from={{ scale: 0.8, opacity: 0, maskOpacity: 0 }}
      enter={{ scale: 1, opacity: 1, maskOpacity: 0.2 }}
      leave={{ scale: 0.8, opacity: 0, maskOpacity: 0 }}
      config={config.stiff}
      delay={200}
    >
      {(styles, item) => (
        <>
          {item && (
            <animated.div className="mayumi-modal" style={styles} ref={ref}>
              {props.children}
            </animated.div>
          )}
          {item && props.maskable && (
            <animated.div
              style={{ opacity: styles.maskOpacity }}
              className="mayumi-modal-mask"
              onClick={handleClickOutside}
            />
          )}
        </>
      )}
    </Transition>
  )
})

ModalWrapper.displayName = 'modal-wrapper'

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ onClose, onClickMask, onOpen, maskable = true, closeIcon, ...props }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    const controlled = typeof props.visible === 'boolean'
    const controlledVisible = useMemo(() => {
      return controlled ? props.visible : visible
    }, [visible, controlled, props.visible])
    const handleClickOutside = useCallback(() => {
      setVisible(false)
      onClickMask?.()
    }, [onClickMask])
    const handleClose = useCallback(() => {
      setVisible(false)
      onClose?.()
    }, [onClose])
    useHotkeys('command+k', () => {
      setVisible((prev) => {
        if (!prev) {
          onOpen?.()
        } else {
          onClose?.()
        }
        return !prev
      })
    })
    useHotkeys('esc', () => {
      setVisible(false)
      onClose?.()
    })
    useOnClickOutside(modalRef, handleClickOutside)
    const hasTitle = props.title !== undefined
    if (typeof window === 'undefined') {
      return null
    }
    return createPortal(
      <ModalContext.Provider value={{ visible: controlledVisible, handleClickOutside }}>
        <Container ref={ref} className={cx('mayumi-modal-container', props.className)}>
          <ModalWrapper ref={modalRef} visible={controlledVisible} maskable={maskable}>
            {hasTitle ? (
              <div className="mayumi-modal-title" style={props.style}>
                {closeIcon ?? <CloseIcon className="mayumi-close-icon" onClick={handleClose} />}
              </div>
            ) : null}
            <div className="mayumi-modal-body" style={props.bodyStyle}>
              {props.children}
            </div>
          </ModalWrapper>
        </Container>
      </ModalContext.Provider>,
      document.body,
    )
  },
)

Modal.displayName = 'Modal'
