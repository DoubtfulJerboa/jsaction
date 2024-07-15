const core = require('@actions/core');
const { getOctokit, context } = require('@actions/github');
// const StreamZip = require('node-stream-zip');
// const fs = require("fs");
// const axios = require('axios');

const execSync = require('child_process').execSync;


async function main() {
try {
    // const ISS_PATH = core.getInput("ISS_PATH")
    
    // console.log(`Compiling ${ISS_PATH}`)
    // execSync(`"C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe" /Qp /O".\\Release" "${ISS_PATH}"`)
    // console.log("Compiled")

    const octo = new getOctokit(process.env.GITHUB_TOKEN);
    
    const currentOwner = context.repo.owner
    const currentRepo = context.repo.repo
    
    console.log(context)

    console.log(context.repo)
    
    const createReleaseResponse = await octo.rest.repos.createRelease({
        owner: currentOwner,
        repo: currentRepo,
        tag_name: "test1",
        // name: "",
        // body: "bodyFileContent || body",
        draft: false,
        prerelease: false,
        // target_commitish: context.sha
      });

    const {
        data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl }
      } = createReleaseResponse;

    core.setOutput('id', releaseId);
    core.setOutput('html_url', htmlUrl);
    core.setOutput('upload_url', uploadUrl);
  } catch (error) {
    core.setFailed(error.message);
    console.error(error.message)
   
  }
      }

main()
