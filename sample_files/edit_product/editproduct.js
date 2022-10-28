const initialData = {
  name: "Womane's Mid Rise Skinny Jeans",
  categoryId: "100",
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

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
  console.log("onclicksave");
  let errorMessage = "";

  const errorMessagePointer = Module._malloc(256);

  const name = document.getElementById("name").value;
  const categoryId = getSelectedCategoryId();


  console.log(categoryId);
  if(
    !validateName(name, errorMessagePointer) ||  
    !validateCategory(categoryId, errorMessagePointer)
  ) {
    errorMessage = Module.UTF8ToString(errorMessagePointer);
    console.log(errorMessage);
  }
  Module._free(errorMessagePointer);

  setErrorMessage(errorMessage);
  if (errorMessage === "") {
  }
}


validateName = (name, errorMessagePointer) => {
  const isValid = Module.ccall('ValidateName',
    'number',
    ['string', 'number', 'number'],
    [name, MAXIMUM_NAME_LENGTH, errorMessagePointer]);

  return (isValid === 1);
}

validateCategory = (categoryId, errorMessagePointer) => {
  const arrayLength = VALID_CATEGORY_IDS.length;
  const bytesPerElement = moduleHEAP32.BYTES_PER_ELEMENT;
  const arrayPointer = Module._malloc((arrayLength * bytesPerElement));
  Module.HEAP32.set(VALID_CATEGORY_IDS, (arrayPointer / bytesPerElement));
  const isValid = Module.ccall('ValidateCategory',
    'number',
    ['string', 'number', 'number', 'number'],
    [categoryId, arrayPointer, arrayLength, errorMessagePointer]
  );
  Module._free(arrayPointer);
  return (isValid === 1); 
}
