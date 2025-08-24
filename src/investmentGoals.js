function convertToMonthlyReturnRate(yearlyReturnRate) {
    return yearlyReturnRate**(1/12);    
}  
 
export function generateReturnsArray(startingAmount=0, monthlyContribution=0,timeHorizon=0,timePeriod="monthly", returnRate=0, returnTimeFrame="monthly",fee=0) {   
    if (!timeHorizon || !startingAmount) {
        throw new Error("Investimento e prazo devem ser preenchidos com valores positivos");        
    }
    
    const finalTimeHorizon=timePeriod==="monthly"?timeHorizon:timeHorizon*12;
    const finalReturnRate=returnTimeFrame==="monthly"?1+returnRate/100:convertToMonthlyReturnRate((1+returnRate/100));    
    const referenceInvestimentObject={
        investedAmount: startingAmount,
        interestReturns:0,
        totalInterestReturns:0,
        month:0,
        totalAmount:startingAmount,
    };
    const returnsArray =[referenceInvestimentObject];

    for (let timeReference = 1; timeReference <= finalTimeHorizon;timeReference++) {

        const investedAmount=startingAmount+monthlyContribution*timeReference;
        const interestReturns=returnsArray[timeReference-1].totalAmount*(finalReturnRate-1);                
        const totalAmount = (returnsArray[timeReference-1].totalAmount*finalReturnRate)+monthlyContribution;
        const totalInterestReturns=totalAmount-investedAmount;
                
        returnsArray.push({ 
            investedAmount,
            interestReturns,            
            totalInterestReturns,
            month:timeReference,
            totalAmount,})

    }
    return returnsArray;
}