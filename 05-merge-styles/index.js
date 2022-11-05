const path = require('path')
const fs = require('fs')
const dirStyles = path.join(__dirname, 'styles')
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css')
createBundle('.css').then(()=>console.log('bundle.css  ready!'))
async function createBundle(ext) {
  const files = await fs.promises.readdir(dirStyles)
  const write = fs.createWriteStream(bundlePath)
  files.forEach(await function (file) {
    if (path.extname(file) === ext) {
      fs.createReadStream(path.join(dirStyles, file)).pipe(write)
    }
  })
}