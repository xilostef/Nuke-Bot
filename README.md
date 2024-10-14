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

4. Run the bot:

   `node index.js`

## Configuartion
- Replace the `PROTECTED_SERVER_ID` in the script with the ID of the server you want to protect from certain actions.
- Update `adminUserIds` with the user IDs of the administrators allowed to execute protected commands.

## Available Commands
- nukevr: Deletes all channels and creates new ones with raid messages.
- addpermsvr: Grants the "Administrator" role to the user.
- kickvr: Kicks all members from the server except bots and administrators.
- banvr: Bans all members from the server except bots and administrators.
- hackervr: Sends 100 DM messages to each member as a "rickroll" joke.
- setwebhookmessage: Prompts the user to send a message to the webhook.
- haltnukevr: Stops the nuke operation.
- stoprickvr: Stops the "hackervr" operation.
- clearvr: Deletes all server channels.

## Loging
Command usage is logged in a JSON file (`command_logs.json`) and sent via the configured webhook.

## Liscence
Free, open-source, use it as you wish.
