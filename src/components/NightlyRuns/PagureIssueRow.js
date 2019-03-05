import React from 'react';
import PropTypes from 'prop-types';
import { getCustomFieldValue, issueUrl, milestoneUrl } from './PagureService';

function printDate(timeStamp) {
    return (new Date(timeStamp * 1000)).toDateString();
}

function pagureLink(issue, text) {
    return <a href={issueUrl(issue)}>{text}</a>;
}

function milestoneLink(milestone) {
    return <a href={milestoneUrl(milestone)}>{milestone}</a>;
}

function prLink(issue) {
    const link = getCustomFieldValue(issue, 'on_review');
    if (link && link.indexOf('pull/') > -1) { // is link to PR
        const parts = link.split('/');
        let prNumber = parts[parts.length - 1];
        prNumber = `#${prNumber}`;
        return <a href={link}>{prNumber}</a>;
    }
    return '';
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
                <td>{milestoneLink(issue.milestone)}</td>
                <td>{issue.priority}</td>
                <td>{prLink(issue)}</td>
                <td>{getCustomFieldValue(issue, 'test_case')}</td>
            </tr>
        </React.Fragment>
    );
}

PagureIssueRow.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    issue: PropTypes.object.isRequired,
};

export default PagureIssueRow;
