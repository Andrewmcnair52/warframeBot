const getJson = require('../scripts/getJson.js');
const fs = require("fs");

exports.run = (client, message, args) => {
	
	var out;
	getJson('https://api.warframestat.us/weapons').then((obj) => {
    	var weapon, query;
    	out = '<!DOCTYPE html>\n<html>\n<head>\n<style>\np.a {\n	"Courier New", Courier, monospace;\n}\n</style>\n</head>\n<body>\n'
    	out += `<p style="white-space: pre;font-family: 'Courier New', Courier, monospace">\n`
    	out += '-------|  DAM  |  DPS  |  ACC  |  REL  |  MAG  |  STA  |CRI %/X|  PRO  <br>'
    	
    	for(var i=0; args[i]; i++) {
    		weapon = null;
    		for(var j=0; j<obj.length; j++) {
    			query = args[i].replace(/_/g, " ");
    			if(query.toLowerCase() === obj[j].name.toLowerCase()) {
    				weapon = obj[j];
    				j = obj.length;
    			}
    		}
    		if(weapon) {
    			
    			var name;
    			if(weapon.name.length>7) {
    				name = weapon.name.substr(0,6);
    			} else name = weapon.name;
    			var dam = String(weapon.damage);
    			var dps = String(Math.round(weapon.damagePerSecond*10)/10);
    			var acc = String(Math.round(weapon.accuracy*10)/10);
    			var rel = String(Math.round(weapon.reloadTime*10)/10)+'s'; 
    			var mag = String(Math.round(weapon.magazineSize*10)/10);
    			var sta = String(Math.round(weapon.procChance*100))+'%';
    			var cri = String(Math.round(weapon.criticalChance*100))+'/'+String(weapon.criticalMultiplier);
    			var fli = weapon.projectile;
    			
    			var fields = [name,dam,dps,acc,rel,mag,sta,cri];
    			
    			for(var k=0; k<fields.length; k++) {
    				out += fields[k];
    				for(var l=7-fields[k].length; l>0; l--) out += ' ';
    				out += '|';
    			}
    			out += fli+'<br>';	
    			
    		} else {
    			out = 'weapon doesnt exist';
    			break;
    		}
    	}
    	if(out !== 'weapon doesnt exist') {
    		out += '\n</p>\n</body>\n</html>';
    		fs.writeFile('./data/table.html', out, (err) => {
              		if (err) throw err;
               	message.channel.send('Weapon comparison complete', {
  					files: ["./data/table.html"]
				})
           	});
			} else message.channel.send(out);
    });
	
}
