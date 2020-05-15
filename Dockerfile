FROM bitholla/hollaex-core:1.23.1

COPY ./mail /app/mail

COPY ./plugins /app/plugins

COPY ./db/migrations /app/db/migrations

COPY ./db/seeders /app/db/seeders

COPY ./db/models /app/db/models

RUN npm install -g nodemon --loglevel=error && \ 
    cd plugins && npm install --loglevel=error && \
    for d in ./*/ ; do (cd "$d" && npm install --loglevel=error); done && \
    cd /app/mail && npm install --loglevel=error
