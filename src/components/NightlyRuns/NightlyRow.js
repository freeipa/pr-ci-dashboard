import React from 'react';
import ChecksSummary from '../PullRequests/ChecksSummary';
import { Link } from 'react-router-dom';

class NightlyRow extends React.Component {
    render() {
        let nightly = this.props.nightly;
        let recent = nightly.nightlies[0];
        return (
        <React.Fragment>
        <tr>
            <td>
                {recent.createdAt}
            </td>
            <td className='pr-title'>
                <Link to={`/nightly/${nightly.name}`}><strong>{nightly.name}</strong></Link>
            </td>
            <td  className='pr-checks'>
                <ChecksSummary statuses={recent.commits.nodes[0].commit.status.contexts} />
            </td>
        </tr>
        </React.Fragment>
        );
    }
}

export default NightlyRow;