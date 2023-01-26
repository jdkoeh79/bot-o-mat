'use strict'

import inquirer from 'inquirer';
import Bot from './Bot';

class User {
  constructor() {
    this.name = ""
    this.ownedBots = {}

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
        eta: 10000,
      },{
        description: 'take out the recycling',
        eta: 4000,
      },{
        description: 'make a sammich',
        eta: 7000,
      },{
        description: 'mow the lawn',
        eta: 20000,
      },{
        description: 'rake the leaves',
        eta: 18000,
      },{
        description: 'give the dog a bath',
        eta: 14500,
      },{
        description: 'bake some cookies',
        eta: 8000,
      },{
        description: 'wash the car',
        eta: 20000,
      },
    ]

    this.start()
  }

  start () {
    // this robot came from https://www.asciiart.eu/electronics/robots - Author unknown.
    console.log("                 __")
    console.log("         _(\\    |@@|")
    console.log("        (__/\\__ \\--/ __")
    console.log("           \\___|----|  |   __")
    console.log("               \\ }{ /\\ )_ / _\\")
    console.log("               /\\__/\\ \\__O (__")
    console.log("              (--/\\--)    \\__/")
    console.log("              _)(  )(_")
    console.log("             \`---''---\`")

    console.log("      ╔╗ ╔═╗╔╦╗  ╔═╗   ╔╦╗╔═╗╔╦╗")
    console.log("      ╠╩╗║ ║ ║───║ ║───║║║╠═╣ ║ ")
    console.log("      ╚═╝╚═╝ ╩   ╚═╝   ╩ ╩╩ ╩ ╩ ")
    console.log("-- A JavaScript Bot Task Simulator --\n")

    this.usernamePrompt("Hi, what's your name?")
  }

  usernamePrompt (message) {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'username',
          message
        }
      ])
      .then(answer => {
        const username = answer.username
        if (!username.length) {
          console.log(`\nSorry, I didn't catch that...\n`)
          this.usernamePrompt("What's your name?")
        } else {
          console.log(`\nWelcome, ${username}! Let's create your first bot!\n`)
          this.name = username
          this.createBot()
        }
      })
  }

  availableBotsList () {
    let availableBots = [...Object.values(this.allBotTypes)]
    let promptOptions = availableBots.filter((type) => {
      return this.ownedBots[type] === undefined
    })
    return promptOptions
  }

  createBot () {
    let promptOptions = this.availableBotsList()
    if (!promptOptions.length) {
      console.log("\nYou already own one of each bot type.\n")
      this.mainPrompt()
    } else {
      if (Object.keys(this.ownedBots).length) {
        promptOptions.push('I have enough bots for now')
      }
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'botType',
            message: 'What type of bot would you like to create?',
            choices: [...promptOptions]
          }
        ])
        .then(answer => {
          if (answer.botType === 'I have enough bots for now') {
            this.mainPrompt()
          } else {
            let bot = new Bot(this, answer.botType)
            this.ownedBots[answer.botType] = bot
            console.log(`\nYou now own a shiny new ${bot.name} bot!\n`)
            this.mainPrompt()
          }
        })
    }
  }

  ownedBotNames () {
    return [...Object.keys(this.ownedBots)]
  }

  selectTasks (bot) {
    let possibleTasks = [...this.taskLibrary]
    let tasks = []
    let totalETA = 0
    let totalTimeToComplete = 0
    while (tasks.length < 5) {
      tasks.push(
        possibleTasks.splice(
          Math.floor(Math.random() * possibleTasks.length),
          1
        )[0]
      )
      let eta = tasks[tasks.length - 1].eta
      let timeToComplete = bot.timeToComplete(eta)
      tasks[tasks.length - 1].timeToComplete = timeToComplete
      totalETA += eta
      totalTimeToComplete += timeToComplete
    }
    bot.assignedTasks = tasks
    let overallPerformance = totalETA - totalTimeToComplete
    bot.performance = overallPerformance
  }

  chooseBotToWork () {
    let promptOptions = this.ownedBotNames()
    if (!promptOptions.length) {
      console.log("\nOops, you don't own any bots. Go create one!\n")
      this.mainPrompt()
    } else {
      promptOptions.push('I want to do something else')
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'botType',
            message: 'Which bot will you put to work?',
            choices: promptOptions
          }
        ])
        .then(answer => {
          if (answer.botType === 'I want to do something else') {
            this.mainPrompt()
          } else {
            let botNames = this.ownedBotNames()
            botNames.forEach((name) => {
              if (name === answer.botType) {
                let bot = this.ownedBots[name]
                if (!bot.assignedTasks.length) {
                  this.selectTasks(bot)
                }
                bot.work()
              }
            })
          }
        })
    }
  }

  decommission () {
    let promptOptions = this.ownedBotNames()
    if (!promptOptions.length) {
      console.log("\nOops, you don't own any bots. Go create one!\n")
      this.mainPrompt()
    } else {
      promptOptions.push('I want to do something else')
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'botType',
            message: 'Which bot would you like to decommission?',
            choices: promptOptions
          }
        ])
        .then(answer => {
          if (answer.botType === 'I want to do something else') {
            this.mainPrompt()
          } else {
            let botNames = this.ownedBotNames()
            botNames.forEach((name) => {
              if (name === answer.botType) {
                delete this.ownedBots[name]
                console.log(`\nYour ${name} bot has been converted to scrap metal.\n`)
                this.mainPrompt()
              }
            })
          }
        })
    }
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
          case "Decommission a bot":
            this.decommission()
            break
          case "List owned bots":
            let ownedBotNames = this.ownedBotNames()
            console.log("")
            if (!ownedBotNames.length) {
              console.log("You currently don't own any bots. Go create one!")
            } else {
              ownedBotNames.forEach((name) => {
                console.log(name)
              })
            }
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

export default User;
