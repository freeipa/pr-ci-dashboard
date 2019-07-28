import React from 'react';
import PropTypes from 'prop-types';

import {
    ALLSTATES, iconMap, getWording, getStatusMap,
} from './StatusHelpers';

export class ChecksSummary extends React.Component {
    static renderState(statusMap, state) {
        const count = statusMap[state].length;
        if (count > 0) {
            return (
                <div className="list-view-pf-additional-info-item" key={state}>
                    <span className={iconMap[state]} />
                    <strong>{count}</strong>
                    {getWording(state, count)}
                </div>
            );
        }
        return '';
    }

    render() {
        const { statuses } = this.props;
        const statusMap = getStatusMap(statuses || []);

        return (
            <React.Fragment>
                {ALLSTATES.map(state => ChecksSummary.renderState(statusMap, state))}
            </React.Fragment>
        );
    }
}

ChecksSummary.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    statuses: PropTypes.array.isRequired,
};

export default ChecksSummary;
