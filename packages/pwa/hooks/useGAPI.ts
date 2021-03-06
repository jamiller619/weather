import { useEffect, useState } from 'react'
import { GOOGLE_API_KEY } from '~/config'

const scriptId = 'google-api-loader'

const doesScriptExist = () => {
  if (window.google != null || document.getElementById(scriptId) != null) {
    return true
  }

  return false
}

export default function useGAPI() {
  const [isLoaded, setIsLoaded] = useState(doesScriptExist())

  useEffect(() => {
    const tag = document.createElement('script')

    if (isLoaded === false && doesScriptExist() === false) {
      const handleLoaded = () => {
        setIsLoaded(true)
      }

      tag.id = scriptId
      tag.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`
      tag.async = true

      tag.addEventListener('load', handleLoaded, {
        once: true,
      })

      document.body.appendChild(tag)
    }

    return () => void tag.remove()
  }, [isLoaded])

  return isLoaded
}
