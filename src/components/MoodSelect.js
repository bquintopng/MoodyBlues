import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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

const allWords = [
  'Happy', 'Sad', 'Angry', 'Excited',
  'Anxious', 'Relaxed', 'Energetic', 'Bored',
  'Content', 'Frustrated', 'Nervous', 'Calm',
  'Joyful', 'Depressed', 'Cheerful', 'Irritated'
];

const MoodSelect = ({ onMoodSelect, selectedDesign }) => {
  useEffect(() => {
    console.log("Selected Design in MoodSelect:", selectedDesign);
  }, [selectedDesign]);

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
      setSelectedBackgroundIndex(getNextImageIndex(selectedBackgroundIndex, backgrounds));
    }
  };

  const handleSubmit = () => {
    console.log("Submit clicked");
    console.log("Selected Design:", selectedDesign);
    console.log("Selected Face Index:", selectedFaceIndex);
    console.log("Selected Body Index:", selectedBodyIndex);
    console.log("Selected Background Index:", selectedBackgroundIndex);

    if (selectedDesign === "A") {
      console.log("selectedDesign is equal to A");
      onMoodSelect({
        background: backgrounds[selectedBackgroundIndex],
        face: faces[selectedFaceIndex],
        body: bodies[selectedBodyIndex],
      });
      console.log("Reached after prop function call")
    }
    else if (selectedDesign === "B") {
      console.log("selectedDesign is equal to B");
      onMoodSelect({
        block1: droppedWords[0],
        block2: droppedWords[1],
        block3: droppedWords[2],
        block4: droppedWords[3],
      });
      console.log("Reached after prop function call")
    }
    else {
      console.warn("No valid design selected");
    }
  };

  const shuffledWords = allWords.sort(() => 0.5 - Math.random());
  const columns = [
    shuffledWords.slice(0, 4),
    shuffledWords.slice(4, 8),
    shuffledWords.slice(8, 12),
    shuffledWords.slice(12, 16)
  ];

  const [droppedWords, setDroppedWords] = useState(Array(4).fill(null));
  const [availableWords, setAvailableWords] = useState(columns);

  const handleDrop = (item, index) => {
    const newDroppedWords = [...droppedWords];
    const newAvailableWords = availableWords.map(col => [...col]);

    if (newDroppedWords[index]) {
      const currentWord = newDroppedWords[index];
      const availableColumnIndex = newAvailableWords.findIndex(col => col.length < 4);
      newAvailableWords[availableColumnIndex].push(currentWord);
    }

    for (let col of newAvailableWords) {
      const availableIndex = col.indexOf(item.word);
      if (availableIndex > -1) {
        col.splice(availableIndex, 1);
        break;
      }
    }

    newDroppedWords[index] = item.word;

    setDroppedWords(newDroppedWords);
    setAvailableWords(newAvailableWords);
  };

  const handleReturnToColumn = (word) => {
    const newDroppedWords = droppedWords.map(w => w === word ? null : w);
    const newAvailableWords = availableWords.map(col => [...col]);
    const availableColumnIndex = newAvailableWords.findIndex(col => col.length < 4);
    newAvailableWords[availableColumnIndex].push(word);

    setDroppedWords(newDroppedWords);
    setAvailableWords(newAvailableWords);
  };

  const Word = ({ word, droppedWords }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'word',
      item: { word },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
  
    return (
      <div
        ref={drag}
        className={`word ${isDragging ? 'dragging' : ''} ${
          droppedWords.includes(word) ? 'dim' : ''
        }`}
      >
        {word}
      </div>
    );
  };
  
  const DropBox = ({ droppedWords, onDrop, onReturn }) => {
    return (
      <div className="drop-box">
        {droppedWords.map((word, index) => (
          <DropSlot 
            key={index} 
            word={word} 
            index={index} 
            onDrop={onDrop} 
            onReturn={onReturn} 
          />
        ))}
      </div>
    );
  };
  
  const DropSlot = ({ word, index, onDrop, onReturn }) => {
    const [, drop] = useDrop({
      accept: 'word',
      drop: (item) => onDrop(item, index),
    });
  
    return (
      <div ref={drop} className="drop-slot">
        {word ? (
          <div 
            className="dropped-word" 
            onClick={() => onReturn(word)}
          >
            {word}
          </div>
        ) : (
          <div className="empty-slot">Drop Here</div>
        )}
      </div>
    );
  };

  return (
    <div className="mood-select-wrapper">
      <div className="Selected Design">Current Design: {selectedDesign}</div>
      {selectedDesign === "A" && (
        <div className="mood-select-design-A">
          <div className="instructions-box">
            <p id="instructions-paragraph">
              Instructions: Create a character that best suits your mood! Try
              clicking on the face, body, and background to change it until you
              feel it suits you!
            </p>
            <br />
            <p>Current face is: {facesText[selectedFaceIndex]}</p>
            <br />
            <p>Current body/pose is: {bodiesText[selectedBodyIndex]}</p>
            <br />
            <p>Current background is: {backgroundsText[selectedBackgroundIndex]}</p>
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
      )}
      {selectedDesign === "B" && (
        <div className="mood-select-design-B">
          <div className="instructions-box">
            <p id="instructions-paragraph">
              Instructions: Click and drag which moods from the boxes you feel like suits you! 
              To remove a mood, click on it! 
            </p>
          </div>
          <DndProvider backend={HTML5Backend}>
            <div className="container">
              <DropBox 
                droppedWords={droppedWords} 
                onDrop={handleDrop} 
                onReturn={handleReturnToColumn} 
              />
              <div className="word-columns">
                {availableWords.map((column, colIndex) => (
                  <div key={colIndex} className="word-column">
                    {column.map((word) => (
                      <Word key={word} word={word} droppedWords={droppedWords} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </DndProvider>
        </div>
      )}
      <button onClick={handleSubmit}>Get Playlist</button>
    </div>
  );
};

export default MoodSelect;
