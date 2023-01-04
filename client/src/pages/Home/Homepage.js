import React from "react";
import logo from '../../assets/logo.svg'
import "../../assets/Homepage.css";

function Homepage() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="Homepage">
      <header className="Homepage-Header">
        <img src={logo} className="Homepage-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  )
}
export default Homepage;