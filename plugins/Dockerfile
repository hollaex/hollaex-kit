FROM bitholla/hollaex-core:1.19.9

EXPOSE 10011

COPY . /app/plugins

WORKDIR /app/plugins

RUN npm install -g express && \
    for d in ./*/ ; do (cd "$d" && npm install); done

WORKDIR /app

RUN ls -al && cd plugins && ls -al 

ENTRYPOINT ["node", "/app/plugins/index.js"]
