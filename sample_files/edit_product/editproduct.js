const initialProductData = {
  name: "Womane's Mid Rise Skinny Jeans",
  categoryId: "100",
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];



let moduleMemory = null;  // reference to WebAssembly.Memory, used for memory manipulation
let moduleExports = null; // substitute for Module variable

initializePage = () => {
  document.getElementById("name").value = initialProductData.name
  const category = document.getElementById("category");
  const count = category.length;

  for (let index = 0; index < count; index++) {
    if (category[index].value === initialProductData.categoryId) {
      category.selectedIndex = index;
      break;
    }
  }

  // loading wasm
  const importObject = {
    env:{
      UpdateHostAboutError: (errorMessagePointer) => {
        setErrorMessage(getStringFromMemory(errorMessagePointer));
      },
    },
    wasi_snapshot_preview1: {
      proc_exit: (value) => {}
    }
  };

  WebAssembly.instantiateStreaming(fetch("validate.wasm"), importObject).then(
    result => {
      moduleExports = result.instance.exports;
      moduleMemory= moduleExports.memory;
    });
}

getSelectedCategoryId = () => {
  const category = document.getElementById("category");
  const index = category.selectedIndex;

  if (index !== -1) { return category[index].value; }
}

setErrorMessage = (error) => {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.innerText = error;
  // console.log("setErrorMessage:" . error);
  errorMessage.style.display = (error === "" ? "none" : "");
}


onClickSave = () => {
  setErrorMessage(""); 

  const name = document.getElementById("name").value;
  const categoryId = getSelectedCategoryId();

  Promise.all([
    validateName(name),
    validateCategory(categoryId)
  ]).then(() => {
  }).catch((error) => {
    setErrorMessage(error);
  });
}

validateName = (name) => {
  return new Promise(function(resolve, reject){
    const pointers = { onSuccess: null, onError: null };
    createPointers( resolve, reject, pointers );

    Module.ccall(
      'ValidateName', 
      null,
      ['string','number','number','number'],
      [name, MAXIMUM_NAME_LENGTH, pointers.onSuccess, pointers.onError]);
  });
}

validateCategory = (categoryId) => {

  return new Promise(function(resolve, reject){
    const pointers = { onSuccess: null, onError: null };
    createPointers(resolve, reject, pointers);

    const arrayLength = VALID_CATEGORY_IDS.length;
    const bytesPerElement = Int32Array.BYTES_PER_ELEMENT;
    const arrayPointer = moduleExports.create_buffer((arrayLength * bytesPerElement));

   
    Module.ccall('ValidateCategory', 
      null,
      ['string', 'number', 'number', 'number', 'number'],
      [categoryId, arrayPointer, arrayLength, pointers.onSuccess, pointers.onError]
    );

    Module._free(arrayPointer);
  });
}

getStringFromMemory = (memoryOffset) => {
  let returnValue = "";

  const size = 256;
  const bytes = new Uint8Array(moduleMemory.buffer, memoryOffset, size);

  let character = "";
  for(let i = 0; i<size; i++){
    character = String.fromCharCode(bytes[i]);
    if(character === "\0") { break; }
    returnValue += character;
  }
return returnValue;
}



copyStringToMemory = (value, memoryOffset) => {

  // To maniuplate placing memory buffer as Uint8Array object 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
  const bytes = new Uint8Array(moduleMemory.buffer);

  // TextEncoder to convert string to byte-array
  // 1st arg: byte array to be stored
  // 2nd arg: starting memory address
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set 
  bytes.set(new TextEncoder().encode((value + "\0")), memoryOffset);
}


createPointers = (resolve, reject, returnPointers) => {
  const onSuccess = Module.addFunction(function(){
    freePointers(onSuccess, onError);
    resolve();
  }, 'v');

  const onError = Module.addFunction(function(errorMessage){
    freePointers(onSuccess, onError);
    reject(Module.UTF8ToString(errorMessage));
  }, 'vi');
  returnPointers.onSuccess = onSuccess;
  returnPointers.onError = onError;

}

freePointers = (onSuccess, onError) => {
  Module.removeFunction(onSuccess);
  Module.removeFunction(onError);
}



