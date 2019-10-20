'use strict'

const inquirer = require('inquirer')
const _cliProgress = require('cli-progress')
const Bot = require('./Bot')

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
          choices: Object.values(this.availableBots)
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

module.exports = User