# Use Node.js 18 Alpine as the base image for a small footprint.
# Node.js 18 is EOL: this tag receives no further security updates. Upgrading the base
# image is outside this change's scope and is handled as a separately scoped upgrade.
FROM node:18-alpine

WORKDIR /app

# Dependency layer. Copying the manifests ahead of the source would let Docker cache the
# install across source-only changes, and --production would keep devDependencies out of
# the image. Neither takes effect today: src/backend/ contains no package.json and no
# package-lock.json, so the COPY below matches no file and the install below then fails
# with ENOENT on /app/package.json. Supplying the backend manifest — repairing the
# container build — is outside this change's scope.
COPY src/backend/package*.json ./

RUN npm install --production

COPY src/backend/ ./

ENV PORT=3000

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "index.js"]