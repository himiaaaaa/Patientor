"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const patients_1 = __importDefault(require("../../data/patients"));
const uuid_1 = require("uuid");
const getPatient = () => {
    return patients_1.default;
};
const getNoSsnPatient = () => {
    return patients_1.default.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
        entries
    }));
};
const getPatientForOne = (id) => {
    return patients_1.default.find(p => p.id === id);
};
const addPatient = (entry) => {
    const id = (0, uuid_1.v1)();
    const newPatient = Object.assign({ id }, entry);
    patients_1.default.push(newPatient);
    return newPatient;
};
const addEntry = (patient, entry) => {
    const id = (0, uuid_1.v1)();
    const newEntry = Object.assign({ id }, entry);
    patient.entries.push(newEntry);
    return newEntry;
};
exports.default = {
    getPatient,
    getNoSsnPatient,
    addPatient,
    getPatientForOne,
    addEntry
};
