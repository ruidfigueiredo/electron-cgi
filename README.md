# Electron CGI

Electron CGI is a NodeJs library (npm package: [electron-cgi](https://www.npmjs.com/package/electron-cgi)) that makes interacting with executables from other languages easy.

Currently there's support for .Net through the [ElectronCgi.DotNet](https://www.nuget.org/packages/ElectronCgi.DotNet/) Nuget package.

Here's an example of how you can interact with a .Net application (more examples [here](https://www.blinkingcaret.com/2020/03/25/electroncgi-1-0-cross-platform-guis-for-net-core/)):

In NodeJs/Electron:

    const { ConnectionBuilder } = require('electron-cgi');

    const connection = new ConnectionBuilder()
            .connectTo('dotnet', 'run', '--project', 'DotNetConsoleProjectWithElectronCgiDotNetNugetPackage')
            .build();

    connection.onDisconnect = () => {
        console.log('Lost connection to the .Net process');
    };
    
    connection.send('greeting', 'John', (error, theGreeting) => {
        if (error) {
            console.log(error); //serialized exception from the .NET handler
            return;
        }

        console.log(theGreeting); // will print "Hello John!"
    });

    //alternatively use async/await, in an async function:
    try{
        const greeting = await connection.send('greeting', 'John');
        console.log(greeting);
    }catch (err) {
        console.log(err); //err is the serialized exception thrown in the .NET handler for the greeting request
    }

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
        connection.On("greeting", (string name) =>
        {
            return $"Hello {name}!";
        });

        // wait for incoming requests
        connection.Listen();
    }


### How does it work?

Electron CGI establishes a "connection" with an external process. That external process must be configured to accept that connection. In the example above that's what the `Listen` method does.  

In Node we can "send" requests (for example "greeting" with "John" as a parameter) and receive a response from the other process.

The way this communication channel is established is by using the connected process' stdin and stdout streams. This approach does not rely on starting up a web server and because of that introduces very little overhead in terms of the requests' round-trip time.


## Changelog

## Update version 1.0.3..1.0.5

- Incorrect documentation fix
- Re-added Connection to index.d.ts
- Republish because of .git being in the npm package (https://github.com/npm/npm/issues/20213)

## Update version 1.0.2

- Fix for incorrect typescript definition file for connection (callbacks were missing the error parameter)

## Update version 1.0.1

- Added ability to omit parameters in `.send`, for example `connection.send('getAlll', (err, allResults) => {...})`

## Update version 1.0.0

- Alignment of the API for making requests with Node.js conventions (this is a **breaking change**)

    connection.send('requestId', args, (error, response) => {...})

- Ability to use promises. If no callback is provided `send` returns a promise:

        try{
            const result = await connection.send('request', args);
            //use result
        }catch(error) {
            //handle error
        }

- Errors propagate from .NET to Node.js (requires NuGet package ElectronCgi.DotNet version 1.0.1)

    - If an exception is thrown in a handler in .NET it will be serialized and sent to Node.js.

- Arguments are now optional in `connection.send` (e.g. this is valid: `connection.send('start')`)

- Bugfixes

## Update version 0.0.5

- Duplex: ability to send requests from both .Net and Node.js

## Update version 0.0.3 and 0.0.4

- (.Net) Ability to serve request concurrently (uses System.Threading.Tasks.DataFlow) 
- Intellisense for electron-cgi
- .Net stderr stream is displayed in node's console (Console.Error.WriteLine in .Net is now visible)
- Fixed logging in ElectronCgi.DotNet
- Duplex communication (i.e. ability initiate a requests in .Net to Node):

In .Net:

    var posts = await GetNewPosts();
    connection.Send("new-posts", posts);

Node.js:

    connection.on('new-posts', posts => {
        console.log('Received posts from Net:');
        posts.forEach(post => {
            console.log(post.title);
        });
    });
