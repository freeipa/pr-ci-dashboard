FROM registry.fedoraproject.org/f30/s2i-base:latest

# This image provides a Node.JS environment you can use to run your Node.JS
# applications.

# Based on https://github.com/sclorg/s2i-nodejs-container/blob/master/10/Dockerfile.fedora

EXPOSE 8080

# Add $HOME/node_modules/.bin to the $PATH, allowing user to make npm scripts
# available on the CLI without using npm's --global installation mode
# This image will be initialized with "npm run $NPM_RUN"
# See https://docs.npmjs.com/misc/scripts, and your repo's package.json
# file for possible values of NPM_RUN
# Description
# Environment:
# * $NPM_RUN - Select an alternate / custom runtime mode, defined in your package.json files' scripts section (default: npm run "start").
# Expose ports:
# * 8080 - Unprivileged port used by nodejs application

ENV NODEJS_VERSION=10 \
    NPM_RUN=start \
    NPM_RUN_DEV=debug\
    NAME=pr-ci-dashboard \
    NPM_CONFIG_PREFIX=$HOME/.npm-global \
    PATH=$HOME/node_modules/.bin/:$HOME/.npm-global/bin/:$PATH

ENV SUMMARY="FreeIPA PR-CI Dashboard" \
    DESCRIPTION=""

LABEL summary="$SUMMARY" \
      description="$DESCRIPTION" \
      io.k8s.description="$DESCRIPTION" \
      io.k8s.display-name="$SUMMARY $VERSION" \
      io.openshift.expose-services="8080:http" \
      io.openshift.tags="builder,$NAME,$NAME$VERSION" \
      io.openshift.s2i.scripts-url="image:///usr/libexec/s2i" \
      io.s2i.scripts-url="image:///usr/libexec/s2i" \
      com.redhat.dev-mode="DEV_MODE:false" \
      com.redhat.deployments-dir="${APP_ROOT}/src" \
      com.redhat.dev-mode.port="DEBUG_PORT:5858"\
      com.redhat.component="$NAME" \
      name="$FGC/$NAME" \
      version="$VERSION" \
      maintainer="Petr Vobornik<pvoborni@gmail.com>" \
      help="For more information visit https://github.com/pvoborni/freeipa-pr-ci" \
      usage="s2i build https://github.com/pvoborni/freeipa-pr-ci $NAME"

RUN dnf -y module enable nodejs:$NODEJS_VERSION && \
    INSTALL_PKGS="nodejs npm nss_wrapper nodejs-yarn" && \
    dnf remove $INSTALL_PKGS -y && \
    yum install -y --setopt=tsflags=nodocs $INSTALL_PKGS && \
    dnf -y clean all --enablerepo='*'

# TODO: Add nodejs-nodemon into Fedora
# https://bugzilla.redhat.com/show_bug.cgi?id=1433784
RUN NPM_CONFIG_PREFIX=$HOME/../ npm install -g nodemon && \
    rm $(npm config get cache)/* -rf && \
    rm -rf $(npm config get tmp)/npm-*

# Copy the S2I scripts to image on io.openshift.s2i.scripts-url
COPY ./.s2i/bin/ /usr/libexec/s2i

# Drop the root user and make the content of /opt/app-root owned by user 1001
RUN chown -R 1001:0 ${APP_ROOT} && chmod -R ug+rwx ${APP_ROOT} && \
    rpm-file-permissions

USER 1001

# Set the default CMD to print the usage of the language image
CMD /usr/libexec/s2i/usage