FROM node:current-slim
# assign working dir
WORKDIR /usr/src/app
# Copy all files.
COPY ./ ./
# List files and directories.
RUN ls -la && sleep 5
# check yarn version
RUN yarn -v
# install dependencies
RUN yarn install --production=false
# install @nestjs/cli to execute `nest build`
RUN yarn add -D @nestjs/cli
# expose the endpoint
EXPOSE 3000
# run the command
ENTRYPOINT ["yarn","run","start"]