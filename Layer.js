import Neuron from "./Neuron.js";

class Layer {
    constructor(neurons, activation) {
        this.bias = Math.random();
        this.neurons = neurons;
        this.activation = activation;
        this.layer = [];
        for (let i = 0; i < this.neurons; i++) {
            this.layer.push(new Neuron());
        }
    }

    activate() {
        if (this.activation == "sigmoid") {

            for (let i = 0; i < this.layer.length; i++) {
                this.layer[i].value = (1 / (1 + Math.pow(2.71, (this.layer[i].value * -1))))


            }
        }
        else if (this.activation == "relu") {

            for (let i = 0; i < this.layer.length; i++) {
                this.layer[i].value = Math.max(-0.1, this.layer[i].value)


            }
        }

    }

    activate_deriv(){
        let vals = [...this.layer];
        
        if(this.activation == "sigmoid"){
            for(let i = 0; i < vals.length; i++){
                vals[i].value = (Math.pow(2.71, (vals[i].value)*-1)) / Math.pow((1 + Math.pow(2.71, (vals[i].value)*-1)), 2)
            }
        } 
        else if (this.activation == "relu"){
            for(let i = 0; i < vals.length; i++){
                if(vals[i].value > 0){
                    vals[i].value=1
                } else {
                    vals[i].value=0;
                }
            }
        }
        return vals

    }
}

export default Layer;