/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package javaapplication1;
import java.util.Scanner;
/**
 *
 * @author Aluno
 */
public class JavaApplication1 {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        System.out.println("Digite o valor de X e depois o de Y");
	 	     Scanner entrada = new Scanner(System.in);
                     int x = entrada.nextInt();
                     int y = entrada.nextInt();
                     System.out.println(mdc(x, y));
    }
    public static int mdc(int x, int y) {    
          int mdc = 0, maior = 0, menor = 0;
          if (x>=y) { 
              maior = x; 
              menor = y;
          } else { 
              maior = y; 
              menor = x;
          }
          if (maior % menor == 0){ mdc = menor; }
          else if (x == menor)  { 
              mdc = mdc(maior, menor);
          }
          else { mdc = mdc(maior, maior%menor); }
          return mdc;
    }
}
