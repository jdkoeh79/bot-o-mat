'use strict'

import _progress from 'cli-progress';
import clc from 'cli-color';

const red = clc.red
const green = clc.green
const yellow = clc.yellowBright

class Bot {
  constructor(user, name) {
    this.user = user
    this.owner = user.name
    this.name = name
    this.assignedTasks = []
    this.performance = 0
  }

  fetchAssignment () {
    this.assignedTasks = this.user.selectTasks(this)
  }

  // vary ETA by +/- 10%
  timeToComplete (eta) {
    const accelerated = (Math.floor(Math.random() * 2))
    const multiplier = (accelerated) ? 1 : -1
    return eta - (Math.floor(Math.random() * eta / 10) + 1) * multiplier
  }

  doTask (task) {
    return new Promise(function(resolve, reject) {
      setTimeout((function() {
        resolve(`Task completed in ${task.timeToComplete} milliseconds`)
      }), task.timeToComplete)
    })
  }

  allDone () {
    let ahead = (Math.sign(this.performance))
    let aheadOrBehind = (ahead === 1) ? 'ahead of schedule!' : 'behind schedule.'
    if (ahead) {
      this.performance * -1
    }
    console.log(`\nYour ${this.name} bot completed all tasks ${Math.abs(this.performance)}ms ${aheadOrBehind}\n`)
    this.user.mainPrompt(this.user)
  }

  work () {
    let task = this.assignedTasks.shift()
    console.log(`\n${this.name} bot starting task: ${yellow(task.description)}. ETA: ${task.eta}ms`)
    this.progress(task)
    this.doTask(task)
      .then((res) => {
        const performance = task.timeToComplete - task.eta
        res += (performance > 0) ? ' (' + red('+') : ' ('
        res += (performance > 0) ? `${red(performance + 'ms')}).` : `${green(performance + 'ms')}).`
        console.log(res)
        this.assignedTasks.length ? this.work() : this.allDone()
      })
      .catch((err) => console.log(err))
  }

  progress(task){
    // create new progress bar
    let bar = new _progress.Bar({
        format: 'Progress |' + '{bar}' + '| {percentage}%',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    })

    bar.start(100, 0, {
        speed: "N/A"
    })

    let value = 0;

    let timer = setInterval(function(){
        // increment value
        value++

        // update the bar value
        bar.update(value, {
            speed: 'ludicrous'
        })

        // set limit
        if (value >= bar.getTotal()){
            // stop timer
            clearInterval(timer)

            bar.stop()
        }
    }, Math.floor(task.timeToComplete / 100) - 5)
  }
}

export default Bot;
