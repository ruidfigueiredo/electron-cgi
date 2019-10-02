export class Connection {
    /**
     * Sends a request and arguments to the connected process
     * @param type The request type
     * @param args Argument to pass to 
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