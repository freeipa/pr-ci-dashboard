import React from 'react';
import PropTypes from 'prop-types';

import {
    iconMap, getWording, getStatusMap,
    ERROR, FAILURE, PENDING,
} from './StatusHelpers';

export class ChecksList extends React.Component {
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

    static renderStatus(status) {
        const hasArtifacts = !!status.targetUrl;
        const { context } = status;
        let jobLink = '';
        let resultsLink = '';
        const aUrl = status.targetUrl;
        let contextNode = context;

        if (hasArtifacts) {
            contextNode = (
                <a href={status.targetUrl} title="Go to artifacts">
                    {context}
                </a>
            );
        }

        // Render Links to artifacts only for Pull Request CI
        if (hasArtifacts && status.creator.login === 'freeipa-pr-ci') {
            jobLink = (
                <span className="jobLink">
                    <a href={`${aUrl}/runner.log.gz`} alt="Go to runner.log.gz">
                        <span className="fa fa-external-link" />
                        Runner Log
                    </a>
                </span>
            );
            resultsLink = (
                <span className="resultsLink">
                    <a href={`${aUrl}/report.html`} alt="Go to report">
                        <span className="fa fa-external-link" />
                        Pytest Report
                    </a>
                </span>
            );
        }

        return (
            <div key={status.id} className="pr-checkListItem">
                <span className={iconMap[status.state]} />
                <img src={status.creator.avatarUrl} alt={status.creator.login} />
                {contextNode}
                <span className="status-description">{status.description}</span>
                {jobLink}
                {resultsLink}
            </div>
        );
    }

    static renderStatuses(map, type) {
        const statuses = map[type];
        statuses.sort((s1, s2) => {
            if (s1.creator.login !== s2.creator.login) {
                return s1.creator.login > s2.creator.login;
            }
            return s1.context > s2.context;
        });
        return statuses.map(status => ChecksList.renderStatus(status));
    }

    render() {
        const { statuses } = this.props;
        const statusMap = getStatusMap(statuses || []);

        return (
            <React.Fragment>
                {ChecksList.renderStatuses(statusMap, ERROR)}
                {ChecksList.renderStatuses(statusMap, FAILURE)}
                {ChecksList.renderStatuses(statusMap, PENDING)}
            </React.Fragment>
        );
    }
}

ChecksList.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    statuses: PropTypes.object.isRequired,
};


export default ChecksList;
