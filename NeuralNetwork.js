import Layer from "./Layer.js";
import Neuron from "./Neuron.js";

class NeuralNetwork {
    constructor() {
        this.l = 0;
        this.l_deriv = 0;
        this.accuracy = 0;
        this.output=0
        this.layers = [];
        this.weights = [];
        this.dcdw = [];
        this.x = 0;
    }
    generateWeights() {
        this.weights = [];
        for (let i = 0; i < this.layers.length - 1; i++) {
            let layer = [];
            for (let j = 0; j < this.layers[i].neurons; j++) {
                let neuron = [];
                for (let k = 0; k < this.layers[i + 1].neurons; k++) {
                    neuron.push(Math.random());
                }
                layer.push(neuron);

            }
            this.weights.push(layer);
        }

        return this.weights;

    }

    train(xs, ys) {
        this.loss_col = [];

        this.l = 0;
        let outputs = [];
        for (let x = 0; x < xs.length; x++) {
            for (let l = 0; l < this.layers.length; l++) {
                for (let n = 0; n < this.layers[l].layer.length; n++) {
                    this.layers[l].layer[n].value = 0;
                }
            }
            this.layers[0].layer[0].value = xs[x];
            this.x = xs[x];

            for (let i = 1; i < this.layers.length; i++) {

                for (let j = 0; j < this.layers[i].layer.length; j++) {
                    for (let k = 0; k < this.layers[i - 1].layer.length; k++) {
                        this.layers[i].layer[j].value += ((this.layers[i - 1].layer[k].value * this.weights[i - 1][k][j]));
                    }
                    this.layers[i].layer[j].value += this.layers[i].bias;
                    
                    this.layers[i].activate();

                }

            }
            this.output = this.layers[this.layers.length - 1].layer[this.layers[this.layers.length - 1].layer.length - 1].value;
            outputs.push(this.output);
            console.log(ys[x], this.output)
            this.l_deriv = this.loss_deriv(ys[x], this.output);

        }

        let accuracy = 0;
        console.log(outputs.length)
        for (let i = 0; i < outputs.length; i++) {
            this.l += this.loss(ys[i], outputs[i]);
            this.l_deriv += this.loss_deriv(ys[i], outputs[i])
            accuracy += (outputs[i] - ys[i]);
        }
        console.log("loss:",this.l)
        this.l_deriv /= ys.length;
        this.l /= xs.length ;
        for (let i = 1; i < this.layers.length; i++) {
            for (let j = 0; j < this.layers[i].layer.length; j++) {
                for (let k = 0; k < this.layers[i - 1].layer.length; k++) {
                    let dzdw = this.layers[i-1].layer[k].value;
                    let dadz = this.layers[i].activate_deriv()[j].value
                    console.log(dadz, dzdw, this.l_deriv);
                    let dcdw = dzdw * dadz * this.l_deriv;
                    this.weights[i - 1][k][j] -= dcdw * 0.0001;
                    
                    this.layers[i].bias -= (dadz * this.l_deriv) * 0.0001;
                    console.log(this.weights[i - 1][k][j],
                        this.layers[i].bias);
                    
                }
            }
        }

        return this.layers[this.layers.length - 1].layer[this.layers[this.layers.length - 1].layer.length - 1].value

    }


    // predict(xs) {
    //     this.layers[0].layer[0].value = xs;

    //     for (let i = 1; i < this.layers.length; i++) {
    //         for (let j = 0; j < this.layers[i].layer.length; j++) {
    //             for (let k = 0; k < this.layers[i - 1].layer.length; k++) {
    //                 this.layers[i].layer[j].value += ((this.layers[i - 1].layer[k].value * this.weights[i - 1][k][j]) + this.layers[i].bias);
                    
    //             }
    //         }
    //     }
    //     let l = this.layers[i].activate();;

    //     return l[this.layers[this.layers.length - 1].layer.length - 1].value;
    // }

    backprop() {


    }
    loss(actual, output) {
        return Math.pow(actual - output, 2)
    }

    loss_deriv(actual, output) {
        return -2 * (actual - output);
    }

    add(neurons, activation) {
        let layer = new Layer(neurons, activation);
        console.log(layer);
        this.layers.push(layer);
        this.weights = this.generateWeights();

    }
}


export default NeuralNetwork;