
const API_URL = 'https://pagure.io/api/0';
const FREEIPA_PROJECT = 'freeipa';
const TEST_FAILURE_TAG = 'test-failure';
const OPEN = 'Open';
const PAGURE_URL = 'https://pagure.io';

export function issueUrl(issue) {
    return `${PAGURE_URL}/${FREEIPA_PROJECT}/issue/${issue.id}`;
}

export function milestoneUrl(milestone) {
    return `${PAGURE_URL}/${FREEIPA_PROJECT}/roadmap/${milestone}`;
}

export async function getIssues(project, status, tag) {
    const url = `${API_URL}/${project}/issues?status=${status}&tags=${tag}`;
    let out = null;
    try {
        const response = await window.fetch('/api/pagure/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        if (response.ok) {
            out = await response.json();
            out = out.issues;
        }
    } catch (err) {
        window.console.error(err);
    }
    out = out || [];
    return out;
}

export async function getReportedFailures() {
    return getIssues(FREEIPA_PROJECT, OPEN, TEST_FAILURE_TAG);
}

export function getCustomFieldValue(issue, fieldName) {
    for (let i = 0, l = issue.custom_fields.length; i < l; i += 1) {
        const field = issue.custom_fields[i];
        if (field.name === fieldName) {
            return field.value;
        }
    }
    return null;
}

export default getReportedFailures;
