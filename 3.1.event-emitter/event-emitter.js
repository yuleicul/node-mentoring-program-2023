class EventEmitter {
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

///////////////////////// Tests //////////////////////////
// from https://d17btkcdsmqrmh.cloudfront.net/node-gmp/docs/event-emitter-vs-buffers-vs-streams/Homework#task-1

const myEmitter = new EventEmitter()

function c1() {
  console.log('an event occurred!')
}

function c2() {
  console.log('yet another event occurred!')
}

myEmitter.on('eventOne', c1) // Register for eventOne
myEmitter.on('eventOne', c2) // Register for eventOne

// Register eventOnce for one time execution
myEmitter.once('eventOnce', () => console.log('eventOnce once fired'))
myEmitter.once('init', () => console.log('init once fired'))

// Register for 'status' event with parameters
myEmitter.on('status', (code, msg) => console.log(`Got ${code} and ${msg}`))

myEmitter.emit('eventOne')

// Emit 'eventOnce' -> After this the eventOnce will be
// removed/unregistered automatically
myEmitter.emit('eventOnce')

myEmitter.emit('eventOne')
myEmitter.emit('init')
myEmitter.emit('init') // Will not be fired
myEmitter.emit('eventOne')
myEmitter.emit('status', 200, 'ok')

// Get listener's count
console.log(myEmitter.listenerCount('eventOne'))

// Get array of rawListeners//
// Event registered with 'once()' will not be available here after the
// emit has been called
console.log(myEmitter.rawListeners('eventOne'))

// Get listener's count after remove one or all listeners of 'eventOne'
myEmitter.off('eventOne', c1)
console.log(myEmitter.listenerCount('eventOne'))
myEmitter.off('eventOne', c2)
console.log(myEmitter.listenerCount('eventOne'))
