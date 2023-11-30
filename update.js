//request api.github.com
let request = require('https').request;
const fs = require('fs');
request({
    hostname: "api.github.com",
    path: "/repos/ntxngle/s1gn/releases/latest",
    method: "GET",
    headers: {
        "User-Agent": "s1gn-updater"
    }
}, (response) => {
    let data = "";
    response.on("data", (chunk) => {
        data += chunk;
    });
    response.on("end", () => {
        data = JSON.parse(data);
        let version = data.tag_name.replace("v", "");
        let current = JSON.parse(fs.readFileSync("package.json")).version;
        if(version != current){
            console.log("UPDATE FROM "+current+" TO "+version);
            request({
                hostname: "github.com",
                path: data.assets[0].browser_download_url,
                method: "GET",
                headers: {
                    "User-Agent": "s1gn-updater"
                }
            }, (response) => {
                let data = "";
                response.on("data", (chunk) => {
                    data += chunk;
                });
                response.on("end", () => {
                    fs.writeFileSync("update.tar", data);
                });
            }).end();
        } else {
            console.log("UP TO DATE ("+version+")");
        }
    });
}).end();