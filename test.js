/*global zedb, Promise */
var db;
zedb.delete("test").then(function() {
    return zedb.open("test", 1, function(db) {
        console.log("Creating/upgrading data store");
        // if (db.getObjectStoreNames().contains("todo")) {
        //     db.deleteObjectStore("todo");
        // }

        var symbolStore = db.createObjectStore("symbols", {
            keyPath: "id"
        });

        symbolStore.createIndex("predIdn", "predIdn", {
            unique: false
        });
        symbolStore.createIndex("path", "path", {
            unique: false
        });

        symbolStore.add({
            id: "Index~/app/js/db/db.js:10",
            name: "Index",
            path: "/app/js/db/db.js"
        });
        symbolStore.add({
            id: "ObjectStore~/app/js/db/db.js:10",
            name: "ObjectStore",
            path: "/app/js/db/db.js"
        });
        symbolStore.add({
            id: "Database~/app/js/db/db.js:10",
            name: "Database",
            path: "/app/js/db/db.js"
        });
    });
}).then(function(db) {
    window.db = db;
    console.log("Database open.");
    return db.readStore("symbols").getAll().then(function(r) {
        console.log("All symbols", r);
    });
}).then(function() {
    return db.readStore("symbols").get("ObjectStore~/app/js/db/db.js:10").then(function(r) {
        console.log("Single lookup", r);
    });
}).then(function() {
    var promises = [];
    var store = db.writeStore("symbols");
    for(var i = 0; i < 100; i++) {
        var sym = {
            id: "Symbol" + i,
            path: "/path/to/file.js"
        };
        promises.push(store.put(sym));
    }
    return Promise.all(promises);
}).then(function() {
    return db.readStore("symbols").query(">=", "Sy", "<=", "Sy~").then(function(r) {
        console.log("All symbols starting with 'Sy'", r);
    });
}).catch (function(e) {
    console.error("Error", e);
});
