const { spawn } = require('child_process');
const Connection = require('./connection');

function ConnectionBuilder() {
    var spawnArguments = null;
    this.connectTo = (command, ...args) => {
        spawnArguments = {
            command,
            args
        };
        return this;
    };
    this.build = () => {
        if (!spawnArguments) {
            throw new Error('Use connectTo(pathToExecutable, [arguments]) to specify to which executable to connect');
        }
        const executable = spawn(spawnArguments.command, spawnArguments.args);
        return new Connection(executable.stdin, executable.stdout);
    };
}

exports.ConnectionBuilder = ConnectionBuilder;
