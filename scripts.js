// URLs or base64 strings for card parts
let bgUrl = 'BG.png';
let textAreaUrl = 'TextArea2.png';
let cardNameUrl = 'CardName2.png';
let topLeftIconUrl = 'Type.png';
let overlayUrl = 'Mana Cost.png';



// Function to update the URLs based on dropdown selection
function updateUrls() {
    // bgUrl = document.getElementById('bg-select').value;
    // textAreaUrl = document.getElementById('textArea-select').value;
    cardNameUrl = document.getElementById('cardName-select').value;
    topLeftIconUrl = document.getElementById('topLeftIcon-select').value;
    // overlayUrl = document.getElementById('overlay-select').value;

    // You can perform actions with the updated URLs here
    // console.log('Background URL:', bgUrl);
    // console.log('Text Area URL:', textAreaUrl);
    console.log('Card Name URL:', cardNameUrl);
    console.log('Top Left Icon URL:', topLeftIconUrl);
    // console.log('Overlay URL:', overlayUrl);
}

// Add event listeners to each dropdown
// document.getElementById('bg-select').addEventListener('change', updateUrls);
// document.getElementById('textArea-select').addEventListener('change', updateUrls);
document.getElementById('cardName-select').addEventListener('change', updateUrls);
document.getElementById('topLeftIcon-select').addEventListener('change', updateUrls);
// document.getElementById('overlay-select').addEventListener('change', updateUrls);



const defaultColors = {
    cardName: '#FFFFFF',  // White
    manaCost: '#65a9fd',  // Light blue
    description: '#000000', // Black
    attack: '#ff0000', // Red
    life: '#00ff00', // Green
    starText: '#ffff00', // Yellow
    // Add more defaults as needed
};

const cardCanvas = document.getElementById('cardCanvas');
const ctx = cardCanvas.getContext('2d');
// Template configurations
const templates = {
    template1: {
        inputs: ['cardName', 'manaCost', 'imageUpload', 'starText', 'description', 'attack', 'life'],
        drawFunction: drawTemplate1
    },
    template2: {
        inputs: ['cardName', 'manaCost', 'imageUpload', 'starText', 'description'],
        drawFunction: drawTemplate2
    },
    template3: {
        inputs: ['cardName', 'manaCost', 'imageUpload', 'description'],
        drawFunction: drawTemplate3
    },
    
};

document.getElementById('templateSelect').addEventListener('change', updateInputFields);
document.getElementById('generateCard').addEventListener('click', generateCard);
document.getElementById('saveCard').addEventListener('click', saveCard);




// Update input fields based on selected template
function updateInputFields() {
    const selectedTemplate = document.getElementById('templateSelect').value;
    const inputs = templates[selectedTemplate].inputs;
    const inputFieldsContainer = document.getElementById('inputFields');
    inputFieldsContainer.innerHTML = '';

    inputs.forEach(input => {
        const inputGroup = document.createElement('div');
        inputGroup.classList.add('mb-3');

        let inputElement;
        switch (input) {
            case 'imageUpload':
                inputElement = `<label for="${input}" class="form-label">Upload Image</label>
                                <input type="file" class="form-control" id="${input}">`;
                break;
            case 'description':
                inputElement = `<label for="${input}" class="form-label">Description</label>
                <div class="input-group">
                <textarea class="form-control" id="${input}" rows="3"></textarea>
                                        <div class="input-group-append">
                                            <input type="number" min="1" class="form-control" id="${input}Size" placeholder="Size">
                                            <input type="color" class="form-control" id="${input}Color" value="${defaultColors[input] || '#000000'}">
                                        </div>
                                        </div>`;
                break;
            default:
                inputElement = `<label for="${input}" class="form-label">${capitalize(input)}</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="${input}">
                                        <div class="input-group-append">
                                            <input type="number" min="1" class="form-control" id="${input}Size" placeholder="Size">
                                            <input type="color" class="form-control" id="${input}Color" value="${defaultColors[input] || '#000000'}">
                                        </div>
                                        </div>`;
        }
        inputGroup.innerHTML = inputElement;
        inputFieldsContainer.appendChild(inputGroup);
    });
}

// Generate the card based on selected template and inputs
function generateCard() {
    const selectedTemplate = document.getElementById('templateSelect').value;
    templates[selectedTemplate].drawFunction();
}
document.getElementById('saveCard').addEventListener('click', () => {
    const width = parseInt(document.getElementById('width').value, 10);
    const height = parseInt(document.getElementById('height').value, 10);

    if (!width || !height) {
        alert('Please enter width and height.');
        return;
    }

    const cardCanvas = document.getElementById('cardCanvas');
    if (!cardCanvas || !cardCanvas.getContext) {
        alert('Card canvas is not available.');
        return;
    }
    cardCanvas.cro
    // Create a temporary canvas for resizing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;

    try {
        // Draw the current card canvas onto the temporary canvas with scaling
        tempCtx.drawImage(cardCanvas, 0, 0, width, height);

        // Generate and download the resized image
        const link = document.createElement('a');
        link.download = 'card.png';
        
        // Ensure the canvas data is properly handled
        link.href = tempCanvas.toDataURL();
        link.click();
    } catch (e) {
        alert('Error exporting image: ' + e.message);
    }
});


// Draw function for template 1
function drawTemplate1() {
    const cardName = document.getElementById('cardName').value || '';
    const manaCost = document.getElementById('manaCost').value || '';
    const description = document.getElementById('description').value || '';
    const attack = document.getElementById('attack').value || '';
    const life = document.getElementById('life').value || '';
    const starText = document.getElementById('starText').value || '';



    cardCanvas.width = 400;
    cardCanvas.height = 600;

    const bgImage = new Image();
    bgImage.src = bgUrl;
    bgImage.onload = () => {
        ctx.drawImage(bgImage, 0, 0, cardCanvas.width, cardCanvas.height);

        const imageInput = document.getElementById('imageUpload');
        if (imageInput.files && imageInput.files[0]) {
            const userImage = new Image();
            userImage.src = URL.createObjectURL(imageInput.files[0]);
            userImage.onload = () => {
                const userImageX = cardCanvas.width * 0.05;
                const userImageY = cardCanvas.height * 0.05;
                const userImageWidth = cardCanvas.width * 0.9;
                const userImageHeight = cardCanvas.height * 0.45;
                ctx.drawImage(userImage, userImageX, userImageY, userImageWidth, userImageHeight);
                drawTemplate1Elements(cardName, manaCost, description, attack, life, starText);
            };
        } else {
            drawTemplate1Elements(cardName, manaCost, description, attack, life, starText);
        }
    };
}






let boldKeywords = [];
let iconMappings = {};

// Function to read keywords and icon mappings from a file
function loadMappingsFromFile(fileInput) {
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const lines = event.target.result.split(/\r?\n/).filter(line => line.trim() !== '');
            lines.forEach(line => {
                try {
                    const mapping = JSON.parse(line);
                    if (mapping.boldKeywords) {
                        boldKeywords = mapping.boldKeywords;
                    }
                    if (mapping.iconMappings) {
                        Object.assign(iconMappings, mapping.iconMappings);
                    }
                } catch (error) {
                    console.error('Invalid JSON:', line);
                }
            });
            console.log('Loaded Bold Keywords:', boldKeywords); // For debugging
            console.log('Loaded Icon Mappings:', iconMappings); // For debugging
        };
        reader.readAsText(file);
    }
}

// Attach the file input event listener for mappings
document.getElementById('keywordsFile').addEventListener('change', function() {
    loadMappingsFromFile(this);
});





function drawTemplate1Elements(cardName, manaCost, description, attack, life, starText) {
    // Retrieve size and color inputs
    const descriptionSize = document.getElementById('descriptionSize').value || '20';
    const descriptionColor = document.getElementById('descriptionColor').value || 'Black';

    const cardNameSize = document.getElementById('cardNameSize').value || '40';
    const cardNameColor = document.getElementById('cardNameColor').value || 'White';

    const starTextSize = document.getElementById('starTextSize').value || '40';
    const starTextColor = document.getElementById('starTextColor').value || 'White';

    const attackSize = document.getElementById('attackSize').value || '55';
    const attackColor = document.getElementById('attackColor').value || '#bd2b26';

    const lifeSize = document.getElementById('lifeSize').value || '55';
    const lifeColor = document.getElementById('lifeColor').value || '#f035c4';

    const manaCostSize = document.getElementById('manaCostSize').value || '55';
    const manaCostColor = document.getElementById('manaCostColor').value || '#65a9fd';

    // Load box images for each text type
    const attackBoxImage = new Image();
    attackBoxImage.src = 'attackBox.png'; // Replace with the actual box image URL for attack

    const lifeBoxImage = new Image();
    lifeBoxImage.src = 'lifeBox.png'; // Replace with the actual box image URL for life

    const manaCostBoxImage = new Image();
    manaCostBoxImage.src = 'manaCostBox.png'; // Replace with the actual box image URL for mana cost

    // Load icon images
    const attackIcon = new Image();
    attackIcon.src = "Attack.png"; // Replace with the actual icon image URL for attack

    const lifeIcon = new Image();
    lifeIcon.src = "Life.png"; // Replace with the actual icon image URL for life

    function drawTextWithBox(image, text, x, y, textSize, textColor, textAlign) {
        ctx.font = `${textSize}px MyFont`;
        ctx.fillStyle = textColor;
        ctx.textAlign = textAlign;

        // Measure text size
        const textWidth = ctx.measureText(text).width;
        const boxWidth = textWidth + 20; // Add padding
        const boxHeight = parseInt(textSize) + 10; // Add padding

        // Calculate the position of the box
        const boxX = x - (boxWidth / 2);
        const boxY = y - (boxHeight / 2);

        // Draw the box
        image.onload = () => {
            ctx.drawImage(image, boxX, boxY, boxWidth, boxHeight);

            // Draw the text centered within the box
            ctx.fillText(text, x, y + (parseInt(textSize) / 2) - 5); // Adjust text position within the box
        };

        if (image.complete) {
            ctx.drawImage(image, boxX, boxY, boxWidth, boxHeight);
            ctx.fillText(text, x, y + (parseInt(textSize) / 2) - 5);
        }
    }

    const topLeftImage = new Image();
    topLeftImage.src = topLeftIconUrl;
    topLeftImage.onload = () => {
        const iconSize = 90;
        const iconX = 5;
        const iconY = 5;
        ctx.drawImage(topLeftImage, iconX, iconY, iconSize, iconSize);

        const textAreaImage = new Image();
        textAreaImage.src = "TextArea1.png";
        textAreaImage.onload = () => {
            const textAreaWidth = cardCanvas.width * 0.94;
            const textAreaHeight = cardCanvas.height * 0.45;
            const textAreaX = cardCanvas.width * 0.03;
            const textAreaY = cardCanvas.height * 0.5;
            ctx.drawImage(textAreaImage, textAreaX, textAreaY, textAreaWidth, textAreaHeight);

            // Draw description text with bold keywords and icon replacements
            ctx.textAlign = 'left'; // Change to left align for better control over word placement
            const lineHeight = parseInt(descriptionSize) * 1.5; // Adjust line height as needed
            const maxWidth = textAreaWidth - 20; // Reduce width slightly for padding

            function drawTextWithIcons(text, x, y, maxWidth, lineHeight) {
                const words = text.split(' ');
                let xOffset = x;
                let currentY = y;

                words.forEach((word, index) => {
                    const isBold = boldKeywords.includes(word.toLowerCase());
                    const fontSize = `${descriptionSize}px bebas`;
                    const fontBoldSize = `bold ${descriptionSize}px bebas`;

                    ctx.font = isBold ? fontBoldSize : fontSize;
                    ctx.fillStyle = descriptionColor;

                    if (iconMappings[word.toLowerCase()]) {
                        const iconImage = new Image();
                        iconImage.src = iconMappings[word.toLowerCase()];
                        const iconWidth = parseInt(descriptionSize);
                        const iconHeight = parseInt(descriptionSize);

                        function drawIcon() {
                            if (xOffset + iconWidth > x + maxWidth) {
                                currentY += lineHeight; // New line if overflow
                                xOffset = x;
                            }
                            ctx.drawImage(iconImage, xOffset, currentY - iconHeight * 0.9, iconWidth, iconHeight);
                            xOffset += iconWidth; // Move x offset to end of icon
                        }

                        if (iconImage.complete) {
                            drawIcon();
                        } else {
                            iconImage.onload = drawIcon;
                        }
                    } else {
                        const wordWidth = ctx.measureText(word + ' ').width;
                        if (xOffset + wordWidth > x + maxWidth) {
                            currentY += lineHeight;
                            xOffset = x;
                        }
                        ctx.fillText(word + ' ', xOffset, currentY);
                        xOffset += wordWidth;
                    }
                });
            }

            drawTextWithIcons(description, textAreaX + 10, textAreaY + 80, maxWidth, lineHeight);

            const cardNameImage = new Image();
            cardNameImage.src = cardNameUrl;
            cardNameImage.onload = () => {
                const nameWidth = cardCanvas.width * 0.94;
                const nameHeight = cardCanvas.height * 0.2;
                const nameX = cardCanvas.width * 0.03;
                const nameY = cardCanvas.height * 0.4;
                ctx.drawImage(cardNameImage, nameX, nameY, nameWidth, nameHeight);

                ctx.save(); // Save the current state
                const cardNameX = cardCanvas.width / 2;
                const cardNameY = nameY + nameHeight * 0.76;
                ctx.translate(cardNameX, cardNameY); // Translate to the text position
                ctx.rotate((Math.PI / 180) * -5); // Rotate by -5 degrees

                ctx.font = `${cardNameSize}px MyFont`;
                ctx.fillStyle = cardNameColor; // Apply color
                ctx.textAlign = 'center';
                ctx.fillText(cardName, 0, 0); // Draw text at the new origin (0, 0)

                ctx.restore(); // Restore the original state

                const overlayImage = new Image();
                overlayImage.src = overlayUrl;
                overlayImage.onload = () => {
                    const overlayX = cardCanvas.width - 75;
                    const overlayY = 0;
                    const overlayWidth = 60;
                    const overlayHeight = 15;
                    ctx.drawImage(overlayImage, overlayX, overlayY, overlayWidth, overlayHeight);

                    const starImage = new Image();
                    starImage.src = 'Star.png';
                    starImage.onload = () => {
                        const starSize = 100;
                        const starX = cardCanvas.width / 2 - starSize / 2;
                        const starY = cardCanvas.height * 0.82;
                        ctx.drawImage(starImage, starX, starY, 120, 80);

                        ctx.font = `${starTextSize}px MyFont`;
                        ctx.fillStyle = starTextColor;
                        ctx.textAlign = 'center';
                        ctx.fillText(starText, starX + starSize * 0.6, starY + starSize * 0.7);

                        // Draw attack box at the bottom left
                        const attackBoxX = 50;
                        const attackBoxY = cardCanvas.height - 60;
                        drawTextWithBox(attackBoxImage, attack, attackBoxX, attackBoxY, attackSize, attackColor, 'center');

                        // Draw attack icon below the attack box
                        const attackIconSize = 20;
                        const attackIconX = attackBoxX - attackIconSize / 2;
                        const attackIconY = attackBoxY + 20; // Position below the text box
                        ctx.drawImage(attackIcon, attackIconX-15, attackIconY+15, 55, attackIconSize);

                        // Draw life box at the bottom right
                        const lifeBoxX = cardCanvas.width - 50;
                        const lifeBoxY = cardCanvas.height - 60;
                        drawTextWithBox(lifeBoxImage, life, lifeBoxX, lifeBoxY, lifeSize, lifeColor, 'center');

                        // Draw life icon below the life box
                        const lifeIconSize = 20;
                        const lifeIconX = lifeBoxX - lifeIconSize / 2;
                        const lifeIconY = lifeBoxY + 20; // Position below the text box
                        ctx.drawImage(lifeIcon, lifeIconX-15, lifeIconY+15, 55, lifeIconSize);

                        // Draw mana cost box at the top right
                        const manaCostX = cardCanvas.width - 50;
                        const manaCostY = 50;
                        drawTextWithBox(manaCostBoxImage, manaCost, manaCostX, manaCostY+10, manaCostSize, manaCostColor, 'center');
                    };
                };
            };
        };
    };
}





// Draw function for template 2
function drawTemplate2() {
    const cardName = document.getElementById('cardName').value || '';
    const manaCost = document.getElementById('manaCost').value || '';
    const description = document.getElementById('description').value || '';
    const starText = document.getElementById('starText').value || '';

    cardCanvas.width = 400;
    cardCanvas.height = 600;

    const bgImage = new Image();
    bgImage.src = bgUrl;
    bgImage.onload = () => {
        ctx.drawImage(bgImage, 0, 0, cardCanvas.width, cardCanvas.height);

        const imageInput = document.getElementById('imageUpload');
        if (imageInput.files && imageInput.files[0]) {
            const userImage = new Image();
            userImage.src = URL.createObjectURL(imageInput.files[0]);
            userImage.onload = () => {
                const userImageX = cardCanvas.width * 0.05;
                const userImageY = cardCanvas.height * 0.1;
                const userImageWidth = cardCanvas.width * 0.9;
                const userImageHeight = cardCanvas.height * 0.45;
                ctx.drawImage(userImage, userImageX, userImageY, userImageWidth, userImageHeight);
                drawTemplate2Elements(cardName, manaCost, description, starText);
            };
        } else {
            drawTemplate2Elements(cardName, manaCost, description, starText);
        }
    };
}

function drawTemplate2Elements(cardName, manaCost, description, starText) {
    // Retrieve size and color inputs
    const descriptionSize = document.getElementById('descriptionSize').value || '20';
    const descriptionColor = document.getElementById('descriptionColor').value || 'Black';

    const cardNameSize = document.getElementById('cardNameSize').value || '40';
    const cardNameColor = document.getElementById('cardNameColor').value || 'White';

    const starTextSize = document.getElementById('starTextSize').value || '40';
    const starTextColor = document.getElementById('starTextColor').value || 'White';

    const manaCostSize = document.getElementById('manaCostSize').value || '55';
    const manaCostColor = document.getElementById('manaCostColor').value || '#65a9fd';

    const topLeftImage = new Image();
    topLeftImage.src = topLeftIconUrl;
    topLeftImage.onload = () => {
        const iconSize = 90;
        const iconX = 5;
        const iconY = 5;
        ctx.drawImage(topLeftImage, iconX, iconY, iconSize, iconSize);

        const textAreaImage = new Image();
        textAreaImage.src = "TextArea1.png";
        textAreaImage.onload = () => {
            const textAreaWidth = cardCanvas.width * 0.94;
            const textAreaHeight = cardCanvas.height * 0.45;
            const textAreaX = cardCanvas.width * 0.03;
            const textAreaY = cardCanvas.height * 0.5;
            ctx.drawImage(textAreaImage, textAreaX, textAreaY, textAreaWidth, textAreaHeight);

            // Draw description text with bold keywords and icon replacements
            ctx.textAlign = 'left'; // Change to left align for better control over word placement

            const lineHeight = parseInt(descriptionSize) * 1.5; // Adjust line height as needed
            const maxWidth = textAreaWidth - 20; // Reduce width slightly for padding

            function drawTextWithIcons(text, x, y, maxWidth, lineHeight) {
                const words = text.split(' ');
                let xOffset = x;
                let currentY = y;

                words.forEach((word, index) => {
                    const isBold = boldKeywords.includes(word.toLowerCase());
                    const fontSize = `${descriptionSize}px bebas`;
                    const fontBoldSize = `bold ${descriptionSize}px bebas`;

                    ctx.font = isBold ? fontBoldSize : fontSize;
                    ctx.fillStyle = descriptionColor;

                    if (iconMappings[word.toLowerCase()]) {
                        const iconImage = new Image();
                        iconImage.src = iconMappings[word.toLowerCase()];
                        const iconWidth = parseInt(descriptionSize);
                        const iconHeight = parseInt(descriptionSize);

                        function drawIcon() {
                            if (xOffset + iconWidth > x + maxWidth) {
                                currentY += lineHeight; // New line if overflow
                                xOffset = x;
                            }
                            ctx.drawImage(iconImage, xOffset, currentY - iconHeight * 0.9, iconWidth, iconHeight);
                            xOffset += iconWidth; // Move x offset to end of icon
                        }

                        if (iconImage.complete) {
                            drawIcon();
                        } else {
                            iconImage.onload = drawIcon;
                        }
                    } else {
                        const wordWidth = ctx.measureText(word + ' ').width;
                        if (xOffset + wordWidth > x + maxWidth) {
                            currentY += lineHeight;
                            xOffset = x;
                        }
                        ctx.fillText(word + ' ', xOffset, currentY);
                        xOffset += wordWidth;
                    }
                });
            }

            drawTextWithIcons(description, textAreaX + 10, textAreaY + 80, maxWidth, lineHeight);

            const cardNameImage = new Image();
            cardNameImage.src = cardNameUrl;
            cardNameImage.onload = () => {
                const nameWidth = cardCanvas.width * 0.94;
                const nameHeight = cardCanvas.height * 0.2;
                const nameX = cardCanvas.width * 0.03;
                const nameY = cardCanvas.height * 0.4;
                ctx.drawImage(cardNameImage, nameX, nameY, nameWidth, nameHeight);

                ctx.save(); // Save the current state
                const cardNameX = cardCanvas.width / 2;
                const cardNameY = nameY + nameHeight * 0.76;
                ctx.translate(cardNameX, cardNameY); // Translate to the text position
                ctx.rotate((Math.PI / 180) * -5); // Rotate by -5 degrees

                ctx.font = `${cardNameSize}px MyFont`;
                ctx.fillStyle = cardNameColor; // Apply color
                ctx.textAlign = 'center';
                ctx.fillText(cardName, 0, 0); // Draw text at the new origin (0, 0)

                ctx.restore(); // Restore the original state

                const overlayImage = new Image();
                overlayImage.src = overlayUrl;
                overlayImage.onload = () => {
                    const overlayX = cardCanvas.width - 70;
                    const overlayY = 0;
                    const overlayWidth = 50;
                    const overlayHeight = 20;
                    ctx.drawImage(overlayImage, overlayX, overlayY, overlayWidth, overlayHeight);

                    const starImage = new Image();
                    starImage.src = 'Star.png';
                    starImage.onload = () => {
                        const starSize = 100;
                        const starX = cardCanvas.width / 2 - starSize / 2;
                        const starY = cardCanvas.height * 0.85;
                        ctx.drawImage(starImage, starX, starY, 120, 80);

                        // Draw text on the star
                        ctx.font = `${starTextSize}px MyFont`;
                        ctx.fillStyle = starTextColor; // Apply color
                        ctx.textAlign = 'center';
                        ctx.fillText(starText, starX + starSize * 0.6, starY + starSize * 0.7);

                        // Draw mana cost box (top right)
                        const manaCostBoxImage = new Image();
                        manaCostBoxImage.src = 'manaCostBox.png'; // Replace with the actual box image URL
                        const manaCostBoxX = cardCanvas.width - 50;
                        const manaCostBoxY = 60;

                        function drawManaCostBox() {
                            ctx.font = `${manaCostSize}px MyFont`;
                            ctx.fillStyle = manaCostColor; // Apply color
                            ctx.textAlign = 'center';

                            // Measure text size
                            const textWidth = ctx.measureText(manaCost).width;
                            const boxWidth = textWidth + 20; // Add padding
                            const boxHeight = parseInt(manaCostSize) + 20; // Add padding

                            // Draw the box
                            const boxX = manaCostBoxX - (boxWidth / 2);
                            const boxY = manaCostBoxY - (boxHeight / 2);
                            manaCostBoxImage.onload = () => {
                                ctx.drawImage(manaCostBoxImage, boxX, boxY, boxWidth, boxHeight);

                                // Draw the mana cost text centered within the box
                                ctx.fillText(manaCost, manaCostBoxX, manaCostBoxY + (parseInt(manaCostSize) / 2) - 5); // Adjust text position within the box
                            };

                            if (manaCostBoxImage.complete) {
                                ctx.drawImage(manaCostBoxImage, boxX, boxY, boxWidth, boxHeight);
                                ctx.fillText(manaCost, manaCostBoxX, manaCostBoxY + (parseInt(manaCostSize) / 2) - 5);
                            }
                        }

                        drawManaCostBox(); // Draw the mana cost box

                    };
                };
            };
        };
    };
}
// Draw function for template 3
function drawTemplate3() {
    const cardName = document.getElementById('cardName').value || '';
    const manaCost = document.getElementById('manaCost').value || '';
    const description = document.getElementById('description').value || '';

    cardCanvas.width = 400;
    cardCanvas.height = 600;

    const bgImage = new Image();
    bgImage.src = bgUrl;
    bgImage.onload = () => {
        ctx.drawImage(bgImage, 0, 0, cardCanvas.width, cardCanvas.height);

        const imageInput = document.getElementById('imageUpload');
        if (imageInput.files && imageInput.files[0]) {
            const userImage = new Image();
            userImage.src = URL.createObjectURL(imageInput.files[0]);
            userImage.onload = () => {
                const userImageX = cardCanvas.width * 0.05;
                const userImageY = cardCanvas.height * 0.05;
                const userImageWidth = cardCanvas.width * 0.9;
                const userImageHeight = cardCanvas.height * 0.45;
                ctx.drawImage(userImage, userImageX, userImageY, userImageWidth, userImageHeight);
                drawTemplate3Elements(cardName, manaCost, description);
            };
        } else {
            drawTemplate3Elements(cardName, manaCost, description);
        }
    };
}




function drawTemplate3Elements(cardName, manaCost, description) {
    function getValueOrDefault(id, defaultValue) {
        const value = document.getElementById(id).value.trim();
        return value.length > 0 ? value : defaultValue;
    }
    
    const descriptionSize = getValueOrDefault('descriptionSize', '20');
    const descriptionColor = getValueOrDefault('descriptionColor', 'Black');
    
    const cardNameSize = getValueOrDefault('cardNameSize', '40');
    const cardNameColor = getValueOrDefault('cardNameColor', 'White');
    
    const manaCostSize = getValueOrDefault('manaCostSize', '55');
    const manaCostColor = getValueOrDefault('manaCostColor', '#65a9fd');
    

    const topLeftImage = new Image();
    topLeftImage.src = topLeftIconUrl;
    topLeftImage.onload = () => {
        const iconSize = 90;
        const iconX = 5;
        const iconY = 5;
        ctx.drawImage(topLeftImage, iconX, iconY, iconSize, iconSize);

        const textAreaImage = new Image();
        textAreaImage.src = "TextArea1.png";
        textAreaImage.onload = () => {
            const textAreaWidth = cardCanvas.width * 0.94;
            const textAreaHeight = cardCanvas.height * 0.45;
            const textAreaX = cardCanvas.width * 0.03;
            const textAreaY = cardCanvas.height * 0.5;
            ctx.drawImage(textAreaImage, textAreaX, textAreaY, textAreaWidth, textAreaHeight);

            // Draw description text with bold keywords and icon replacements
            ctx.textAlign = 'left'; // Change to left align for better control over word placement

            const lineHeight = parseInt(descriptionSize) * 1.5; // Adjust line height as needed
            const maxWidth = textAreaWidth - 20; // Reduce width slightly for padding

            // Function to draw text and icons within bounds
            function drawTextWithIcons(text, x, y, maxWidth, lineHeight) {
                const words = text.split(' ');
                let xOffset = x;
                let currentY = y;
            
                words.forEach((word, index) => {
                    const isBold = boldKeywords.includes(word.toLowerCase());
                    const fontSize = `${descriptionSize}px bebas`;
                    const fontBoldSize = `bold ${descriptionSize}px bebas`;
            
                    ctx.font = isBold ? fontBoldSize : fontSize;
                    ctx.fillStyle = descriptionColor;
            
                    if (iconMappings[word.toLowerCase()]) {
                        // Load the icon if the current word has a corresponding icon URL
                        const iconImage = new Image();
                        iconImage.src = iconMappings[word.toLowerCase()];
                        const iconWidth = parseInt(descriptionSize);
                        const iconHeight = parseInt(descriptionSize);
            
                        // Check if image is loaded, draw it or set onload to draw later
                        function drawIcon() {
                            if (xOffset + iconWidth > x + maxWidth) {
                                currentY += lineHeight; // New line if overflow
                                xOffset = x;
                            }
                            ctx.drawImage(iconImage, xOffset, currentY - iconHeight * 0.9, iconWidth, iconHeight);
                            xOffset += iconWidth; // Move x offset to end of icon
                        }
            
                        if (iconImage.complete) {
                            drawIcon();
                        } else {
                            iconImage.onload = drawIcon;
                        }
                    } else {
                        // Render text if no icon is mapped
                        const wordWidth = ctx.measureText(word + ' ').width;
                        if (xOffset + wordWidth > x + maxWidth) {
                            currentY += lineHeight;
                            xOffset = x;
                        }
                        ctx.fillText(word + ' ', xOffset, currentY);
                        xOffset += wordWidth;
                    }
                });
            }
            
            drawTextWithIcons(description, textAreaX + 10, textAreaY + 80, maxWidth, lineHeight);
            
            const cardNameImage = new Image();
            cardNameImage.src = cardNameUrl;
            cardNameImage.onload = () => {
                const nameWidth = cardCanvas.width * 0.94;
                const nameHeight = cardCanvas.height * 0.2;
                const nameX = cardCanvas.width * 0.03;
                const nameY = cardCanvas.height * 0.4;
                ctx.drawImage(cardNameImage, nameX, nameY, nameWidth, nameHeight);

                // Rotate and draw the card name
                ctx.save(); // Save the current state
                const cardNameX = cardCanvas.width / 2;
                const cardNameY = nameY + nameHeight * 0.76;
                ctx.translate(cardNameX, cardNameY); // Translate to the text position
                ctx.rotate((Math.PI / 180) * -5); // Rotate by -5 degrees

                ctx.font = `${cardNameSize}px MyFont`;
                ctx.fillStyle = cardNameColor; // Apply color
                ctx.textAlign = 'center';
                ctx.fillText(cardName, 0, 0); // Draw text at the new origin (0, 0)

                ctx.restore(); // Restore the original state

                const overlayImage = new Image();
                overlayImage.src = overlayUrl;
                overlayImage.onload = () => {
                    const overlayX = cardCanvas.width - 75;
                    const overlayY = 0;
                    const overlayWidth = 60;
                    const overlayHeight = 15;
                    ctx.drawImage(overlayImage, overlayX, overlayY, overlayWidth, overlayHeight);

                    // Draw mana cost box (top right)
                    const manaCostBoxImage = new Image();
                    manaCostBoxImage.src = 'manaCostBox.png'; // Replace with the actual box image URL
                    const manaCostBoxX = cardCanvas.width - 50;
                    const manaCostBoxY = 60;

                    function drawManaCostBox() {
                        ctx.font = `${manaCostSize}px MyFont`;
                        ctx.fillStyle = manaCostColor; // Apply color
                        ctx.textAlign = 'center';

                        // Measure text size
                        const textWidth = ctx.measureText(manaCost).width;
                        const boxWidth = textWidth + 20; // Add padding
                        const boxHeight = parseInt(manaCostSize) + 20; // Add padding

                        // Draw the box
                        const boxX = manaCostBoxX - (boxWidth / 2);
                        const boxY = manaCostBoxY - (boxHeight / 2);
                        manaCostBoxImage.onload = () => {
                            ctx.drawImage(manaCostBoxImage, boxX, boxY, boxWidth, boxHeight);

                            // Draw the mana cost text centered within the box
                            ctx.fillText(manaCost, manaCostBoxX, manaCostBoxY + (parseInt(manaCostSize) / 2) - 5); // Adjust text position within the box
                        };

                        if (manaCostBoxImage.complete) {
                            ctx.drawImage(manaCostBoxImage, boxX, boxY, boxWidth, boxHeight);
                            ctx.fillText(manaCost, manaCostBoxX, manaCostBoxY + (parseInt(manaCostSize) / 2) - 5);
                        }
                    }

                    drawManaCostBox(); // Draw the mana cost box

                };
            };
        };
    };
}



// Capitalize the first letter of a string
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
