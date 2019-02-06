import React from 'react';
import {ALLSTATES, iconMap, getWording, getStatusMap} from './StatusHelpers'

export class ChecksSummary extends React.Component {

    renderState(statusMap, state) {
        let count = statusMap[state].length
        if (count > 0) {
            return (
                <div className="list-view-pf-additional-info-item" key={state}>
                    <span className={iconMap[state]}></span>
                    <strong>{count}</strong> {getWording(state, count)}
                </div>
            );
        }
        return "";
    }

    render() {
        let statusMap = getStatusMap(this.props.statuses || []);

        return (
            <React.Fragment>
            {ALLSTATES.map((state, i) => { return this.renderState(statusMap, state)})}
            </React.Fragment>
        );
    }
}

export default ChecksSummary;