import React, { useState, useEffect, useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import Calendar from "../Calendar/Calendar.jsx";
import Modal from "../Modal/Modal";
import GarbageBin from "../Calendar/GarbageBin";
import { createKeyframes, getOffset, FlexBoxWrapper } from "../../Utils.jsx";
import { InputForm } from "../Input/Input.jsx";
import { HexColorPicker } from "react-colorful";
import Tooltip, { TooltipProvider, useTooltip } from "../Providers/Tooltip";
import {
  supabase,
  getPersonnel,
  getServices,
  deleteService,
  addService,
} from "../../Database.jsx";
import "./Puzzle.css";

const PuzzlePiece = ({ piece, animate, puzzlePieces }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "service",
    item: { id: piece.id, name: piece.name, color: piece.color },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const color = piece.backgroundColor || "#17a2b8";

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

  const pieceClass = `puzzle-piece ${animate && animate}`;

  return (
    <div
      id={"piece" + piece.id}
      ref={drag}
      style={{
        cursor: "grab",
      }}
      className={pieceClass}
    >
      <div className="puzzle-content" style={{ color: color }}>
        <h1>{piece.name}</h1>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0,0,300,300"
      >
        <g transform="translate(-90,-40) scale(1.8,1.50)">
          <g fill="none">
            <g transform="translate(4.608,5.376) scale(2.56,2.56)">
              <path d="M21,64v16c0,2.761 2.239,5 5,5h48c2.761,0 5,-2.239 5,-5v-48c0,-2.761 -2.239,-5 -5,-5h-16.859v0c1.769,-1.803 2.859,-4.274 2.859,-7c0,-5.523 -4.477,-10 -10,-10c-5.523,0 -10,4.477 -10,10c0,2.725 1.09,5.196 2.859,7h-0.999h-15.86c-2.761,0 -5,2.239 -5,5v15v1.859c1.804,-1.769 4.274,-2.859 7,-2.859c5.523,0 10,4.477 10,10c0,5.523 -4.477,10 -10,10c-2.726,0 -5.196,-1.09 -7,-2.859z"></path>
              <path
                d="M53.93,24.35c-0.127,0 -0.253,-0.048 -0.351,-0.144c-0.196,-0.193 -0.199,-0.51 -0.006,-0.707c0.92,-0.937 1.427,-2.18 1.427,-3.499c0,-0.276 0.224,-0.5 0.5,-0.5c0.276,0 0.5,0.224 0.5,0.5c0,1.583 -0.608,3.074 -1.714,4.2c-0.098,0.1 -0.226,0.15 -0.356,0.15zM46.07,24.35c-0.13,0 -0.259,-0.05 -0.356,-0.149c-1.106,-1.127 -1.714,-2.618 -1.714,-4.201c0,-3.309 2.691,-6 6,-6c0.276,0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5c-2.757,0 -5,2.243 -5,5c0,1.319 0.507,2.562 1.427,3.499c0.193,0.197 0.19,0.514 -0.006,0.707c-0.098,0.096 -0.225,0.144 -0.351,0.144zM62.5,81h-22c-0.276,0 -0.5,-0.224 -0.5,-0.5c0,-0.276 0.224,-0.5 0.5,-0.5h22c0.276,0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5zM71.5,81h-5c-0.276,0 -0.5,-0.224 -0.5,-0.5c0,-0.276 0.224,-0.5 0.5,-0.5h5c0.276,0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5zM74.5,75c-0.276,0 -0.5,-0.224 -0.5,-0.5v-28c0,-0.276 0.224,-0.5 0.5,-0.5c0.276,0 0.5,0.224 0.5,0.5v28c0,0.276 -0.224,0.5 -0.5,0.5zM74.5,44c-0.276,0 -0.5,-0.224 -0.5,-0.5v-1c0,-0.276 0.224,-0.5 0.5,-0.5c0.276,0 0.5,0.224 0.5,0.5v1c0,0.276 -0.224,0.5 -0.5,0.5zM74.5,40c-0.276,0 -0.5,-0.224 -0.5,-0.5v-3c0,-0.276 0.224,-0.5 0.5,-0.5c0.276,0 0.5,0.224 0.5,0.5v3c0,0.276 -0.224,0.5 -0.5,0.5zM74.5,35c-0.276,0 -0.5,-0.224 -0.5,-0.5v-2.5h-5.5c-0.276,0 -0.5,-0.224 -0.5,-0.5c0,-0.276 0.224,-0.5 0.5,-0.5h5.5c0.561,0 1,0.439 1,1v2.5c0,0.276 -0.224,0.5 -0.5,0.5z"
                fill={color}
              ></path>
              <g fill={color}>
                <path d="M74,86h-48c-3.309,0 -6,-2.691 -6,-6v-16.858c0,-0.402 0.241,-0.766 0.612,-0.922c0.372,-0.155 0.8,-0.074 1.088,0.208c1.693,1.658 3.93,2.572 6.3,2.572c4.963,0 9,-4.037 9,-9c0,-4.963 -4.037,-9 -9,-9c-2.37,0 -4.607,0.914 -6.3,2.572c-0.288,0.284 -0.716,0.365 -1.088,0.208c-0.371,-0.156 -0.612,-0.519 -0.612,-0.922v-16.858c0,-3.309 2.691,-6 6,-6h14.776c-1.155,-1.771 -1.776,-3.84 -1.776,-6c0,-6.065 4.935,-11 11,-11c6.065,0 11,4.935 11,11c0,2.16 -0.621,4.229 -1.777,6h14.777c3.309,0 6,2.691 6,6v48c0,3.309 -2.691,6 -6,6zM22,65.223v14.777c0,2.206 1.794,4 4,4h48c2.206,0 4,-1.794 4,-4v-48c0,-2.206 -1.794,-4 -4,-4h-16.859c-0.402,0 -0.766,-0.241 -0.922,-0.612c-0.156,-0.372 -0.074,-0.8 0.208,-1.088c1.659,-1.693 2.573,-3.93 2.573,-6.3c0,-4.963 -4.037,-9 -9,-9c-4.963,0 -9,4.037 -9,9c0,2.371 0.914,4.608 2.572,6.3c0.282,0.288 0.364,0.716 0.208,1.088c-0.156,0.371 -0.519,0.612 -0.922,0.612h-16.858c-2.206,0 -4,1.794 -4,4v14.777c1.771,-1.156 3.841,-1.777 6,-1.777c6.065,0 11,4.935 11,11c0,6.065 -4.935,11 -11,11c-2.159,0 -4.229,-0.621 -6,-1.777z"></path>
              </g>
            </g>
          </g>
        </g>
      </svg>
      {/* <p>{piece.duration} hrs</p>
      <p>${piece.price}</p> */}
    </div>
  );
};

const PuzzleContainer = ({
  onDeleteService,
  onDrop,
  personID,
  handleSelectedSlot,
  onAddService,
  deletedService,
  addedService,
  puzzlePieces,
  handlePersonnelServiceUpdate,
  personnelServices,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["puzzlePiece"],
    drop: (item, monitor) => {
      onDrop(item); // Call the onDrop function passed as prop with the dropped item
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const [animateDeleteId, setAnimateDeleteId] = useState(null);
  const [animateAddId, setAnimateAddId] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pieceRef = useRef(null);

  useEffect(() => {
    if (deletedService) {
      setAnimateDeleteId(deletedService.id);
    }
  }, [deletedService]);

  useEffect(() => {
    if (addedService) {
      setAnimateAddId(addedService.id);
    }
  }, [addedService]);

  const [{ isBinOver }, dropRef] = useDrop({
    accept: ["service"],
    drop: (item, monitor) => {
      onDeleteService(item);
    },
    collect: (monitor) => ({
      isBinOver: monitor.isOver(),
    }),
  });

  return (
    <>
      <div
        ref={drop}
        className={`main-body ${collapsed && "collapsed"}`}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: isOver && canDrop ? "lightblue" : "#2D2D2A",
          position: "relative",
        }}
      >
        <Calendar
          personID={personID}
          handleSelectedSlot={(e) => handleSelectedSlot(e)}
          puzzlePieces={puzzlePieces}
          handlePersonnelServiceUpdate={(e) => handlePersonnelServiceUpdate(e)}
          personnelServices={personnelServices}
        />

        <div className={`pieces-container`}>
          <i
            className={`fa-solid fa-chevron-${!collapsed ? "right" : "left"}`}
            onClick={() => setCollapsed(!collapsed)}
          ></i>
          <div className="pieces-main">
            {puzzlePieces?.map((piece, index) => (
              // <Tooltip
              //   tooltipText={piece.description}
              //   theme={{ color: piece?.backgroundColor }}
              //   direction="down"
              // >
              <PuzzlePiece
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
              // </Tooltip>
            ))}
          </div>
          <div className={`pieces-footer`}>
            <Tooltip tooltipText="Add Service" theme={{ color: "primary" }}>
              <div
                className="green"
                id="add-bin"
                onClick={() => setIsOpen(true)}
              >
                <i className="fas fa-plus"></i>
              </div>
            </Tooltip>
            {/* <Tooltip
              tooltipText="Delete Service"
              theme={{ color: "secondary" }}
            > */}
            <div
              id="garbage-bin"
              className={`${isBinOver ? "is-over" : "no"}`}
              ref={dropRef}
            >
              <i class="fa-regular fa-trash-can"></i>
            </div>
            {/* </Tooltip> */}
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <InputForm
          id="add-service"
          states={[
            { id: "serviceName", type: "name", label: "Service Name" },
            { id: "duration", type: "number", label: "Duration (hrs)" },
            { id: "price", type: "number", label: "Price ($)" },
            { id: "description", type: "textarea", label: "Description" },
            {
              id: "backgroundColor",
              type: "color",
              label: "Color",
              child: <HexColorPicker />,
            },
          ]}
          onClose={() => setIsOpen(false)}
          onSubmit={(states) => {
            onAddService({
              name: states.serviceName,
              duration: states.duration,
              price: states.price,
              backgroundColor: states.backgroundColor,
              description: states.description,
            });
          }}
          buttonLabel="Add Service"
        ></InputForm>
      </Modal>
    </>
  );
};

export default PuzzleContainer;
