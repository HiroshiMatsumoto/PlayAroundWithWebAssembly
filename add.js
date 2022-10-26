// An object containing the values to be imported into the newly-created Instance
// https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate
const importObject = {
  env: {
    memory: new WebAssembly.Memory({ initial: 1, maximum: 10 }),
  },
};

let arg1 = document.getElementById("arg1");
let arg2 = document.getElementById("arg2");
let result = document.getElementById("result");

function mouseOut() {
  if (arg1.value !== "" && arg2.value !== "") {
    // load local wasm file
    fetch("add.wasm")
      // load wasm onto memory
      .then((res) => res.arrayBuffer())
      // instantiation on memory
      .then((bytes) => WebAssembly.instantiate(bytes, importObject))
      .then((result) => {
        // process
        console.log(result);
        document.getElementById("result").value = result.instance.exports.add(
          parseInt(arg1.value, 10),
          parseInt(arg2.value, 10)
        );
      });
  }
}

function init() {
  arg1.onmouseout = mouseOut;
  arg2.onmouseout = mouseOut;
}
init();
