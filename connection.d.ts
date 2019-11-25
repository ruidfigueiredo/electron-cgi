import { Writable, Readable } from "stream";

export = class Connection {    
    constructor(executabeStdin: Writable, executabeStdout: Readable);
    /**
     * Sends a request and arguments to the connected process
     * @param type The request type
     * @param args Argument to be sent to the connected process request handler 
     * @param onResponse Optional callback that will be invoked after the request has been executed on the connected process 
     */
    send(type: string, args: any, onResponse?: (returnArg: any) => void): void;
    /**
     * Closes the connection
     */
    close(): void;

    on(type: string, onRequest?: (requestArg: any) => any): void;

    onDisconnect: () => void;
}