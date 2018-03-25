const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", () => {
	console.log(`${bot.user.username} is online!`);

	bot.user.setActivity("on Bot Editor");
});

bot.on("message", message => {
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;

	let prefix = botconfig.prefix;
	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1);

	if (command === `${prefix}kick`){

		let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if (!kUser) return message.channel.send("Unidentified User!");
		let kReason = args.join(" ").slice(22);
		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have the permissions to do this.");
		if (kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("User can not be kicked.");


		let kickembed = new Discord.RichEmbed()
		.setDescription("Kick")
		.setColor("#ff0000")
		.addField("User Kicked", `${kUser} with ID: ${kUser.id}`)
		.addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
		.addField("Kicked In", message.channel)
		.addField("Time", message.createdAt)
		.addField("Reason", kReason);

		let incidentchannel = message.guild.channels.find(`name`, "incidents")
		if (!incidentchannel) return message.channel.send("Could not find incidents channel.");

		message.guild.member(kUser).kick(kReason);
		incidentchannel.send(kickEmbed);

		return ;
	}

	if (command === `${prefix}report`){

		let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if (!rUser) return message.channel.send("Unidentified User!");
		let reason = args.join(" ").slice(22);

		let reportembed = new Discord.RichEmbed()
		.setDescription("Reports")
		.setColor("#ff0000")
		.addField("Reported User", `${rUser} with ID: ${rUser.id}`)
		.addField("Reported By", `${message.author} with ID: ${message.author.id}`)
		.addField("Channel", message.channel)
		.addField("Time", message.createdAt)
		.addField("Reason", reason);

		let reportchannel = message.guild.channels.find(`name`, "reports")
		if (!reportchannel) return message.channel.send("Could not find report channel.");

		message.delete().catch(O_o=>{})
		reportchannel.send(reportembed);

		return;
	}

	if (command === `${prefix}serverinfo`){

		let sicon = message.guild.iconURL;
		let serverembed = new Discord.RichEmbed()
		.setDescription("Server Information")
		.setColor("#75efaa")
		.setThumbnail(sicon)
		.addField("Server Name", message.guild.name)
		.addField("Server Created", message.guild.createdAt)
		.addField("You Joined", message.member.joinedAt)
		.addField("Total Members", message.guild.memberCount);

		return message.channel.send(serverembed);
	}

	if (command === `${prefix}botinfo`){

		let bicon = bot.user.displayAvatarURL;
		let botembed = new Discord.RichEmbed()
		.setDescription("Bot Information")
		.setColor("#75efaa")
		.setThumbnail(bicon)
		.addField("Bot Name", bot.user.username)
		.addField("Created On", bot.user.createdAt);

		return message.channel.send(botembed);

	}

});

bot.login(tokenfile.token);
