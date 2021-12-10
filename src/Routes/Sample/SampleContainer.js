import React from "react";
import SamplePresenter from "./SamplePresenter";
// eslint-disable-next-line
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    console.log("didmount");
  }
  render() {
    const {} = this.state;
    return <SamplePresenter />;
  }
}
