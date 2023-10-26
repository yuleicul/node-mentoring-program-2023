/**
 * This file contains examples from
 * https://d17btkcdsmqrmh.cloudfront.net/node-gmp/docs/event-emitter-vs-buffers-vs-streams/Homework#task-2
 * You can run `npm run m3t2` to run this file.
 * Prerequisite: Node >= 18
 */
import WithTime from './with-time.js'

const withTime = new WithTime()

withTime.on('begin', () => console.log('About to execute'))
withTime.on('end', () => console.log('Done with execute'))

console.log(withTime.rawListeners('end'))

const fetchData = (id) =>
  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then((res) =>
    res.json()
  )
withTime.execute(fetchData, 1)
