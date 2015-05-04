# dropbox

This is a basic Dropbox clone to sync files across multiple remote folders.

Time spent: 13 hours

## List of features:
- ✅ Client can make GET requests to get file or directory contents
- ✅ Client can make HEAD request to get just the GET headers
- ✅ Client can make PUT requests to create new directories and files with content
- ✅ Client can make POST requests to update the contents of a file
- ✅ Client can make DELETE requests to delete files and folders
- ✅ Server will serve from --dir or cwd as root
- ✅ Client will sync from server over TCP to cwd or CLI dir argument

##Installation steps:
* Install node. See http://nodejs.org/
* Install `nodemon`, `babel`. Do these globally by using `npm install -g`
* run `npm install`

##Start up
There are two parts to this app. Client and Server. Below are the steps on how to start each of this

###Server
Run `npm start` to start the server. Since Client and server are in the same folder, `npm start` doesn't use `nodemon`

If you want to start using `nodemon` use this: `nodemon --exec babel-node -- --stage 1 --optional strict -- server.js`

###Client
Run `babel-node -- --stage 1 --optional strict -- client.js`.

You now have both client and server running.



