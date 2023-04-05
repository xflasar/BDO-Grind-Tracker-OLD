import React from "react";
import "../../assets/Homepage.css";

function Homepage() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    try {
      fetch("/api")
        .then((res) => res.json())
        .then((data) => setData(data.message));
    } catch (error) {
      setData("No data!");
    }
  }, []);

  return (
    <div className="Homepage">
      <div className="box-container">
        <div className="box box-1">Box 1</div>
        <div className="box box-2">Box 2</div>
        <div className="box box-3">Box 3</div>
        <div className="box box-4">Box 4</div>
        <div className="box box-5">Box 5</div>
      </div>
      <p>{!data ? "No data!" : data}</p>
    </div>
  )
}
export default Homepage;