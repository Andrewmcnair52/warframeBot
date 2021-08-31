const Discord = require("discord.js");
const getJson = require('./getJson.js');
const getExpiry = require('./getExpiry');


async function update(channel) {

	//channel.fetchMessages().then(messages => { messages.deleteAll(); });

    channel.fetchMessages().then( messages => {
        
        //delete all messages in channel (maximum of 100)
        channel.bulkDelete(messages);
        
        //display info
        getJson('https://api.warframestat.us/pc').then((obj) => {
        
        	events(channel, obj);				//display current events
        	cycles(channel, obj);				//display open world cycles
        	alerts(channel, obj);				//dispaly active alerts
        	invasions(channel, obj);		//display active invasions
        	arbitration(channel, obj);	//display arbitration info
        	voidtrader(channel, obj)		//display void trader info
        	steelPath(channel, obj);		//dispaly steel path rotation
        	
       	});
        
    }).catch((e) => { console.log("exception thrown while fetching messages\n"+e) });
    

}
function events(channel, obj) {	//to b added in the future

	//console.log(obj.events);		cant debug rn, no events active, 

}

function steelPath(channel, obj) {
	
	var out = "```\n-= Steel Path Rotation =-\n";
	out += "current reward: " + obj.steelPath.currentReward.name + "\n";
	out += "price: " + obj.steelPath.currentReward.cost + " steel essence\n"
	out += "expires: " + getExpiry(obj.steelPath.expiry) + "\n";
	
	out += '```';
  channel.send(out);
	
}

function invasions(channel, obj) {

	var out = "```\n-= Invasions =-\n";

	var invasions = obj.invasions;
  if(invasions.length<1) {
  	
  	out += "no invasions at this time\n";
  
  } else {
    
    var infested = new Array();
    invasions.forEach( inv => {
    	if(inv.desc === "Infested Outbreak") infested.push(inv.defenderReward.itemString);
    	else out += inv.desc+": "+inv.defenderReward.itemString+" || "+inv.attackerReward.itemString+"\n"; 
    });
    
    if(infested.length>0) {
      out += "Infested Outbreak: ";            
      infested.forEach( inf => { out += inf+", "; });
      out = out.substr(0,out.length-2);
    }
    
  }
  
  out += '```';
  channel.send(out);

}

function voidtrader(channel, obj) {

	var out = "```\n-= Void trader Info =-\n";
	
	var vt = obj.voidTrader;
  out += "available: "+vt.active.toString()+"\n";
  out += "arrival: "+vt.startString+"\n";
  out += "departure: "+vt.endString+"\n";
  out += "location: "+vt.location+"\n";
  out += "inventory:\n"
  for(var i=0; i<vt.inventory.length; i++)
  	out += "	"+JSON.stringify(vt.inventory[i])+"\n";
  
  out += '```';
  channel.send(out);

}

function arbitration(channel, obj) {

	var out = "```\n-= Arbitration =-\n";
	
	out += obj.arbitration.type + ", expires in: " + getExpiry(obj.arbitration.expiry);
	
	out += "```"        
  channel.send(out);
	
}

function alerts(channel, obj) {

	var out = "```\n-= Alerts =-\n";

  if(obj.alerts.length<1) {
  	out += "no alerts at this time\n";
  } else {
    for(var i=0; i<obj.alerts.length; i++) {
    	 out += al[i].mission.reward.asString+" | expires: "+al[i].eta+" | "+al[i].mission.type+"("+al[i].mission.faction+")"+"\n";	
    }
  }
  
  out += "```"        
  channel.send(out);

}

function cycles(channel, obj) {

  var out = '```\n-= Cycles =-\n';
	
	if(obj.cetusCycle.isDay) out += "cetus time: [Day] expires in " + obj.cetusCycle.timeLeft + "\n";
	else out += "cetus time: Night expires in " + obj.cetusCycle.timeLeft + "\n";
  
  if(obj.vallisCycle.isWarm) out += "orb vallis cycle: [Warm] expires in " + obj.vallisCycle.timeLeft + "\n";
  else out += "orb vallis cycle: Cold expires in " + obj.vallisCycle.timeLeft + "\n";
  
  if(obj.cambionCycle.active=="fass") out += "cambion drift cycle: [Fass] expires in " + getExpiry(obj.cambionCycle.expiry) + "\n";
	else out += "cambion drift cycle: Vome expires in " + getExpiry(obj.cambionCycle.expiry) + "\n";
  
  out += "```";
  channel.send(out);


}



module.exports = update;
