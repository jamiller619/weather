import { useCallback, useEffect, useRef } from 'react'

export default function useIsMounted(startingValue = false): () => boolean {
  const isMounted = useRef(startingValue)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  return useCallback(() => isMounted.current, [])
}
