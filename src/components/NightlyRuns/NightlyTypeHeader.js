import React from 'react';
import PropTypes from 'prop-types';

function renderCell(nightlyRun) {
    return (
        <th key={nightlyRun.number} className="nightlyHeader">
            <div><strong>{nightlyRun.number}</strong></div>
            <div>{(new Date(nightlyRun.createdAt)).toDateString()}</div>
        </th>
    );
}

function NightlyTypeHeader(props) {
    const { nightlies } = props;
    return (
        <React.Fragment>
            <th />
            { nightlies.map(nightlyRun => renderCell(nightlyRun)) }
        </React.Fragment>
    );
}

NightlyTypeHeader.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    nightlies: PropTypes.array.isRequired,
};

export default NightlyTypeHeader;
