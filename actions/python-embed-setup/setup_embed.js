const core = require('@actions/core');
const github = require('@actions/github');

const unzip = require('unzip-stream');
const fs = require("fs-extra");

const exec = require('child_process').exec;

try {
    const {PYTHON_VERSION} = process.env
    const match = PYTHON_VERSION.match("^[0-9]\.[0-9]{1,2}\.[0-9]{1,2}$")
    if (!match){
        console.error("Invalid python version")
        process.exit(1)
    }
    const fs = require("fs")
    const embedResult = github.request("https://www.python.org/ftp/python/"+PYTHON_VERSION+"/python-"+PYTHON_VERSION+"-embed-amd64.zip")
    fs.writeFile("python-embed.zip", Buffer.from(embedResult.data), (err)=>{ if (err) throw err; console.log('File saved');});


    fs.createReadStream('./python-embed.zip').pipe(unzip.Extract({ path: './python-embed' }));

    const pth = PYTHON_VERSION.split(".").slice(0,2).join("")

    fs.appendFile('./python-embed/python'+pth+'._pth', '\nLib\nLib/site-packages\nScripts\n../\n../../', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    const pipResult = github.request("https://bootstrap.pypa.io/get-pip.py")
    fs.writeFile("get-pip.py", Buffer.from(pipResult.data), (err)=>{ if (err) throw err; console.log('File saved');})

    exec(".\\python-embed\\python.exe .\\get-pip.py")


  } catch (error) {
    core.setFailed(error.message);
  }