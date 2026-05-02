const fs = require('fs')
const path = require('path')

const dir = path.resolve(__dirname, '..', 'assets', 'sounds')

function listSounds(){
  if(!fs.existsSync(dir)){
    console.log('Sounds directory does not exist:', dir)
    return
  }
  const files = []
  function walk(d){
    for(const f of fs.readdirSync(d)){
      const p = path.join(d,f)
      if(fs.statSync(p).isDirectory()) walk(p)
      else files.push(path.relative(dir, p))
    }
  }
  walk(dir)
  console.log('Found sound files:', files)
}

listSounds()
