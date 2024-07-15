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

    const octo = new getOctokit(process.env.GITHUB_TOKEN);
    
    
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

    console.log(`Version numbner regex matches: ${matches}`)

    const releaseVersion = matches[0];
    
    const fileData = fs.readFileSync(`./Release/${setupFile}`)

    const currentOwner = context.repo.owner
    const currentRepo = context.repo.repo
    
    console.log("Creating release")
    const createReleaseResponse = await octo.rest.repos.createRelease({
        owner: currentOwner,
        repo: currentRepo,
        tag_name: releaseVersion,
        draft: false,
        prerelease: false,
      });
    console.log("Completed")


    const {
        data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl }
      } = createReleaseResponse;

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
    console.error(error.message)
   
  }
      }

main()
