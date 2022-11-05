const path = require('path')
const fs = require('fs')
const dirPath = path.join(__dirname, 'files')
const copyDirPath = `${dirPath}-copy`
copyDir(dirPath, copyDirPath)
async function copyDir(outDir, inDir) {
  let amountCopiedFiles = 0
  await fs.promises.rm(inDir, {
    recursive: true,
    force: true
  })
  await fs.mkdir(inDir, {
    recursive: true
  }, error => {
    if (error) throw error
  })
  fs.readdir(outDir, {
    withFileTypes: true
  }, (error, files) => {
    if (error) throw error
    files.forEach( item => {
      const filePath = path.join(outDir, item.name)
      const copyFilePath = path.join(inDir, item.name)
      const read = fs.createReadStream(filePath)
      const write = fs.createWriteStream(copyFilePath)
      read.pipe(write)
      read.on('error', error => { if (error) throw error })
      read.on('close', () => {
        amountCopiedFiles++
        console.log(`file ---->    ${item.name}     --> copied`)
        if(amountCopiedFiles===files.length) {
          console.log(`Finish! ${amountCopiedFiles} files copied`)
        }
      })
    })
  })
}
