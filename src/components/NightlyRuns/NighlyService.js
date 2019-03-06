import { fetchPullRequestsPaged } from '../../prlist';

// Number of PRS which are checked to be nightly runs
const SOURCE_PRS = 100;

// String to filter Pull Request title to get nightly runs
const NIGHTLY_FILTER = 'Nightly PR';

const cache = {
    nightlies: [],
    types: [],
    map: [],
    output: null, // this should be the only publicly visible
};

function resetCache() {
    cache.nightlies = [];
    cache.types = [];
    cache.map = [];
    cache.output = null;
}

/**
 * Fills cache.nightlies with new data
 */
async function loadNighlies() {
    cache.nightlies = await fetchPullRequestsPaged({
        numOfPrs: SOURCE_PRS,
        filter: NIGHTLY_FILTER,
    });
    return cache.nightlies;
}

/**
 * Sets cache.types and cache.map based on data from cache.nightlies
 */
function processNightlies(c) {
    const newC = {
        ...c,
    };
    const map = {};
    const types = [];

    // Group Nighlies by types
    for (let i = 0, l = newC.nightlies.length; i < l; i += 1) {
        const pr = newC.nightlies[i];
        if (!map[pr.title]) {
            types.push(pr.title);
            map[pr.title] = {
                jobs: {},
                nightlies: [],
            };
        }
        map[pr.title].nightlies.push(pr);
    }
    newC.map = map;
    newC.types = types;

    // Here would be ordering by date, but we assume it is already ordered
    // by GitHub

    types.forEach((type) => {
        const typeMap = map[type];
        const { nightlies, jobs } = typeMap;
        for (let i = 0, l = nightlies.length; i < l; i += 1) {
            const nightly = nightlies[i];
            const statuses = nightly.commits.nodes[0].commit.status.contexts;

            // Group tests within types
            // Output is dict (typeMap) of arrays of the same jobs (status), key is a
            // job name (status.context)
            statuses.forEach((status) => {
                const name = status.context;
                if (!jobs[name]) jobs[name] = [];
                jobs[name][i] = status;
            });
        }
        // fill gaps in jobs with explicit null so that even they are iterable
        for (let i = 0, l = nightlies.length; i < l; i += 1) {
            Object.values(jobs).forEach((job) => {
                // eslint-disable-next-line no-param-reassign
                job[i] = job[i] || null;
            });
        }
    });

    // final process
    // transform it into structure to enable:
    // nightlyType => test names => array of test results
    newC.output = {
        nightlies: newC.nightlies,
        nightlyTypes: [],
    };
    const nts = newC.output.nightlyTypes;
    types.forEach((type) => {
        const jobs = [];
        const jobsIn = newC.map[type].jobs;
        Object.keys(jobsIn).forEach(jobName => jobs.push({
            name: jobName,
            results: jobsIn[jobName],
        }));

        nts.push({
            name: type,
            nightlies: newC.map[type].nightlies,
            jobs,
        });
    });
    console.log(newC);
    return newC;
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
        Object.assign(cache, processNightlies(cache));
    }
    return cache.output;
}

export async function getNightlyType(typeName, refresh) {
    const output = await getNightlies(refresh);
    return output.nightlyTypes.find(t => t.name === typeName);
}

export default getNightlies;
