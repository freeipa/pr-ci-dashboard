// A module for fetching and parsing junit XML file into JavaScript object
// structure.
//
// Fetches the file base on Job ID from default PR-CI test results server

// TODO: make it configurable
export const DEFAULT_SERVER = "http://freeipa-org-pr-ci.s3-website.eu-central-1.amazonaws.com";
export const JOBS_DIR = "jobs";
export const TEST_RESULTS_FILE= "junit.xml.gz";

function parseFloatAttr(element, attrName, defaultValue) {
    return parseNumAttr(parseFloat, element, attrName, defaultValue);
}

function parseIntAttr(element, attrName, defaultValue) {
    return parseNumAttr(parseInt, element, attrName, defaultValue);
}

function parseNumAttr(func, element, attrName, defaultValue) {
    if (element === null || element === undefined) return defaultValue;

    let val = func(element.getAttribute(attrName), 10);

    if (isNaN(val)) {
        val = defaultValue
    }
    return val;
}

function parseTextAttr(element, attrName, defaultValue) {
    if (element === null || element === undefined) return defaultValue;
    let val = element.getAttribute(attrName);
    if (typeof(val) === "string") {
        val = val.trim();
    } else {
        val = defaultValue;
    }
    return val;
}

function parse_testsuite(xml) {
    // parse testsuite
    var element = xml.getElementsByTagName('testsuite')[0];
    if (element === undefined) return null;
    const testsuite = {
        time: parseFloatAttr(element, 'time'),
        tests: parseIntAttr(element, 'tests'),
        skips: parseIntAttr(element, 'skips'),
        name: parseTextAttr(element, 'name'),
        failures: parseIntAttr(element, 'failures'),
        errors: parseIntAttr(element, 'errors'),
        testcases: []
    };

    // parse cases
    const cases = xml.getElementsByTagName('testcase');
    for(let i=0, j=cases.length; i < j; i++) {
        let caseEl = cases[i];
        testsuite.testcases.push(parse_testcase(caseEl))
    }

    return testsuite;
}

function parse_testcase(element) {
    const testcase = {
        time: parseFloatAttr(element, 'time'),
        name: parseTextAttr(element, 'name'),
        line: parseIntAttr(element, 'line'),
        file: parseTextAttr(element, 'file'),
        classname: parseTextAttr(element, 'classname')
    };
    let failures = element.getElementsByTagName("failure");
    if (failures.length > 0) {
        let failure = failures[0];
        testcase.failure = {
            message: parseTextAttr(failure, 'message'),
            text: failure.textContent.trim()
        }
    }
    let errors = element.getElementsByTagName("error");
    if (errors.length > 0) {
        let error = errors[0];
        testcase.error = {
            message: parseTextAttr(error, 'message'),
            text: error.textContent.trim()
        }
    }
    return testcase;
}

/**
 * Read content of jUnit XML file and return it in form of object with structure
 * matching the XML file: elements are objects, child elements are array
 * attributes. Element attributes are object attributes.
 *
 * @param {string} xml_text content of jUnit XML file
 */
export function read_junit_xml(xml_text) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml_text, "text/xml")
    const testcases = parse_testsuite(doc);
    return testcases;
}

/**
 * Create test URL for Job's test results pointing to a default server
 * @param {string} job_id
 */
export function create_test_results_url(job_id) {
    return [
        DEFAULT_SERVER,
        JOBS_DIR,
        job_id,
        TEST_RESULTS_FILE
    ].join('/');
}

function fetch_xml(url) {
    const r = new Request(url);
    const init_obj = { method: "GET", mode: "cors" };
    const xml_promise = window.fetch(r, init_obj)
        .then(response => response.text());
    return xml_promise;
}

/**
 * Fetch test job results from Web
 *
 * Parses the XML file and return it as object, structure is described in
 * "can parse the xml well" test.
 *
 * @param {string} job_id job ID or full link to junit.xml
 */
export function fetch_test_results(job_id) {
    // prepare URL
    let url = job_id;
    if (!job_id.includes('://')) {
        url = create_test_results_url(job_id)
    }

    return new Promise ((resolve, reject) => {
        // fetch the XML file
        fetch_xml(url).then(
            text => {
                let jobs;
                try {
                    // convert XML to JSON
                    jobs = read_junit_xml(text);
                } catch (error) {
                    // handle conversion errors
                    reject(error);
                }
                resolve(jobs);
            }
        // handle network errors
        ).catch(error => reject(error));
    });
}
