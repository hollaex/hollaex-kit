FROM node:16

RUN apt-get update && \
    apt-get install -y curl openssl ca-certificates git python build-essential && \
    rm -rf /var/lib/apt/lists/* && \
    npm config set unsafe-perm true && \
    npm install pm2 sequelize-cli mocha -g --loglevel=error

ENV NODE_ENV=production

COPY ./server /app

WORKDIR /app

# Changing the default image user to 'appuser'
RUN groupadd -g 999 appuser && \
    useradd -r -u 999 -g appuser appuser && \
    mkdir /home/appuser && \
    chown -R appuser /home/appuser && \
    chown -R appuser /app

USER appuser

RUN npm install --loglevel=error && \
    pm2 update && \
    cd /app/mail && npm install --loglevel=error

EXPOSE 10010

EXPOSE 10080

ENTRYPOINT ["/entrypoint.sh"]
