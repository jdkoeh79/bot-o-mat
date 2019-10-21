'use strict'

const inquirer = require('inquirer')
const Bot = require('./Bot')

class User {
  constructor() {
    this.name = ""
    this.ownedBots = []

    this.allBotTypes = {
      UNIPEDAL: 'Unipedal',
      BIPEDAL: 'Bipedal',
      QUADRUPEDAL: 'Quadrupedal',
      ARACHNID: 'Arachnid',
      RADIAL: 'Radial',
      AERONAUTICAL: 'Aeronautical'
    }

    this.availableBots = [...Object.values(this.allBotTypes)]

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
    if (!this.availableBots.length) {
      console.log("You already own one of each bot type.")
      this.mainPrompt()
    } else {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'botType',
            message: 'What type of bot would you like to create?',
            choices: Object.values(this.availableBots)
          }
        ])
        .then(answer => {
          let bot = new Bot(this, answer.botType)
          this.ownedBots.push(bot.name)
          this.availableBots = this.availableBots.filter((bot) => {
            return !this.ownedBots.includes(bot)
          })
          this.mainPrompt()
        })
    }
  }

  getBotNames () {
    return this.bots.map((bot) => {
      return bot.name
    })
  }

  selectTasks (bot) {
    if (!bot.assignedTasks.length) {
      let possibleTasks = [...this.taskLibrary]
      let tasks = []
      while (tasks.length < 5) {
        tasks.push(possibleTasks.splice(Math.floor(Math.random() * possibleTasks.length), 1)[0])
        tasks[tasks.length - 1].timeToComplete = bot.timeToComplete(tasks[tasks.length - 1].eta)
      }
      bot.assignedTasks = tasks
    }
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
        this.ownedBots.forEach((bot) => {
          if (bot.name === answer.botType) {
            if (!bot.assignedTasks.length) {
              this.selectTasks(bot)
            }
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
          choices: [
            "Put a bot to work",
            "Create a new bot",
            "Decommission a bot",
            "List owned bots",
            new inquirer.Separator(),
            "Exit"
          ]
        }
      ])
      .then(answer => {
        switch (answer.main) {
          case "Create a new bot":
            this.createBot()
            break
          case "List owned bots":
            console.log("")
            this.ownedBots.forEach((bot) => {
              console.log(bot)
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

module.exports = User