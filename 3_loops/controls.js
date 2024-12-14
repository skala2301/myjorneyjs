const btn_test = document.querySelector('.btn-test');
const btn_edit_mode = document.querySelector('.btn-edit-mode');
const btn_add_layer = document.querySelector('.btn-add-layer');
const figure_selector = document.querySelector('.figure-select');

const popups = [];

const last_selected_figure = {
    value: 'none',
    obj: null,

    setSelection(value, obj) {
        this.value = value;
        this.obj = obj;
    }
};
const MODES = [
    {
        value: 'none',
        label: 'None',
    },
    {
        value: 'admin',
        label: 'Admin Mode',
    },
    {
        value: 'edit',
        label: 'Edit Mode',
    },
    {
        value: 'view',
        label: 'View Mode',
    }
];

const FIGURE_OPTIONS = [
    {
        value: 'circle',
        label: 'Circle',
        createFigure: ({dx = 20, dy = 20, originX = 'center', originY = 'center'} = {}) => {
            const radius = dx >= 20 ? dx / 2 : dy >= 20 ? dy / 2 : 10;
            return new fabric.Circle({
                radius: radius,
                originX: originX,
                originY: originY
            })
        }
    },
    {
        value: 'square',
        label: 'Square',
        createFigure: ({dx = 20, dy = 20, originX = 'center', originY = 'center'} = {}) => {
            const width = dx >= 20 ? dx : 20;
            const height = dy >= 20 ? dy : 20;
            return new fabric.Rect({
                width: width,
                height: height,
                originX: originX,
                originY: originY,
                fill: 'red'
            })
        }
    },
    {
        value: 'triangle',
        label: 'Triangle',
        createFigure: ({dx = 20, dy = 20, originX = 'center', originY = 'center'} = {}) => {
            const width = dx >= 20 ? dx : 20;
            const height = dy >= 20 ? dy : 20;
            return new fabric.Triangle({
                width: width,
                height: height,
                originX: originX,
                originY: originY
            })
        }
    }
];

var designer_mode = MODES.find(m => m.value == 'edit');


FIGURE_OPTIONS.map(op => {
    const created_option = document.createElement("option");
    created_option.value = op.value;
    created_option.innerHTML = op.label;
    figure_selector.appendChild(created_option);
});


function test() {
    console.log("Hello",my_canvas);
}


btn_test.addEventListener('click', function() {
    test();
});

btn_edit_mode.addEventListener('click', function() {
    designer_mode = MODES.find(m => m.value == 'edit');
    my_canvas.getObjects("group").map(layer => {
        //layer.transparentCorners = true;
        //layer.hasBorders = false;
        //layer.hasControls = false;
        layer.selectable = false;
    });
    my_canvas.discardActiveObject();
    my_canvas.renderAll()
});

btn_add_layer.addEventListener('click', function() {
    
    designer_mode = MODES.find(m => m.value == 'admin');
    my_canvas.getObjects("group").map(layer => {
        //layer.transparentCorners = false;
        //layer.hasBorders = true;
        //layer.hasControls = true;
        layer.selectable = true;
    });
    popups.push(new Popup('Admin Mode active','You can add layers and place them on the canvas.'));
    

});

figure_selector.addEventListener('change', function(e) {
    

    const selection =  FIGURE_OPTIONS.find(op => e.target.value == op.value);
    last_selected_figure.setSelection(selection.value, selection.createFigure());
});

window.addEventListener('resize', function() {
    canvas_dimensions.resizeDimensions(window.innerWidth - 20, window.innerHeight - 20);
    const zoom = canvas_dimensions.width / canvas_dimensions.base_width;
    my_canvas.setDimensions({width: canvas_dimensions.width, height: canvas_dimensions.height});
    my_canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
    //my_canvas.setZoom(canvas_dimensions.width / canvas_dimensions.base_width);
    my_canvas.renderAll();
    
    
});


document.addEventListener('DOMContentLoaded', () => {
    
    //my_canvas.renderAll();
    
    
    try {
        fabric.Image.fromURL('https://designer-files.nyc3.cdn.digitaloceanspaces.com/defaults/front.jpg').then( (img) => {
            canvas_dimensions = new CanvasDimensions(img.width/img.height, img.width, img.height);
            
            my_canvas.setDimensions({width: canvas_dimensions.width, height: canvas_dimensions.height});
            
            my_canvas.backgroundImage = img;
            
            img.set({
                originX: 'center',
                originY: 'center',
                left: canvas_dimensions.width / 2,
                top: canvas_dimensions.height / 2
            });

            canvas_dimensions.resizeDimensions(window.innerWidth - 20, window.innerHeight - 20);
            my_canvas.setDimensions({width: canvas_dimensions.width, height: canvas_dimensions.height});
            my_canvas.setZoom(canvas_dimensions.width / canvas_dimensions.base_width);
            my_canvas.renderAll();
         });
    
    }
    catch (error) {
        console.error("Error loading image:", error);
    }

});

