import React from "react";
import PuzzlePiece from "../PuzzlePiece";

/**
 * PagesDragPreview Component
 *
 * Purpose:
 * - Displays a stacked preview of draggable pages, layering multiple "back previews" to give a sense of depth and movement.
 * - Provides a visual preview for up to three pages from the `pages` array when dragging.
 *
 *
 * Input:
 * - `pages` (Array): A list of page objects to display in the drag preview.
 *    - Each page should have:
 *      - `id` (String or Number): A unique identifier for the page.
 *      - `content` (String): The content to be displayed in each `PuzzlePiece` component.
 *
 * Output:
 * - Renders up to three `PuzzlePiece` components with each page’s content.
 *
 * Notes:
 * - Ensure the `PuzzlePiece` component is defined and accepts a `content` prop to render each page’s details.
 * - This component is memoized with `React.memo` to optimize re-renders during drag-and-drop interactions.
 */


const PagesDragPreview = React.memo(function PagesDragPreview({ pages }) {
  let backPreviews = 1;
  if (pages.length === 2) {
    backPreviews = 2;
  } else if (pages.length >= 3) {
    backPreviews = 3;
  }

  return (
    <div>
      {pages.slice(0, backPreviews).map((page, i) => (
        <div
          key={page.id}
          style={{
            zIndex: pages.length - i,
            transform: `rotateZ(${-i * 2.5}deg)`,
            height: "0px",
            width: "0px",
          }}
        >
          <PuzzlePiece content={page.content} />
        </div>
      ))}
    </div>
  );
});

export default PagesDragPreview;
