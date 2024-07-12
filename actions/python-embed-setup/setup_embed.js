const core = require('@actions/core');
const github = require('@actions/github');

const StreamZip = require('node-stream-zip');
const fs = require("fs");
const axios = require('axios');

const execSync = require('child_process').execSync;


async function unzippo(zipSource, zipDest) {
  const zip = new StreamZip.async({ file: zipSource });
  fs.mkdirSync(zipDest);
  await zip.extract(null, zipDest);
  console.log(`Extracted ${zipSource}`);
  await zip.close();
}

async function main() {
try {
    const PYTHON_VERSION = core.getInput("PYTHON_VERSION")
    const REQUIREMENTS_PATH = core.getInput("REQUIREMENTS_PATH")
    const match = PYTHON_VERSION.match("^[0-9]\.[0-9]{1,2}\.[0-9]{1,2}$")
    if (!match){
        console.error("Invalid python version")
        process.exit(1)
    }

    console.log("Fetching python-embed.zip")
    let res = await axios({method: "get", url:`https://www.python.org/ftp/python/${PYTHON_VERSION}/python-${PYTHON_VERSION}-embed-amd64.zip`, responseType: "arraybuffer"}).then(function (response) {
      return response.data});
    
    fs.writeFileSync("./python-embed.zip", Buffer.from(res), (err)=>{ 
        if (err) throw err;}); console.log('python-embed.zip saved'); 

    console.log("Unzipping python-embed")
    await unzippo("./python-embed.zip", "./python-embed")    

    const pth = PYTHON_VERSION.split(".").slice(0,2).join("")

    console.log("Appending to python path")
    fs.appendFile(`./python-embed/python${pth}._pth`, '\nLib\nLib/site-packages\nScripts\n../\n../../', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    res = await axios.get("https://bootstrap.pypa.io/get-pip.py").then(function (response) {return response.data});

    console.log("Fetching get-pip.py")
    fs.writeFileSync("get-pip.py", Buffer.from(res), (err)=>{ if (err) throw err;});
    console.log('get-pip.py saved');
    
    console.log("Installing pip")

    execSync(".\\python-embed\\python.exe .\\get-pip.py --no-warn-script-location")

    console.log("Pip installed!")

    console.log("Installing python requirements")

    execSync(`.\\python-embed\\python.exe -m pip install -r ${REQUIREMENTS_PATH} --no-warn-script-location`)

    console.log("Python requirements intalled")
    

  } catch (error) {
    core.setFailed(error.message);
   
  }
      }

main()
