const core = require('@actions/core');
const { getOctokit, context } = require('@actions/github');

const fs = require("fs");


const execSync = require('child_process').execSync;


async function main() {
try {
    const releaseId = core.getInput("RELEASE_ID")
    const path = core.getInput("FILE_PATH")
    const setupFile = core.getInput("FILE_NAME")

    const octo = new getOctokit(process.env.GITHUB_TOKEN);
    
    const fileData = fs.readFileSync(`${path}/${setupFile}`)
    
    console.log("Uploading asset to release")
    await octo.rest.repos.uploadReleaseAsset({
        owner: "DoubtfulJerboa",
        repo: "workflowtest",
        release_id: releaseId,
        name: setupFile,
        data: fileData

    })
  console.log("Completed")
    
  } catch (error) {
    core.setFailed(error.message);   
  }
}

main()


