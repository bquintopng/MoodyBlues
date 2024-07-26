import React, { useState } from "react";

import Happy from "../images/person-happy-mask.png";
import Sad from "../images/person-sad-mask.png";
import Energetic from "../images/person-energetic-mask.png";
import Relaxed from "../images/person-relaxed-mask.png";
import Running from "../images/running-mask.png";
import Sitting from "../images/sitting-mask.png";
import Standing from "../images/standing-mask.png";
import Dancing from "../images/dancing-mask.png";
import City from "../images/city-background.png";
import Park from "../images/park-background.png";
import Party from "../images/party-background.png";
import Gym from "../images/gym-background.png";

const faces = [Happy, Sad, Energetic, Relaxed];
const bodies = [Running, Sitting, Standing, Dancing];
const backgrounds = [City, Park, Party, Gym];

const facesText = ["Happy", "Sad", "Energetic", "Relaxed"];
const bodiesText = ["Running", "Sitting", "Standing", "Dancing"];
const backgroundsText = ["City", "Park", "Party", "Gym"];

const MoodSelect = ({ onMoodSelect }) => {
  const [selectedFaceIndex, setSelectedFaceIndex] = useState(0);
  const [selectedBodyIndex, setSelectedBodyIndex] = useState(0);
  const [selectedBackgroundIndex, setSelectedBackgroundIndex] = useState(0);

  const getNextImageIndex = (currentIndex, images) => {
    return (currentIndex + 1) % images.length;
  };

  const handleImageClick = (type) => {
    if (type === "face") {
      setSelectedFaceIndex(getNextImageIndex(selectedFaceIndex, faces));
    } else if (type === "body") {
      setSelectedBodyIndex(getNextImageIndex(selectedBodyIndex, bodies));
    } else if (type === "background") {
      setSelectedBackgroundIndex(
        getNextImageIndex(selectedBackgroundIndex, backgrounds)
      );
    }
  };

  const handleSubmit = () => {
    onMoodSelect({
      background: backgrounds[selectedBackgroundIndex],
      face: faces[selectedFaceIndex],
      body: bodies[selectedBodyIndex],
    });
  };

  return (
    <div className="mood-select-wrapper">
      <div className="mood-select-content">
        <div className="instructions-box">
          <p id="instructions-paragraph">
            Instructions: Create a character that best suits your mood! Try
            clicking on the face, body, and background to change it until you
            feel it suits you!
          </p>
          <br></br>
          <p>Current face is: {facesText[selectedFaceIndex]}</p>
          <br></br>
          <p>Current body/pose is: {bodiesText[selectedBodyIndex]}</p>
          <br></br>
          <p>
            Current background is: {backgroundsText[selectedBackgroundIndex]}
          </p>
        </div>
        <div className="mood-select-container">
          <img
            src={backgrounds[selectedBackgroundIndex]}
            alt="Background"
            className="mood-select-background"
            onClick={() => handleImageClick("background")}
          />
          <img
            src={bodies[selectedBodyIndex]}
            alt="Body"
            className="mood-select-body"
            onClick={() => handleImageClick("body")}
          />
          <img
            src={faces[selectedFaceIndex]}
            alt="Face"
            className="mood-select-face"
            onClick={() => handleImageClick("face")}
          />
        </div>
      </div>
      <button onClick={handleSubmit}>Get Playlist</button>
    </div>
  );
};

export default MoodSelect;
