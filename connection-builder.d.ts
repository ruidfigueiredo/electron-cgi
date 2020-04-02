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
     * Allows adding a callback that runs when the connected process exits
     * @param onExitHandler invoked with the exit code
     */ 
    onExit: (onExitHandler: (code: number) => void) => ConnectionBuilder;
   
    /**
     * Allows adding a callback that runs when the connected process writes to the sterr stream
     * @param onStderrHandler invoked with what's on the sterr stream
     */
    onStderr: (onStderrHandler: (error: string) => void) => ConnectionBuilder; 
}