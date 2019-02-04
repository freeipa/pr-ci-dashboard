import React from 'react';

// source: https://stackoverflow.com/questions/35969656/
function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

// source: https://stackoverflow.com/questions/35969656/
function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}


export class Label extends React.Component {
    render() {
        let label = this.props.label;
        let style = {
            "backgroundColor": `#${label.color}`,
            color: invertColor(label.color, true),
            borderRadius: '4px'
        }
        return (
            <span className="badge" style={style}
                  title={label.description}>
                {label.name}
            </span>
        )
    }
}


export class PullRequestLabels extends React.Component {
    render() {
        let labels = this.props.labels || [];
        return (
            <React.Fragment>
            {labels.map((label, i) => <Label label={label} key={label.name}/>)}
            </React.Fragment>
        );
    }
}

export default PullRequestLabels;