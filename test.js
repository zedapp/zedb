/*global zedb, Promise */
var db;
zedb.delete("test").then(function() {
    return zedb.open("test", 1, function(db) {
        var store = db.createObjectStore("symbols", {
            keyPath: "id"
        });
        store.createIndex("path", "path", {
            unique: false
        });
        store.add({
            id: "ObjectStore~/app/js/db/db.js:10",
            name: "ObjectStore",
            locator: "10"
        });
        store.add({
            id: "FietsStore~/app/js/db/db.js:100",
            name: "FietsStore",
            locator: "100"
        });
        store.add({
            id: "HankStore~/app/js/db/db.js:12",
            name: "HankStore",
            locator: "12"
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
    for (var i = 0; i < 100; i++) {
        var sym = {
            id: "Symbol" + i,
            path: "/path/to/file.js"
        };
        promises.push(store.put(sym));
    }
    return Promise.all(promises);
}).then(function() {
    console.log("Yhere");
    return db.readStore("symbols").query(">=", "Sy", "<=", "Sy~", {
        limit: 10
    });
}).then(function(r) {
    console.log("All symbols starting with 'Sy'", r);
}).
catch (function(e) {
    console.error("Error", e.stack);
});
