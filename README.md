# NestJS Project

<p align="center">
  <a href="http://nestjs.com/" target="_blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[![NPM Version](https://img.shields.io/npm/v/@nestjs/core.svg)](https://www.npmjs.com/~nestjscore)
[![License](https://img.shields.io/npm/l/@nestjs/core.svg)](https://github.com/nestjs/nest/blob/master/LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dm/@nestjs/common.svg)](https://www.npmjs.com/~nestjscore)
[![CircleCI](https://img.shields.io/circleci/build/github/nestjs/nest/master)](https://circleci.com/gh/nestjs/nest)
[![Discord](https://img.shields.io/badge/discord-online-brightgreen.svg)](https://discord.gg/G7Qnnhy)

## Description

This project is built using the [NestJS](https://github.com/nestjs/nest) framework, a progressive Node.js framework for building scalable server-side applications.

## Features

- Modular architecture using NestJS
- TypeScript support
- Authentication system with JWT
- CRUD operations for user management
- Geolocation-based user validation
- Unit and e2e testing
- Swagger API documentation

## Installation

Ensure you have Node.js and pnpm installed.

```bash
$ pnpm install
```

## Running the Application

```bash
# Development mode
$ pnpm run start

# Watch mode
$ pnpm run start:dev

# Production mode
$ pnpm run start:prod
```

## API Documentation

After running the application, you can access the API documentation at:

```
http://localhost:3000/api/docs#/
```

## Running Tests

```bash
# Run all tests
$ pnpm run test

# Run unit tests
$ pnpm run test:unit

# Run e2e tests
$ pnpm run test:e2e

# Test coverage
$ pnpm run test:cov
```

## Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
JWT_SECRET=hfjkwergk@t732vj78yr2kblEIO@e23$esdklklhl8
JWT_REFRESH_SECRET=fwefhwejfhwlj21312fkl214lfe34jk@hfjerh
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=mydatabase
```

## Deployment

To deploy your NestJS application:

```bash
# Install NestJS deployment CLI
$ pnpm install -g mau

# Deploy with Mau (AWS-based hosting for NestJS apps)
$ mau deploy
```

Alternatively, you can deploy using Docker:

```bash
# Build Docker image
$ docker build -t nestjs-app .

# Run the container
$ docker run -p 3000:3000 nestjs-app
```

## Useful Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Discord](https://discord.gg/G7Qnnhy)
- [NestJS Devtools](https://devtools.nestjs.com)
- [NestJS Enterprise Support](https://enterprise.nestjs.com)
- [NestJS Jobs Board](https://jobs.nestjs.com)

## Author

- **Kamil Myśliwiec** - [Twitter](https://twitter.com/kammysliwiec)
- **NestJS Official Website** - [nestjs.com](https://nestjs.com)

## License

This project is licensed under the [MIT License](https://github.com/nestjs/nest/blob/master/LICENSE).

