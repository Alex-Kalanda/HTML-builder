const path = require('path')
const fs = require('fs')
const directoryPath = path.join(__dirname, 'secret-folder')
fs.readdir(directoryPath, {
  withFileTypes: true
}, ((error, files) => {
  if(error) throw error
    
  files.forEach( item => {
    if(item.isFile()) {
      const fileName = path.join(directoryPath, item.name)
      
      fs.stat(fileName, (error, stat) => {
        if(error) throw error
        
        console.log(
          `${getName(item.name)} - ${getExtension(item.name)} - ${stat.size/1000}Kb`
        )  
      })  
          
    }
  })  
}))
function getExtension(filename) {
  const arr = filename.split('.')
  return arr[arr.length-1]
}
function getName(filename) {
  const arr = filename.split('.')
  arr.pop()
  return arr.join('.')
}