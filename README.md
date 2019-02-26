# Electron CGI

Electron CGI is a NodeJs library (npm package: [electron-cgi](https://www.npmjs.com/package/electron-cgi)) that makes interacting with executables from other languages easy.

Currently there's support for .Net through the [ElectronCgi.DotNet](https://www.nuget.org/packages/ElectronCgi.DotNet/) Nuget package.

Here's an example of how you can interact with a .Net application:

In NodeJs/Electron:

    const { ConnectionBuilder } = require('electron-cgi');

    const connection = new ConnectionBuilder()
            .connectTo('dotnet', 'run', '--project', 'DotNetConsoleProjectWithElectronCgiDotNetNugetPackage')
            .build();

    connection.onDisconnect = () => {
        console.log('Lost connection to the .Net process');
    };
    
    connection.send('greeting', 'John', theGreeting => {
        console.log(theGreeting); // will print "Hello John!"
    });

    connection.close();


And in the .Net Console Application:

    using ElectronCgi.DotNet;

    //...
    static void Main(string[] args)
    {
        var connection = new ConnectionBuilder()
                            .WithLogging()
                            .Build();

        // expects a request named "greeting" with a string argument and returns a string
        connection.On<string, string>("greeting", name =>
        {
            return $"Hello {name}!";
        });

        // wait for incoming requests
        connection.Listen();        
    }


### How does it work?

Electron CGI establishes a "connection" with an external process. That external process must be configured to accept that connection. In the example above that's what the `Listen` method does.  

In Node we can "send" requests (for example "greeting" with "John" as a parameter) and receive a response from the other process.

The way this communication channel is established is by using the connected process' stdin and stdout streams. This approach does not rely on staring up a web server and because of that introduces very little overhead in terms of the requests' round-trip time.

