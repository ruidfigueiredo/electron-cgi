const { EventEmitter } = require('events');

function TabSeparatedInputStreamParser() {
    const responseEmitter = new EventEmitter();
    let streamInput = '';

    this.addPartial = streamContent => {
        streamInput += streamContent;
        while (streamInput.indexOf('\t') !== -1) {
            const responseStr = streamInput.substring(0, streamInput.indexOf('\t'));
            streamInput = streamInput.substring(streamInput.indexOf('\t') + 1);
            let response = null;
            try{            
                response = JSON.parse(responseStr);
            } catch (e){
                throw new Error(`Invalid incoming JSON: ${responseStr}`);
            }
            responseEmitter.emit('response', response);
        }
    };

    this.onResponse = handleResponseCallback => {
        responseEmitter.on('response', handleResponseCallback);
    };
}

module.exports = TabSeparatedInputStreamParser;