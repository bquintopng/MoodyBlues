import React, { useState, useEffect } from "react";
// import LoginButton from "./LoginButton";

const Home = ({ onDesignSelect }) => {
  const [selected, setSelected] = useState(localStorage.getItem("selectedDesign") || "A");

  useEffect(() => {
    localStorage.setItem("selectedDesign", selected);
    onDesignSelect(selected);
  }, [selected, onDesignSelect]);

  const handleDesignChange = (design) => {
    setSelected(design);
  };
  

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            name="design"
            value="A"
            checked={selected === "A"}
            onChange={() => handleDesignChange("A")}
          />
          Design A
        </label>
        <label>
          <input
            type="radio"
            name="design"
            value="B"
            checked={selected === "B"}
            onChange={() => handleDesignChange("B")}
          />
          Design B
        </label>
      </div>
    </div>
  );
};

export default Home;
