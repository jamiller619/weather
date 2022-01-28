import useSize from '@react-hook/size'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

const backgroundColor = '#70707033'

export default function useSkeleton(
  width?: number | string,
  height?: number | string
): [RefObject<HTMLElement>, () => void] {
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const [w, h] = useSize(ref)

  useEffect(() => {
    if (ref.current && isLoaded === false) {
      const dw = width
      const dh = width != null ? (height == null ? width : height) : height
      const styles = {
        width: typeof dw === 'string' ? dw : `${dw ?? w}px`,
        height: typeof dh === 'string' ? dh : `${dh ?? h}px`,
        backgroundColor,
      }

      Object.assign(ref.current.style, styles)
    }
  }, [h, height, isLoaded, w, width])

  const reset = useCallback((callback?: () => void) => {
    if (ref.current) {
      setIsLoaded(true)

      Object.assign(ref.current.style, {
        width: '',
        height: '',
        backgroundColor: '',
      })
    }

    if (callback instanceof Function) {
      callback()
    }
  }, [])

  return [ref, reset]
}
