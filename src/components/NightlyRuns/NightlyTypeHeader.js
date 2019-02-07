import React from 'react';

class NightlyTypeHeader extends React.Component {

    renderCell(nightlyRun) {
        return <th key={nightlyRun.number} className='nightlyHeader'>
            <div><strong>{nightlyRun.number}</strong></div>
            <div>{(new Date(nightlyRun.createdAt)).toDateString()}</div>
        </th>;
    }

    render() {
        let nightlies = this.props.nightlies;
        return (
        <React.Fragment>
             <th></th>
             { nightlies.map((nightlyRun, i) => this.renderCell(nightlyRun)) }
        </React.Fragment>
        );
    }
}

export default NightlyTypeHeader;