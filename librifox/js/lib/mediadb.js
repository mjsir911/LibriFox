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

		var _this = this;
		// iterate over ~/AudioBooks
		// this is rushed
		LazyLoader.load('js/lib/blobview.js').then(() => {
			fileManager.walk("AudioBooks")(
				(entry) => entry.file((file) => {
					file.end = file.start + 10;
					fileManager.getBlobFromFile(file).then(
						(blob) =>  BlobView.get(blob, 0, 10,
							function (blobview, error) {
								blobview.seek(6);
								var size = blobview.readID3Uint28BE()
								entry.file((file) => {
									file.end = file.start + size;
									fileManager.getBlobFromFile(file).then(
										blob => _this.metadataParser(blob,
											(metadata) => callback({name: entry.fullPath.slice(1), metadata: metadata}),
											console.err
										)
									)
								})
							}
						)
					)
				})
			)
		})
	}

	return MediaDB
}());
