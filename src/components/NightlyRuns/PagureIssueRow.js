import React from 'react';
import PropTypes from 'prop-types';
import { getCustomFieldValue, issueUrl } from './PagureService';

function printDate(timeStamp) {
    return (new Date(timeStamp * 1000)).toDateString();
}

function pagureLink(issue, text) {
    return <a href={issueUrl(issue)}>{text}</a>;
}

function PagureIssueRow(props) {
    const { issue } = props;
    return (
        <React.Fragment>
            <tr>
                <td>
                    {`#${issue.id}`}
                </td>
                <td>
                    <div>{printDate(issue.date_created)}</div>
                    <div>{printDate(issue.last_updated)}</div>
                </td>
                <td>{pagureLink(issue, issue.title)}</td>
                <td>{issue.user.fullname}</td>
                <td>{issue.assignee ? issue.assignee.fullname : ''}</td>
                <td>{issue.milestone}</td>
                <td>{issue.priority}</td>
                <td>{getCustomFieldValue(issue, 'on_review')}</td>
            </tr>
        </React.Fragment>
    );
}

PagureIssueRow.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    issue: PropTypes.object.isRequired,
};

export default PagureIssueRow;
