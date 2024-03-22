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

          // Attaching isValidCostItem to the db object
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

          db.isValidDate = function (item) {
            return (
              typeof item.month == "number" &&
              item.month >= 1 &&
              item.month <= 12 &&
              typeof item.year == "number" &&
              item.year >= 1990 &&
              item.year <= 2038
            );
          };

          resolve(db);
        };
      });
    },
  };
}
