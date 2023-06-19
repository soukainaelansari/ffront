import React, { useState, useRef, useEffect } from 'react';
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';
import axios from 'axios';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkLookupTable from '@kitware/vtk.js/Common/Core/LookupTable';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';


function VTKViewer(value, annotation) {
  const [file, setFile] = useState(null);
  const vtkContainerRef = useRef(null);
  const context = useRef(null);
  const [colorByField, setColorByField] = useState('');
  const [colorMapName, setColorMapName] = useState('Cool to Warm');

  const handleColorByFieldChange = (event) => {
    setColorByField(event.target.value);
  };

  const handleVisualize = async () => {
    if (!file) {
      console.error('No VTP file selected');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const baseUrl = 'http://localhost:8000';
      const uploadResponse = await axios.post(`${baseUrl}/model/upload-file-segment-downsampling-refined/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const vtpFileUrl = `${baseUrl}/model/vtp-file`;
      visualizeVTPFile(vtpFileUrl);
    } catch (error) {
      console.error('Error visualizing VTP file:', error);
    }
  };

const applyColorBy = () => {
  const {polyData, mapper} = context.current;

  const labelArray = vtkDataArray.newInstance({
    name: 'Label',
    values: polyData.getPointData().getArrayByName('Label').getData(),
  });
  polyData.getPointData().setScalars(labelArray);

  const lookupTable = vtkLookupTable.newInstance();
  lookupTable.setNumberOfColors(15); // Set the number of colors to match the number of classes
  lookupTable.build();

  const colorTransferFunction = vtkColorTransferFunction.newInstance();
  colorTransferFunction.setMappingRange(polyData.getPointData().getScalars().getRange());
  colorTransferFunction.updateRange();

  const colorMap = vtkColorMaps.getPresetByName('Cool to Warm');
  const table = [];

  for (let i = 0; i < colorMap.RGBPoints.length; i += 4) {
    const r = colorMap.RGBPoints[i];
    const g = colorMap.RGBPoints[i + 1];
    const b = colorMap.RGBPoints[i + 2];
    const x = colorMap.RGBPoints[i + 3];
    table.push(x, r, g, b);
  }

  const colors = [
    [1.0, 1.0, 1.0], // Class 0 (background) is white
    [0.0, 0.0, 1.0], // Class 1 is blue
    [0.0, 1.0, 0.0], // Class 2 is green
    [1.0, 1.0, 0.0], // Class 3 is yellow
    [1.0, 0.0, 1.0], // Class 4 is magenta
    [0.5, 0.0, 0.5], // Class 5 is purple
    [0.0, 0.5, 0.5], // Class 6 is teal
    [0.5, 0.5, 0.0], // Class 7 is olive
    [1.0, 0.0, 0.0], // Class 8 is red
    [0.5, 0.5, 0.5], // Class 9 is gray
    [0.0, 1.0, 1.0], // Class 10 is cyan
    [0.5, 0.0, 0.0], // Class 11 is dark red
    [0.5, 1.0, 0.0],
    [0.5, 0.5, 1.0],
    [0.5, 0.0, 1.0]
  ]
//   lookupTable.setTable(table);
//   lookupTable.setAnnotation(colors, annotation);
//
//   mapper.setLookupTable(lookupTable);
//   mapper.setScalarModeToUsePointData();
//   mapper.selectColorArray('Label', 'default');
//   mapper.setColorBy('Label');
//
//   context.current.fullScreenRenderer.render();
// };

  const annotation = ['Background', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Class 13', 'Class 14'];
  lookupTable.setTable(table);
  lookupTable.setAnnotation(colors, annotation);

  mapper.setLookupTable(lookupTable);
  mapper.setScalarModeToUsePointData();
  mapper.setUseLookupTableScalarRange(true);
  mapper.selectColorArray('Label', 'default');
  mapper.setColorBy('Label');

  context.current.fullScreenRenderer.render();
};

//   const applyColorBy = () => {
//   const { polyData, mapper } = context.current;
//
//   const labelArray = vtkDataArray.newInstance({
//     name: 'Label',
//     values: polyData.getPointData().getArrayByName('Label').getData(),
//   });
//   polyData.getPointData().setScalars(labelArray);
//
//   const lookupTable = vtkLookupTable.newInstance();
//   lookupTable.setHueRange(0.667, 0.0); // Set the hue range for the color map
//
//   const colorTransferFunction = vtkColorTransferFunction.newInstance();
//   colorTransferFunction.setMappingRange(polyData.getPointData().getScalars().getRange());
//   colorTransferFunction.updateRange();
//
//   lookupTable.applyColorMap(colorTransferFunction);
//
//   mapper.setLookupTable(lookupTable);
//   mapper.setScalarModeToUsePointData();
//   mapper.selectColorArray('Label', 'default');
//   mapper.setColorBy('Label');
//
//   context.current.fullScreenRenderer.render();
// };

  const visualizeVTPFile = (vtpFileUrl) => {
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      rootContainer: vtkContainerRef.current,
    });
    const renderer = fullScreenRenderer.getRenderer();
    const renderWindow = fullScreenRenderer.getRenderWindow();

    const vtpReader = vtkXMLPolyDataReader.newInstance();
    vtpReader.setUrl(vtpFileUrl).then(() => {
      const polyData = vtpReader.getOutputData(0);

      const mapper = vtkMapper.newInstance();
      mapper.setInputData(polyData);

      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);

      renderer.addActor(actor);

      if (colorByField !== '') {
        applyColorBy();
      }

      renderer.resetCamera();
      renderWindow.render();

      context.current = {
        fullScreenRenderer,
        vtpReader,
        polyData,
        mapper,
        actor,
      };
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    return () => {
      if (context.current) {
        const { fullScreenRenderer, vtpReader, polyData, mapper, actor } = context.current;
        if (vtpReader) vtpReader.delete();
        if (polyData) polyData.delete();
        if (mapper) mapper.delete();
        if (actor) actor.delete();
        if (fullScreenRenderer) fullScreenRenderer.delete();
      }
    };
  }, []);

  return (
    <div>
      <div ref={vtkContainerRef} />
      <table
        style={{
          position: 'absolute',
          top: '25px',
          left: '25px',
          background: 'white',
          padding: '12px',
        }}
      >
        <tbody>
          <tr>
            <td>
              <input type="file" accept=".vtp" onChange={handleFileChange} />
            </td>
          </tr>
          <tr>
            <td>

            </td>
          </tr>
          <tr>
            <td>
              <button type="button"  className="display-button" onClick={handleVisualize}>
                Predict
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VTKViewer;
