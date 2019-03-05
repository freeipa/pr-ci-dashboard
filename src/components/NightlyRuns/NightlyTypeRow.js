import React from 'react';
import PropTypes from 'prop-types';

function renderCell(result, i) {
    if (!result) {
        return <td key={i} className="jobResult empty" />;
    }

    return (
        <td
            key={i}
            className={`jobResult ${result.state}`}
            title={result.state}
        />
    );
}

function NightlyTypeRow(props) {
    const { job } = props;
    return (
        <React.Fragment>
            <tr>
                <td className="jobName">{job.name}</td>
                { job.results.map((result, i) => renderCell(result, i)) }
            </tr>
        </React.Fragment>
    );
}

NightlyTypeRow.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    job: PropTypes.object.isRequired,
};

export default NightlyTypeRow;
