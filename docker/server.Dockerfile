FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependecies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY server/package.json ./
COPY server/yarn.lock ./

RUN yarn

# Bundle app source
COPY server/ .

RUN yarn build

ENV NODE_ENV production

EXPOSE 8080

USER node

CMD ["node", "dist/index.js"]