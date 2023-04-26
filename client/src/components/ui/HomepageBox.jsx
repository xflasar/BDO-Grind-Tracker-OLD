import React from "react";
import '../../assets/HomepageBox.scss';

const Box = ({className, data }) => {
    return (
        <div className={`box ` + className}>
            <div className="box-title">{data.Title}</div>
            <div className="box-content">
                <p>
                    {data.Content}
                </p>
            </div>
        </div>
    )
}

export default Box;