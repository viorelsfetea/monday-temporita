import React from "react";
import Loader from "monday-ui-react-core/dist/Loader";

class Preloader extends React.Component {
  render() {
    return <div className="Preloader">
      <div className="spinner">
        <Loader svgClassName="loader-size-lg" />
      </div>
    </div>
  }
}

export default Preloader;