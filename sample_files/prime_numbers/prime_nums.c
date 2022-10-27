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

void print_primes(int num){
  for(int i=3;i<num;i++){
    if(0 < is_prime(i)){
      printf("%d\n", i);
    }
  }
}

int main(){
  print_primes(1000);
  return 0;
}
