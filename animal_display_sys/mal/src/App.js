import React from "react";
import { Horse, Camel, Cow, Sheep, Coat } from "./Mal"; // ЗӨВ ИМПОРТ
import "./App.css";
function App() {
  const animals = [new Horse(), new Camel(), new Cow(), new Sheep(), new Coat()];

  return (
    <div className="animal-card">
      <h1>Малын мэдээлэл</h1>
      <div>
      {animals.map((animal, index) => (
        <div key={index} style={{ backgroundColor: animal.getColor(), padding: "10px", margin: "5px" }}>
          <h2>{animal.name} {animal.getEmoji()}</h2>
          <p>Дуу: {animal.getSound()}</p>
          <p>Өнгө: {animal.getColor()}</p>
        </div>
      ))}
      </div>
    </div>
  );
}

export default App;
