import React from 'react';
import { LoadingState } from 'patternfly-react';
import PullRequestRow from './PullRequestRow';
import { fetchPullRequests } from '../../prlist';

class PullRequestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            repository: {},
            loading: false,
        };
    }

    componentWillMount() {
        this.setState(state => ({
            ...state,
            loading: true,
        }));

        fetchPullRequests({ numOfPrs: 50, state: 'OPEN' }).then((repository) => {
            this.setState({
                repository,
                loading: false,
            });
        });
    }

    getPrs() {
        const { repository } = this.state;
        if (repository && repository.pullRequests) {
            return repository.pullRequests.nodes;
        }
        return [];
    }

    render() {
        const prs = this.getPrs();
        const { repository, loading } = this.state;

        return (
            <React.Fragment>
                <h2>Pull Requests</h2>
                <LoadingState loading={loading} size="lg" loadingText="">
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th />
                                <th>Author</th>
                                <th>Pull Request</th>
                                <th>Title</th>
                                <th>Checks</th>
                                <th>Labels</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prs.map(pr => (
                                <PullRequestRow
                                    repository={repository}
                                    pr={pr}
                                    key={pr.number}
                                />
                            ))}
                        </tbody>
                    </table>
                </LoadingState>
            </React.Fragment>
        );
    }
}

export default PullRequestList;