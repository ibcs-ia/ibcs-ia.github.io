import NeuralNetwork from "./NeuralNetwork.js";
import Neuron from "./Neuron.js";

let layers_c = 3;
let neurons = [1, 3, 1];
let neural_net = document.getElementById("nn");
let stats = document.getElementById("stats");
let train = document.getElementById("train");
let predictions = document.getElementById("predictions");
let container = document.getElementById("container");
let layers = document.getElementsByClassName("layer");



let model = new NeuralNetwork();
model.add(1, "relu")
model.add(3, "relu")
model.add(1, "relu")

neural_net.innerHTML += '<p id="input"></p>'


for (let i = 0; i < model.layers.length; i++) {
    let layer = `
    
        <div class="layer">
        <button class="removeNeuron" id="${i}">-</button>
        <div class="neurons">
        `
    for (let j = 0; j < model.layers[i].layer.length; j++) {
        layer += '<div class="neuron"></div>'
    }
    // console.log(layer);
    layer += `</div>`;

    layer += `<button class="addNeuron" id="${i}">+</button>`
    layer += `</div>`;

    neural_net.innerHTML += layer;
}


// Array.from(document.getElementsByClassName("addNeuron")).forEach(button => {
//     console.log(button))
//     button.addEventListener("click", () => {
//         console.log(".")
//         let id = parseInt(button.id);
//         model.layers[id].layer.push(new Neuron());
//         model.layers[id].layer.neurons++;
//         let newNeuron = document.createElement("div")
//         newNeuron.className="neuron";
//         Array.from(document.getElementsByClassName("neurons"))[id].appendChild(newNeuron);

//     })

// })
neural_net.innerHTML += '<p id="output"></p>'

let n = Array.from(document.getElementsByClassName("neurons"));
n.forEach((neuron, i, a) => {

    a[i] = neuron.children;
})

let synapses = [];
function visualize() {
    document.querySelectorAll(".synapses").forEach(el => el.remove());
    for (let i = 0; i < n.length - 1; i++) {
        for (let j = 0; j < n[i].length; j++) {
            for (let k = 0; k < n[i + 1].length; k++) {
                let neuron1 = n[i][j].getBoundingClientRect();

                let neuron2 = n[i + 1][k].getBoundingClientRect();
                let n1x = neuron1.x + (neuron1.width / 2)
                let n1y = neuron1.y + (neuron1.height / 2)
                let n2x = neuron2.x + (neuron2.width / 2)
                let n2y = neuron2.y + (neuron2.height / 2)

                let height = Math.abs(n2y - n1y);
                let width = Math.abs(n2x - n1x);

                let hypotenuse = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));
                let angle = (Math.asin(height / hypotenuse) * (180 / Math.PI));

                let newEle = document.createElement("div");
                if (n2y < n1y) {
                    angle *= -1

                }

                newEle.style.width = `${hypotenuse}px`;
                newEle.style.height = "1px";
                newEle.style.position = "absolute";
                newEle.style.left = `${n1x}px`
                newEle.style.top = `${n1y}px`


                if (n[i + 1].length > n[i].length) {
                    newEle.style.transformOrigin = "top left"
                }

                else {
                    newEle.style.transformOrigin = "top left"
                }
                newEle.style.transform = `rotate(${angle}deg)`

                newEle.id = model.weights[i][j][k]
                newEle.className = "synapses";
                newEle.style.zIndex = "99";
                let randomR = Math.floor(Math.random() * 255)
                let randomG = Math.floor(Math.random() * 255)
                let randomB = Math.floor(Math.random() * 255)
                let randombb = Math.random() * 2
                // newEle.style.border = `1px solid #C89093`
                if (model.weights[i][j][k] > 0) {
                    newEle.style.backgroundColor = `rgba(200, 144, 147, ${Math.abs(model.weights[i][j][k])})`
                }
                else {
                    newEle.style.backgroundColor = `rgba(163, 188, 236, ${Math.abs(model.weights[i][j][k])})`

                }
                neural_net.appendChild(newEle)

            }
        }
    }
    Array.from(document.getElementsByClassName("synapses")).forEach(element => {
        element.addEventListener("mouseover", (e) => {
            console.log("?")
            document.getElementById("neuron-hover").style.display = "block";
            document.getElementById("neuron-hover").innerHTML = `Weight: ${parseFloat(element.id).toFixed(6)}`;


        })
        element.addEventListener("mouseout", e => {
            document.getElementById("neuron-hover").style.display = "none";

        })
    })
}
visualize()
let buttons = document.getElementsByClassName("addNeuron");

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        let id = parseInt(buttons[i].id);

        model.layers[id].layer.push(new Neuron());

        model.layers[id].neurons += 1;

        model.weights = model.generateWeights();
        let newNeuron = document.createElement("div")
        newNeuron.className = "neuron";
        Array.from(document.getElementsByClassName("neurons"))[id].appendChild(newNeuron);
        visualize()
    });
}


let buttonsR = document.getElementsByClassName("removeNeuron");
for (let i = 0; i < buttonsR.length; i++) {
    buttonsR[i].addEventListener("click", function () {
        let id = parseInt(buttonsR[i].id);

        model.layers[id].layer.pop();


        model.layers[id].neurons -= 1;

        model.weights = model.generateWeights();
        let newNeuron = document.createElement("div")
        newNeuron.className = "neuron";
        document.getElementsByClassName("neurons")[id].querySelector(".neuron").remove()
        // document.getElementsByClassName("neurons")[id].childNodes[0].remove();
        // Array.from(Array.from(document.getElementsByClassName("neurons"))[id].childNodes).pop()


        visualize()
    });
}


let xs = []
let ys = [];
for (let i = 0; i < 100; i++) {
    xs.push(i)
}
for (let i = 0; i < 100; i++) {
    ys[i] = xs[i] + 3 + Math.random();
}

console.log(ys);


let losses = [];
train.addEventListener("click", e => {
    let epochs = parseInt(document.getElementById("epochs").value);

    for (let i = 0; i < epochs; i++) {
        setTimeout(() => {

        document.getElementById("epoch").innerHTML = `Epoch #${i + 1} `
        let stat = model.train(xs, ys);
        document.getElementById("input").innerHTML = model.x;
        document.getElementById("output").innerHTML = model.output.toFixed(3)

        stats.innerHTML = `loss: ${model.l.toFixed(3)} | accuracy:  `;
        // console.log(model.predict(15))

        Array.from(document.getElementsByClassName("synapses")).forEach((element, i, a) => {
            // element.style.backgroundColor = `rgba(200, 144, 147, ${parseFloat(element.id)})`
            visualize();

        })

        }, 1000)

    }

   

})




