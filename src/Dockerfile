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
RUN yarn
# expose the endpoint
EXPOSE 3000
# run the command
CMD ["yarn","run","start"]