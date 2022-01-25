import UserState from './slices/UserState'
import WeatherState from './slices/WeatherState'

export type Store = {
  state: State
  version: number
}

export default interface State {
  user: UserState
  weather: WeatherState
}
