const core = require('@actions/core');
const { getOctokit, context } = require('@actions/github');

const fs = require("fs");


const execSync = require('child_process').execSync;


async function main() {
try {
    const ISS_PATH = core.getInput("ISS_PATH")
    
    console.log(`Compiling ${ISS_PATH}`)
    execSync(`"C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe" /Qp /O".\\Release" "${ISS_PATH}"`)
    console.log("Compiled")

    
    const files =  fs.readdirSync(`./Release/`)
      
    var setupFile = files.filter(file => file.match(/\.exe$/));

    if (!setupFile){
        throw `No exe found in ./Release`
    }

    setupFile = setupFile[0]
    console.log(`Asset to be attached to release: ${setupFile}`)
    
    // Extract version number from the file name
    const regex = /\d+\.\d+\.\d+/;
    const matches = setupFile.match(regex);

    console.log(`Version number regex matches: ${matches}`)

    const releaseVersion = matches ? matches[0] : setupFile ;

    core.setOutput("releaseTag", releaseVersion)
    core.setOutput("releaseFile", setupFile)
    
  } catch (error) {
    core.setFailed(error.message);   
  }
}

main()
