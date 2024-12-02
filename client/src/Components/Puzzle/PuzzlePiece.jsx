import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { createKeyframes, getOffset, FlexBoxWrapper } from "../../Utils.jsx";
import "./Puzzle.css";

/**
 * PuzzlePiece Component
 * 
 * Purpose:
 * - The PuzzlePiece component represents an individual puzzle piece in the calendar.
 * - It can be dragged and dropped within the calendar.
 * - It supports animations for adding or deleting a service.
 * 
 * Inputs:
 * - piece: The data for the puzzle piece, including its id, name, and color.
 * - animate: A string indicating the type of animation to apply to the piece.
 * - puzzlePieces: An array of all puzzle pieces in the calendar.
 * 
 * Outputs:
 * - JSX for rendering the puzzle piece with drag-and-drop functionality and animations.
 * 
 * Example Usage:
 * <PuzzlePiece
      puzzlePieces={puzzlePieces}
      key={index}
      piece={piece}
      animate={
        piece.id === animateDeleteId
        ? "animate-delete"
        : piece.id === animateAddId
        ? "animate-add"
        : null
      }
      pieceRef={pieceRef}
    />
 */

const PuzzlePiece = ({ piece, animate, puzzlePieces }) => {
  // useDrag hook to enable drag-and-drop functionality
  const [{ isDragging }, drag, preview] = useDrag({
    type: "service",
    item: { ...piece },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    isDragging: (monitor) => {
      return monitor.getItem().id === piece.id;
    },
  });
  const color = piece.backgroundColor || "#17a2b8";
  if (isDragging) {
  }

  // useEffect hook to handle animations
  useEffect(() => {
    if (animate) {
      const puzzleEl = document.getElementById(`piece${piece.id}`);
      const puzzleOffset = getOffset(puzzleEl);

      const addBinEl = document.getElementById("add-bin");
      const addBinOffset = getOffset(addBinEl);

      const garbageBinEl = document.getElementById("garbage-bin");
      const garbageBinOffset = getOffset(garbageBinEl);

      if (animate === "animate-delete") {
        const keyframeCSS = ` {
                from { transform: translate(0px, 0px) scale(1); }
                to { transform: translate(${
                  garbageBinOffset.left - puzzleOffset.left
                }px, ${garbageBinOffset.top - puzzleOffset.top}px) scale(0); }
              }`;
        createKeyframes("fadeToGarbageBin", keyframeCSS);
        animate = "fadeToGarbageBin";
      } else if (animate === "animate-add") {
        const keyframeCSS = ` {
                from { transform: translate(${
                  puzzlePieces.length % 2 !== 0
                    ? 0
                    : addBinOffset.left - puzzleOffset.left
                }px, ${addBinOffset.top}px) scale(0); }
                to { transform: translate(0px, 0px) scale(1); }
              }`;
        createKeyframes("fadeFromGarbageBin", keyframeCSS);
        animate = "fadeFromGarbageBin";
      }
    }
  }, [animate, piece.id]);

  const pieceClass = `puzzle-piece ${isDragging ? "dragging" : ""}`;
  // Return the JSX for the puzzle piece
  return (
    <div
      id={"piece" + piece.id}
      ref={drag}
      style={{
        cursor: "grab",
        backgroundColor: color,
        display: "flex",
      }}
      className={pieceClass}
    >
      <h1>
        {" "}
        <i className="fas fa-puzzle-piece"></i>
        {piece.name}
      </h1>
      <span>
        <h1>
          <i className="fas fa-clock"></i> {piece.duration} hrs
        </h1>
        <h1>
          <i className="fas fa-dollar-sign"></i> {piece.price}
        </h1>
      </span>
    </div>
  );
};

export default PuzzlePiece;
