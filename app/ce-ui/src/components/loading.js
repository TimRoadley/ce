import React from "react";
import GridLoader from 'react-spinners/GridLoader';

class Loading extends React.Component {

    render() {

        return (
            <div className="container">
                <div className="loading_box">
                    <GridLoader
                        css={`
                            text-align:centre;
                            display: block;
                            margin: 0;
                            border-color: grey;
                        `}
                        sizeUnit={"px"}
                        size={10}
                        color={'#CCCCCC'}
                    />
                </div>
            </div>
        )
    }
}

export default Loading;