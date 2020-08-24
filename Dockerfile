FROM node:10.15.3-stretch-slim

RUN apt-get update && apt-get install -y --no-install-recommends git python build-essential && rm -rf /var/lib/apt/lists/* && \
    npm install pm2@3.2.7 sequelize-cli@5.4.0 mocha -g

ENV NODE_ENV=production

COPY ./server /app

WORKDIR /app

RUN npm install --loglevel=error && \
    pm2 update && \
    npm install -g nodemon --loglevel=error && \ 
    cd plugins && npm install --loglevel=error && \
    for d in ./*/ ; do (cd "$d" && npm install --loglevel=error); done && \
    cd /app/mail && npm install --loglevel=error

EXPOSE 10010

EXPOSE 10080

EXPOSE 10011

ENTRYPOINT ["/entrypoint.sh"]
