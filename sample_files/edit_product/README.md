# Edit Product

## transpile

### merge

transpile `validate.cpp` and merge `UpdateHostAboutError` into Emscripten generated JS file (`validate.js`)

```
emcc validate.cpp --js-library mergeinto.js -s "EXPORTED_RUNTIME_METHODS=['ccall', 'UTF8ToString']" -s "EXPORTED_FUNCTIONS=['_malloc', '_free']" -o validate.js
```
