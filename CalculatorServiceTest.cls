@isTest
public class CalculatorServiceTest {

    @isTest
    static void testCalculatorMethods(){

        Test.startTest();

        Integer result = CalculatorService.addNumbers(2,3);
        Integer result1 = CalculatorService.multiplyNumbers(2,3);

        Test.stopTest();

        System.assertEquals(5, result);
        System.assertEquals(6, result1);
    }
}