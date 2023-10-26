import EventEmitter from './event-emitter.js'

export default class WithTime extends EventEmitter {
  async execute(asyncFunc, ...args) {
    this.emit('begin')
    console.time('execute()')
    const respond = await asyncFunc.apply(this, args)
    console.timeEnd('execute()')
    this.emit('end')
    console.log('respond', respond)
    return respond
  }
}
