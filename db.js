var fs = require('fs');
var sys = {
	read: fs.readFileSync,
	write: fs.writeFileSync,
	makeDir: fs.mkdirSync
};

function db(name, acc){
	this.name = name;
	this.acc = acc || 1;
	try {
		sys.makeDir(__dirname + '/storage/' + name);
	} catch(exc) {

	}
}
db.prototype.set = function db_set(key, val, route){
	try {
		var json = JSON.parse(sys.read(this.route(key)));
	}catch(e){
		var json = {};
	}
	json[key] = val;

	sys.write(route || this.route(key), JSON.stringify(json));
}
db.prototype.remove = function db_remove(key, route){
	try {
		var json = JSON.parse(sys.read(this.route(key)));
	}catch(e){
		var json = {};
	}
	delete json[key];
	sys.write(route || this.route(key), JSON.stringify(json));
}
db.prototype.route = function db_route(x){
	var n = x.substring(0, this.acc);
	if(n.indexOf(/\\\/\?\"\<\>\|/) !== -1) return __dirname + '/storage/' + this.name +'.default';
	return __dirname + '/storage/' + this.name + '/' + n;
}
db.prototype.get = function db_get(key){
	try {
		var data = JSON.parse(sys.read(this.route(key)));
		return data && data[key];
	}catch(e){

	}
}
db.prototype.clean = function db_clean(){
	var mydir = __dirname + '/storage/' + this.name;

	var files = sys.filesForDirectory(mydir);
	for(var i=0, l=files.length;i<l;i++) sys.rm(mydir+'/'+files[i]);
}

module.exports = db;