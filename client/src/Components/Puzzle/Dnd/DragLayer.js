import React from "react";
import { useDragLayer } from "react-dnd";
import DragPreview from "./DragPreview";

/**
 * DragLayer Component
 *
 * Purpose:
 * - Custom layer component for rendering a drag preview during drag-and-drop actions.
 * - Enhances the user interface by displaying an item preview that follows the cursor while dragging.
 *
 *
 * Drag and Drop:
 * - `useDragLayer`: A custom hook from `react-dnd` used to monitor and retrieve the current drag state, including:
 *   - `item`: The item being dragged.
 *   - `itemType`: The type of item, allowing conditional rendering.
 *   - `currentOffset`: Coordinates of the drag preview relative to the viewport.
 *   - `isDragging`: Boolean indicating if an item is currently being dragged.
 *
 * Functions:
 * - `renderItem`: Renders the appropriate preview component based on the `itemType`.
 *   - Currently supports rendering `DragPreview` for `page` items.
 *
 * Notes:
 * - Ensure `DragPreview` is defined and accepts `pagesDragStack` as a prop for `page` items.
 * - This component is memoized with `React.memo` to prevent unnecessary re-renders during drag events.
 */



const layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 999,
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

const getItemStyles = (currentOffset) => {
  if (!currentOffset) {
    return {
      display: "none",
    };
  }
  const { x, y } = currentOffset;
  return {
    transform: `translate(${x}px, ${y}px)`,
    filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.45))",
  };
};

const DragLayer = React.memo(function DragLayer() {
  const { itemType, isDragging, item, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  const renderItem = (type, item) => {
    switch (type) {
      case "page":
        return <DragPreview pages={item.pagesDragStack} />;
      default:
        return null;
    }
  };
  if (!isDragging) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(currentOffset)}>
        {renderItem(itemType, item)}
      </div>
    </div>
  );
});
export default DragLayer;
