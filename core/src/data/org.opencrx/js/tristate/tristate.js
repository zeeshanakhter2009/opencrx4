/* 
 --- Tristate Checkbox ---
v 0.9.2 19th Dec 2008
By Shams Mahmood
http://shamsmi.blogspot.com 
*/

var STATE_NONE = 0;
var STATE_SOME = 1;
var STATE_ALL = 2;

var UNCHECKED_NORM = 'UNCHECKED_NORM';
var UNCHECKED_HILI = 'UNCHECKED_HILI';
var INTERMEDIATE_NORM = 'INTERMEDIATE_NORM';
var INTERMEDIATE_HILI = 'INTERMEDIATE_HILI';
var CHECKED_NORM = 'CHECKED_NORM';
var CHECKED_HILI = 'CHECKED_HILI';

var DEFAULT_CONFIG = {
	UNCHECKED_NORM : './javascript/tristate/images/unchecked.gif',
	UNCHECKED_HILI : './javascript/tristate/images/unchecked_highlighted.gif',
	INTERMEDIATE_NORM : './javascript/tristate/images/intermediate.gif',
	INTERMEDIATE_HILI : './javascript/tristate/images/intermediate_highlighted.gif',
	CHECKED_NORM : './javascript/tristate/images/checked.gif',
	CHECKED_HILI : './javascript/tristate/images/checked_highlighted.gif'
};

function getNextStateFromValue(theValue) {
	if (theValue == STATE_SOME) { return STATE_ALL; }
	if (theValue == STATE_ALL) { return STATE_NONE; }
	return STATE_SOME;
}
function getStateFromValue(theValue, highlightedState) {
	if (theValue == STATE_SOME) { return (!highlightedState) ? INTERMEDIATE_NORM : INTERMEDIATE_HILI; }
	if (theValue == STATE_ALL) { return (!highlightedState) ? CHECKED_NORM : CHECKED_HILI; }
	return (!highlightedState) ? UNCHECKED_NORM : UNCHECKED_HILI;
}

function getFieldAndContainerIds(imageId) {
	var triStateBoxId = imageId.substring(0, imageId.length - '.Img'.length);
	var triStateBoxFieldId = document.getElementById(triStateBoxId + '.Field').value;
	var triStateBoxContainerNode = document.getElementById(triStateBoxId + '.Container');
	var triStateBoxContainerNodeId = '';
	if (triStateBoxContainerNode) {
		triStateBoxContainerNodeId = triStateBoxContainerNode.value;
	}
	return [triStateBoxFieldId, triStateBoxContainerNodeId];
}

function getAllCheckboxesInContainer(triStateBoxContainerNodeId) {
	if (triStateBoxContainerNodeId == '') {
		return [];
	}
	var triStateBoxContainerNode = document.getElementById(triStateBoxContainerNodeId);
	var inputElements = triStateBoxContainerNode.getElementsByTagName('input');
	var checkboxes = new Array();
	var index = 0;
	
	for (var x = 0; x < inputElements.length; x++) {
		var loopElement = inputElements[x];
		if (loopElement.type == 'checkbox') {
			checkboxes[index++] = loopElement;
		}
	}
	
	return checkboxes;
}
function selectOrUnselectBoxes(checkBoxes, selectBoxes) {
	for (var x in checkBoxes) {
		checkBoxes[x].checked = selectBoxes;
	}
}
function areAllBoxesInGivenCheckedState(checkBoxes, boxesSelected) {
	var result = true;
	for (var x = 0; x < checkBoxes.length; x++) {
		if (checkBoxes[x].checked != boxesSelected) {
			result = false;
			break;
		}
	}
	return result;
}

function replaceImage(imageId, imageSrc) {
	var image = document.getElementById(imageId);
	if (image.src != imageSrc) {
		image.src = imageSrc;
	}
}
function mouseOverOutOfImage(imageId, mouseOverMode) {
	
	var fieldAndContainerIds = getFieldAndContainerIds(imageId);
	var triStateBoxField = document.getElementById(fieldAndContainerIds[0]);
	
	var currentState = getStateFromValue(triStateBoxField.value, mouseOverMode);
	return DEFAULT_CONFIG[currentState];
}
function onMouseOverImage(imageId) {
	return function() {
		var imageSrc = mouseOverOutOfImage(imageId, true);
		replaceImage(imageId, imageSrc)
	};
}
function onMouseOutImage(imageId) { 
	return function() {
		var imageSrc = mouseOverOutOfImage(imageId, false);
		replaceImage(imageId, imageSrc)
	};
}
function onTristateImageClick(imageId, standAloneMode) {
	return function() {
		var fieldAndContainerIds = getFieldAndContainerIds(imageId);
		var triStateBoxField = document.getElementById(fieldAndContainerIds[0]);
		
		var nextState = getNextStateFromValue(triStateBoxField.value);
		if (!standAloneMode && nextState == STATE_SOME) {
			nextState = getNextStateFromValue(nextState);
		}
		triStateBoxField.value = nextState;
		
		if (fieldAndContainerIds[1] != '') {
			var allTheCheckboxes = getAllCheckboxesInContainer(fieldAndContainerIds[1]);
			selectOrUnselectBoxes(allTheCheckboxes, nextState == STATE_ALL);
		}
		
		var imageSrc = mouseOverOutOfImage(imageId, true);
		replaceImage(imageId, imageSrc)
	}
}
function onCheckboxClick(imageId, checkBoxId) {
	return function() {
		var fieldAndContainerIds = getFieldAndContainerIds(imageId);
		var allTheCheckboxes = getAllCheckboxesInContainer(fieldAndContainerIds[1]);
		
		var triStateBoxField = document.getElementById(fieldAndContainerIds[0]);
		updateStateAndImage(allTheCheckboxes, triStateBoxField, imageId)
	}
}

function updateStateAndImage(allTheCheckboxes, triStateBoxField, imageId) {
	if (allTheCheckboxes.length > 0) {
		var allBoxesSelected = areAllBoxesInGivenCheckedState(allTheCheckboxes, true);
		var allBoxesUnselected = areAllBoxesInGivenCheckedState(allTheCheckboxes, false);
		
		if (allBoxesSelected) {
			triStateBoxField.value = STATE_ALL;
		} else if (allBoxesUnselected) {
			triStateBoxField.value = STATE_NONE;
		} else {
			triStateBoxField.value = STATE_SOME;
		}
	} 
	var imageSrc = mouseOverOutOfImage(imageId, false);
	replaceImage(imageId, imageSrc);
}
function createHiddenStateField(triStateBoxNode, triStateBoxFieldId) {
	var triStateBoxField = document.createElement('input');
	triStateBoxField.id = triStateBoxFieldId;
	triStateBoxField.type = 'hidden';
	triStateBoxField.value = STATE_NONE;
	triStateBoxNode.appendChild(triStateBoxField);
	return triStateBoxField;
}
function createTriStateImageNode(triStateBoxNode, imageNodeId, standAloneMode) {
	var imageNode = new Image();
	imageNode.id = imageNodeId;
	imageNode.src = DEFAULT_CONFIG[UNCHECKED_NORM];
	triStateBoxNode.appendChild(imageNode);
	if (triStateBoxNode.addEventListener) {
        triStateBoxNode.addEventListener('mouseover', onMouseOverImage(imageNode.id), false);
		triStateBoxNode.addEventListener('mouseout', onMouseOutImage(imageNode.id), false);
		triStateBoxNode.addEventListener('click', onTristateImageClick(imageNode.id, standAloneMode), false);
	} else if (triStateBoxNode.attachEvent) {
		triStateBoxNode.attachEvent('onmouseover', onMouseOverImage(imageNode.id));
		triStateBoxNode.attachEvent('onmouseout', onMouseOutImage(imageNode.id));
		triStateBoxNode.attachEvent('onclick', onTristateImageClick(imageNode.id, standAloneMode));
	}
}
function createFieldNameHiddenField(triStateBoxNode, fieldNameNodeId, triStateBoxFieldId) {
	var fieldNode = document.createElement('input');
	fieldNode.id = fieldNameNodeId;
	fieldNode.type = 'hidden';
	fieldNode.value = triStateBoxFieldId;
	triStateBoxNode.appendChild(fieldNode);
}
function createContainerNameHiddenField(triStateBoxNode, containerNameNodeId, triStateBoxContainerId) {
	var containerNode = document.createElement('input');
	containerNode.id = containerNameNodeId;
	containerNode.type = 'hidden';
	containerNode.value = triStateBoxContainerId;
	triStateBoxNode.appendChild(containerNode);
}
function attachOnclickEventsToDependentBoxes(triStateBoxContainerId, imageNodeId) {
	var allTheCheckboxes = getAllCheckboxesInContainer(triStateBoxContainerId);
	for (var x in allTheCheckboxes) {
		var loopCheckBox = allTheCheckboxes[x];
		if (loopCheckBox.addEventListener) {
	        loopCheckBox.addEventListener('click', onCheckboxClick(imageNodeId, loopCheckBox.id), false);
		} else if (loopCheckBox.attachEvent) {
			loopCheckBox.attachEvent('onclick', onCheckboxClick(imageNodeId, loopCheckBox.id));
		}
	}
	return allTheCheckboxes;
}
function initTriStateCheckBox(triStateBoxId, containerOrStateFieldId, standAloneMode) {

	var triStateBoxNode = document.getElementById(triStateBoxId);
	
	var triStateBoxContainerId = containerOrStateFieldId;
	var triStateBoxFieldId = triStateBoxId + '.Value';
	if (standAloneMode) {
		triStateBoxContainerId = '';
		triStateBoxFieldId = containerOrStateFieldId;
	}
	
	var triStateBoxTextNode = triStateBoxNode.childNodes[0];
	triStateBoxNode.removeChild(triStateBoxTextNode);
	
	var triStateBoxField = document.getElementById(triStateBoxFieldId);
	if (!standAloneMode) {
		triStateBoxField = createHiddenStateField(triStateBoxNode, triStateBoxFieldId);
	} 
	
	var imageNodeId = triStateBoxId + '.Img';
	createTriStateImageNode(triStateBoxNode, imageNodeId, standAloneMode);
	
	var fieldNameNodeId = triStateBoxId + '.Field';
	createFieldNameHiddenField(triStateBoxNode, fieldNameNodeId, triStateBoxFieldId);
	
	if (!standAloneMode) {
		var containerNameNodeId = triStateBoxId + '.Container';
		createContainerNameHiddenField(triStateBoxNode, containerNameNodeId, triStateBoxContainerId);
	}
	
	triStateBoxNode.appendChild(triStateBoxTextNode);
	
	var allTheCheckboxes = attachOnclickEventsToDependentBoxes(triStateBoxContainerId, imageNodeId);
	updateStateAndImage(allTheCheckboxes, triStateBoxField, imageNodeId);
}
