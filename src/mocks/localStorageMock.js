let store = {};

const localStorageMock = {
    getItem: function (key) {
        return store[key];
    },
    setItem: function (key, value) {
        store[key] = value.toString();
    },
    clear: function () {
        store = {};
    },
    removeItem: function (key) {
        delete store[key];
    },
    register: function() {
        if (!window.localStorage) {
            window.localStorage = localStorageMock;
        }
    }
};

export default localStorageMock;
