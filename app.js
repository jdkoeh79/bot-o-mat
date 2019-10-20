
'use strict'
// learn what IIFE
// docker run --rm -it -v "$PWD:/botomat" node:12.12 bash

console.log("Loading Bot-O-Mat, one moment please...")

const inquirer = require('inquirer');
const _progress = require('cli-progress');
const clc = require("cli-color");

const red = clc.red
const green = clc.green

class User {
  constructor() {
    this.name = ""
    this.bots = []

    this.availableBots = {
      UNIPEDAL: 'Unipedal',
      BIPEDAL: 'Bipedal',
      QUADRUPEDAL: 'Quadrupedal',
      ARACHNID: 'Arachnid',
      RADIAL: 'Radial',
      AERONAUTICAL: 'Aeronautical'
    }

    this.usernamePrompt()
  }

  usernamePrompt () {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'username',
          message: "Welcome to Bot-O-Mat! What's your name?"
        }
      ])
      .then(answers => {
        const username = answers.username
        console.log(`\nWelcome, ${username}! Let's create your first bot!\n`)
        this.name = username
        this.createBot()
      })
  }

  createBot () {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'botType',
          message: 'What type of bot would you like to create?',
          choices: Object.values(user.availableBots)
        }
      ])
      .then(answer => {
        let bot = new Bot(this, answer.botType)
        this.bots.push(bot)
        this.mainPrompt()
      })
  }

  getBotNames () {
    return this.bots.map((bot) => {
      return bot.name
    })
  }

  chooseBotToWork () {
    let ownedBots = this.getBotNames()
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'botType',
          message: 'Which bot will you put to work?',
          choices: [...ownedBots]
        }
      ])
      .then(answer => {
        this.bots.forEach((bot) => {
          if (bot.name === answer.botType) {
            bot.assignTasks()
            bot.work()
          }
        })
      })
  }

  mainPrompt () {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'main',
          message: "What would you like to do next?",
          choices: ["Put a bot to work", "Create a new bot", "List available bots", "Exit"]
        }
      ])
      .then(answer => {
        switch (answer.main) {
          case "Create a new bot":
            this.createBot()
            break
          case "List available bots":
            console.log("")
            this.bots.forEach((bot) => {
              console.log(bot.name)
            })
            console.log("")
            this.mainPrompt()
            break
          case "Put a bot to work":
            this.chooseBotToWork()
            break
          case "Exit":
            process.exit()
            break
        }
      })
  }
}

class Bot {
  constructor(user, name) {
    this.user = user
    this.owner = user.name
    this.name = name
    this.durability = 100
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
    if (!this.assignedTasks) {
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
    user.mainPrompt(this.user)
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

process.stdout.write('\x1Bc')
// the User constructor fires off the first prompt, starting the program
let user = new User()
