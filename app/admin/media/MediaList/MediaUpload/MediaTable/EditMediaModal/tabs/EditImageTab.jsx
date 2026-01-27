import React, { useState } from "react";
import { MdOutlineCrop, MdOutlinePhotoFilter } from "react-icons/md";
import { FiRotateCcw } from "react-icons/fi";
import { TfiFullscreen } from "react-icons/tfi";

const EditImageTab = ({ details, editImage, onChange }) => {
  const [activeTool, setActiveTool] = useState(null);

  const toggleTool = (tool) => {
    setActiveTool(activeTool === tool ? null : tool);
  };

  return (
    <div className="emm-main">
      {/* Image Preview */}
      <img
  src={details.previewUrl || details.url || "/assets/media1.png"}
  alt="preview"
  className="emm-preview-img"
  style={{
    transform: `rotate(${editImage.rotate || 0}deg)`,
    filter: `${editImage.filter || ""} brightness(${editImage.filterIntensity}%)`,

    // --- APPLY SIZE (crop → resize → fallback) ---
    width:
      editImage.resizeWidth ||
      editImage.cropWidth ||
      "auto",

    height:
      editImage.resizeHeight ||
      editImage.cropHeight ||
      "auto",

    objectFit: "cover",
  }}
/>


      <div className="emm-right">
        <label>Image Tools</label>

        {/* Buttons */}
        <div className="emm-tools">
          <button className="emm-tool-btn" onClick={() => toggleTool("crop")}>
            <MdOutlineCrop size={17} /> Crop
          </button>

          <button
            className="emm-tool-btn"
            onClick={() => toggleTool("resize")}
          >
            <TfiFullscreen size={15} /> Resize
          </button>

          <button
            className="emm-tool-btn"
            onClick={() =>
              onChange({ rotate: ((editImage.rotate || 0) + 90) % 360 })
            }
          >
            <FiRotateCcw size={15} /> Rotate
          </button>

          <button
            className="emm-tool-btn"
            onClick={() => toggleTool("filter")}
          >
            <MdOutlinePhotoFilter size={17} /> Filters
          </button>
        </div>

        {/* CROP TOOL */}
        {activeTool === "crop" && (
          <div className="emm-tool-panel">
            <label>Aspect Ratio</label>
            <select
              value={editImage.aspectRatio}
              onChange={(e) => onChange({ aspectRatio: e.target.value })}
            >
              <option value="free">Free</option>
              <option value="1:1">1 : 1 (Square)</option>
              <option value="16:9">16 : 9</option>
              <option value="4:3">4 : 3</option>
            </select>

            <label>Crop Size</label>
            <div className="emm-row">
              <input
                type="number"
                placeholder="Width"
                value={editImage.cropWidth}
                onChange={(e) =>
                  onChange({ cropWidth: Number(e.target.value) })
                }
              />
              <input
                type="number"
                placeholder="Height"
                value={editImage.cropHeight}
                onChange={(e) =>
                  onChange({ cropHeight: Number(e.target.value) })
                }
              />
            </div>
          </div>
        )}

        {/* RESIZE TOOL */}
        {activeTool === "resize" && (
          <div className="emm-tool-panel">
            <label>Resize</label>

            <div className="emm-aspect-toggle">
              <input
                type="checkbox"
                checked={editImage.keepAspect}
                onChange={() =>
                  onChange({ keepAspect: !editImage.keepAspect })
                }
              />
              <span>Keep aspect ratio</span>
            </div>

            <div className="emm-row">
              <input
                type="number"
                placeholder="Width"
                value={editImage.resizeWidth}
                onChange={(e) =>
                  onChange({ resizeWidth: Number(e.target.value) })
                }
              />
              <input
                type="number"
                placeholder="Height"
                value={editImage.resizeHeight}
                onChange={(e) =>
                  onChange({ resizeHeight: Number(e.target.value) })
                }
              />
            </div>
          </div>
        )}

        {/* FILTERS TOOL */}
        {activeTool === "filter" && (
          <div className="emm-tool-panel">
            <label>Filter</label>
            <select
              value={editImage.filter}
              onChange={(e) => onChange({ filter: e.target.value })}
            >
              <option value="">None</option>
              <option value="grayscale(100%)">Grayscale</option>
              <option value="sepia(80%)">Sepia</option>
              <option value="contrast(130%)">High Contrast</option>
              <option value="saturate(180%)">Saturated</option>
            </select>

            <label>Intensity</label>
            <input
              type="range"
              min="50"
              max="150"
              value={editImage.filterIntensity}
              onChange={(e) =>
                onChange({ filterIntensity: Number(e.target.value) })
              }
            />
          </div>
        )}

        {/* Quality + Format */}
        <div className="emm-param">
          <label>Quality</label>
          <select
            value={editImage.quality}
            onChange={(e) => onChange({ quality: e.target.value })}
          >
            <option value="original">High (best)</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <label>Format</label>
          <select
            value={editImage.format}
            onChange={(e) => onChange({ format: e.target.value })}
          >
            <option value="original">Original</option>
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EditImageTab;
