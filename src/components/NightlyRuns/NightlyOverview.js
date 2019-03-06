import React from 'react';
import { LoadingState } from 'patternfly-react';
import { getNightlies } from './NighlyService';
import { getReportedFailures } from './PagureService';
import NightlyRow from './NightlyRow';
import PagureIssueRow from './PagureIssueRow';


class NightlyOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nightlies: {
                nightlies: [],
                nightlyTypes: [],
            },
            reportedFailures: [],
            loading: false,
            loadingTickets: false,
        };
    }

    componentWillMount() {
        this.setState({
            loading: true,
            loadingTickets: true,
        });
        getNightlies().then((nightlies) => {
            this.setState({
                nightlies,
                loading: false,
            });
        });
        getReportedFailures().then((tickets) => {
            this.setState({
                reportedFailures: tickets,
                loadingTickets: false,
            });
        });
    }

    render() {
        const {
            nightlies, reportedFailures, loadingTickets, loading,
        } = this.state;
        const types = nightlies.nightlyTypes;
        return (
            <React.Fragment>
                <React.Fragment>
                    <h2>Reported bugs (test failures)</h2>
                    <LoadingState loading={loadingTickets} size="lg" loadingText="">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Opened/Updated</th>
                                    <th>Bug title</th>
                                    <th>Reporter</th>
                                    <th>Assignee</th>
                                    <th>Milestone</th>
                                    <th>Priority</th>
                                    <th>Pull Request (review)</th>
                                    <th>Test Case</th>
                                </tr>
                            </thead>
                            <tbody>
                                { reportedFailures.map(issue => (
                                    <PagureIssueRow
                                        issue={issue}
                                        key={issue.id}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </LoadingState>
                </React.Fragment>
                <React.Fragment>
                    <h2>Recent Nightly Runs</h2>
                    <LoadingState loading={loading} size="lg" loadingText="">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Last run</th>
                                    <th>Nightly run</th>
                                    <th>Last run results</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(types.map(nightly => (
                                    <NightlyRow
                                        nightly={nightly}
                                        key={nightly.name}
                                    />
                                )))}
                            </tbody>
                        </table>
                    </LoadingState>
                </React.Fragment>
            </React.Fragment>
        );
    }
}

export default NightlyOverview;
