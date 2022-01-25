import deepMerge from 'deepmerge'
import create, { GetState, SetState } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import { createUserSlice } from './slices/UserState'
import { createWeatherSlice } from './slices/WeatherState'
import State from './State'

const createState = (set: SetState<State>, get: GetState<State>): State => ({
  ...createUserSlice(set, get),
  ...createWeatherSlice(set),
})

const persistOptions: PersistOptions<State> = {
  name: 'weather',
  partialize: (state: State) => ({
    user: state.user,
  }),
  merge: (oldState: State, newState: State) => deepMerge(newState, oldState),
}

const useStore = create(persist(createState, persistOptions))

export default useStore
