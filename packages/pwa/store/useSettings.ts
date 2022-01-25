import { toDegrees } from '@weather/base/utils/convert'
// import shallow from 'zustand/shallow'
import State from './State'
import useStore from './useStore'

const selector = (state: State) => state.user.settings ?? {}

export default function useSettings() {
  return useStore(selector)
}

export const useUserTempFormat = () => {
  const { units } = useSettings()

  return (temp?: number): string => {
    if (temp == null) {
      return ''
    }

    return toDegrees(temp, units) ?? ''
  }
}
