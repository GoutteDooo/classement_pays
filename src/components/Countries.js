import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";

const Countries = () => {
  const [data, setData] = useState([]);
  const [rangeValue, setRangeValue] = useState(36); //36 pays par défaut car multiple de douze
  const [selectedRadio, setSelectedRadio] = useState("");
  const radios = [
    "Africa",
    "America",
    "Asia",
    "Europe",
    "Oceania",
    "Antarctic",
  ];
  const [selectedSort, setSelectedSort] = useState("");
  const radiosSort = [
    "A-Z",
    "Z-A",
    "par pop >",
    "par pop <",
    "capitales A-Z",
    "capitales Z-A",
  ];

  //Le useEffect se joue lorsque le composant est monté
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((res) => setData(res.data));
  }, []);
  return (
    <div className="countries">
      <ul className="radio-container">
        <div className="rangeValue">
          <input
            type="range"
            id="rangeValue"
            min="1"
            max="250"
            defaultValue={rangeValue}
            onChange={(e) => setRangeValue(e.target.valueAsNumber)}
          />
          <span>{rangeValue}</span>
        </div>
        {radios.map((continent, index) => (
          <li key={index}>
            <input
              type="radio"
              id={continent}
              name="continentRadio"
              checked={continent === selectedRadio} //condition qui renvoie true ou false
              onChange={(e) => setSelectedRadio(e.target.id)}
            />
            <label htmlFor={continent}>{continent}</label>
          </li>
        ))}
      </ul>
      {/* Les méthodes pour trier */}
      <ul className="radioSort-container">
        {radiosSort.map((methodes, index) => (
          <li key={index}>
            <input
              type="radio"
              id={methodes}
              name="radiosSort"
              checked={methodes === selectedSort} //condition qui renvoie true ou false
              onChange={(e) => setSelectedSort(e.target.id)}
            />
            <label htmlFor={methodes}>{methodes}</label>
          </li>
        ))}
      </ul>
      {selectedRadio && (
        <button onClick={() => setSelectedRadio("")}>
          Tout les pays du monde
        </button>
      )}
      {/* Les cartes des pays */}
      <ul>
        {data
          .sort((a, b) => {
            // TRIER
            // Important de déclarer les const pour gérer le cas où a.capital ou b.capital est indéfini ou vide
            const capitalA = a.capital ? a.capital[0].toLowerCase() : "";
            const capitalB = b.capital ? b.capital[0].toLowerCase() : "";
            switch (selectedSort) {
              case "A-Z":
                return a.name.common
                  .toLowerCase()
                  .localeCompare(b.name.common.toLowerCase());
              case "Z-A":
                return b.name.common
                  .toLowerCase()
                  .localeCompare(a.name.common.toLowerCase());
              case "par pop >":
                return b.population - a.population;
              case "par pop <":
                return a.population - b.population;
              case "capitales A-Z":
                return capitalA.localeCompare(capitalB);
              case "capitales Z-A":
                // Gérer le cas où a.capital ou b.capital est indéfini ou vide
                return capitalB.localeCompare(capitalA);
              default:
                break;
            }
          })
          .filter((country) => country.continents[0].includes(selectedRadio))
          .slice(0, rangeValue)
          .map((country, index) => (
            <Card key={index} country={country} />
          ))}
      </ul>
    </div>
  );
};

export default Countries;
