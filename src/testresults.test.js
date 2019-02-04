import {read_junit_xml, create_test_results_url, fetch_test_results,
        DEFAULT_SERVER, JOBS_DIR, TEST_RESULTS_FILE} from './testresults';

it('has well defined defaults', () => {
    var noEndSlash = /.+\/$/;
    var noStartSlash = /^^\/.+/;
    [DEFAULT_SERVER, JOBS_DIR, TEST_RESULTS_FILE].map(str => {
        expect(str).not.toMatch(noEndSlash);
        expect(str).not.toMatch(noStartSlash);
        return "";
    })
});

it('creates results url', () => {
    var jobID = 'abcde-1234-6789-fghijk-foo'
    var expectURL = DEFAULT_SERVER + '/' + JOBS_DIR + '/' + jobID + '/'
        + TEST_RESULTS_FILE;
    expect(create_test_results_url(jobID)).toEqual(expectURL);
});

it('fetches real test results - junit.xml', async() => {
    // this is not a greatest thing to have explicitely defined in tests
    // as the job can be deleted and the test needs to be changed
    var realJobId = '737d9902-dc8e-11e8-ba6e-fa163e9cc7bf'; // fedora-28/caless
    let xunitResult = await fetch_test_results(realJobId);
    expect(xunitResult.errors).toBe(0);
    expect(xunitResult.failures).toBe(0);
    expect(xunitResult.name).toBe("pytest");
    expect(xunitResult.skips).toBe(0);
    expect(xunitResult.tests).toBe(3);
    expect(xunitResult.time).toBeCloseTo(1432.027, 2);
    expect(xunitResult.testcases).toHaveLength(3);
});

it('can parse junit xml well', () => {
    let xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <testsuite time="12.33" tests="3" skips="0" name="mytest" failures="1" errors="1">
        <testcase time="6.2" name="success_test" line="3" file="success.py" classname="successClass"/>
        <testcase time="4.2" name="failing_test" line="10" file="fail.py" classname="failClass">
            <failure message="failure message">
                Long Failure Text
            </failure>
        </testcase>
        <testcase time="1.93" name="error_test" line="23" file="error.py" classname="errorClass">
            <error message="error message">
                Long Error Text
            </error>
        </testcase>
    </testsuite>
    `;
    let testsuite = {
        time: 12.33,
        tests: 3,
        skips: 0,
        name: "mytest",
        failures: 1,
        errors: 1,
        testcases: [
            {
                name: "success_test",
                time: 6.2,
                file: "success.py",
                line: 3,
                classname: "successClass"
            },
            {
                name: "failing_test",
                time: 4.2,
                file: "fail.py",
                line: 10,
                classname: "failClass",
                failure: {
                    message: "failure message",
                    text: "Long Failure Text"
                }
            },
            {
                name: "error_test",
                time: 1.93,
                file: "error.py",
                line: 23,
                classname: "errorClass" ,
                error: {
                    message: "error message",
                    text: "Long Error Text"
                }
            }

        ]
    };

    expect(read_junit_xml(xml)).toEqual(testsuite);
});

it('can parse poorly defined junit xml well', () => {
    let xml1 = `
    <?xml version="1.0" encoding="UTF-8"?>
    <testsuite time="1" tests="0" skips="0" name="mytest" failures="0" errors="">
    </testsuite>
    `;
    let res1 = {
        time: 1, tests: 0, skips: 0, name: "mytest", failures: 0,
        errors: undefined, testcases: []};
    expect(read_junit_xml(xml1)).toEqual(res1);

    let malformed = `
    <?xml version="1.0" encoding="UTF-8"?>
    <testsuite time="1" tests="0" skips="0" name="mytest" failures="0" errors="">
    `;
    expect(read_junit_xml(malformed)).toEqual(null);

    let empty = '<testsuite></testsuite>'
    expect(read_junit_xml(empty)).toEqual({testcases: []});

    // completely empty
    expect(read_junit_xml('')).toEqual(null);
});