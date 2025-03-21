import mitt, { type Emitter } from 'mitt'

type Events = {
  'pushed-tag-to-search': { tag: string }
}


export default defineNuxtPlugin(() => {
  const emitter = mitt<Events>()
  return {
    provide: {
      event: {
        // Methods for interacting with the event bus
        emit: <K extends keyof Events>(event: K, data: Events[K]) => emitter.emit(event, data),
        on: <K extends keyof Events>(event: K, callback: (data: Events[K]) => void) => {
          emitter.on(event, callback)
        },
        off: <K extends keyof Events>(event: K, callback: (data: Events[K]) => void) => {
          emitter.off(event, callback)
        },
        // Clear all events of a specific type
        clear: <K extends keyof Events>(event: K) => emitter.all.delete(event),
        // Clear all events of all types
        clearAll: () => emitter.all.clear(),
      },
    },
  }
})
