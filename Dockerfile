# specify the node base image with your desired version node:<version>
FROM node:11
# replace this with your application's default port
EXPOSE 8888

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app

CMD ["npm", "start"]