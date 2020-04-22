FROM bitholla/hollaex-core:1.22.0

RUN apt-get update && apt-get install -y git

COPY ./mail /app/mail

COPY ./plugins /app/plugins

COPY ./db/migrations /app/db/migrations

COPY ./db/seeders /app/db/seeders

COPY ./db/models /app/db/models

EXPOSE 10011

RUN npm install -g nodemon && \ 
    cd plugins && npm install --loglevel=error && \
    for d in ./*/ ; do (cd "$d" && npm install --loglevel=error); done && \
    cd /app/mail && npm install --loglevel=error
