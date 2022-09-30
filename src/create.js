

const axios = require("axios")
const ora = require("ora")
const Inquirer = require("inquirer")
const { downloadDirectory } = require("./constants")
const { promisify } = require("util")
let downloadGitRepo = require("download-git-repo")
let ncp = require("ncp")
const path = require("path")
downloadGitRepo = promisify(downloadGitRepo)
ncp = promisify(ncp)

const fetchReoList = async () => {
    const { data } = await axios.get("https://api.github.com/orgs/td-cli/repos")
    return data
}
const fetchTagList = async (repo) => {
    const { data } = await axios.get(`https://api.github.com/repos/td-cli/${repo}/tags`)
    return data
}
const download = async (repo, tag) => {
    let api = `td-cli/${repo}`
    if (tag) {
        api += `#${tag}`
    }
    const dest = `${downloadDirectory}/${repo}`
    await downloadGitRepo(api, dest)
    return dest
}

const waitFnLoading = (fn, message) => async (...args) => {
    const spinner = ora(message)
    spinner.start()
    let repos = await fn(...args)
    spinner.succeed()
    return repos
}

module.exports = async (proname) => {
    let repos = await waitFnLoading(fetchReoList, "fetching template...")()
    repos = repos.map(item => item.name)

    const { repo } = await Inquirer.prompt({
        name: 'repo',
        type: "list",
        message: "please choise a template to create project",
        choices: repos
    })

    let tags = await waitFnLoading(fetchTagList, "fetching tags...")(repo)
    tags = tags.map(item => item.name)
    const { tag } = await Inquirer.prompt({
        name: 'tag',
        type: "list",
        message: "please choise a tag to create project",
        choices: tags
    })


    const result = await waitFnLoading(download, "download template...")(repo, tag)
    await ncp(result, path.resolve(proname))
}