
## Install dependencies
Run `npm install` from the directory to install all dependencies.

## Start the application
To start the node server, run `npm start`. This will start a node server on `localhost` port `8888`.

## Docker image
RUN `docker build -t chat-server .`

## Start image
RUN `docker run -it --rm -d --network host --name chat-server chat-server`


## Package Your Node.js Application for Deployment in an Offline Environment
Visit `https://dzone.com/articles/how-to-package-your-nodejs-application-for-deploym`

## Way1: Deploy Production Server
- Make sure that you install Node.js on server, to verify run `node -v`
- Run `npm pack` to package your application
- Copy `chat_server-1.0.0.tgz` file to server
- Run `npm install chat_server-1.0.0.tgz` to extract and install your app
- Run `cd node_modules\chat_server` and Run `npm start` to start the application

## Way2: Makes executables: (package Node.js project into an executable that can be run even on devices without Node.js installed)
- Step 1: Run `npm install -g pkg` in your project
- Step 2: Run `npm install` from the directory to install all dependencies.
- Step 2: RUN `pkg -t node10-win-x64 server.js` for package app with NodeJs v10 on Window64

## Run node.js applications as windows services using nssm  (Non-Sucking Service Manager)
- Step1: Installation with command `npm install winser` 

## Way3: Steps to install windows service
- Create a `start.bat` file with content `npm start`
- Download nssm
- Extract it and rename to nssm-chat.exe
- Goto nodejs application folder
- Type `nssm-chat install service-name` from command prompt
- Select start.bat as Application Path, you could also add your startup Arguments here