const path = require('path')
const fs = require('fs')
const readLine = require('readline')
const process = require('process')
const filePath = path.join(__dirname, 'text.txt')
const stream = fs.createWriteStream(filePath,{
  encoding: 'utf-8'
})
const consoleAPI = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Now you can add text to file "text.txt"\n'
})
consoleAPI.prompt()
consoleAPI.on('line', input => {
  if (input.replace(/\s/g, '')==='exit') {
    consoleAPI.close()
    process.exit()
  }
  stream.write(`${input}\n`)
})
consoleAPI.on('close', () => console.log('\nThe text was saved. Work completed.'))