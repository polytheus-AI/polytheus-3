class Memory {

    /*
    * Initializes the database for the first time.
     */
    static Onboarding(){
        this.createTypeOfTool(["CSS", "HTML", "JavaScript"]);
        setTimeout(() => {
            this.deleteTypeOfTool(["CSS", "HTML", "JavaScript"]);
        }, 1000);
    }

    /*
    * @param {string|string[]} name
    * Creates a new type of tool in the database.
    * For this the function creates one or many new object store in the database.
    * A object store is named after the name of the tool.
    * A object store is created with a key path of "id".
    * A object store is created with a key generator of "autoIncrement".
     */
    static createTypeOfTool(name){


        // Use a timestamp to ensure the version is always higher, triggering an upgrade.
        const request = indexedDB.open("tools", Date.now());

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if(Array.isArray(name)){
                name.forEach(element => {
                    if (!db.objectStoreNames.contains(element)) {
                        db.createObjectStore(element, { keyPath: "id", autoIncrement: true });
                    }
                });
            }else{
                if (!db.objectStoreNames.contains(name)) {
                    db.createObjectStore(name, { keyPath: "id", autoIncrement: true });
                }
            }
        };

        request.onsuccess = (event) => {
            // Close the connection immediately so future upgrades aren't blocked.
            event.target.result.close();
        };
    }

    /*
    * @param {string | string[]} name
    * Deletes one or many type of tool from the database.
     */
   static deleteTypeOfTool(name){
    const request = indexedDB.open("tools", Date.now());

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if(Array.isArray(name)){
            name.forEach(element => {
                if (db.objectStoreNames.contains(element)) {
                    db.deleteObjectStore(element);
                }
            });
        }else{
            if (db.objectStoreNames.contains(name)) {
                db.deleteObjectStore(name);
            }
        }
    };

    request.onsuccess = (event) => {
        // Close the connection immediately so future upgrades aren't blocked.
        event.target.result.close();
    };
   }
}

export default Memory;
