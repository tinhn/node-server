
## Install dependencies
Run `npm install` from the directory to install all dependencies.

## Start the application
To start the node server, run `npm start`. This will start a node server on `localhost` port `8888`.

## Docker image
RUN `docker build -t chat-server .`

## Start image
RUN `docker run -it --rm -d --network host --name chat-server chat-server`