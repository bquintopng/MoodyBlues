import React, { useState } from "react";
import LoginButton from "./LoginButton";

const Home = ({ onDesignSelect }) => {
  const [selected, setSelected] = useState("A");

  const handleDesignChange = (design) => {
    setSelected(design);
    onDesignSelect(design);
    localStorage.setItem("selectedDesign", design); // Store in local storage
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
      <LoginButton />
    </div>
  );
};

export default Home;
