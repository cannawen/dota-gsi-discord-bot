FROM debian:bullseye as builder

ENV PATH=/usr/local/node/bin:$PATH
ARG NODE_VERSION=19.4.0

RUN apt-get update; apt install -y curl python-is-python3 pkg-config build-essential && \
    curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
    /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
rm -rf /tmp/node-build-master

RUN apt -y install git

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install 
RUN npm update
RUN npm run build

FROM debian:bullseye-slim

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /usr/local/node /usr/local/node
COPY --from=builder /app /app

WORKDIR /app
ENV NODE_ENV production
ENV PATH /usr/local/node/bin:$PATH

CMD [ "node", "./build/index.js" ]
