FROM node:8

ENV NODE_ENV production

# Create app directory
WORKDIR /blockmed-eth-event-listener

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

VOLUME ["/blockmed-eth-event-listener/logs"]

CMD [ "node", "event_watcher.js" ]