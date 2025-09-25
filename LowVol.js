document.addEventListener('DOMContentLoaded', function() {
    const img = document.querySelector('img');
    const dots = [];
    
    function showDayText(dayNumber) {
       
        let dayTextElement = document.querySelector('.day-text-h2');
        if (!dayTextElement) {
           

            dayTextElement = document.createElement('h2');
            dayTextElement.className = 'day-text-h2';
          

            const img = document.querySelector('img');
            img.parentNode.insertBefore(dayTextElement, img.nextSibling);
        }
        
       
        dayTextElement.textContent = `Day ${dayNumber}`;
        dayTextElement.style.color = '#db285e';
        dayTextElement.style.display = 'block';
        
        

        setTimeout(() => {
            if (dayTextElement) {
                dayTextElement.style.display = 'none';
            }
        }, 10000);
    }
   
    function getCanvasArea() {
        const canvasSize = 170;

        const canvasLeft = 220;
        const canvasTop = 340;
        
        return {
            left: canvasLeft,
            top: canvasTop,
            right: canvasLeft + canvasSize,
            bottom: canvasTop + canvasSize,
            width: canvasSize,
            height: canvasSize
        };
    }
    
    function createRandomDot(dayNumber) {
        const dot = document.createElement('div');
        dot.className = 'floating-dot2';
        
        

        dot.addEventListener('click', function() {
            showDayText(dayNumber);
        });
        
        const canvas = getCanvasArea();
        
   

        const startX = canvas.left + Math.random() * (canvas.width - 10); // Account for dot size
        const startY = canvas.top + Math.random() * (canvas.height - 10);
        
    

        dot.style.left = startX + 'px';
        dot.style.top = startY + 'px';
        


        let velocityX = (Math.random() - 0.5) * 1; 
        let velocityY = (Math.random() - 0.5) * 1;



        dot.canvasBounds = canvas;
        dot.velocityX = velocityX;
        dot.velocityY = velocityY;
        
        document.body.appendChild(dot);
        dots.push(dot);
        
        animateDot(dot);
    }
    
    function animateDot(dot) {
        const rect = dot.getBoundingClientRect();
        const currentX = parseFloat(dot.style.left);
        const currentY = parseFloat(dot.style.top);
        
       
        let newX = currentX + dot.velocityX;
        let newY = currentY + dot.velocityY;
        
        
        if (newX <= dot.canvasBounds.left || newX >= dot.canvasBounds.right - 10) {
            dot.velocityX = -dot.velocityX;
            newX = Math.max(dot.canvasBounds.left, Math.min(newX, dot.canvasBounds.right - 10));
        }
        
        if (newY <= dot.canvasBounds.top || newY >= dot.canvasBounds.bottom - 10) {
            dot.velocityY = -dot.velocityY;
            newY = Math.max(dot.canvasBounds.top, Math.min(newY, dot.canvasBounds.bottom - 10));
        }
        

        dot.style.left = newX + 'px';
        dot.style.top = newY + 'px';
        
        requestAnimationFrame(() => animateDot(dot));
    }
    
  //10 dots
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createRandomDot(i + 1); 
        }, i * 200); 
    }
});