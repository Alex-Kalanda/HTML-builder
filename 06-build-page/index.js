const path = require('path')
const fs = require('fs')
const outputStylesDir = path.join(__dirname, 'styles')
const outputAssetsDir = path.join(__dirname, 'assets')
const outputHTMLDir = path.join(__dirname, 'components')
const basicHTML = path.join(__dirname, 'template.html')
const prodDir = path.join(__dirname, 'project-dist')
const prodStylesPath = path.join(prodDir, 'style.css')
const prodAssetsDir = path.join(prodDir, 'assets')
const prodHTML = path.join(prodDir, 'index.html')
mountPage()
//page assembly
async function mountPage() {
  //create prod directory and subfolders
  await fs.promises.rm(prodDir, {
    recursive: true,
    force: true
  })
  await fs.mkdir(prodDir, {
    recursive: true
  }, error => {
    if(error) throw error
  })
  await fs.mkdir(prodAssetsDir, {
    recursive:true
  }, error => {
    if(error) throw error
  })
  generateHTML()
  createBundle('.css')
    .then(()=>console.log('Common styles are ready!'))
  copyAssets()
}
//create common styles file
async function createBundle(ext) {
  const files = await fs.promises.readdir(outputStylesDir)
  const write = fs.createWriteStream(prodStylesPath)
  files.forEach(await function (file) {
    if (path.extname(file) === ext) {
      fs.createReadStream(path.join(outputStylesDir, file)).pipe(write)
    }
  })
}
//copy assets to prod
function copyAssets() {
  fs.readdir(outputAssetsDir, {
    withFileTypes: true
  },  (error, files) => {
    if(error) throw error
    deepCopy(files, outputAssetsDir, prodAssetsDir)
    function deepCopy(dirents, dirPath, inputDir) {
      let input = inputDir
      dirents.forEach( async item => {
        if(item.isFile()) {
          const sourceFile = path.join(dirPath, item.name)
          const copyFile = path.join(input, item.name)
          await fs.createReadStream(sourceFile)
            .pipe(fs.createWriteStream(copyFile))
        }else {
          const newDirPath = path.join(dirPath, item.name)
          await fs.readdir(newDirPath, {
            withFileTypes: true
          }, (error, files) => {
            if(error) throw error
            input = path.join(inputDir, item.name)
            fs.mkdir(input, {
              recursive:true
            }, error => {
              if(error) throw error
            })
            deepCopy(files, newDirPath, input)
          })
        }
      })
    }
    console.log('Files from /assets copied!')
  })
}
//create common HTML file
function generateHTML() {
  const readStream = fs.createReadStream(basicHTML, 'utf-8')
  const writeStream = fs.createWriteStream(prodHTML)
  let buffer = ''
  readStream.on('data', data => {
    buffer = data
    fs.readdir(outputHTMLDir, {
      withFileTypes: true
    }, (error, files) => {
      if (error) throw error
      files.forEach(async (item, index) => {
        const filePath = path.join(outputHTMLDir, item.name)
        if(item.isFile() && (path.extname(filePath)==='.html')) {
          const readStreamItem = await fs.createReadStream(filePath, 'utf-8')
          const target = `{{${item.name.slice(0, -5)}}}`
          readStreamItem.on('data', async data => {
            buffer = await buffer.replace(target, data)
            if(index === files.length-1) {
              writeStream.write(buffer)
              console.log('HTML ready!')
            }
          })
        }
      })
    })
  })
}