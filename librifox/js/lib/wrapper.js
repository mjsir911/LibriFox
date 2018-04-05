var MediaDB = (function() {
	function MediaDB(mediaType, metadataParser, options) {
		EventManager.call(this);
		this.metadataParser = metadataParser
	}
	MediaDB.prototype = Object.create(EventManager.prototype);
	MediaDB.prototype.addEventListener = function(event_name, callback) { 
		if (!(event_name in this.events)) {
			this.registerEvent(event_name);
		}
		this.on(event_name, callback);
	}
    //    name: // the filename
    //    type: // the file type
    //    size: // the file size
    //    date: // file mod time
    //    metadata: // whatever object the metadata parser returns
	MediaDB.prototype.enumerate = function(callback) { 
		// Iterate through all media files in the directory
		// do callback on any media file in the directory {'name': path_of_file, 'metadata': something?}
		asyncStorage.length(function(length) {
			for (let i = 0; i < length; i++) {
				asyncStorage.key(i, function(key) {
					if (key.startsWith('bookid_')) {
						asyncStorage.getItem(key, function(metadata) {
							console.log(metadata);
						});
					}
				});
		}
		});
		console.log(asyncStorage);
		callback({name: '/home/phablet/.local/share/cordova-ubuntu/persistent/librifox/app_dl/1268/0.lfa', 'metadata': {}});

	}
	return MediaDB
}());
