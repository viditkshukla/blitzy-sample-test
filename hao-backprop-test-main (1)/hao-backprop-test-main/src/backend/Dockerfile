# Use Node.js 18 with Alpine Linux as the base image for a minimal footprint
# Node.js 18 is EOL: this tag receives no further security updates. Upgrading the base
# image is outside this change's scope and is handled as a separately scoped upgrade.
FROM node:18-alpine

WORKDIR /app

# Dependency layer. Copying the manifests ahead of the source would let Docker cache the
# install across source-only changes, and npm ci would give a lockfile-pinned, deterministic
# install. Neither takes effect today: this build context (src/backend/) contains no
# package.json and no package-lock.json, so the COPY below matches no file and npm ci then
# refuses to run without a lockfile, failing the build. Supplying the backend manifest and
# lockfile — repairing the container build — is outside this change's scope.
COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

# Uses the array syntax for proper signal handling
CMD ["node", "index.js"]