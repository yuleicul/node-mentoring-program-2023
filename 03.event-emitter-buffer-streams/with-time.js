import EventEmitter from './event-emitter.js'

export default class WithTime extends EventEmitter {
  async execute(asyncFunc, ...args) {
    this.emit('begin')
    const respond = await asyncFunc.apply(this, args)
    console.log(respond)
    this.emit('end')
  }
}
