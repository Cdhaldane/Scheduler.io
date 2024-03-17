import React, { useState, useEffect, useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import Calendar from "../Calendar/Calendar.jsx";
import Modal from "../Modal/Modal";
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
    item: { ...piece },
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
        backgroundColor: color,
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
          <i class="fas fa-clock"></i> {piece.duration} hrs
        </h1>
        <h1>
          <i class="fas fa-dollar-sign"></i> {piece.price}
        </h1>
      </span>
    </div>
  );
};

const PuzzleContainer = ({
  onDeleteService,
  onDrop,
  personID,
  onAddService,
  deletedService,
  addedService,
  puzzlePieces,
  handlePersonnelServiceUpdate,
  personnelServices,
  ...calendarProps
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["puzzlePiece"],
    drop: (item, monitor) => {
      onDrop(item);
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
      <div ref={drop} className={`main-body ${collapsed && "collapsed"}`}>
        <Calendar {...calendarProps} puzzlePieces={puzzlePieces} />

        <div className={`main-right`}>
          <div className="pieces-container">
            <div className="pieces-main">
              <i
                className={`fa-solid fa-caret-${!collapsed ? "right" : "left"}`}
                onClick={() => setCollapsed(!collapsed)}
              ></i>
              <h1>
                <i className="fas fa-puzzle-piece icon-right"></i> Services
              </h1>
              <div className="pieces-list">
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
