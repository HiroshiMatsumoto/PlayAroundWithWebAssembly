#include <stdio.h>
#include <math.h>
#include "emscripten.h"

int is_prime(int num){
  if(num == 2) {return 1;}
  if(num <= 1 || num % 2 == 0) {return 0;}
  for(int i = 3; i * i <= num; i+=2){
    if( i % 2 == 0 ) {return 0;}
  }
  return 1;
}

int main(){
  for(int i=3;i<10000;i++){
    if(0 < is_prime(i)){
      printf("%d\n", i);
    }
  }
  return 0;
}
