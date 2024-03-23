// Chen Moasis 318912805
// Ariel Shirkani 207267824
// Check if the browser supports IndexedDB
window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

// If IndexedDB is not supported, log a message
if (!window.indexedDB) {
  console.log("This browser doesn't support IndexedDB");
} else {
  window.idb = {
    // Asynchronously open the IndexedDB database
    async openCostsDB(name, version) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, version);

        // Handle errors during database opening
        request.onerror = (event) => {
          console.error("An error occurred with IndexedDB", event);
          reject(event);
        };

        // Handle database upgrade (e.g., creating object stores and indexes)
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("costs")) {
            const store = db.createObjectStore("costs", {
              keyPath: "id",
              autoIncrement: true,
            });
            store.createIndex("month_and_year", ["month", "year"], {
              unique: false,
            });
          }
        };

        // Handle successful database opening
        request.onsuccess = (event) => {
          const db = event.target.result;

          // Enhance the db object with additional methods
          db.addCost = async function (item) {
            // Method to add a cost item to the database
            return new Promise((resolve, reject) => {
              if (!db.isValidCostItem(item)) {
                console.error("Invalid cost item:", item);
                reject("Invalid cost item", item);
                return;
              }
              const transaction = db.transaction(["costs"], "readwrite");
              const store = transaction.objectStore("costs");
              const request = store.add(item);

              request.onsuccess = () => resolve("Cost item added successfully");
              request.onerror = (event) => {
                console.error("Error adding cost item", event);
                reject("Error adding cost item");
              };
            });
          };

          db.CostItemsReport = async function ({ month, year }) {
            // Method to fetch cost items report based on month and year
            return new Promise((resolve, reject) => {
              if (!db.isValidDate({ month, year })) {
                console.error("Invalid date:", { month, year });
                reject("Invalid date", { month, year });
                return;
              }

              const transaction = db.transaction(["costs"], "readonly");
              const store = transaction.objectStore("costs");
              const index = store.index("month_and_year");
              const range = IDBKeyRange.bound([month, year], [month, year]);
              const cursorRequest = index.openCursor(range);
              const results = [];

              cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                  results.push(cursor.value);
                  cursor.continue();
                } else {
                  resolve(results);
                }
              };

              cursorRequest.onerror = (event) => {
                console.error(
                  "Error searching by month and year:",
                  event.target.error
                );
                reject("Error searching by month and year");
              };
            });
          };

          db.yearlyCostSummaryByCategory = async function (year) {
            // Method to calculate yearly cost summary by category
            const monthlySummaries = new Array(12).fill(null).map(() => ({
              FOOD: 0,
              HEALTH: 0,
              EDUCATION: 0,
              TRAVEL: 0,
              HOUSING: 0,
              OTHER: 0,
            })); // Initialize an array for 12 months with categories starting at 0

            for (let month = 1; month <= 12; month++) {
              try {
                const monthlyCosts = await this.CostItemsReport({
                  month,
                  year,
                });
                monthlyCosts.forEach((item) => {
                  monthlySummaries[month - 1][item.category] += item.sum;
                });
              } catch (error) {
                console.error(
                  `Error processing costs for month ${month} of year ${year}:`,
                  error
                );
              }
            }

            return monthlySummaries;
          };

          db.isValidCostItem = function (item) {
            // Method to validate a cost item
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

          db.isValidDate = function (item) {
            // Method to validate a date object
            return (
              typeof item.month == "number" &&
              item.month >= 1 &&
              item.month <= 12 &&
              typeof item.year == "number" &&
              item.year >= 1990 &&
              item.year <= 2038
            );
          };

          resolve(db); // Resolve the promise with the enhanced db object
        };
      });
    },
  };
}
