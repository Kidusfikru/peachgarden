import { createApp, isRef, toRaw } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'
import './app.css'

const app = createApp(App)
const pinia = createPinia()

/** Deep copy status value: first use toRaw to remove the responsive proxy, and support array, Set, Map, Date and ordinary objects */
const cloneState = (value: unknown): unknown => {
  const raw: unknown = toRaw(value)
  if (isRef(raw)) return cloneState(raw.value)
  if (raw === null || typeof raw !== 'object') return raw
  if (Array.isArray(raw)) return raw.map(item => cloneState(item))
  if (raw instanceof Set) return new Set(Array.from(raw, item => cloneState(item)))
  if (raw instanceof Map) return new Map(Array.from(raw, ([key, item]) => [cloneState(key), cloneState(item)]))
  if (raw instanceof Date) return new Date(raw.getTime())
  return Object.fromEntries(Object.entries(raw).map(([key, item]) => [key, cloneState(item)]))
}

// Add $reset() for setup store (Pinia only supports $reset for option store by default).
// The state tree of the setup store stores ref: the snapshot needs to read the unpacked value through the reactive agent.
// When resetting, write back one by one through the proxy, and then it will fall on the .value of the original ref.
pinia.use(({ store }) => {
  const state = store.$state as Record<string, unknown>
  const initialState = Object.fromEntries(Object.keys(state).map(key => [key, cloneState(state[key])]))
  store.$reset = () => {
    store.$patch($state => {
      const target = $state as Record<string, unknown>
      for (const [key, value] of Object.entries(initialState)) target[key] = cloneState(value)
    })
  }
})

app.use(pinia)
app.use(router)
app.mount('#app')