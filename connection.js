const Request = require('./request');
const TabSeparatedInputStreamParser = require('./tab-separated-input-stream-parser');

/** @param {import('stream').Writable} outStream */
function Connection(outStream, inStream) {
    const responseHandlersQueue = [];
    const requestHandlersQueue = [];

    const inputStreamParser = new TabSeparatedInputStreamParser();

    inStream.setEncoding('utf8');
    inStream.on('data', (chunk) => {
        inputStreamParser.addPartial(chunk);
    });

    inStream.on('close', () => {
        if (this.onDisconnect) {
            this.onDisconnect();
        }
    });

    inputStreamParser.onResponse(response => {
        const responseIds = responseHandlersQueue.map(r => r.id);
        if (responseIds.indexOf(response.id) !== -1) {
            responseHandlersQueue.splice(responseIds.indexOf(response.id), 1)[0].onResponse(response.result);
        }
    });

    inputStreamParser.onRequest(request => {
        const requestType = request.type;
        const requestHandlerIndex = requestHandlersQueue.map(rh => rh.type).indexOf(requestType);
        if (requestHandlerIndex !== -1) {
            const requestHandler = requestHandlersQueue[requestHandlerIndex].onRequest;
            const resultArgs = requestHandler(request.args)
            sendResponse(request.id, resultArgs);
        }
    });

    const sendResponse = (requestId, resultArgs) => {        
        if (!outStream.writable) return; //stream was closed    
        outStream.write(`{"type": "RESPONSE", "response": ${JSON.stringify({
            id: requestId,
            result: JSON.stringify(resultArgs || null)
        })}}\t`);
    }

    const sendRequest = (request, onResponse) => {        
        if (!outStream.writable) return;
        outStream.write(`{"type": "REQUEST", "request": ${JSON.stringify(request)}}\t`);
        if (onResponse) {
            responseHandlersQueue.push({
                id: request.id,
                onResponse
            });
        }
    };

    this.onDisconnect = null;

    this.send = (type, args = {}, onResponse = null) => {
        sendRequest(new Request(type, args), onResponse);
    };

    this.on = (type, onRequest) => {
        requestHandlersQueue.push({ type, onRequest })
    }

    this.close = () => {
        outStream.end();
    };
}

module.exports = Connection;