import React from "react";

/**
 * Puzzle Component
 *
 * Purpose:
 * - The Puzzle component provides a container for displaying a puzzle piece.
 * - It uses an SVG element to render the shape of a puzzle piece.
 * - The component accepts children, allowing for additional content to be displayed within the puzzle piece.
 *
 * Inputs:
 * - children: The content to be displayed inside the puzzle piece.
 * - ref: A ref object to be attached to the root div element of the component.
 * - style: An object containing CSS styles to be applied to the root div element.
 * - className: A string containing additional CSS class names to be applied to the root div element.
 * - color: A string representing the fill color of the puzzle piece SVG.
 *
 * Outputs:
 * - JSX for rendering a div element containing the puzzle piece SVG and any children passed to the component.
 */

const Puzzle = ({ children, ref, style, className, color }) => {
  return (
    <div className={className} style={style} ref={ref}>
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0,0,256,256"
      >
        <g transform="translate(-32,-32) scale(1.25,1.25)">
          <g
            fill="none"
            fill-rule="nonzero"
            stroke="none"
            stroke-width="1"
            stroke-linecap="butt"
            stroke-linejoin="miter"
            stroke-miterlimit="10"
            stroke-dasharray=""
            stroke-dashoffset="0"
            font-family="none"
            font-weight="none"
            font-size="none"
            text-anchor="none"
          >
            <g transform="translate(4.608,5.376) scale(2.56,2.56)">
              <path
                d="M21,64v16c0,2.761 2.239,5 5,5h48c2.761,0 5,-2.239 5,-5v-48c0,-2.761 -2.239,-5 -5,-5h-16.859v0c1.769,-1.803 2.859,-4.274 2.859,-7c0,-5.523 -4.477,-10 -10,-10c-5.523,0 -10,4.477 -10,10c0,2.725 1.09,5.196 2.859,7h-0.999h-15.86c-2.761,0 -5,2.239 -5,5v15v1.859c1.804,-1.769 4.274,-2.859 7,-2.859c5.523,0 10,4.477 10,10c0,5.523 -4.477,10 -10,10c-2.726,0 -5.196,-1.09 -7,-2.859z"
                fill={color}
              ></path>
              <path
                d="M53.93,24.35c-0.127,0 -0.253,-0.048 -0.351,-0.144c-0.196,-0.193 -0.199,-0.51 -0.006,-0.707c0.92,-0.937 1.427,-2.18 1.427,-3.499c0,-0.276 0.224,-0.5 0.5,-0.5c0.276,0 0.5,0.224 0.5,0.5c0,1.583 -0.608,3.074 -1.714,4.2c-0.098,0.1 -0.226,0.15 -0.356,0.15zM46.07,24.35c-0.13,0 -0.259,-0.05 -0.356,-0.149c-1.106,-1.127 -1.714,-2.618 -1.714,-4.201c0,-3.309 2.691,-6 6,-6c0.276,0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5c-2.757,0 -5,2.243 -5,5c0,1.319 0.507,2.562 1.427,3.499c0.193,0.197 0.19,0.514 -0.006,0.707c-0.098,0.096 -0.225,0.144 -0.351,0.144zM62.5,81h-22c-0.276,0 -0.5,-0.224 -0.5,-0.5c0,-0.276 0.224,-0.5 0.5,-0.5h22c0.276,0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5zM71.5,81h-5c-0.276,0 -0.5,-0.224 -0.5,-0.5c0,-0.276 0.224,-0.5 0.5,-0.5h5c0.276,0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5zM74.5,75c-0.276,0 -0.5,-0.224 -0.5,-0.5v-28c0,-0.276 0.224,-0.5 0.5,-0.5c0.276,0 0.5,0.224 0.5,0.5v28c0,0.276 -0.224,0.5 -0.5,0.5zM74.5,44c-0.276,0 -0.5,-0.224 -0.5,-0.5v-1c0,-0.276 0.224,-0.5 0.5,-0.5c0.276,0 0.5,0.224 0.5,0.5v1c0,0.276 -0.224,0.5 -0.5,0.5zM74.5,40c-0.276,0 -0.5,-0.224 -0.5,-0.5v-3c0,-0.276 0.224,-0.5 0.5,-0.5c0.276,0 0.5,0.224 0.5,0.5v3c0,0.276 -0.224,0.5 -0.5,0.5zM74.5,35c-0.276,0 -0.5,-0.224 -0.5,-0.5v-2.5h-5.5c-0.276,0 -0.5,-0.224 -0.5,-0.5c0,-0.276 0.224,-0.5 0.5,-0.5h5.5c0.561,0 1,0.439 1,1v2.5c0,0.276 -0.224,0.5 -0.5,0.5z"
                fill="#1f212b"
              ></path>
              <g fill="#1f212b">
                <path d="M74,86h-48c-3.309,0 -6,-2.691 -6,-6v-16.858c0,-0.402 0.241,-0.766 0.612,-0.922c0.372,-0.155 0.8,-0.074 1.088,0.208c1.693,1.658 3.93,2.572 6.3,2.572c4.963,0 9,-4.037 9,-9c0,-4.963 -4.037,-9 -9,-9c-2.37,0 -4.607,0.914 -6.3,2.572c-0.288,0.284 -0.716,0.365 -1.088,0.208c-0.371,-0.156 -0.612,-0.519 -0.612,-0.922v-16.858c0,-3.309 2.691,-6 6,-6h14.776c-1.155,-1.771 -1.776,-3.84 -1.776,-6c0,-6.065 4.935,-11 11,-11c6.065,0 11,4.935 11,11c0,2.16 -0.621,4.229 -1.777,6h14.777c3.309,0 6,2.691 6,6v48c0,3.309 -2.691,6 -6,6zM22,65.223v14.777c0,2.206 1.794,4 4,4h48c2.206,0 4,-1.794 4,-4v-48c0,-2.206 -1.794,-4 -4,-4h-16.859c-0.402,0 -0.766,-0.241 -0.922,-0.612c-0.156,-0.372 -0.074,-0.8 0.208,-1.088c1.659,-1.693 2.573,-3.93 2.573,-6.3c0,-4.963 -4.037,-9 -9,-9c-4.963,0 -9,4.037 -9,9c0,2.371 0.914,4.608 2.572,6.3c0.282,0.288 0.364,0.716 0.208,1.088c-0.156,0.371 -0.519,0.612 -0.922,0.612h-16.858c-2.206,0 -4,1.794 -4,4v14.777c1.771,-1.156 3.841,-1.777 6,-1.777c6.065,0 11,4.935 11,11c0,6.065 -4.935,11 -11,11c-2.159,0 -4.229,-0.621 -6,-1.777z"></path>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Puzzle;
