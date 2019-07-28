import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ChecksSummary } from '../PullRequests/ChecksSummary';

function NightlyRow(props) {
    const { nightly } = props;
    const recent = nightly.nightlies[0];
    const statuses = recent.commits.nodes[0].commit.status.contexts;
    return (
        <React.Fragment>
            <tr>
                <td>
                    {recent.createdAt}
                </td>
                <td className="pr-title">
                    <Link to={`/nightly/${nightly.name}`}>
                        <strong>{nightly.name}</strong>
                    </Link>
                </td>
                <td className="pr-checks">
                    <ChecksSummary statuses={statuses} />
                </td>
            </tr>
        </React.Fragment>
    );
}

NightlyRow.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    nightly: PropTypes.object.isRequired,
};

export default NightlyRow;
