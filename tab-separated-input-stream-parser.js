const { EventEmitter } = require('events');

function TabSeparatedInputStreamParser() {
    const messageEmitter = new EventEmitter();
    let streamInput = '';

    this.addPartial = streamContent => {        
        streamInput += streamContent;
        while (streamInput.indexOf('\t') !== -1) {
            const messageStr = streamInput.substring(0, streamInput.indexOf('\t'));
            streamInput = streamInput.substring(streamInput.indexOf('\t') + 1);
            let message = null;
            try {
                message = JSON.parse(messageStr);
            } catch (e) {
                throw new Error(`Invalid incoming JSON: ${messageStr}`);
            }
            if (message.type === 'RESPONSE') {
                messageEmitter.emit('response', message.response);
            }else if (message.type === 'REQUEST') {
                messageEmitter.emit('request', message.request);
            }
        }
    };

    this.onResponse = handleResponseCallback => {
        messageEmitter.on('response', handleResponseCallback);
    };

    this.onRequest = handleRequestCallback => {
        messageEmitter.on('request', handleRequestCallback);
    };
}

module.exports = TabSeparatedInputStreamParser;