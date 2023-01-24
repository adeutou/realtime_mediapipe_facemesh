import { useRef, useEffect } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as Facemesh from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import { drawConnectors } from '@mediapipe/drawing_utils';
import Webcam from 'react-webcam';

import './App.css';

function App() {
  // Setup references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var camera = null;
  const connect = window.drawConnectors;

  const onResults = async (results) => {
    //console.log(results);

    // Set canvas width and height
    canvasRef.current.width = webcamRef.current.video.videoWidth;
    canvasRef.current.height = webcamRef.current.video.videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks){
      for (const landmarks of results.multiFaceLandmarks) {
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION,
                       {color: '#C0C0C070', lineWidth: 0.5});
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {color: '#C0C0C070'});
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_IRIS, {color: '#C0C0C070'});
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {color: '#C0C0C070'});
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_IRIS, {color: '#30FF30'});
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {color: '#C0C0C070'});
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {color: '#C0C0C070'});
      }
    }
  }

  useEffect(() => {
    const faceMesh = new FaceMesh({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }});

    faceMesh.setOptions({
      maxNumFaces: 3,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame:async () => {
          await faceMesh.send({image:webcamRef.current.video})
        },
        width: 640,
        height: 480
      });
      camera.start();
    }
  });


  return (
    <div className="App">
      <header className='App-header'>
        <Webcam 
          ref={webcamRef} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480
          }} 
        />   
        <canvas 
          ref={canvasRef} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480
          }} 
        />
      </header>
    </div>
  );
}

export default App;
