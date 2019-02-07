import React from 'react';
import { LoadingState} from 'patternfly-react';
import { getNightlyType } from './NighlyService';
import NightlyTypeRow from './NightlyTypeRow';
import NightlyTypeHeader from './NightlyTypeHeader';
import Content from '../../Content';


class NightlyType extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nightlyType: null,
            loading: false
        };
    }

    componentWillMount() {
        this.setState({
            ...this.state,
            loading: true
        });
        getNightlyType(this.props.match.params.nightlyTypeName).then(nightlyType => {
            this.setState({
                nightlyType: nightlyType,
                loading: false
            });
        });
    }

    renderNightly(nightlyType) {
        return <React.Fragment>
            <h2>{nightlyType.name}</h2>
            <table className='table table-striped table-bordered'>
            <thead>
                <tr>
                    <NightlyTypeHeader nightlies={nightlyType.nightlies} />
                </tr>
            </thead>
                <tbody>
                    { nightlyType.jobs.map((job, i) =>
                        <NightlyTypeRow job={job} key={i}/>) }
                </tbody>
            </table>
        </React.Fragment>
    }

    render() {
        const nightlyType = this.state.nightlyType;
        let out = "";
        if (!this.state.loading && nightlyType) {
            out = this.renderNightly(nightlyType);
        }

        return (
            <Content>
            <LoadingState loading={this.state.loading} size="lg" loadingText=''>
                {out}
            </LoadingState>
            </Content>
        );
    }
}

export default NightlyType;