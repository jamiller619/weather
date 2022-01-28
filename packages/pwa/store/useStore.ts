import deepMerge from 'deepmerge'
import create, { SetState } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import { createUserSlice } from './slices/userSlice'
import { createWeatherSlice } from './slices/weatherSlice'
import State from './State'

const createState = (set: SetState<State>): State => ({
  ...createUserSlice(set),
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
