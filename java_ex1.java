import java.util.Scanner;

public class Exercises {
int main(String [], args) {

  public static void main(String[] args) {
        System.out.println("Digite o valor de X e depois o de Y");
	 	     Scanner entrada = new Scanner(System.in);
                     int x = entrada.nextInt();
                     int y = entrada.nextInt();
                    System.out.println("Soma: "+ (x + y));
                    int maior = (x >= y ? x : y);
                    System.out.println("Maior: " + maior);
                    int menor = (maior == x ? y : x);
                    menor++;
                    while (menor < maior) {
			System.out.println(menor);
                        menor++;
		}    
    }

}
