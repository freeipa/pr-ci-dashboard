import React from 'react';
import PropTypes from 'prop-types';
import { LoadingState } from 'patternfly-react';
import { getNightlyType } from './NighlyService';
import NightlyTypeRow from './NightlyTypeRow';
import NightlyTypeHeader from './NightlyTypeHeader';
import Content from '../../Content';


class NightlyType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nightlyType: null,
            loading: false,
        };
    }

    componentWillMount() {
        const { match } = this.props;
        this.setState({
            loading: true,
        });
        getNightlyType(match.params.nightlyTypeName).then((nightlyType) => {
            this.setState({
                nightlyType,
                loading: false,
            });
        });
    }

    static renderNightly(nightlyType) {
        return (
            <React.Fragment>
                <h2>{nightlyType.name}</h2>
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <NightlyTypeHeader nightlies={nightlyType.nightlies} />
                        </tr>
                    </thead>
                    <tbody>
                        { nightlyType.jobs.map(job => (
                            <NightlyTypeRow job={job} key={job.name} />
                        ))}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }

    render() {
        const { nightlyType, loading } = this.state;
        let out = '';
        if (!loading && nightlyType) {
            out = NightlyType.renderNightly(nightlyType);
        }

        return (
            <Content>
                <LoadingState loading={loading} size="lg" loadingText="">
                    {out}
                </LoadingState>
            </Content>
        );
    }
}

NightlyType.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    match: PropTypes.object.isRequired, // Router match
};

export default NightlyType;
