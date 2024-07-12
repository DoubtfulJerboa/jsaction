const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
// const StreamZip = require('node-stream-zip');
// const fs = require("fs");
// const axios = require('axios');

const execSync = require('child_process').execSync;


async function main() {
try {
    const ISS_PATH = core.getInput("ISS_PATH")
    
    console.log(`Compiling ${ISS_PATH}`)
    execSync(`"C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe" /Qp /O".\\Release" "${ISS_PATH}"`)


    const githubAuth = new GitHub(process.env.GITHUB_TOKEN);
    
    const { owner: currentOwner, repo: currentRepo } = context.repo
    
    console.log(context)
    
    const createReleaseResponse = await githubAuth.repos.createRelease({
        currentOwner,
        currentRepo,
        tag_name: "test1",
        name: "",
        body: bodyFileContent || body,
        draft: "false",
        prerelease: "false",
        target_commitish: context.sha
      });

    const {
        data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl }
      } = createReleaseResponse;

    core.setOutput('id', releaseId);
    core.setOutput('html_url', htmlUrl);
    core.setOutput('upload_url', uploadUrl);
  } catch (error) {
    core.setFailed(error.message);
   
  }
      }

main()
