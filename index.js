#!/usr/bin/env node

const fs = require("fs");
const marked = require("marked");
const TerminalRenderer = require("marked-terminal");
const argv = require("yargs/yargs")(process.argv.slice(2))
  .usage(
    "$0 DIRECTORY",
    "Output content of a random markdown file from DIRECTORY"
  )
  .demandCommand(1).argv;

marked.setOptions({
  renderer: new TerminalRenderer(),
});

// Verify that the path ends with a '/'
let path = argv.DIRECTORY;
if (!path.endsWith("/")) {
  path += "/";
}

printMarkdown(path);

/**
 * Pick a random markdown file from the path and print its content to the console
 * @param {string} path - Path to directory with markdown files
 */
function printMarkdown(path) {
  fs.readdir(path, { withFileTypes: true }, (err, dirEntries) => {
    if (err) throw err;
    const filteredDirEntries = dirEntries.filter(
      (dirent) => dirent.isFile() && dirent.name.endsWith(".md")
    );
    const randomIndex = Math.floor(Math.random() * filteredDirEntries.length);
    const fileName = `${path}${filteredDirEntries[randomIndex].name}`;
    fs.readFile(
      fileName,
      {
        encoding: "utf8",
      },
      (err, data) => {
        if (err) throw err;
        console.log(marked(data));
      }
    );
  });
}
