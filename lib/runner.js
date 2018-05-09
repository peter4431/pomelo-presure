/**
 * Created by wyang on 2018/5/8.
 */

const vm = require('vm')
const fs = require('fs')

module.exports = class Runner {

  run(file, times) {
    try {
      let script = fs.readFileSync(file)

      for (let i = 0; i < times; i++) {
        let initSandbox = {
          actor: {offset: i},
          console: console,
          require: require,
          setTimeout: setTimeout,
          clearTimeout: clearTimeout,
          setInterval: setInterval,
          clearInterval: clearInterval,
          global: global,
          process: process
        }

        let context = vm.createContext(initSandbox)
        vm.runInContext(script, context)
      }
    } catch (err) {
      console.log(err.message + err.stack)
    }

  }
}