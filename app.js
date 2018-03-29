const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings_example.json');

client.on('ready',() => {
	console.log('I\'m Online\nI\'m Online');
});

var prefix = "!"
client.on('message', message => {
	if (message.author === client.user) return;
	if(message.channel.name != 'bot') return;
	if (message.content.startsWith(prefix + 'pps')) {
		str = message.content.split(" ");
		
		if (str.length > 3){
			points = str[1];
			
			if (points.slice(-1) == 'k'){
				points = points.slice(0, -1) * 1000;
			}
			
			time = str[2];
			num_ppl = str[3];
			
			split = num_ppl.split('+')[0];

			t_array = time.split(':');
			min = t_array[0];
			sec = t_array[1];
			
			t_sec = Number(min)*60+Number(sec);
			pps = points/t_sec/split;
			pps = Math.round(pps * 100) / 100;
			message.channel.send(pps.toString()+ " points per second");
			
			const fs = require('fs');
			
			if (str[4] == 'save'){
				fs.appendFileSync('points.txt', pps + '|' + points + '|' + time + '|' + num_ppl + '\n');
			}
		}
	}
	
	if (message.content.startsWith(prefix + 'list')) {
		const fs = require('fs');
		
		
		message.channel.send('Points per second | Points | Time | Size');
		list = fs.readFileSync('points.txt', 'utf8');

		message.channel.send(list);
		
	}
	
	if (message.content.startsWith(prefix + 'best')) {
		const fs = require('fs');
		list = fs.readFileSync('points.txt', 'utf8');
		
		lines = list.split('\n');
		pps = [];
		sizes = [];
		for (var i = 0; i < lines.length -1; i++) {
		  pps.push(lines[i].split("|")[0]);
		  sizes.push(lines[i].split("|")[3]);
		}
		
		for (i = 0; i<pps.length; i++){pps[i] = +pps[i];}
		message.channel.send('Points per second | Points | Time | Size');
		
		str = message.content.split(" ");
		
		if (str.length > 1){
			size_unique = [str[1]];
			console.log(size_unique);
		}
		else{
			size_unique = Array.from(new Set(sizes));
		}
		index_best = [];
		for (var i = 0; i < size_unique.length; i++) {
			si = size_unique[i];
			pp_all = [];
			lines_all = [];
			for (var j = 0; j < sizes.length; j++) {
				if (sizes[j] == si){
					pp_all.push(pps[j]);
					lines_all.push(lines[j]);
				}
			}
			
			var ind = pp_all.indexOf(Math.max(...pp_all));
			if ( ind > -1){
				message.channel.send(lines_all[ind]);
			}
		}
		
		
	}
	if (message.content.startsWith(prefix + 'help')) {
		console.log(message);
		//message.channel.send('!pps points time size [save]');
		//message.channel.send('!list');
		//message.channel.send('!best [size]');
	}
	
});

client.login(process.env.TOKEN);
