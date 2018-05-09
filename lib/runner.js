/**
 * Created by wyang on 2018/5/8.
 */

const vm = require('vm')
const fs = require('fs')
const path = require('path')

const fileData = fs.readFileSync(path.join(__dirname,'../file/client.js'), {encoding: 'utf8'})

module.exports = class Runner {

  run(file, times) {
    try {
      let script = fs.readFileSync(file, {encoding: 'utf8'})
      let filename = path.basename(file)

      script = script.replace(/require\(['|"]pomelo-presure-client['|"]\)/, '__clientClass')
      script = fileData + script

      let fileDataLength = fileData.split('\n').length - 1

      for (let i = 0; i < times; i++) {
        let initSandbox = {
          actor: {id: i, emit: function(){}},
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
        vm.runInContext(script, context, {lineOffset: -fileDataLength, filename, displayErrors: true})
      }
    } catch (err) {
      console.log(err.message + err.stack)
    }

  }
}