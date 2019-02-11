import { fetchPullRequestsPaged } from '../../prlist';

// Number of PRS which are checked to be nightly runs
const SOURCE_PRS = 100;

// String to filter Pull Request title to get nightly runs
const NIGHTLY_FILTER = "Nightly PR";

const cache = {
    nighlies: [],
    types: [],
    map: [],
    output: null // this should be the only publicly visible
};

function resetCache() {
    cache.nighlies = [];
    cache.types = [];
    cache.map = [];
    cache.output = null;
}

/**
 * Fills cache.nightlies with new data
 */
async function loadNighlies() {
    cache.nighlies = await fetchPullRequestsPaged({
        numOfPrs: SOURCE_PRS,
        filter: NIGHTLY_FILTER
    });
    return cache.nighlies;
}

/**
 * Sets cache.types and cache.map based on data from cache.nightlies
 */
function processNighlies(cache) {
    let map = {};
    let types = [];

    // Group Nighlies by types
    for (let pr of cache.nighlies) {
        if (!map[pr.title]) {
            types.push(pr.title);
            map[pr.title] = {
                jobs: {},
                nightlies: []
            };
        }
        map[pr.title].nightlies.push(pr);
    }
    cache.map = map;
    cache.types = types;

    // Here would be ordering by date, but we assume it is already ordered
    // by GitHub

    // Group tests within types
    // Output is dict (typeMap) of arrays of the same jobs (status), key is a
    // job name (status.context)
    function addToTypeMap(position, jobs, status) {
        let name = status.context;
        if (!jobs[name]) jobs[name] = [];
        jobs[name][position] = status;
    }

    for (let type of types) {
        let typeMap = map[type];
        let nightlies = typeMap.nightlies;
        for (let i=0, l=nightlies.length; i<l; i++) {
            let nightly = nightlies[i];
            let statuses = nightly.commits.nodes[0].commit.status.contexts;
            for (let status of statuses) {
                addToTypeMap(i, typeMap.jobs, status);
            }
        }
        // fill gaps in jobs with explicit null so that even they are iterable
        let jobs = typeMap.jobs;
        for (let i=0, l=nightlies.length; i<l; i++) {
            for(let jobName in jobs) {
                jobs[jobName][i] = jobs[jobName][i] || null;
            }
        }
    }

    // final process
    // transform it into structure to enable:
    // nightlyType => test names => array of test results
    cache.output = {
        nightlies: cache.nighlies,
        nightlyTypes: []
    };
    let nts = cache.output.nightlyTypes;
    for (const type of types) {
        let jobs = [];
        let jobsIn = cache.map[type].jobs;

        for (const job in jobsIn) {
            jobs.push({
                name: job,
                results: jobsIn[job]
            });
        }

        nts.push({
            name: type,
            nightlies: cache.map[type].nightlies,
            jobs: jobs
        });
    }
    console.log(cache);
}

/**
 * Get recent Nightly runs in following structure:
 *
 * {
 *    nightlies: [Array of all Nighly PRs orderder by date]
 *    nightlyTypes: [Array]
 * }
 *
 * nightlyType: {
 *     name: [String]
 *     results: [Jobs]
 * }
 *
 * job: {
 *     name: [String]
 *     results: [Statuses]: Array of statuses
 * }
 *
 * status: {
 *    id
 *    context: [String] - name of test
 *    description [String]
 *    state [STATE]
 *    targetUrl [URL]
 *    creator {
 *        login
 *        avatarUrl
 *    }
 * }
 *
 * @param {*} refresh Break cache
 */
export async function getNightlies(refresh) {
    if (refresh) resetCache();
    if (!cache.output) {
        await loadNighlies();
        processNighlies(cache);
    }
    return cache.output;
}

export async function getNightlyType(typeName, refresh) {
    let output = await getNightlies(refresh);
    for (const nightlyType of output.nightlyTypes) {
        if (nightlyType.name === typeName) {
            console.log(nightlyType);
            return nightlyType;
        }
    }
    return null;
}

export default getNightlies;
