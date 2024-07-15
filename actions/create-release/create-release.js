const core = require('@actions/core');
const { getOctokit, context } = require('@actions/github');

const fs = require("fs");


async function main() {
try {
    const tag = core.getInput("RELEASE_TAG")

    const octo = new getOctokit(process.env.GITHUB_TOKEN);

    
    const currentOwner = context.repo.owner
    const currentRepo = context.repo.repo
    
    console.log("Creating release")
    const createReleaseResponse = await octo.rest.repos.createRelease({
        owner: currentOwner,
        repo: currentRepo,
        tag_name: tag,
        draft: false,
        prerelease: false,
    });
    console.log("Completed")
    
    
    const {
        data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl }
    } = createReleaseResponse;

    core.setOutput("releaseID", releaseId)
        
  } catch (error) {
    core.setFailed(error.message);   
  }
}

main()


