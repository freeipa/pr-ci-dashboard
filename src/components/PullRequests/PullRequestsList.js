import React from 'react';
import PullRequestRow from './PullRequestRow'
import { fetchPullRequests } from '../../prlist'
import { LoadingState} from 'patternfly-react'

class PullRequestList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            repository: {},
            loading: false
        }
    }

    componentWillMount() {
        this.setState({
            ...this.state,
            loading: true
        })
        fetchPullRequests({numOfPrs: 5, state: 'OPEN'}).then(repository => {
            this.setState({
                repository: repository,
                loading: false
            });
        })
    }

    getPrs() {
        if (this.state.repository && this.state.repository.pullRequests) {
            return this.state.repository.pullRequests.nodes;
        } else {
            return [];
        }
    }

    render() {
        const prs = this.getPrs();
        const repository = this.state.repository;

        return (
        <React.Fragment>
            <h2>Pull Requests</h2>
            <LoadingState loading={this.state.loading} size="lg" loadingText=''>
            <table className='table table-striped table-bordered table-hover'>
                <thead>
                    <tr>
                    <th></th>
                    <th>Author</th>
                    <th>Pull Request</th>
                    <th>Title</th>
                    <th>Checks</th>
                    <th>Labels</th>
                    </tr>
                </thead>
                <tbody>
                {prs.map((pr, i) => <PullRequestRow repository={repository}
                                                    pr={pr} key={pr.number}/>)}
                </tbody>
            </table>
            </LoadingState>
        </React.Fragment>
        );
    }
}

export default PullRequestList;