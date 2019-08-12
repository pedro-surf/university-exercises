#include <stdio.h>

int main() {
int n, m, *ptr;

printf("\n Digite a quantidade de linhas");
scanf("%d", &m);

printf("\n Digite a quantidade de colunas");
scanf("%d", &n);

ptr = (int**) malloc(n*sizeof(int*));
for (i =0; i < m; i++) {
 for (j =0; i < m; i++) {
   ptr[i][j] = 1 + srand() % 30;
   printf("\n %d", ptr[i][j]);
  }
 }
}
