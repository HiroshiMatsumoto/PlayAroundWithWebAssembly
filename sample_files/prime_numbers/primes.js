// An object containing the values to be imported into the newly-created Instance
// https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate
const importObject = {
  env: {
    memory: new WebAssembly.Memory({ initial: 1, maximum: 10 }),
  },
};

let arg = document.getElementById("arg");
let result = document.getElementById("result");

function mouseOut() {
  if (arg.value !== "") {
    console.log("mouseOut");
    // load local wasm file
    fetch("print_primes.wasm")
      // load wasm onto memory
      .then((res) => {
        console.log("result");
        console.log(res);
        const buff = res.arrayBuffer();
        return buff;
      })
      // instantiation on memory
      .then((bytes) => {
        console.log("instantiate");
        console.log("catching bytes");
        console.log(bytes);
        const instance = WebAssembly.instantiate(bytes, importObject);
        return instance;
      })
      .then((result) => {
        console.log(result);
        // process
        // result.instance.exports.prime_numbers(parseInt(arg.value, 10));
        result.instance.exports.print_primes(parseInt(arg.value, 10));
      });
  }
}

function init() {
  arg.onmouseout = mouseOut;
  result.value = 0;
}
init();
