public class CloseAllOpen {
    public static void Close()
    {
        List<Opportunity> opp1=[Select id,StageName 
                                from Opportunity 
                                where CloseDate<N_DAYS_AGO:30 
                                and AccountId!=null 
                                and IsClosed=FALSE];
        
        for(Opportunity opp:opp1)
        {
            if(opp.AccountId!=null)
            {  opp.StageName='Closed Lost';}
        }
        if(!opp1.isEmpty())
        {
            update opp1;
        }
        
    }
}