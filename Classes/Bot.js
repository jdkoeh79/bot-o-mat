'use strict'

const _progress = require('cli-progress');
const clc = require('cli-color');

const red = clc.red
const green = clc.green

class Bot {
  constructor(user, name) {
    this.user = user
    this.owner = user.name
    this.name = name
    this.assignedTasks = []
    this.taskLibrary = [
      {
        description: 'do the dishes',
        eta: 1000,
      },{
        description: 'sweep the house',
        eta: 3000,
      },{
        description: 'do the laundry',
        eta: 1000,
      },{
        description: 'take out the recycling',
        eta: 4000,
      },{
        description: 'make a sammich',
        eta: 7000,
      },{
        description: 'mow the lawn',
        eta: 2000,
      },{
        description: 'rake the leaves',
        eta: 1800,
      },{
        description: 'give the dog a bath',
        eta: 1450,
      },{
        description: 'bake some cookies',
        eta: 8000,
      },{
        description: 'wash the car',
        eta: 2000,
      },
    ]

    this.assignTasks()
  }


  assignTasks () {
    if (!this.assignedTasks.length) {
      let possibleTasks = [...this.taskLibrary]
      let tasks = []
      while (tasks.length < 5) {
        tasks.push(possibleTasks.splice(Math.floor(Math.random() * possibleTasks.length), 1)[0])
        tasks[tasks.length - 1].timeToComplete = this.timeToComplete(tasks[tasks.length - 1].eta)
      }
      this.assignedTasks = tasks
      // console.log(tasks)
    }
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
    console.log("All tasks complete!\n")
    this.user.mainPrompt(this.user)
  }

  work () {
    let task = this.assignedTasks.shift()
    console.log(`\nStarting task: ${task.description}. ETA: ${task.eta}ms`)
    // console.log(`ETA: ${task.eta}ms`)
    this.progress(task)
    this.doTask(task).then((res) => {
      const performance = task.timeToComplete - task.eta
      res += (performance > 0) ? ' (' + red('+') : ' ('
      res += (performance > 0) ? `${red(performance + 'ms')}).` : `${green(performance + 'ms')}).`
      console.log(res)
      this.assignedTasks.length ? this.work() : this.allDone()
    })
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
            speed: 'blah'
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

module.exports = Bot