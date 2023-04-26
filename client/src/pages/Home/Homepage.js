import React from "react";
import Box from "../../components/ui/HomepageBox";
import "../../assets/Homepage.scss";

function Homepage() {
  const [data, setData] = React.useState(null);
  //const [session, setSession] = React.useState(null);
  //const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    try {
      fetch("/api")
        .then((res) => res.json())
        .then((data) => setData(data.message));
    } catch (error) {
      setData("No data!");
    }
    setData({
      Title: "Test",
      Content: "EWW"
    });
  }, []);
  return (
    <div className="Homepage">
      <div className="box-container">
        <Box className="box-1" data={data ? data : ""}/>
        <Box className="box-2" data={data ? data : ""}/>
        <Box className="box-3" data={data ? data : ""}/>
        <Box className="box-4" data={data ? data : ""}/>
        <Box className="box-5" data={data ? data : ""}/>
      </div>
    </div>
  )
}
export default Homepage;