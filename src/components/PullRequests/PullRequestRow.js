import React from 'react';
import PropTypes from 'prop-types';
import { PullRequestLabels } from './PullRequestLabels';
import { ChecksSummary } from './ChecksSummary';
import { ChecksList } from './ChecksList';

class PullRequestRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
        };
    }

    handleExpand() {
        this.setState(state => ({
            expanded: !state.expanded,
        }));
    }

    renderExanded() {
        const { expanded } = this.state;
        const { pr } = this.props;
        if (!expanded) return '';
        const { contexts } = pr.commits.nodes[0].commit.status;
        return (
            <tr>
                <td colSpan="3" />
                <td colSpan="3">
                    <ChecksList statuses={contexts} />
                </td>
            </tr>
        );
    }

    render() {
        const { pr, repository } = this.props;
        const { status } = pr.commits.nodes[0];
        const contexts = status ? status.contexts : [];
        return (
            <React.Fragment>
                <tr>
                    <td className="table-view-pf-select">
                        <button
                            type="button"
                            className="btn btn-link btn-lg"
                            onClick={() => this.handleExpand()}
                        >
                            <i className="fa fa-angle-right" />
                        </button>
                    </td>
                    <td className="pr-author">
                        <img src={pr.author.avatarUrl} alt={pr.author.login} height="40px" />
                        <a
                            href={`${repository.url}/pulls/${pr.author.login}`}
                            title="Show PRs of author on GitHub"
                        >
                            {pr.author.login}
                        </a>
                    </td>
                    <td className="pr-number">
                        <a href={pr.url} title="Navigate to GitHub PR">
                            {`#${pr.number}`}
                        </a>
                    </td>
                    <td className="pr-title">
                        <strong>{pr.title}</strong>
                    </td>
                    <td className="pr-checks">
                        <ChecksSummary statuses={contexts} />
                    </td>
                    <td className="pr-labels">
                        <PullRequestLabels labels={pr.labels.nodes} />
                    </td>
                </tr>
                {this.renderExanded()}
            </React.Fragment>
        );
    }
}

PullRequestRow.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    pr: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    repository: PropTypes.object.isRequired,
};

export default PullRequestRow;
