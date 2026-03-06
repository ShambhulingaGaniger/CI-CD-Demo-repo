@isTest
public class CalculatorServiceTest {

    @isTest
    static void testAddNumbers(){

        Integer result = CalculatorService.addNumbers(2,3);

        System.assertEquals(5, result);
    }

}