import React from "react";
import PropTypes from "prop-types";
import {
  CheckCircle,
  HighlightOff,
  Warning,
  Cancel,
  Info
} from "@material-ui/icons";
import { withStyles, Grid } from "material-ui";

import {
  StatsCard,
  ItemGrid
} from "components";

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

class MinerSummary extends React.Component {
  state = {
    knownminers: "",
    value: 0
};

componentDidMount() {
    this.callApiGetMiners()
    .then(res => this.setState({ knownminers: res.knownminers }))
    .catch(err => console.log(err));
}

callApiGetMiners = async () => {
    const response = await fetch("/api/knownminers");
    const body = await response.json();
    if (response.status !== 200) { throw Error(body.message); }
    return body;
  };
  
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const jminers = JSON.parse(JSON.stringify(this.state.knownminers));
    const arrMiners = [];
		if (jminers != null){
			Object.keys(jminers).forEach(function(key) {
			  arrMiners.push(JSON.parse(jminers[key], function (key, value) {
					return (value == null) ? "" : value
				}));
			});
		}
    var counts = arrMiners.reduce((result, miner) => {
      var status = miner.status;
      if (!result.hasOwnProperty(status)) {
        result[status] = 0;
      }
      result[status]++;
      return result;
    }, {});

    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={CheckCircle}
              iconColor="green"
              title="Online"
              description={counts["online"] || 0}
              statIcon={Info}
              statText="Miners online"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={HighlightOff}
              iconColor="orange"
              title="Offline"
              description={counts["offline"] || 0}
              small=""
              statIcon={Warning}
              statIconColor="danger"
              statText="Miners offline"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Cancel}
              iconColor="red"
              title="Disabled"
              description={counts["disabled"] || 0}
              statIcon={Info}
              statText="Miners disabled"
            />
          </ItemGrid>
        </Grid>

      </div>
    );
  }
}

MinerSummary.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(MinerSummary);
