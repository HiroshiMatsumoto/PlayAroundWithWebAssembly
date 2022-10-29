const initialData = {
  name: "Womane's Mid Rise Skinny Jeans",
  categoryId: "100",
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];



let moduleMemory = null;  // reference to WebAssembly.Memory, used for memory manipulation
let moduleExports = null; // substitute for Module variable

initializePage = () => {
  console.log("init");
  document.getElementById("category");
  const count = category.length;

  for (let index = 0; index < count; index++) {
    if (category[index].value === initialData.categoryId) {
      category.selectedIndex = index;
      break;
    }
  }

  // loading wasm
  const importObject = {
    wasi_snapshot_preview1: {
      proc_exit: (value) => {}
    }
  };

  WebAssembly.instantiateStreaming(fetch("validate.wasm"), importObject).then(
    result => {
     console.log(result.instance.exports);
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

  if(validateName(name) && validateCategory(categoryId)){
    //
  }
}

validateName = (name) => {
  const isValid = Module.ccall('ValidateName',
    'number',
    ['string', 'number'],
    [name, MAXIMUM_NAME_LENGTH]);
  
  return (isValid === 1);
}

validateCategory = (categoryId) => {
  const arrayLength = VALID_CATEGORY_IDS.length;
  const bytesPerElement = Int32Array.BYTES_PER_ELEMENT;
  const arrayPointer = moduleExports.create_buffer((arrayLength * bytesPerElement));

  bytesForArray.set(VALID_CATEGORY_IDS, (arrayPointer / bytesPerElement));

  const isValid = Module.ccall('ValidateCategory', 'number', ['string', 'number', 'number'], [categoryId, arrayPointer, arrayLength]); 

  Module._free(arrayPointer);

  return (isValid === 1); 
}


getStringFromMemory = (memoryOffset) => {
  console.log("get string from memory");
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

