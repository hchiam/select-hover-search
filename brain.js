(function() {

let isSearching = false;
let mouseX = 0;
let mouseY = 0;
let timer;

document.addEventListener("mousemove", function(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

document.addEventListener("mouseup", function(event) {
  let outerHTML = window.getSelection().anchorNode && window.getSelection().anchorNode.outerHTML;
  let isInputOrTextArea = (outerHTML && (outerHTML.includes('<input') || outerHTML.includes('<textarea')));
  if (isInputOrTextArea) {
    return;
  }

  let selectedText = String(window.getSelection());
  if (!selectedText.trim()) {
    return;
  }

  let selectedTextTooLong = (selectedText.length > 100);
  if (selectedTextTooLong) {
    return;
  }

  let mouseQuadrant = getMouseQuadrant(event);
  let mouseCoordinates = getMouseCoordinates(event);

  showIcons(selectedText, mouseQuadrant, mouseCoordinates);
});

function getMouseQuadrant(event) {
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  let left = event.clientX;
  let top = event.clientY;
  if (left <= width / 2 && top <= height / 2) {
    return 1;
  } else if (left <= width / 2 && top > height / 2) {
    return 3;
  } else if (left > width / 2 && top <= height / 2) {
    return 2;
  } else if (left > width / 2 && top > height / 2) {
    return 4;
  }
}

function getMouseCoordinates(event) {
  let left = event.clientX;
  let top = event.clientY;
  return [left, top];
}

// show icons
// for 1 second
// in quadrants the mouse is not in
function showIcons(selectedText, mouseQuadrant, mouseCoordinates) {
  removeQuadrantButtons();
  createBackground();
  let searchEngineList = [{
      'searchEngine': 'Google',
      'urlStart': 'https://www.google.com/search?q='
    },
    {
      'searchEngine': 'Wiktionary',
      'urlStart': 'https://en.wiktionary.org/wiki/'
    },
    {
      'searchEngine': 'Reddit ELI5',
      'urlStart': 'https://www.google.com/search?q=site:reddit.com "eli5" '
    },
    {
      'searchEngine': '(exit)',
      'urlStart': ''
    }
  ];
  let searchEngineIndex = 0;
  let quadrantsToUse = [];
  let quadrantsToUseIndex = 0;
  quadrantsToUse = [4, 6, 7, 5];
  // switch (mouseQuadrant) {
  //   case 1:
  //     quadrantsToUse = [5, 7, 8, 1];
  //     break;
  //   case 2:
  //     quadrantsToUse = [4, 6, 7, 3];
  //     break;
  //   case 3:
  //     quadrantsToUse = [2, 3, 5, 6];
  //     break;
  //   case 4:
  //     quadrantsToUse = [1, 2, 4, 8];
  //     break;
  // }
  for (let i = 1; i <= 4 && searchEngineIndex < searchEngineList.length; i++) {
    let quadrantToUse = quadrantsToUse[quadrantsToUseIndex];
    let searchEngine = searchEngineList[searchEngineIndex].searchEngine;
    let urlStart = searchEngineList[searchEngineIndex].urlStart;
    createQuadrantButton(quadrantToUse, mouseCoordinates, searchEngine, selectedText, urlStart);
    searchEngineIndex++;
    quadrantsToUseIndex++;
  }
  clearTimeout(timer);
  timer = setTimeout(function() {
    removeQuadrantButtons();
    isSearching = false;
  }, 1000);
}

function removeQuadrantButtons() {
  var quadrantButtons = document.getElementsByClassName('select-hover-search-quadrants');
  while (quadrantButtons.length > 0) {
    quadrantButtons[0].parentNode.removeChild(quadrantButtons[0]);
  }
}

function createBackground() {
  let div = document.createElement('div');
  div.className = 'select-hover-search-quadrants';
  div.style.cssText = `
    all: initial;
    z-index: 9998;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.25);
  `;
  document.body.appendChild(div);
}

function createQuadrantButton(quadrantToUse, mouseCoordinates, searchEngine, selectedText, urlStart) {
  let isExitIcon = (searchEngine === '(exit)');
  let button = document.createElement('button');
  button.id = 'select-hover-search-quadrant-' + quadrantToUse;
  button.className = 'select-hover-search-quadrants';
  if (isExitIcon) {
    button.innerHTML = searchEngine;
  } else {
    button.innerHTML = searchEngine + ':' + '<br/><br/><span style="font-size: medium;">' + selectedText + '</span>';
  }
  let left = 0;
  let top = 0;
  let distanceFromMouse = 150;
  let widthOfButton = 100;
  let relativeDistances = getRelativePosition(quadrantToUse, mouseCoordinates, distanceFromMouse, widthOfButton);
  let background = getBackground(searchEngine);
  let borderStyle = getBorderStyle(searchEngine);
  let hoverBackground = 'rgba(255, 255, 255, 0.75)';
  left = relativeDistances[0];
  top = relativeDistances[1];
  button.style.cssText = `
    all: initial;
    z-index: 9999;
    position: fixed;
    left: ${left}px;
    top: ${top}px;
    width: ${widthOfButton}px;
    height: ${widthOfButton}px;
    border-radius: 20px;
    text-align: center;
    background: ${background};
    border: ${borderStyle};
    font-family: avenir, arial;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `;
  button.onmouseover = function() {
    button.style.cssText += `background: ${hoverBackground}; border: ${borderStyle};`;
    if (!isSearching) {
      isSearching = true;
      if (urlStart) {
        window.open(urlStart + selectedText);
      }
      removeQuadrantButtons();
    }
  };
  document.body.appendChild(button);
}

function getRelativePosition(quadrantToUse, mouseCoordinates, distanceFromMouse, widthOfButton) {
  let left = 0;
  let top = 0;
  switch (quadrantToUse) {
    case 1:
      left = mouseCoordinates[0] - distanceFromMouse - widthOfButton / 2;
      top = mouseCoordinates[1] - distanceFromMouse - widthOfButton / 2;
      break;
    case 2:
      left = mouseCoordinates[0] - widthOfButton / 2;
      top = mouseCoordinates[1] - distanceFromMouse - widthOfButton / 2;
      break;
    case 3:
      left = mouseCoordinates[0] + distanceFromMouse - widthOfButton / 2;
      top = mouseCoordinates[1] - distanceFromMouse - widthOfButton / 2;
      break;
    case 4:
      left = mouseCoordinates[0] - distanceFromMouse - widthOfButton / 2;
      top = mouseCoordinates[1] - widthOfButton / 2;
      break;
    case 5:
      left = mouseCoordinates[0] + distanceFromMouse - widthOfButton / 2;
      top = mouseCoordinates[1] - widthOfButton / 2;
      break;
    case 6:
      left = mouseCoordinates[0] - distanceFromMouse - widthOfButton / 2;
      top = mouseCoordinates[1] + distanceFromMouse - widthOfButton / 2;
      break;
    case 7:
      left = mouseCoordinates[0] - widthOfButton / 2;
      top = mouseCoordinates[1] + distanceFromMouse - widthOfButton / 2;
      break;
    case 8:
      left = mouseCoordinates[0] + distanceFromMouse - widthOfButton / 2;
      top = mouseCoordinates[1] + distanceFromMouse - widthOfButton / 2;
      break;
  }
  return [left, top];
}

function getBorderStyle(searchEngine) {
  let borderStyle = '5px solid rgb(200, 200, 200)';
  if (searchEngine == 'Google') {
    borderStyle = '5px solid rgba(0, 255, 0, 0.75)';
  } else if (searchEngine == 'Wiktionary') {
    borderStyle = '5px solid rgba(255, 255, 255, 0.75)';
  } else if (searchEngine == 'Reddit ELI5') {
    borderStyle = '5px solid rgba(255, 0, 0, 0.75)';
  } else {
    borderStyle = '5px dashed rgba(0, 0, 255, 0.75)';
  }
  return borderStyle;
}

function getBackground(searchEngine) {
  let background = 'rgb(150, 200, 150)';
  if (searchEngine == 'Google') {
    background = 'rgb(150, 200, 150)';
  } else if (searchEngine == 'Wiktionary') {
    background = 'rgb(200, 200, 200)';
  } else if (searchEngine == 'Reddit ELI5') {
    background = 'rgb(200, 150, 150)';
  } else {
    background = 'rgb(150, 150, 200)';
  }
  return background;
}

})();