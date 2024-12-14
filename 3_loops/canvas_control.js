

const my_canvas = new fabric.Canvas('main-canvas', 
    {
        width: 500,
        height: 600
    }
);
my_canvas.perPixelTargetFind = true;
let canvas_dimensions = null;
//let overLayer = false;
const current_figure = {
    figure: null,
    position: {
        x0: 0,
        y0: 0,
        xf: 0,
        yf: 0
    }

};


class Layer extends fabric.Group {


    static lastSelectedLayer = null;
    static count = 0;


    constructor(left = 0, top = 0, width = 20, height = 20) {
        ++Layer.count; //const layer_count = my_canvas.getObjects("group").length;
        const rect = new fabric.Rect({
            left: left,
            top: top,
            width: width,
            height: height,
            originX: 'center',
            originY: 'center',
            fill: '#555555'
        });
        
        const text = new fabric.IText(String(Layer.count),{
            left: rect.left,
            top: rect.top,
            originX: 'center',
            originY: 'center'
        });
        const maxScale = Math.min(rect.width / text.width, rect.height / text.height);
        text.set('fontSize', text.fontSize * text._fontSizeMult * maxScale)

        super([rect, text],{
            left: rect.left,
            top: rect.top,
            originX: 'center',
            originY: 'center'
        });
        this.perPixelTargetFind = true;
        this.setLayerEvents();
        
    }

    setLayerEvents() {
    
        this.on('modified', function(e) {
            console.log(e);
            const width = e.target.width * e.target.scaleX;
            const height = e.target.height * e.target.scaleY;
            e.target.set({
                width: width,
                height: height,
                scaleX: 1,
                scaleY: 1
            });
            e.target.getObjects().map(obj => {
                if(obj instanceof fabric.IText) {
                    
                    const maxScale = Math.min(width / obj.width, height / obj.height);
                    const newFontSize = obj.fontSize * (maxScale * obj._fontSizeMult);
                    
                    obj.set({
                        fontSize: newFontSize,
                        scaleX: 1,
                        scaleY: 1
                    });
                }else {
                    obj.set({
                        width: width,
                        height: height,
                        scaleX: 1,
                        scaleY: 1
                    });
                }
                
            })
            e.target.setCoords();
            my_canvas.renderAll();
        })
    
        this.on('mouseup', function(e) {
            
            if(designer_mode.value == 'edit') {
                const text = e.target.getObjects().find(obj => obj instanceof fabric.IText)
                popups.push(new Popup('Insert Object', text.text));
            }
        });
    }

    destroy() {
        // Llama al método dispose del padre si existe
        if (typeof this.dispose === 'function') {
            this.dispose();
        }

        this.off();
        if(this?._element){
            this._element = null;
        }
        

        --Layer.count;
        console.log('Objeto eliminado.');
    }
}




my_canvas.on('mouse:down', function(e) {
    
    //console.log(e);
    const selectedLayer = e.target;
    const x0_position = e.scenePoint.x;
    const y0_position = e.scenePoint.y;

    Layer.lastSelectedLayer = selectedLayer instanceof Layer ? selectedLayer : null;
    if(designer_mode.value == 'edit') {
        if(last_selected_figure?.obj && !current_figure.figure){
            //current_figure.figure = FIGURE_OPTIONS.find(opt => opt.value === last_selected_figure.value)?.createFigure();
            //if (current_figure.figure) {
            current_figure.position = {
                ...current_figure.position,
                x0: x0_position,
                y0: y0_position,
            }
            //}
            
        }
    }else if(designer_mode.value == 'admin' && !Layer.lastSelectedLayer) {
        if(!current_figure.figure){
            current_figure.figure = new fabric.Rect();
            if (current_figure.figure) {
                current_figure.position = {
                    ...current_figure.position,
                    x0: x0_position,
                    y0: y0_position,
                }
            }
            
        }
    }
    
    
});

my_canvas.on('mouse:up', function(e) {
    
    const selectedLayer = e.target;
    const xf_position = e.scenePoint.x;
    const yf_position = e.scenePoint.y;
    if(designer_mode.value == 'edit'){
        if(last_selected_figure?.obj){
            current_figure.figure = FIGURE_OPTIONS
                .find(opt => opt.value === last_selected_figure.value)?.createFigure({
                    dx: Math.abs(xf_position - current_figure.position.x0),
                    dy: Math.abs(yf_position - current_figure.position.y0)
                });
            if (current_figure.figure) {
                current_figure.figure.set({
                    left: (xf_position + current_figure.position.x0) / 2,
                    top: (yf_position + current_figure.position.y0) / 2
                });
                my_canvas.add(current_figure.figure);
                my_canvas.renderAll();
                current_figure.figure = null
            }
            
        }
        selectedLayer.setCoords();
        if(Layer.lastSelectedLayer){
            const point0 = new fabric.Point(Layer.lastSelectedLayer.oCoords.br.x, Layer.lastSelectedLayer.oCoords.br.y);
            const pointf = new fabric.Point(Layer.lastSelectedLayer.oCoords.bl.x, Layer.lastSelectedLayer.oCoords.bl.y);
            my_canvas.zoomToPoint(point0.midPointFrom(pointf), (my_canvas.width / Layer.lastSelectedLayer.width) / 2);
            selectedLayer.setCoords();
            my_canvas.renderAll();
        }
        
    }else if(designer_mode.value == 'admin' && !Layer.lastSelectedLayer) {
        //if(last_selected_figure?.obj){
        const layerLeft = (xf_position + current_figure.position.x0) / 2;
        const layerTop = (yf_position + current_figure.position.y0) / 2;
        const layerWidth = Math.abs(xf_position - current_figure.position.x0) >= 20 ? Math.abs(xf_position - current_figure.position.x0) : 20;
        const layerHeight = Math.abs(yf_position - current_figure.position.y0) >= 20 ? Math.abs(yf_position - current_figure.position.y0) : 20;
        //const newlayer = createLayer({left: layerLeft, top: layerTop, width: layerWidth, height: layerHeight});

        const layer = new Layer(layerLeft, layerTop, layerWidth, layerHeight);
        my_canvas.add(layer);
        my_canvas.renderAll();
        current_figure.figure = null;
        //}
        //layer.setLayerEvents();
    }
    
    
});

my_canvas.on('object:removed', function(e) {
    const removedObject = e.target;
    if (removedObject instanceof Layer) {
        removedObject.destroy(); // Llama al método `destroy` personalizado
    }
});







