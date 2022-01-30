import { UserState } from './slices/userSlice'
import { WeatherState } from './slices/weatherSlice'

export type Store = {
  state: State
  version: number
}

export default interface State {
  user: UserState
  weather: WeatherState
  isFetching: boolean
}
