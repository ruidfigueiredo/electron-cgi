import { Connection } from './connection'
export class ConnectionBuilder {
    /**
     * Configures the connection builder with the command and arguments supplied as parameters
     * @param command The command to execute, for example 'dotnet'
     * @param args A list of parameters to pass to the command 'run', '--project', 'pathToProject'
     */
    connectTo(command: string, ...args: string[]): ConnectionBuilder;

    /**
     * Starts a new process and takes over its stdin and stdout. Returns a Connection object that can be used to communicate with the new process 
     */
    build(): Connection;

    /**
     * Available to override and manage onExit by your own implementation
     */ 
    onExited: (code: any) => void;
   
    /**
     * Available to override and manage errors by your own implementation 
     */
    onError: (data: any) => void; 
}