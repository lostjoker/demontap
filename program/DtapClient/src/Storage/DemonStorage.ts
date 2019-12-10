// TypeScript file

namespace DemonStorage {

    export namespace DemonKV {

        export function put(key, value) {
            return localforage.setItem(key, value);
        }

        export function get(key) {
            return localforage.getItem(key);
        }
    }




    let _init = false;
    export function init() {
        if (_init) return;
        _init = true;

        localforage.config({
            name: 'DemonForage',
            version: 1.0,
            storeName: 'DemonKV', // Should be alphanumeric, with underscores.
        });
    }
}
