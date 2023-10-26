export default class EventEmitter {
  listenerStore = {}

  addListener(eventName, fn) {
    const newListener = { once: false, listener: fn }
    if (this.listenerStore[eventName]) {
      this.listenerStore[eventName].push(newListener)
    } else {
      this.listenerStore[eventName] = [newListener]
    }
  }

  on(eventName, fn) {
    this.addListener(eventName, fn)
  }

  removeListener(eventName, fn) {
    this.listenerStore[eventName] = this.listenerStore[eventName]?.filter(
      ({ listener }) => listener !== fn
    )
  }

  off(eventName, fn) {
    this.removeListener(eventName, fn)
  }

  once(eventName, fn) {
    const newListener = { once: true, listener: fn }
    if (this.listenerStore[eventName]) {
      this.listenerStore[eventName].push(newListener)
    } else {
      this.listenerStore[eventName] = [newListener]
    }
  }

  emit(eventName, ...args) {
    this.listenerStore[eventName] = this.listenerStore[eventName]?.filter(
      ({ once, listener }) => {
        listener(...args)
        return !once
      }
    )
  }

  listenerCount(eventName) {
    return this.listenerStore[eventName]?.filter((item) => item).length || 0
  }

  /** @see: https://nodejs.org/api/events.html#emitterrawlistenerseventname */
  rawListeners(eventName) {
    const wrappedListeners = this.listenerStore[eventName]?.map(
      ({ once, listener }, index) => {
        const wrappedListener = (...args) => {
          listener(...args)
          if (once) {
            this.listeners.splice(index, 1)
            wrappedListeners.splice(index, 1)
          }
        }
        wrappedListener.listener = listener
        return wrappedListener
      }
    )
    return wrappedListeners
  }
}
