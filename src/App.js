import React, { useCallback, useEffect, useRef, useState } from "react";
import { boxesIntersect, useSelectionContainer } from "react-drag-to-select";

const MouseSelection = React.memo(({ onSelectionChange }) => {
  const { DragSelection } = useSelectionContainer({
    eventsElement: document.getElementById("root"),
    onSelectionChange,
    onSelectionStart: () => {
      console.log("OnSelectionStart");
    },
    onSelectionEnd: () => console.log("OnSelectionEnd")
  });

  return <DragSelection />;
});

const App = () => {
  const [selectionBox, setSelectionBox] = useState();
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const selectableItems = useRef([]);

  useEffect(() => {
    const elementsContainer = document.getElementById("elements-container");
    if (elementsContainer) {
      Array.from(elementsContainer.childNodes).forEach((item) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        selectableItems.current.push({
          left,
          top,
          width,
          height
        });
      });
    }
  }, []);

  const handleSelectionChange = useCallback(
    (box) => {
      setSelectionBox(box);
      const indexesToSelect = [];
      selectableItems.current.forEach((item, index) => {
        if (boxesIntersect(box, item)) {
          indexesToSelect.push(index);
        }
      });

      setSelectedIndexes(indexesToSelect);
    },
    [selectableItems]
  );

  return (
    <div className="container">
      <MouseSelection onSelectionChange={handleSelectionChange} />
      <div id="elements-container" className="elements-container">
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className={`element ${
              selectedIndexes.includes(i) ? "selected" : ""
            } `}
          />
        ))}
      </div>

      <div className="selection-box-info">
        Selection Box:
        <div>top: {selectionBox?.top || ""}</div>
        <div>left: {selectionBox?.left || ""}</div>
        <div>width: {selectionBox?.width || ""}</div>
        <div>height: {selectionBox?.height || ""}</div>
      </div>
    </div>
  );
};

export default App;
