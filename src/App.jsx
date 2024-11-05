import "./App.css";
import Tesseract from "tesseract.js";
import { useState, useRef } from "react";
import { Camera } from "react-camera-pro";

const CameraComponent = ({ result, setResult }) => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState();
  const [showInput, setShowInput] = useState(false);

  const handleClick = () => {
    setShowInput(true);
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const processCameraImage = () => {
    setResult("");
    setProgress(0);
    Tesseract.recognize(image, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(m.progress);
        }
      },
    }).then(({ data: { text } }) => {
      setResult(text);
    });
  };

  const processImage = () => {
    setResult("");
    setProgress(0);
    Tesseract.recognize(file, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(m.progress);
        }
      },
    }).then(({ data: { text } }) => {
      setResult(text);
    });
  };

  const handleSave = () => {
    setShowInput(false);
  };

  const handleInputChange = (e) => {
    setResult(e.target.value.toUpperCase());
  };

  return (
    <div className="contentcontainer">
      <div className="cameracomponent">
        <Camera ref={camera} aspectRatio={16 / 9} facingMode="environment" />
      </div>
      {image !== null && <img src={image} alt="Taken photo" />}
      <button onClick={() => setImage(camera.current.takePhoto())}>
        Take photo
      </button>
      <h4>Upload photo 📂</h4>
      <input type="file" onChange={onFileChange} />
      <div className="submitbtns">
        <input type="button" value="Submit Upload" onClick={processImage} />
        <input
          type="button"
          value="Submit Photo"
          onClick={processCameraImage}
        />
        <input type="button" value="Submit Manually" onClick={handleClick} />
      </div>
      <div className="progresscontainer">
        <progress value={progress} max={1} />
      </div>
      {showInput && (
        <div>
          <input
            id="manual"
            type="text"
            value={result}
            onChange={handleInputChange}
            placeholder="Enter serial number"
          />
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

const DisplayResult = ({ result }) => {
  const snMatch = result.match(/S\/N:\s*([A-Z0-9-]+)/); // Capture text following "S/N:"
  const longMatches = result.match(/\b[A-Z0-9-]{8,}\b/g); // Capture uppercase alphanumeric sequences of 8+ characters

  const matches = [...(snMatch ? [snMatch[1]] : []), ...(longMatches || [])];

  return (
    <div>
      {matches.length > 0
        ? matches.map((e, index) => {
            return <button key={index}>{e}</button>;
            console.log(e);
          })
        : result !== "" && <p>No matches found</p>}
    </div>
  );
};

function App() {
  const [result, setResult] = useState("");

  return (
    <>
      <h1>ClientCTRL 💻</h1>
      <CameraComponent result={result} setResult={setResult} />
      <DisplayResult result={result} />
    </>
  );
}

export default App;
