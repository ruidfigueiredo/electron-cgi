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

        if (!executable.pid)
            throw new Error(`Could not start ${spawnArguments.command}. Are you sure you have the right path?`);

        executable.on('exit', (code) => {
            console.log(`Connection to ${spawnArguments.command} was terminated (code: ${code})`)
        });
        return new Connection(executable.stdin, executable.stdout);
    };
}

exports.ConnectionBuilder = ConnectionBuilder;
