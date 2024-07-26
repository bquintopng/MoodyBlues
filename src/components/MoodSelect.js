import React, { useState } from "react";

import Happy from "../Moodyblues pictures/person-happy-mask.png";
import Sad from "../Moodyblues pictures/person-sad-mask.png";
import Energetic from "../Moodyblues pictures/person-energetic-mask.png";
import Relaxed from "../Moodyblues pictures/person-relaxed-mask.png";
import Running from "../Moodyblues pictures/running-mask.png";
import Sitting from "../Moodyblues pictures/sitting-mask.png";
import Standing from "../Moodyblues pictures/standing-mask.png";
import Dancing from "../Moodyblues pictures/dancing-mask.png";
import City from "../Moodyblues pictures/city-background.png";
import Park from "../Moodyblues pictures/park-background.png";
import Party from "../Moodyblues pictures/party-background.png";
import Gym from "../Moodyblues pictures/gym-background.png";

const faces = [Happy, Sad, Energetic, Relaxed];
const bodies = [Running, Sitting, Standing, Dancing];
const backgrounds = [City, Park, Party, Gym];

const facesText = ["Happy", "Sad", "Energetic", "Relaxed"]
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
    if (type === 'face') {
      setSelectedFaceIndex(getNextImageIndex(selectedFaceIndex, faces));
    } else if (type === 'body') {
      setSelectedBodyIndex(getNextImageIndex(selectedBodyIndex, bodies));
    } else if (type === 'background') {
      setSelectedBackgroundIndex(getNextImageIndex(selectedBackgroundIndex, backgrounds));
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
          <p id="instructions-paragraph">Instructions:
              
              Create a character that best suits your mood!
              Try clicking on the face, body, and background to change it
              until you feel it suits you!</p>
          <br></br>
          <p>Current face is: {facesText[selectedFaceIndex]}</p>
          <br></br>
          <p>Current body/pose is: {bodiesText[selectedBodyIndex]}</p>
          <br></br>
          <p>Current background is: {backgroundsText[selectedBackgroundIndex]}</p>
        </div>
        <div className="mood-select-container">
          <img
            src={backgrounds[selectedBackgroundIndex]}
            alt="Background"
            className="mood-select-background"
            onClick={() => handleImageClick('background')}
          />
          <img
            src={bodies[selectedBodyIndex]}
            alt="Body"
            className="mood-select-body"
            onClick={() => handleImageClick('body')}
          />
          <img
            src={faces[selectedFaceIndex]}
            alt="Face"
            className="mood-select-face"
            onClick={() => handleImageClick('face')}
          />
        </div>
      </div>
      <button onClick={handleSubmit}>Get Playlist</button>
    </div>
  );
};

export default MoodSelect;
