const uuidv4 = require('uuid/v4');

function Request(type, args) {
    this.type = type;
    this.id = uuidv4();
    this.args = JSON.stringify(args);
}

module.exports = Request;