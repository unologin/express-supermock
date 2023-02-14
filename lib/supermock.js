"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supermock = exports.clearAll = exports.mock = void 0;
var supertest_1 = __importDefault(require("supertest"));
var express_1 = __importDefault(require("express"));
var methods_1 = __importDefault(require("methods"));
// all registered api mocks
var mocks = [];
/**
 * Registers a new api mock
 * @param url host to mock
 * @param param1 app, handler, or router
 * @returns void
 */
function mock(url, _a) {
    var app = _a.app, handler = _a.handler, router = _a.router;
    if (!app) {
        app = (0, express_1.default)();
        app.use(handler || router || (function () { }));
    }
    mocks.push({ supertest: (0, supertest_1.default)(app), host: url });
}
exports.mock = mock;
/**
 * Clears all API mocks.
 * @returns void
 */
function clearAll() {
    mocks = [];
}
exports.clearAll = clearAll;
/**
 * @param method method
 * @param url url
 * @returns same as supertest(method, url)
 */
exports.supermock = function (method, url) {
    return exports.supermock[method.toLowerCase()](url);
};
var _loop_1 = function (method) {
    exports.supermock[method] = function (url, callback) {
        var _a = new URL(url.toString()), host = _a.host, pathname = _a.pathname, search = _a.search;
        for (var _i = 0, mocks_1 = mocks; _i < mocks_1.length; _i++) {
            var mock_1 = mocks_1[_i];
            if (mock_1.host === host) {
                return mock_1.supertest[method](pathname + search, callback)
                    .set('Host', host);
            }
        }
        throw new Error('no mock found for ' + host);
    };
};
// intercept all http methods
for (var _i = 0, _a = methods_1.default; _i < _a.length; _i++) {
    var method = _a[_i];
    _loop_1(method);
}
