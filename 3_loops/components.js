



class Popup {

    static count = 0;

    constructor(title, content) {
        this.key = Popup.count;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;

        const popup = document.createElement('div');
        const popup_header = document.createElement('div');
        const popup_content = document.createElement('div');
        const btn_close = document.createElement('button');
        const popup_header_span = document.createElement('span');
        const p_content = document.createElement('p');

        popup.id = 'popup', popup.className = 'popup';
        popup_header.id = 'popup-header', popup_header.className = 'popup-header'; 
        popup_content.className = 'popup-content';
        btn_close.id = 'close-btn', btn_close.textContent = 'X';
        popup_header_span.textContent = title;
        p_content.textContent = content;


        popup_header.appendChild(popup_header_span), popup_header.appendChild(btn_close);
        popup_content.appendChild(p_content);
        popup.appendChild(popup_header), popup.appendChild(popup_content);

        this.component = popup;
        document.body.appendChild(this.component);

        popup_header.addEventListener("mousedown", (e) => {
            this.isDragging = true;
            this.offsetX = e.clientX - popup.offsetLeft;
            this.offsetY = e.clientY - popup.offsetTop;
            document.body.style.userSelect = "none"; // Prevent text selection while dragging
        });

        document.addEventListener("mouseup", () => {
            this.isDragging = false;
            document.body.style.userSelect = ""; // Re-enable text selection
        });

        document.addEventListener("mousemove", (e) => {
            if (this.isDragging) {
                popup.style.left = `${e.clientX - this.offsetX}px`;
                popup.style.top = `${e.clientY - this.offsetY}px`;
            }
        });

        btn_close.addEventListener("click", () => {
            this.destroy();
        });

        Popup.count++;
        
    }

    
    destroy() {
        if (this.component && this.component.parentNode) {
            this.component.parentNode.removeChild(this.component);
            Popup.count--;
        }
    }

    function2() {
        
    }

}



