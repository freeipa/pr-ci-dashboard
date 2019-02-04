import React from 'react';
import { iconMap, getWording, getStatusMap,
         ERROR, FAILURE, PENDING} from './StatusHelpers'

export class ChecksList extends React.Component {

    renderState(statusMap, state) {
        let count = statusMap[state].length
        if (count > 0) {
            return (
                <div class="list-view-pf-additional-info-item" key={state}>
                    <span class={iconMap[state]}></span>
                    <strong>{count}</strong> {getWording(state, count)}
                </div>
            );
        }
        return "";
    }

    renderStatus(status) {

        let hasArtifacts = !!status.targetUrl;
        let context = status.context;
        let jobLink = ''
        let resultsLink = ''
        let a_url = status.targetUrl;

        if (hasArtifacts) {
            context = <a href={status.targetUrl} title="Go to artifacts">{context}</a>
        }

        // Render Links to artifacts only for Pull Request CI
        if (hasArtifacts && status.creator.login === 'freeipa-pr-ci') {
            jobLink = <span className='jobLink'>
                <a href={`${a_url}/runner.log.gz`} alt='Go to runner.log.gz'>
                <span className='fa fa-external-link' />
                Runner Log
                </a>
            </span>
            resultsLink = <span className='resultsLink'>
                <a href={`${a_url}/report.html`} alt='Go to report'>
                    <span className='fa fa-external-link' />
                    Pytest Report
                </a>
            </span>
        }

        return (
            <div key={status.id} className="pr-checkListItem">
                <span class={iconMap[status.state]}></span>
                <img src={status.creator.avatarUrl} alt={status.creator.login} />
                {context}
                <span className='status-description'>{status.description}</span>
                {jobLink}
                {resultsLink}
            </div>
        )
    }

    renderStatuses(map, type) {
        let statuses = map[type];
        statuses.sort((s1, s2) => {
            if (s1.creator.login !== s2.creator.login) {
                return s1.creator.login > s2.creator.login;
            }
            return s1.context > s2.context;
        });
        return statuses.map((status) => { return this.renderStatus(status)});
    }

    render() {
        let statusMap = getStatusMap(this.props.statuses || []);

        return (
            <React.Fragment>
                {this.renderStatuses(statusMap, ERROR)}
                {this.renderStatuses(statusMap, FAILURE)}
                {this.renderStatuses(statusMap, PENDING)}
            </React.Fragment>
        );
    }
}

export default ChecksList;