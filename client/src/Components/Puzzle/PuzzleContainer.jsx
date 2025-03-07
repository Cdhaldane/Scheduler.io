import React, { useState, useEffect, useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import Calendar from "../Calendar/Calendar.jsx";
import Modal from "../../DevComponents/Modal/Modal.jsx";
import { InputForm } from "../../DevComponents/Input/Input.jsx";
import { HexColorPicker } from "react-colorful";
import PuzzlePiece from "./PuzzlePiece.jsx";
import Tooltip, {
  TooltipProvider,
  useTooltip,
} from "../../DevComponents/Providers/Tooltip.jsx";
import {
  supabase,
  getPersonnel,
  getServices,
  deleteService,
  addService,
} from "../../Database.jsx";
import "./Puzzle.css";
import { handleTwoWayCollapse } from "../../Utils.jsx";

/**
 * PuzzleContainer Component
 *
 * Purpose:
 * - The PuzzleContainer component contains the calendar and the puzzle pieces.
 * - It manages the drag-and-drop functionality and animations for the puzzle pieces.
 *
 * Inputs:
 * - onDrop: A callback function that is called when a puzzle piece is dropped.
 * - onDeleteService: A callback function that is called when a service is deleted.
 * - personID: The ID of the person associated with the calendar.
 * - handleSelectedSlot: A callback function for handling slot selection.
 * - onAddService: A callback function that is called when a service is added.
 * - deletedService: The service that was recently deleted.
 * - addedService: The service that was recently added.
 * - puzzlePieces: An array of all puzzle pieces in the calendar.
 * - fetchData: A function for fetching data.
 * - session: The current user session object.
 *
 * Outputs:
 * - JSX for rendering the calendar with the puzzle pieces, including the add and delete buttons.
 */

const PuzzleContainer = ({
  onDeleteService,
  onDrop,
  personID,
  onAddService,
  deletedService,
  addedService,
  puzzlePieces,
  personnelServices,
  organization,
  ...calendarProps
}) => {
  // State hooks and useDrop hook for drag-and-drop functionality
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
  const [isOpen, setIsOpen] = useState(false);
  const pieceRef = useRef(null);
  const isMobile = window.innerWidth <= 768;
  const [mobileOpen, setMobileOpen] = useState(isMobile ? false : true);

  //Effect hooks for handling animations when a service is deleted or added
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

  //Render the JSX for the PuzzleContainer
  return (
    <>
      <div className={`pieces-container`}>
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
        <div className={`pieces-footer`}>
          <Tooltip tooltipText="Add Service" theme={{ color: "primary" }}>
            <div
              className="puzzle-footer-buttons"
              id="add-bin"
              onClick={() => setIsOpen(true)}
            >
              <i className="fas fa-plus"></i>
            </div>
          </Tooltip>
          <Tooltip
            tooltipText="Delete Service"
            theme={{ color: "secondary" }}
            className="puzzle-footer-buttons"
          >
            <div
              id="garbage-bin"
              className={`puzzle-footer-buttons  ${
                isBinOver ? "is-over" : "no"
              }`}
              ref={dropRef}
            >
              <i className="fa-regular fa-trash-can"></i>
            </div>
          </Tooltip>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <InputForm
          id="add-service"
          states={[
            { id: "serviceName", label: "Service Name" },
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
              organization_id: organization?.id,
            });
          }}
          buttonLabel="Add Service"
        ></InputForm>
      </Modal>
    </>
  );
};

export default PuzzleContainer;
