class CanvasDimensions {
    constructor(ratio, ref_width, ref_height) {
        this.ratio = ratio; 
        this.setDimensions(ref_width, ref_height);
        this.base_width = ref_width;
        this.base_height = ref_height;
        
    }

    
    resizeDimensions(ref_width, ref_height) {
        this.setDimensions(ref_width, ref_height);
    }

    setDimensions(ref_width, ref_height) {
        const width_based = ref_width < ref_height;
        if(width_based){
            
            
            this.width = ref_width; 
            this.height = this.width / this.ratio ; 
        }else {
            
            
            this.height = ref_height; 
            this.width = this.height * this.ratio ; 
        }
    }

}





