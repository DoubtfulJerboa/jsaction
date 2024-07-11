const core = require('@actions/core');
const github = require('@actions/github');

const StreamZip = require('node-stream-zip');
const fs = require("fs");
const axios = require('axios');

const exec = require('child_process').exec;


async function unzippo(zipSource, zipDest) {
  const zip = new StreamZip.async({ file: zipSource });
  fs.mkdirSync(zipDest);
  const count = await zip.extract(null, zipDest);
  console.log(`Extracted ${zipSource}`);
  await zip.close();
}

async function main() {
try {
    // const {PYTHON_VERSION} = process.env
    const PYTHON_VERSION = "3.11.4"
    const match = PYTHON_VERSION.match("^[0-9]\.[0-9]{1,2}\.[0-9]{1,2}$")
    if (!match){
        console.error("Invalid python version")
        process.exit(1)
    }
    // const fs = require("fs")
    let res = await axios.get(`https://www.python.org/ftp/python/${PYTHON_VERSION}/python-${PYTHON_VERSION}-embed-amd64.zip`).then(function (response) {
      return response.data});
    
    fs.writeFileSync("./python-embed.zip", Buffer.from(res), (err)=>{ 
        if (err) throw err;}); console.log('python-embed.zip saved'); 

    await unzippo("./python-embed.zip", "./")    

/*
fs.createReadStream("./python-embed.zip")
.pipe( unzip.Parse())
.on("entry", function (entry) {
  entry.pipe(fs.createWriteStream("./python-embed"))
});
let target = path.join(__dirname, "/python-embed")
await extract("./python-embed.zip", {dir: target})

*/

    const pth = PYTHON_VERSION.split(".").slice(0,2).join("")

    fs.appendFile(`./python-embed/python${pth}._pth`, '\nLib\nLib/site-packages\nScripts\n../\n../../', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    res = await axios.get("https://bootstrap.pypa.io/get-pip.py").then(function (response) {return response.data});

    fs.writeFileSync("get-pip.py", Buffer.from(res), (err)=>{ if (err) throw err;});
    console.log('get-pip.py saved');
    

    exec(".\\python-embed\\python.exe .\\get-pip.py")


  } catch (error) {
    core.setFailed(error.message);
   
  }
      }

main()
