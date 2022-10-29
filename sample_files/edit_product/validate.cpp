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
int ValidateValueProvided(const char *value, const char *error_message,
                          char *return_error_message) {
  if ((value == NULL) || (value[0] == '\0')) {
    strcpy(return_error_message, error_message);
    return 0;
  }
  return 1;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int ValidateName(char *name, int maximum_length, char *return_error_message) {
  if (ValidateValueProvided(name, "A Product Name must be provided.",
                            return_error_message) == 0) {
    return 0;
  }

  if (strlen(name) > maximum_length) {
    strcpy(return_error_message, "The Product Name is too long.");
    return 0;
  }
  return 1;
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
int ValidateCategory(char *category_id, int *valid_category_ids,
                     int array_length, char *return_error_message) {
  if ((valid_category_ids == NULL) || (array_length == 0)) {
    strcpy(return_error_message, "There are no Product Categories available.");
    return 0;
  }
  return 1;
}
#ifdef __cplusplus
}
#endif
