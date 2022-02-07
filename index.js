const { Client, MessageActionRow, MessageButton } = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');

let data;

try {
    data = JSON.parse(readFileSync('./numbers.json', 'utf-8'));
} catch {}

if (!data || !data.numbers || !data.nextToAdd) {
    writeFileSync('./numbers.json', JSON.stringify({ numbers: [], nextToAdd: null }, null, 4), 'utf8');

    data = JSON.parse(readFileSync('./numbers.json', 'utf-8'));
}

const client = new Client({
    intents: ['GUILDS', 'GUILD_MESSAGES']
});

client.on('ready', async function(readyClient) {
    console.log(`${readyClient.user.tag} is online`);
});

client.on('messageCreate', async function(message) {
    if (!message.content.toLowerCase().startsWith('!!'))
        return;
    if (message.author.id == "930192986107703296") {


        let [command, ...args] = message.content.split(' ');

        command = command.slice(2, command.length);

        data = JSON.parse(readFileSync('./numbers.json', 'utf-8'));

        switch(command) {
        case 'roll':
            let [min, max, num1, num2, num3] = args;

            if (!min || !max) {
                message.channel.send(`You did not input a value for ${!min ? !max ? '\`minimum value\`,' : '\`minimum value\`' : ''} ${!max ? '\`maxmimum value\`' : ''}`).catch(console.error);
                break;
            }

            if (args.map(Number).some(arg => isNaN(arg) || !Number.isInteger(arg) || arg < 0)) {
                message.channel.send('Every input for \`roll\` must be a positive integer (whole number)').catch(console.error);
                break;
            }

            const minValue = Math.ceil(Number(min));
            const maxValue = Math.floor(Number(max));

            if (minValue > maxValue) {
                message.channel.send('Minimum value cannot be less than the maximum value').catch(console.error);
                break;
            }

            let nextToAdd = data.nextToAdd;

            if (nextToAdd) {
                if (minValue > nextToAdd || maxValue < nextToAdd || [num1, num2, num3].map(Number).includes(nextToAdd)) {
                    message.channel.send(':x: **\` Error: out of range \`**').catch(console.error);
                    break;
                }

                data.numbers.push(nextToAdd);
                data.nextToAdd = null;

                writeFileSync('./numbers.json', JSON.stringify(data, null, 4), 'utf8');

                message.channel.send(`Rolled **${nextToAdd}**`).catch(console.error);
                break;
            }

            let random = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

            let rolls = 1;

            while ((data.numbers.includes(random) || [num1, num2, num3].map(Number).includes(random)) && rolls <= maxValue) {
                random = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
                rolls++;
            }

            if (rolls > maxValue) {
                message.channel.send(`All numbers between ${minValue} and ${maxValue} are already in the list`).catch(console.error);
                break;
            }

            data.numbers.push(random);

            writeFileSync('./numbers.json', JSON.stringify(data, null, 4), 'utf8');

            message.channel.send(`Rolled **${random}**`).catch(console.error);
            break;
        case 'skipped':
            message.channel.send(`Numbers: ${data.numbers.join(', ') || 'none'}`).catch(console.error);
            break;
        case 'remove':
            let [input] = args;

            if (input) {
                let toRemove = Number(input);

                if (isNaN(toRemove)) {
                    message.channel.send('Your input for \`number\` must be a positive integer (whole number)').catch(console.error);
                    break;
                }

                if (!data.numbers.includes(toRemove)) {
                    message.channel.send(`**${toRemove}** not found in list`).catch(console.error);
                    break;
                }

                data.numbers.splice(data.numbers.indexOf(toRemove), 1);

                message.channel.send(`**${toRemove}** removed from list`).catch(console.error);
            } else {
                const confirmationMessage = await message.reply({
                    content: 'Are you sure you want to remove all numbers?',
                    allowedMentions: { repliedUser: false },
                    components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('yes')
                                    .setLabel('Remove all')
                                    .setStyle('DANGER'),
                                new MessageButton()
                                    .setCustomId('no')
                                    .setLabel('Cancel')
                                    .setStyle('PRIMARY')
                            )
                    ]
                }).catch(console.error);

                if (!confirmationMessage)
                    break;

                const confirmation = await confirmationMessage.awaitMessageComponent({
                    filter(interaction) {
                        if (interaction.user.id !== message.author.id) {
                            interaction.reply({ ephemeral: true, content: 'You did not call this command' }).catch(console.error);
                            return false;
                        }

                        interaction.deferUpdate().catch(console.error);

                        return true;
                    },
                    time: 20000
                }).catch(() => null);

                if (!confirmation) {
                    confirmationMessage.edit({
                        content: '**20s timeout:** no action taken',
                        allowedMentions: { repliedUser: false },
                        components: []
                    }).catch(console.error);
                    break;
                }

                if (confirmation.customId === 'yes')
                    data.numbers = [];

                confirmationMessage.edit({
                    content: confirmation.customId === 'yes' ? 'All numbers removed' : 'No numbers removed',
                    allowedMentions: { repliedUser: false },
                    components: []
                }).catch(console.error);
            }

            writeFileSync('./numbers.json', JSON.stringify(data, null, 4), 'utf8');
            break;
        case 'rig':
            let toAdd = Number(args[0]);

            if (isNaN(toAdd) || !Number.isInteger(toAdd) || toAdd < 0) {
                message.channel.send('Your input for \`number\` must be a positive integer (whole number)').catch(console.error);
                break;
            }

            data.nextToAdd = toAdd;

            writeFileSync('./numbers.json', JSON.stringify(data, null, 4), 'utf8');

            message.channel.send(`${toAdd} will be added next roll`).catch(console.error);
            break;
        }
    }
});

client.login('OTQwMDAxMjkwNjk4NzcyNDgw.YgBCbA.79QEbZDfc6cw7MhaBragksMZ8jo');