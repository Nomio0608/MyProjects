import React from "react";
import "./App.css";

class MalCard extends React.Component {
    render() {
        const { mal } = this.props; 

        return (
            <div style={{
                backgroundColor: mal.getColor(),
                padding: "20px",
                margin: "10px",
                borderRadius: "10px",
                textAlign: "center",
                width: "200px",
            }}>
                <h2>{mal.name} {mal.getEmoji()}</h2>
                <p><strong>Дуу авиа:</strong> {mal.getSound()}</p>
                <p><strong>Өнгө:</strong> {mal.getColor()}</p>
            </div>
        );
    }
}

export default MalCard;
