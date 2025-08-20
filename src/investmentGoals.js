function convertToMonthlyReturnRate(yearlyReturnRate) {
    return yearlyReturnRate**(1/12);    
}  
 
function generateReturnsArray(startingAmount=0,timeHorizon=0,timePeriod="monthly", montlhyContribution=0, returnRate=0, returnTimeFrame="monthly") {
    
    if (!timeHorizon || !startingAmount) {
        throw new Error("Investimento e prazo devem ser preenchidos com valores positivos");        
    }

    const finalReturnRate=returnTimeFrame==="monthly"?1+returnRate:convertToMonthlyReturnRate(1+returnRate/100);
    const finalTimeHorizon=timePeriod==="monthly"?timeHorizon:timeHorizon*12;
    const referenceInvestimentObject={
        investimentAmount: startingAmount,
        interestReturns:0,
        totalInterestReturns:0,
        month:0,
        totalAmount:startingAmount,
    };
    const returnsArray =[referenceInvestimentObject];

    for (let timeReference = 1; timeReference <= finalTimeHorizon;timeReference++) {
        const totalAmount =returnsArray[timeReference-1].totalAmount*finalReturnRate+montlhyContribution ;
        const interestReturns=returnsArray[timeReference-1].totalAmount*finalReturnRate;
        const investimentAmount=startingAmount+montlhyContribution*timeReference;
        const totalInterestReturns=startingAmount-investimentAmount;

        returnsArray.push({ 
            investimentAmount,
            interestReturns,            
            totalInterestReturns,
            month:timeReference,
            totalAmount,})

    }
    return returnsArray;
}