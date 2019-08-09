import java.util.Scanner;

public class Exercises {
int main(String [], args) {

 public static void main(String[] args) {
 	System.out.println("Digite o valor de X e depois o de Y");
	 Scanner x = new Scanner (System.in);
 	Scanner y = new Scanner (System.in);
        System.out.println("Soma: "+ (x + y));
	int maior = (x >= y ? x : y);
	System.out.println("Maior: " + maior);
    while (x < y) {
	x++; 
	System.out.println(x);
	}    

     }

}
