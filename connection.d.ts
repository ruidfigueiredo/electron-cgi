import { Writable, Readable } from "stream";

export = class Connection {    
    constructor(executabeStdin: Writable, executabeStdout: Readable);
    /**
     * Sends a request to the connected process
     * @param type The request type
     * @param onResponse Optional callback that will be invoked after the request has been executed on the connected process 
     */
    send(type: string, onResponse?: (err: any, returnArg: any) => void): void | Promise<any>;
    /**
     * Sends a request and arguments to the connected process
     * @param type The request type
     * @param arg Argument to be sent to the connected process request handler 
     * @param onResponse Optional callback that will be invoked after the request has been executed on the connected process 
     */
    send(type: string, arg?: any, onResponse?: (err: any, returnArg: any) => void): void | Promise<any>;
    /**
     * Closes the connection
     */
    close(): void;

    /**
     * Registers a request handler for the request type
     * @param type The name of the request type
     * @param onRequest The handler for the request
     */
    on(type: string, onRequest: (requestArg?: any) => any): void;

    onDisconnect: () => void;
}