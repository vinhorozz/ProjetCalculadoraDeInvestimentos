import { generateReturnsArray } from "./investmentGoals";

// const calculateButton=document.getElementById("calculate_returns");
const form=document.getElementById("formInvestiment");

function renderProgression(e) {
e.preventDefault();

    const startingAmount=Number(document.getElementById("startingAmount").value);
    const additionalIncomes=Number(document.getElementById("additionalIncomes").value);
    
    const period=Number(document.getElementById("period").value);    
    const evaluatePeriod=document.getElementById("evaluatePeriod").value;
    
    const interestRates=Number(document.getElementById("interestRates").value);
    const ratePeriod=document.getElementById("ratePeriod").value;
    
    const fees=Number(document.getElementById("fees").value);

    const returnsArray= generateReturnsArray(startingAmount,additionalIncomes,period,evaluatePeriod,interestRates,ratePeriod,fees)

    console.log(returnsArray);
    e.con
}

// calculateButton.addEventListener("click",renderProgression)
form.addEventListener("submit",renderProgression)