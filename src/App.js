import React, { useState ,useRef} from 'react';
import ThreeScene from './components/visualize';
import VTKViewer from './components/vtkviewer';
import {NavBar} from "./components/navbar.js";
import { Banner } from "./components/Banner";
import { Why } from "./components/Why";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { About } from "./components/about";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [fileType, setFileType] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const inputRef = useRef();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file.name.endsWith('.obj') || file.name.endsWith('.stl')) {
      setFileType('3D');
    } else if (file.name.endsWith('.vtp')) {
      setFileType('VTK');
    } else {
      setFileType('');
    }

    setFileUploaded(true);
  };
  const handleButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="App">
      <NavBar />
       <Banner />
        <Why />

      {/* ... */}
      <section className="visualizer"  id="upload">
        {/*<h2>Upload, Display, and Predict Models</h2>*/}
        {!fileUploaded && (
            <div className="file-inputs">
                <h1> Upload 3D Object</h1>
          <input type="file" accept=".obj,.stl,.vtp" onChange={handleFileUpload} ref={inputRef}  style={{ display: 'none' }} />
             <button type="button"  className="upload-button" onClick={handleButtonClick}>
                          <i>
                            <FontAwesomeIcon icon={faPlus} />
                        </i>Upload</button>
                </div>




        )}
          <p className="main">Supported files</p>
                <p className="info">OBJ, STL, PLY, VTP, GLB, GLTG, FBX</p>


        {fileType === '3D' && <ThreeScene />}
        {fileType === 'VTK' && <VTKViewer />}
      </section>

        <About />
         <Contact />
        <Footer />
    </div>
  )
}

export default App;
