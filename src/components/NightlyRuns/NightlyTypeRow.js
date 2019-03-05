import React from 'react';
import PropTypes from 'prop-types';


function resultArtifacts(targetUrl) {
    if (!targetUrl) return '';

    return (
        <div className="artifacts">
            <a href={targetUrl}>
                <i className="fa fa-trophy" aria-hidden="true" title="Artifacts" />
            </a>
        </div>
    );
}

function resultRunnerLog(targetUrl) {
    if (!targetUrl) return '';

    return (
        <div className="runnerLog">
            <a href={`${targetUrl}/runner.log.gz`}>
                <i className="fa fa-file-text-o" aria-hidden="true" title="Runner Log" />
            </a>
        </div>
    );
}

function resultResults(targetUrl, state) {
    if (!targetUrl || state === 'ERROR') return '';

    return (
        <div className="runnerLog">
            <a href={`${targetUrl}/report.html`}>
                <i className="fa fa-pie-chart" aria-hidden="true" title="Results" />
            </a>
        </div>
    );
}

function description(value) {
    if (value.indexOf('no description') > -1) return '';
    if (value.indexOf('\\(^_^)/') > -1) return '';
    if (value.indexOf('The Travis CI build passed') > -1) return '';
    if (!value) return '';
    return <div className="description">{value}</div>;
}

function ResultInfo(props) {
    const { result } = props;

    return (
        <div className="resultInfo">
            {resultArtifacts(result.targetUrl)}
            {resultRunnerLog(result.targetUrl)}
            {resultResults(result.targetUrl, result.state)}
            {description(result.description)}
        </div>
    );
}

ResultInfo.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    result: PropTypes.object.isRequired,
};

function ResultCell(props) {
    const { result } = props;

    return (
        <td
            className={`jobResult ${result.state}`}
            title={result.state}
        >
            <ResultInfo result={result} />
        </td>
    );
}

ResultCell.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    result: PropTypes.object.isRequired,
};

function EmptyResult() {
    return <td className="jobResult empty" />;
}

function NightlyTypeRow(props) {
    const { job } = props;
    return (
        <React.Fragment>
            <tr>
                <td className="jobName">{job.name}</td>
                { job.results.map((result, i) => {
                    // for empty rows there is no value than index thus ignore:
                    // eslint-disable-next-line react/no-array-index-key
                    if (!result) return <EmptyResult key={i} />;
                    return <ResultCell result={result} key={result.id} />;
                })}
            </tr>
        </React.Fragment>
    );
}

NightlyTypeRow.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    job: PropTypes.object.isRequired,
};

export default NightlyTypeRow;
