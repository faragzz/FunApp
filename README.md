Here’s your updated README with a section to ensure Docker is running:  

---

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
- Docker support for easy setup  

## Installation  

Ensure you have **Node.js**, **pnpm**, and **Docker** installed.  

```bash  
$ pnpm install  
```  

## Running the Application  

### Ensure Docker is Running  

Before starting the application, make sure Docker is running:  

```bash  
$ docker --version  # Check if Docker is installed  
$ docker ps         # Verify Docker is running  
```  

If Docker is not running, start it and ensure the required containers are up:  

```bash  
$ docker-compose up -d  
```  

### Start the Application  

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

## Environment Variables  

Create a `.env` file in the root directory and configure the following:  

```env  
JWT_SECRET=hfjkwergk@t732vj78yr2kblEIO@e23$esdklklhl8  
JWT_REFRESH_SECRET=fwefhwejfhwlj21312fkl214lfe34jk@hfjerh  
DB_HOST=localhost  
DB_USERNAME=postgres  
DB_PASSWORD=password  
DB_NAME=db  
DB_USER=user  
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

---
