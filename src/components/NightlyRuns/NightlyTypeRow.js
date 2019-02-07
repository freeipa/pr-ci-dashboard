import React from 'react';

class NightlyTypeRow extends React.Component {

    renderCell(result, i) {
        if (!result) {
            return <td key={i} className='jobResult empty'></td>;
        }

        return <td key={i}
            className={`jobResult ${result.state}`}
            title={result.state}>
        </td>;
    }

    render() {
        let job = this.props.job;
        return (
        <React.Fragment>
             <tr>
             <td className='jobName'>{job.name}</td>
             { job.results.map((result, i) => this.renderCell(result, i)) }
             </tr>
        </React.Fragment>
        );
    }
}

export default NightlyTypeRow;