'use strict'

console.log("Loading...");

import User from './Classes/User';

// clear the terminal
process.stdout.write('\x1Bc');

// the User constructor fires off the first prompt, starting the program
new User();
