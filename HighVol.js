document.addEventListener('DOMContentLoaded', function() {
    const img = document.querySelector('img');
    const dots = [];
   
    function getCanvasArea() {
        const img = document.querySelector('img');
        const imgRect = img.getBoundingClientRect();
        
        const canvasWidthPercent = 0.35;
        const canvasHeightPercent = 0.35;
        const offsetXPercent = 0.25;
        const offsetYPercent = 0.48;
        const canvasWidth = imgRect.width * canvasWidthPercent;
        const canvasHeight = imgRect.height * canvasHeightPercent;
        const canvasLeft = imgRect.left + (imgRect.width * offsetXPercent);
        const canvasTop = imgRect.top + (imgRect.height * offsetYPercent);
        
        return {
            left: canvasLeft,
            top: canvasTop,
            right: canvasLeft + canvasWidth,
            bottom: canvasTop + canvasHeight,
            width: canvasWidth,
            height: canvasHeight
        };
    }
    
    function createRandomDot(dayNumber) {
        const dot = document.createElement('div');
        dot.className = 'floating-dot';
        
        const canvas = getCanvasArea();
        
       
        const dotSize = Math.max(20, Math.min(35, canvas.width * 0.04));
        dot.style.width = dotSize + 'px';
        dot.style.height = dotSize + 'px';
        
   //random start points 
        const startX = canvas.left + Math.random() * (canvas.width - dotSize); 
        const startY = canvas.top + Math.random() * (canvas.height - dotSize);
        
        //  initial position
        dot.style.left = startX + 'px';
        dot.style.top = startY + 'px';
        
        //  text label for dots
        const decibelRanges = ['21-37 dB', '48-53 dB', '32-36 dB', '61-65 dB', '51-58 dB'];
        
        if (dayNumber >= 1 && dayNumber <= 5) {
            const textLabel = document.createElement('span');
            textLabel.className = 'dot-text-label';
            textLabel.textContent = `Day ${dayNumber} ${decibelRanges[dayNumber - 1]}`;
            textLabel.style.position = 'absolute';
            textLabel.style.left = (startX + dotSize + 5) + 'px'; 
            textLabel.style.top = (startY - 5) + 'px'; 
            textLabel.style.color = '#2f941b';
            // Scale text size based on canvas size (minimum 14px, maximum 24px)
            const fontSize = Math.max(14, Math.min(24, canvas.width * 0.03));
            textLabel.style.fontSize = fontSize + 'px';
            textLabel.style.fontWeight = 'bold';
            textLabel.style.pointerEvents = 'none';
            textLabel.style.whiteSpace = 'nowrap';
            
            document.body.appendChild(textLabel);
            dot.textLabel = textLabel; 
        }
        
        // velocity and direction
        let velocityX = (Math.random() - 0.5) * 0.3; 
        let velocityY = (Math.random() - 0.5) * 0.3;

        //  canvas bounds and velocity 
        dot.canvasBounds = canvas;
        dot.velocityX = velocityX;
        dot.velocityY = velocityY;
        dot.dotSize = dotSize; 
        
        document.body.appendChild(dot);
        dots.push(dot);
        
        animateDot(dot);
    }
    
    function animateDot(dot) {
        const rect = dot.getBoundingClientRect();
        const currentX = parseFloat(dot.style.left);
        const currentY = parseFloat(dot.style.top);
        
        // new position
        let newX = currentX + dot.velocityX;
        let newY = currentY + dot.velocityY;
        
        //  collisions with canvas boundaries and reverse velocity
        if (newX <= dot.canvasBounds.left || newX >= dot.canvasBounds.right - dot.dotSize) {
            dot.velocityX = -dot.velocityX;
            newX = Math.max(dot.canvasBounds.left, Math.min(newX, dot.canvasBounds.right - dot.dotSize));
        }
        
        if (newY <= dot.canvasBounds.top || newY >= dot.canvasBounds.bottom - dot.dotSize) {
            dot.velocityY = -dot.velocityY;
            newY = Math.max(dot.canvasBounds.top, Math.min(newY, dot.canvasBounds.bottom - dot.dotSize));
        }
        
        //position
        dot.style.left = newX + 'px';
        dot.style.top = newY + 'px';
       
        if (dot.textLabel) {
            dot.textLabel.style.left = (newX + dot.dotSize + 5) + 'px';
            dot.textLabel.style.top = (newY - 5) + 'px';
        }
        
        requestAnimationFrame(() => animateDot(dot));
    }
    
    function updateAllDotBounds() {
        const newCanvas = getCanvasArea();
        dots.forEach(dot => {
            dot.canvasBounds = newCanvas;
            
            // Recalculate dot size based on new canvas size
            const newDotSize = Math.max(20, Math.min(35, newCanvas.width * 0.04));
            dot.style.width = newDotSize + 'px';
            dot.style.height = newDotSize + 'px';
            dot.dotSize = newDotSize;
            
            // Ensure dots stay within new bounds
            const currentX = parseFloat(dot.style.left);
            const currentY = parseFloat(dot.style.top);
            
            const clampedX = Math.max(newCanvas.left, Math.min(currentX, newCanvas.right - newDotSize));
            const clampedY = Math.max(newCanvas.top, Math.min(currentY, newCanvas.bottom - newDotSize));
            
            dot.style.left = clampedX + 'px';
            dot.style.top = clampedY + 'px';
            
            // Update text label position and size if it exists
            if (dot.textLabel) {
                const newFontSize = Math.max(14, Math.min(24, newCanvas.width * 0.03));
                dot.textLabel.style.fontSize = newFontSize + 'px';
                dot.textLabel.style.left = (clampedX + newDotSize + 5) + 'px';
                dot.textLabel.style.top = (clampedY - 5) + 'px';
            }
        });
    }
    
    // Add resize event listener
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce resize events to avoid excessive calculations
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateAllDotBounds();
        }, 100);
    });
    
  //5 dots
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createRandomDot(i + 1);
        }, i * 200); 
    }
});