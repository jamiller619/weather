import deepMerge from 'deepmerge'
import create, { SetState } from 'zustand'
import { PersistOptions, persist } from 'zustand/middleware'

import State from './State'
import { createUserSlice } from './slices/userSlice'
import { createWeatherSlice } from './slices/weatherSlice'

const createState = (set: SetState<State>): State => ({
  ...createUserSlice(set),
  ...createWeatherSlice(set),
  isFetching: false,
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
