public class updateAdiscprtion {
    public static boolean isExiguted=false;
    public static void checkFunction(List<contact> diCon){
        system.debug(diCon.size());
        Set<Id> accId=new set<id>();
        for(Contact i:diCon)
        {
            accId.add(i.accountId);
        }
        Map<Id,Account> acc=new Map<Id,Account>([Select Id,Description from account where Id in:accId]);
        for(Contact i:diCon)
        {
            if(i.accountId!=null&&acc.containsKey(i.AccountId))
              acc.get(i.AccountId).Description=i.Description;
        }
        update acc.values();
    }
}