# Build
RUN `docker build -t chat-server .`

# Running
RUN `docker run -it --rm -d --network host --name chat-server chat-server`