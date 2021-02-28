FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependecies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY web/package.json ./
COPY web/yarn.lock ./

RUN yarn

# Bundle app source
COPY web/ .

RUN yarn build

ENV NODE_ENV production

EXPOSE 3000

# Setting user here to node creates permission issues for the public/logo.png
# USER node

CMD ["yarn", "start"]