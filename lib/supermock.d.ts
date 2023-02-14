import supertest from 'supertest';
import express from 'express';
interface Handler {
    app?: express.Application;
    handler?: express.Handler;
    router?: express.Router;
}
/**
 * Registers a new api mock
 * @param url host to mock
 * @param param1 app, handler, or router
 * @returns void
 */
export declare function mock(url: string, { app, handler, router }: Handler): void;
/**
 * Clears all API mocks.
 * @returns void
 */
export declare function clearAll(): void;
export interface Supermock {
    [method: string]: (url: string | URL, callback?: supertest.CallbackHandler) => supertest.Test;
    (method: string, url: string | URL): supertest.Test;
}
/**
 * @param method method
 * @param url url
 * @returns same as supertest(method, url)
 */
export declare const supermock: Supermock;
export {};
