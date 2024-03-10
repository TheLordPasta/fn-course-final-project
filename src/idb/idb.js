import { keyboard } from "@testing-library/user-event/dist/keyboard";

window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;
if (!window.indexedDB) {
  console.log("The browser doesn't support IndexedDB");
}

const request = indexedDB.open("CostsDataBase", 1);

request.onerror = function (event) {
  console.error("an error accurred with indexedDB");
  console.error(event);
};

request.onupgradeneeded = function () {
  const db = request.result;
  const store = db.createObjectStore("costs", { keyPath: "name" });
  store.createIndex("cost_month", ["month"], { unique: false });
  store.createIndex("cost_year", ["year"], { unique: false });
  store.createIndex("cost_value", ["value"], { unique: false });
  store.createIndex("cost_desc", ["desc"], { unique: false });
};
