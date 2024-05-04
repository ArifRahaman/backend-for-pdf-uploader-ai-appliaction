import java.util.*;
public class string {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        String str=sc.next();
        String find=sc.next();
        int ans=0;
        int index=str.indexOf(find);
        while(index!=-1){
           ans++;
        //    System.out.println(index);
        // str.indexOf(str, str.indexOf(find)+1);
        index=str.indexOf(find,index+1);
        } 
        System.out.println(ans);
    }
}
