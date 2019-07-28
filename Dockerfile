FROM fedora:30
EXPOSE 8888
ENV PORT=8888

RUN dnf install git nodejs nodejs-yarn -y

COPY . /app
WORKDIR /app
RUN git clean -dfx
RUN yarnpkg install
RUN yarnpkg build

# Remove unnecessary dev modules
RUN rm -rf ./node_modules

# Install production dependencies
ENV NODE_ENV=production
RUN yarnpkg install --prod

# Remove packages not-needed for production run
RUN yarnpkg cache clean
RUN dnf remove git nodejs-yarn -y
RUN dnf clean all

ENTRYPOINT ["/usr/bin/node", "/app/server/server.js"]