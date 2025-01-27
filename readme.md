<img align="right" src="./assets/images/icons/fire_gate.jpg" width=200 height=200>

# Fire Gate

[![Release](https://img.shields.io/github/release/Jonathan25J/Fire-Gate.svg)](https://github.com/Jonathan25J/Fire-Gate/releases/latest)
[![License](https://img.shields.io/github/license/Jonathan25J/Fire-Gate.svg)](https://github.com/Jonathan25J/Fire-Gate/blob/main/LICENSE)
[![Build](https://github.com/Jonathan25J/Fire-Gate/actions/workflows/docker-compose.yml/badge.svg)](https://github.com/Jonathan25J/Fire-Gate/actions/workflows/docker-compose.yml)
![!JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&)

With the Fire Gate Discord app is it possible to communicatie anonymously with other Discord users. The only limitation is that users can only communicatie with other users who have this app in common.

The communication happens through entities known as spirits. Everyone can create an unlimited amount of spirits and the owners of these spirits remain anonymous. These spirits go trough the [Fire Gate](./resources/markdown/documentation.md#fire-gate) or gather at [custom made gates](./resources/markdown/documentation.md#custom-gates).

## Invite app
It's not possible to invite this app.

## Hosting
- Have [Node](https://nodejs.org/en) and [Docker Engine](https://docs.docker.com/engine/) installed
- Create a `.env` file in the root folder with the following content 
```bash
# Bot
BOT_TOKEN = [BOT TOKEN]
BOT_CLIENT_ID = [CLIENT ID]

# Database
DB_NAME = [DATABASE NAME]
DB_USER = [DATABASE USER]
DB_PASSWORD = [DATABASE USER PASSWORD]

## Internal
DB_HOST = [DATABASE HOST]
DB_PORT = [DATABASE PORT]
```
- Replace the values inside the brackets `[]` with your values and remove the brackets itself
- Run `docker compose up -d`
- Run `node deploy-commands`