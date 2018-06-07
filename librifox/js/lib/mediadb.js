var MediaDB = (function() {
	function MediaDB(mediaType, metadataParser, options) {
		EventManager.call(this);
		this.mediaType = mediaType;
		this.metadataParser = metadataParser
		this.fileManager = options.fileManager

	}
	MediaDB.prototype = Object.create(EventManager.prototype);
	MediaDB.prototype.addEventListener = function(event_name, callback) { 
		if (!(event_name in this.events)) {
			this.registerEvent(event_name);
		}
		this.on(event_name, callback);
	}
	

	this.walk = function(fileSystem) {
		return new Promise((resolve, reject) => fileSystem.createReader().readEntries(resolve, reject));
	}
    //    name: // the filename
    //    type: // the file type
    //    size: // the file size
    //    date: // file mod time
    //    metadata: // whatever object the metadata parser returns
	MediaDB.prototype.enumerate = function(callback) { 
		var that = this;
		// Iterate over librifox installed books
		asyncStorage.length(function(length) {
			for (let i = 0; i < length; i++) {
				asyncStorage.key(i, function(key) {
					if (key.startsWith('bookid_')) {
						asyncStorage.getItem(key, function(metadata) {
							Object.keys(metadata).forEach(chapterNum => {
								if (!isNaN(parseInt(chapterNum))) {
									var chapter = metadata[parseInt(chapterNum)];
									that.mediaType.testForFile(chapter.path).then((exists) => {
										if (exists) {
											console.log(chapter, metadata);
											callback({name: chapter.path, metadata: metadata});
										} else {
											/*
											asyncStorage.getItem(key, book => {
												delete book[chapterNum]
												asyncStorage.setItem(key, book);
												//that.trigger('deleted');
												// TODO: delete entire item if
												// is empty
												});
											*/
										}
									});
								}
							});
						});
					}
				});
			}
		});

		// iterate over ~/AudioBooks
		// this is rushed
		fileManager.walk("AudioBooks").then(
			(entries) => entries.forEach(
				(entry) => entry.file((file) => {
					file.end = file.start + 10000; console.log(file); console.log(entry); fileManager.getBlobFromFile(file).then(
						(blob) => this.metadataParser(blob, 
							(metadata) => {
								callback({name: entry.fullPath.slice(1), metadata: metadata})
							}
							, console.log)
					)
				})
			)
		)

	}
	return MediaDB
}());
