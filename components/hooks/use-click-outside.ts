// refs: https://usehooks.com/useOnClickOutside/
import { useEffect } from 'react'

export type UseOnClickOutsideProps = {
  disable?: boolean
  includes?: any[]
}

export function useOnClickOutside(
  ref: any,
  handler: (e: MouseEvent) => any,
  { includes = [], ...props }: UseOnClickOutsideProps = {},
) {
  useEffect(
    () => {
      const listener = (event: MouseEvent) => {
        if (props?.disable) {
          return
        }

        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return
        }

        if (includes.some((v) => event.target === v.current)) {
          return
        }

        handler(event)
      }

      document.addEventListener('mousedown', listener, true)

      return () => {
        document.removeEventListener('mousedown', listener)
      }
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler, props?.disable, includes],
  )
}
