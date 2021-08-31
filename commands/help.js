const getJson = require('../scripts/getJson.js');

exports.run = (client, message, args) => {
	
	var out = '-= prefix every command with a mention =-\n';
	out += 'cmp: comapre weapons, cmp <weapon1> <weapon2> ...\n';
	
	message.channel.send(out);
	
	
}
