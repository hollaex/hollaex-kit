FROM bitholla/hollaex-core:1.21.1

RUN rm -rf /app/mail && rm -rf /app/db

COPY ./mail /app/mail

COPY ./plugins /app/plugins

COPY ./db /app/db

EXPOSE 10011

RUN cd plugins && npm install

RUN cd plugins && for d in ./*/ ; do (cd "$d" && npm install); done

RUN cd mail && npm install
