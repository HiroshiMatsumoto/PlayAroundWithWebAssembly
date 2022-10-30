#include <cstdlib>
#include <cstdint> // to use uint8_t
#include <cstring>
#include <iostream>

// if this is compiled for WebAssembly
#ifdef __EMSCRIPTEN__
#include "emscripten.h"
#endif

#ifdef __cplusplus
extern "C" {
#endif


typedef void(*OnSuccess)(void);
typedef void(*OnError)(const char*);


/*
 * Emscripten generated module includes C Standard Library like strlen.
 *
 * For sidemodule, C standard library cannot be used.
 * This means you cannot use strlen, or malloc, free nether.
 * Here we implement malloc, free substitutes functions.
 */

/*
 * malloc substitute
 *
 * uint8_t is 1 byte size. 
 * uint8_t * size_needed will allocate the desired memory size.
 */

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
uint8_t* create_buffer(int size_needed) { 
  return new uint8_t[size_needed]; 
}

// free substitute
#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
void free_buffer(const char* pointer)
{
  delete pointer;
}

//

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
extern void UpdateHostAboutError(const char* error_message);
int ValidateValueProvided(const char *value){
  if ((value == NULL) || (value[0] == '\0')) {
    return 0;
  }
  return 1;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
void ValidateName(char *name, int maximum_length, OnSuccess UpdateHostOnSuccess, OnError UpdateHostOnError){
  if(ValidateValueProvided(name) == 0) {
    UpdateHostOnError("A Product Name must be provided.");
  }
  else if (strlen(name) > maximum_length) {
    UpdateHostOnError("The Product Name is too long.");
  }
  else {
    UpdateHostOnSuccess();
  }

}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int IsCategoryIdInArray(char *selected_category_id,
                        int *valid_category_ids, // integer array
                        int array_length) {
  int category_id = atoi(selected_category_id);
  for (int index = 0; index < array_length; index++) {
    if (valid_category_ids[index] == category_id) {
      return 1;
    }
  }
  return 0;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
void ValidateCategory(
    char *category_id, 
    int *valid_category_ids,
    int array_length, 
    OnSuccess UpdateHostOnSuccess, 
    OnError UpdateHostOnError)
{
  if( ValidateValueProvided(category_id) == 0)
  {
    UpdateHostOnError("A Product Category must be selected.");
  }
  else if(( valid_category_ids == NULL) || (array_length == 0)) 
  {
    UpdateHostOnError("There are no Product Categories available.");
  }
  else if( IsCategoryIdInArray(category_id, valid_category_ids, array_length) == 0){
    UpdateHostOnError("The selected Product Category is not valid.");
  }
  else{
    UpdateHostOnSuccess();
  }
}
#ifdef __cplusplus
}
#endif
