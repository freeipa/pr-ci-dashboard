import React from 'react';
import { Grid } from 'patternfly-react';

const Content = (props) => {
    return <Grid fluid className="container-pf-nav-pf-vertical">
        <Grid.Row>
            <Grid.Col xs={12}>
                {props.children}
            </Grid.Col>
        </Grid.Row>
    </Grid>
}

export default Content;