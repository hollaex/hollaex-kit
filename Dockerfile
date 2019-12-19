FROM bitholla/hollaex-core:1.19.9

RUN rm -rf /app/mail

COPY ./mail /app/mail

COPY ./plugins /app/plugins

