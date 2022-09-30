const { version } = require("../package.json")


const downloadDirectory = `${process.env[process.platform === "darwin" ? "Home" : "USERPROFILE"]}/.template`



module.exports = {
    version,
    downloadDirectory
}