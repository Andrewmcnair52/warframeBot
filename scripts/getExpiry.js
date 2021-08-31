
//get expiry time and format as string
function getExpiry(expiryString) {

	var milliExpiry =  Math.abs( new Date(expiryString) - new Date() );	//get number of milliseconds till expiry
	
  var out = '';
  
  if(milliExpiry>=86400000) out += Math.floor(milliExpiry/86400000) + "d ";
  milliExpiry = milliExpiry % 86400000;
  
  if(milliExpiry>=3600000) out += Math.floor(milliExpiry/3600000) + "h ";
  milliExpiry = milliExpiry % 3600000;
  
  if(milliExpiry>=60000) out += Math.floor(milliExpiry/60000) + "m ";
  milliExpiry = milliExpiry % 60000;
  
  out += Math.floor(milliExpiry/1000) + "s ";

	return out;

}




module.exports = getExpiry;
