// reference: https://developer.github.com/v4/enum/statusstate/
export const ERROR = 'ERROR'
export const EXPECTED = 'EXPECTED'
export const FAILURE = 'FAILURE'
export const PENDING = 'PENDING'
export const SUCCESS = 'SUCCESS'
export const ALLSTATES = [ERROR, EXPECTED, FAILURE, PENDING, SUCCESS]

export const iconMap = {
    [ERROR]: 'pficon pficon-error-circle-o',
    [EXPECTED]: 'fa fa-check',
    [FAILURE]: 'pficon pficon-error-circle-o',
    [PENDING]: 'pficon pficon-in-progress',
    [SUCCESS]: 'pficon pficon-ok'
}

export const WORDING = {
    [ERROR]: {
        1: 'Error',
        many: 'Errors'
    },
    [EXPECTED]: {
        many: 'Expected'
    },
    [FAILURE]: {
        1: 'Failure',
        many: 'Failures'
    },
    [PENDING]: {
        many: 'Pending'
    },
    [SUCCESS]: {
        many: 'Succeeded'
    }
}

export function getWording(state, count) {
    return WORDING[state][count] || WORDING[state].many;
}

export function getStatusMap(statuses) {
    let statusMap = {};
    for (let state of ALLSTATES) statusMap[state] = [];
    for (let status of statuses) {
        statusMap[status.state].push(status);
    }
    return statusMap
}