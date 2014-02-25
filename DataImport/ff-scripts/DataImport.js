var print = print;
var require = require;
var exports = exports;

var ff = require('ffef/FatFractal');
var io = require('io');
exports.simpleImport = function() {
    //
    // Let's restrict execution of this code to the 'system' user only
    if (ff.getActiveUser().guid != "system")
        throw {statusCode:403, statusMessage:"Nope"};

    var stream = new io.Stream(ff.getExtensionRequestData().httpContent);
    var byteString = stream.read();
    var jsonString = byteString.decodeToString("UTF-8");
    print("Got JSON :" + jsonString);

    var data = JSON.parse(jsonString);

    var numCreated = 0;
    for (var i = 0; i < data.length; i++) {
        var objToCreate = data[i];

        // If you have a primary key in the data, and it's not already called 'guid', then set the 'guid' like this:
        //     objToCreate.guid = objToCreate.somePrimaryKey
        // and you probably want to remove 'somePrimaryKey' from the data
        //     delete objToCreate.somePrimaryKey

        // You always need a 'clazz'
        objToCreate.clazz='Thing';

        // Seeing as we're doing a batch import, then if an object with this key already exists
        // we should log a message, NOT create the object, and carry on
        var collectionName = "/Thing";
        if (ff.getObjFromUri(collectionName + "/" + objToCreate.guid)) {
            ff.logger.forceInfo("Object with guid " + objToCreate.guid + " already exists in collection " + collectionName);
            continue;
        }

        // Finally, let's create the object in some collection
        objToCreate = ff.createObjAtUri(objToCreate, collectionName);
        numCreated++;
    }

    ff.response().statusMessage = "Created " + numCreated + " objects";
};

