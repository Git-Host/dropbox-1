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
Run `babel-node --stage 1 --optional strict -- client.js`.

You now have both client and server running.

##Demo
1. Starting client and server:
![alt tag](https://github.com/umkatakam/dropbox/blob/master/images/start-server-client.gif)

2. Making `GET` requests to get file or directory
To get a file conents open a terminal and make `curl -v http://127.0.0.1:8000/server.js -X GET`

![alt tag](https://github.com/umkatakam/dropbox/blob/master/images/get-file-contents.gif)

To get a directory conents open a terminal and make `curl -v http://127.0.0.1:8000/ -X GET`

![alt tag](https://github.com/umkatakam/dropbox/blob/master/images/get-dir-contents.gif)

3. Making a `HEAD` request to get just `GET` headers
To get headers run `curl -v http://127.0.0.1:8000 --head`

![alt tag](https://github.com/umkatakam/dropbox/blob/master/images/get-headers.gif)

4. Making `PUT` requests to create new directories and files with content
To create a directory run: `curl -v http://127.0.0.1:8000/foo/ -X PUT`

![alt tag](https://github.com/umkatakam/dropbox/blob/master/images/create-a-directory.gif)

To create a file run: `curl -v http://127.0.0.1:8000/foo/bar.js -X PUT -d "create file" -H "Content-Type:text/plain"`

![alt tag](https://github.com/umkatakam/dropbox/blob/master/images/create-a-file.gif)

5. Making `POST` requests to update contents of a file
To update a file run: `curl -v http://127.0.0.1:8000/foo/bar.js -X POST -d "file updated" -H "Content-Type:text/plain"`

![alt tag](https://github.com/umkatakam/dropbox/blob/master/images/update-a-file.gif)

Updating folders is not supported

6. Making `DELETE` requests to delete files or folders
To delete a file run:  `curl -v http://127.0.0.1:8000/foo/bar.js -X DELETE`

![alt tag](https://github.com/umkatakam/dropbox/blob/master/images/delete-a-directory.gif)

To delete a directory run: `curl -v http://127.0.0.1:8000/foo/ -X DELETE`

![alt tag](https://github.com/umkatakam/dropbox/blob/master/images/delete-a-file.gif)

7. Provide the target directory as an argument
If you want the files to be saved in another directory. Pass it as an argument `--dir` in start up script:
e.g.: `nodemon --exec babel-node -- --stage 1 --optional strict -- index.js --dir /path/to/target/directory`

![alt tag](https://github.com/umkatakam/dropbox/blob/master/images/arg-directory.gif)

8. Client sync from server over TCP
Once both client and server are up. Below are the examples of sync.

![alt tag](https://github.com/umkatakam/dropbox/blob/master/images/client-sync-put.gif)

![alt tag](https://github.com/umkatakam/dropbox/blob/master/images/client-sync-delete.gif)

