var MediaDB = (function() {
	function MediaDB(mediaType, metadataParser, options) {
		EventManager.call(this);
		this.mediaType = mediaType;
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
		var that = this;
		asyncStorage.length(function(length) {
			for (let i = 0; i < length; i++) {
				asyncStorage.key(i, function(key) {
					if (key.startsWith('bookid_')) {
						asyncStorage.getItem(key, function(metadata) {
							for (var chapterNum in metadata) { 
								if (!isNaN(parseInt(chapterNum))) {
									var chapter = metadata[parseInt(chapterNum)];
									that.mediaType.testForFile(chapter.path).then((exists) => {
										if (exists) {
											callback({name: chapter.path, metadata: metadata});
										} else {
											console.log('deleting chapter' + chapterNum + 'of book ' + key);
											asyncStorage.getItem(key, book => {
												delete book[chapterNum]
												asyncStorage.setItem(key, book);
												// TODO: delete entire item if
												// is empty
												});
										}
									});
								}
							};
						});
					}
				});
			}
		});
	}
	return MediaDB
}());
