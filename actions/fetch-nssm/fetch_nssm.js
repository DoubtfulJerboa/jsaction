const core = require('@actions/core');
const github = require('@actions/github');

const StreamZip = require('node-stream-zip');
const fs = require("fs");
const axios = require('axios');


async function unzippo(zipSource, zipDest) {
  const zip = new StreamZip.async({ file: zipSource });
  fs.mkdirSync(zipDest);
  await zip.extract(null, zipDest);
  console.log(`Extracted ${zipSource}`);
  await zip.close();
}

async function main() {
try {
    console.log("Fetching nssm.zip")
    let res = await axios({method: "get", url:"https://nssm.cc/release/nssm-2.24.zip", responseType: "arraybuffer"}).then(function (response) {
      return response.data});
    
    fs.writeFileSync("./nssm.zip", Buffer.from(res), (err)=>{ 
        if (err) throw err;}); console.log('python-embed.zip saved'); 

    console.log("Unzipping NSSM")
    await unzippo("./nssm.zip", "./nssm")    

    console.log("Moving NSSM to current dir")
    fs.rename("./nssm/nssm-2.24/win64/nssm.exe", "./nssm.exe", function (err) {
        if (err) throw err
        console.log('Successfully renamed - AKA moved!')
      })
  } catch (error) {
    core.setFailed(error.message);
   
  }
      }

main()
