import React from 'react';
import PullRequestLabels from './PullRequestLabels'
import ChecksSummary from './ChecksSummary'
import ChecksList from './ChecksList'

class PullRequestRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
    }

    handleExpand = () => {
        this.setState({
            ...this.state,
            expanded: !this.state.expanded
        });
    }

    renderExanded() {
        if (!this.state.expanded) return;
        let pr = this.props.pr;
        return (
        <tr>
            <td colspan='3'>
            </td>
            <td colspan='3'>
                <ChecksList statuses={pr.commits.nodes[0].commit.status.contexts} />
            </td>
        </tr>
        );
    }

    render() {
        let pr = this.props.pr;
        let repo = this.props.repository;
        return (
        <React.Fragment>
        <tr>
            <td className='table-view-pf-select'
                onClick={() => this.handleExpand()}>
                <span class="fa fa-angle-right"></span>
            </td>
            <td className='pr-author'>
                <img src={pr.author.avatarUrl} alt={pr.author.login} height="40px" />
                <a href={`${repo.url}/pulls/${pr.author.login}`}
                   title="Show PRs of author on GitHub">
                    {pr.author.login}
                </a>
            </td>
            <td className='pr-number'>
                <a href={pr.url} title="Navigate to GitHub PR">#{pr.number}</a>
            </td>
            <td className='pr-title'>
                <strong>{pr.title}</strong>
            </td>
            <td  className='pr-checks'>
                <ChecksSummary statuses={pr.commits.nodes[0].commit.status.contexts} />
            </td>
            <td  className='pr-labels'>
                <PullRequestLabels labels={pr.labels.nodes} />
            </td>
        </tr>
        {this.renderExanded()}
        </React.Fragment>
        );
    }
}

export default PullRequestRow;