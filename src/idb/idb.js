// Ensure IndexedDB compatibility across different browsers
window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

if (!window.indexedDB) {
  console.log("This browser doesn't support IndexedDB");
} else {
  window.idb = {
    async openCostsDB(name, version) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, version);

        request.onerror = (event) => {
          console.error("An error occurred with IndexedDB", event);
          reject(event);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("costs")) {
            const store = db.createObjectStore("costs", {
              keyPath: "id",
              autoIncrement: true,
            });
            // Assuming costs items will now include 'month' and 'year' for indexing
            store.createIndex("month_and_year", ["month", "year"], {
              unique: false,
            });
          }
        };

        request.onsuccess = (event) => {
          const db = event.target.result;

          // Enhance the db object with additional methods
          db.addCost = async function (item) {
            return new Promise((resolve, reject) => {
              if (!this.isValidCostItem(item)) {
                console.error("Invalid cost item:", item);
                reject("Invalid cost item");
                return;
              }
              const transaction = this.transaction(["costs"], "readwrite");
              const store = transaction.objectStore("costs");
              const request = store.add(item);

              request.onsuccess = () => resolve("Cost item added successfully");
              request.onerror = (event) => {
                console.error("Error adding cost item", event);
                reject("Error adding cost item");
              };
            });
          };

          // Attaching isValidCostItem to the db object, but it could also be a standalone function since it doesn't use 'this'
          db.isValidCostItem = function (item) {
            const validCategories = [
              "FOOD",
              "HEALTH",
              "EDUCATION",
              "TRAVEL",
              "HOUSING",
              "OTHER",
            ];
            return (
              validCategories.includes(item.category) &&
              typeof item.sum === "number" &&
              item.sum > 0 &&
              typeof item.description === "string" &&
              item.description.trim() !== ""
            );
          };

          resolve(db);
        };
      });
    },
  };
}
