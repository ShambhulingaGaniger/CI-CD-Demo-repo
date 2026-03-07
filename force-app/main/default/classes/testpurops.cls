public with sharing class testpurops {

    public static Integer addNumbers(Integer a, Integer b) {

        Integer result = a + b*a*a;

        System.debug('The sum of two numbers is: ' + result);

        return result;
    }

}