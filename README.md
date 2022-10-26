# Hands on WebAssembly

## Prepare

Have emsdk installed and ready

[https://github.com/emscripten-core/emsdk.git](https://github.com/emscripten-core/emsdk.git)

## How to transpile

This is one way to transpile.

This generates a module of function(s) defined in C source file.
C source file can consist only of functions but main function.
In the case of no main defined in C source file, `--no-entry` option is needed.

Modulizing target functions are described in the `EXPORTED_FUNCTIONS` list.

```
emcc -O1 --no-entry -s "EXPORTED_FUNCTIONS=['_add']" -o add.wasm add.c
```

## How to run

Run up a server

It can be any server, but python server is easy to start up.

```
python -m http.server 8080
```

then, open `XXX.html`

# sample files

## add.c

takes two integers and return the sum
