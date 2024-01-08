"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const parseDescription = (description) => {
    if (!description || !isString(description)) {
        throw new Error('Incorrect ot missing description');
    }
    return description;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date;
};
const parseSpecialist = (specialist) => {
    if (!specialist || !isString(specialist)) {
        throw new Error('Incorrect or missing specialist');
    }
    return specialist;
};
const parseDiagnosisCodes = (object) => {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
        // we will just trust the data to be in correct form
        return [];
    }
    return object.diagnosisCodes;
};
const isNumber = (text) => {
    return typeof text === 'number' || text instanceof Number;
};
const isHealthCheckRating = (param) => {
    return Object.values(types_1.HealthCheckRating).includes(param);
};
const parseHealthCheckRating = (healthCheckRating) => {
    if (!healthCheckRating || !isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
        throw new Error('Incorrect or missing healthCheckRating: ' + healthCheckRating);
    }
    return healthCheckRating;
};
const parseSickLeave = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if ('startDate' in object
        && 'endDate' in object) {
        const sickLeave = {
            startDate: parseDate(object.startDate),
            endDate: parseDate(object.endDate)
        };
        return sickLeave;
    }
    throw new Error('Incorrect data: a field missing');
};
const parseEmployerName = (employerName) => {
    if (!employerName || !isString(employerName)) {
        throw new Error('Incorrect ot missing description');
    }
    return employerName;
};
const parseCriteria = (criteria) => {
    if (!criteria || !isString(criteria)) {
        throw new Error('Incorrect or missing criteria');
    }
    return criteria;
};
const parseDischarge = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if ('date' in object
        && 'criteria' in object) {
        const discharge = {
            date: parseDate(object.date),
            criteria: parseCriteria(object.criteria)
        };
        return discharge;
    }
    throw new Error('Incorrect data: a field missing');
};
const toNewEntry = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if ('description' in object
        && 'date' in object
        && 'specialist' in object) {
        const newBaseEntry = 'diagnosisCodes' in object ?
            {
                description: parseDescription(object.description),
                date: parseDate(object.date),
                specialist: parseSpecialist(object.specialist),
                diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes)
            }
            :
                {
                    description: parseDescription(object.description),
                    date: parseDate(object.date),
                    specialist: parseSpecialist(object.specialist)
                };
        if ('type' in object) {
            switch (object.type) {
                case 'HealthCheck':
                    if ('healthCheckRating' in object) {
                        const healthCheckEntry = Object.assign(Object.assign({}, newBaseEntry), { type: 'HealthCheck', healthCheckRating: parseHealthCheckRating(object.healthCheckRating) });
                        return healthCheckEntry;
                    }
                    throw new Error("Incorrect data: health check rating missing");
                case 'OccupationalHealthcare':
                    if ('employerName' in object) {
                        let occupationalHealthcareEntry;
                        'sickLeave' in object ?
                            occupationalHealthcareEntry = Object.assign(Object.assign({}, newBaseEntry), { type: 'OccupationalHealthcare', employerName: parseEmployerName(object.employerName), sickLeave: parseSickLeave(object.sickLeave) })
                            :
                                occupationalHealthcareEntry = Object.assign(Object.assign({}, newBaseEntry), { type: 'OccupationalHealthcare', employerName: parseEmployerName(object.employerName) });
                        return occupationalHealthcareEntry;
                    }
                    throw new Error("Incorrect data: employer name missing");
                case 'Hospital':
                    if ('discharge' in object) {
                        const hospitalEntry = Object.assign(Object.assign({}, newBaseEntry), { type: 'Hospital', discharge: parseDischarge(object.discharge) });
                        return hospitalEntry;
                    }
                    throw new Error("Incorrect data: discharge missing");
            }
        }
    }
    throw new Error('Incorrect data: a field missing');
};
exports.default = toNewEntry;
