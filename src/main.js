const { version } = require("./constants")

const program = require("commander")

const path = require("path")

const mapAction = {
    create: {
        alias: "c",
        description: "create a project",
        examples: ["bj-cli create <project-name>"]
    },
    config: {
        alias: "conf",
        description: "config project variable",
        examples: ["bj-cli config set <key><value>", "bj-cli config get <key>"]
    },
    "*": {
        alias: "",
        description: "commond not fund",
        examples: []
    },
}

Reflect.ownKeys(mapAction).forEach(action => {
    program.command(action)
        .alias(mapAction[action].alias)
        .description(mapAction[action].description)
        .action(() => {
            if (action === "*") {
                console.log(mapAction[action].description)
            } else {
                require(path.resolve(__dirname, action))(...process.argv.slice(3))
            }
        })
})

program.on("--help", () => {
    console.log("\n Examples:")
    Reflect.ownKeys(mapAction).forEach(action => {
        mapAction[action].examples.forEach(example => {
            console.log(example)
        })
    })
})



program.version(version).parse(process.argv)