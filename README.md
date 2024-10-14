# Discord Raid Bot

This is a Discord bot script designed to automate operations within a server, such as creating multiple channels, sending messages, managing roles, and logging command usage via webhooks.

## Features
- Create multiple channels in batches.
- Send customized raid messages to channels.
- Admin role management and permissions handling.
- Command logging sent via Discord webhooks.
- Protection for a designated server (`PROTECTED_SERVER_ID`).
- Batch delete channels, ban or kick members, and more.

## Requirements
- Node.js
- Discord.js
- Axios

## Installation

1. Clone the repository to your local machine:

   `git clone https://github.com/your-repo/discord-raid-bot.git`  
   `cd discord-raid-bot`

2. Install the necessary packages:

   `npm install discord.js axios`

3. Create a `config.json` file in the root directory with your bot's token and webhook URLs:

   ```json
   {
     "token": "YOUR_BOT_TOKEN",
     "webhook": "YOUR_WEBHOOK_URL",
     "updateWebhook": "YOUR_UPDATE_WEBHOOK_URL"
   }
