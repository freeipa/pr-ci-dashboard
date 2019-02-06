import React from 'react';
import { LoadingState} from 'patternfly-react';
import getNightlies from './NighlyService';
import NightlyRow from './NightlyRow';

class NightlyOverview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nightlies: {
                nightlies: [],
                nightlyTypes: []
            },
            loading: false
        };
    }

    componentWillMount() {
        this.setState({
            ...this.state,
            loading: true
        });
        getNightlies().then(nightlies => {
            this.setState({
                nightlies: nightlies,
                loading: false
            });
        });
    }

    render() {
        const nightlies = this.state.nightlies;
        const types = nightlies.nightlyTypes;

        return (
        <React.Fragment>
            <h2>Nightly Runs</h2>
            <LoadingState loading={this.state.loading} size="lg" loadingText=''>
            <table className='table table-striped table-bordered table-hover'>
            <thead>
                    <tr>
                    <th>Last run</th>
                    <th>Nightly run</th>
                    <th>Last run results</th>
                    </tr>
                </thead>
                <tbody>
                {types.map((nightly, i) => <NightlyRow nightly={nightly}
                                                    key={nightly.name}/>)}
                </tbody>
            </table>
            </LoadingState>
        </React.Fragment>
        );
    }
}

export default NightlyOverview;