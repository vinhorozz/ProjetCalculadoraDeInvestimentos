import { Chart} from "chart.js/auto";
import { generateReturnsArray } from "./investmentGoals.js";
 


const form=document.getElementById("formInvestment");
const btnClear=document.getElementById("clearForm");
const shareAmountChart=document.getElementById("shareAmountChart");
const growthAmountChart=document.getElementById("growthAmountChart");
 
function currencyApply(value){
    return value.toFixed(2);    
}


function renderProgression(e) {
    e.preventDefault();

    if(document.querySelector(".error")){        
        return;
    }

    const startingAmount=Number(document.getElementById("startingAmount").value.replace(",","."));
    const additionalIncomes=Number(document.getElementById("additionalIncomes").value.replace(",","."));    
    const period=Number(document.getElementById("period").value);  
    const evaluatePeriod=document.getElementById("evaluatePeriod").value;    
    const interestRates=Number(document.getElementById("interestRates").value.replace(",","."));
    const ratePeriod=document.getElementById("ratePeriod").value;    
    const fees=Number(document.getElementById("fees").value.replace(",","."));
    const returnsArray= generateReturnsArray(startingAmount,additionalIncomes,period,evaluatePeriod,interestRates,ratePeriod,fees)

    //  console.log(returnsArray);

    const finalInvestmentObject=(returnsArray[returnsArray.length -1])

    const investedAmount=currencyApply(finalInvestmentObject.investedAmount);
    const returnAmount=currencyApply(finalInvestmentObject.totalInterestReturns*(1-fees/100));
    const fee=currencyApply(finalInvestmentObject.totalInterestReturns*(fees/100));
    
    
console.log(currencyApply(finalInvestmentObject.investedAmount))
    new Chart(
        shareAmountChart,
        {
        type: 'doughnut',
        data: {labels: ["Investido","Retorno","Imposto"],
            datasets: [{
            // label: 'My First Dataset',
            data: [investedAmount,returnAmount,fee],
            backgroundColor: ['rgb(255, 99, 132)',
                              'rgb(54, 162, 235)',
                              'rgb(255, 205, 86)'],
            hoverOffset: 4}]
            }
        })
}

function clearForm() {
 
    form["startingAmount"].value="";
    form["additionalIncomes"].value="";
    form["period"].value="";
    form["interestRates"].value="";
    form["fees"].value="";
        
    const errorInputs=document.querySelectorAll('.error');//criar uma lista com erros

    for(const errorInput of errorInputs){//tratar cada erro da lista
        errorInput.classList.remove("error");
        errorInput.parentElement.querySelector('p').remove();
    }
}

function validateInput(e) {
    if(e.target.value===""){
        return;
    }

    const {parentElement}=e.target;//mostra o elemento que ativou a função
    const {parentElement:{parentElement:grandParentElement}}=e.target;// const grandParentElement=e.target.parentElement.parentElement;    
    const inputValue=e.target.value.replace(",",".");

    if ( !parentElement.classList.contains('error') && (isNaN(inputValue)|| Number(inputValue)<=0)) {
        const errorTextElement=document.createElement('p');
        errorTextElement.classList.add("text-red-500");
        errorTextElement.innerText="Inserir valor numérico positivo"

        parentElement.classList.add('error');
        grandParentElement.appendChild(errorTextElement);
    } else if(parentElement.classList.contains('error') && !isNaN(inputValue) && Number(inputValue)>0) {
        
        parentElement.classList.remove("error");
        grandParentElement.querySelector("p").remove();
    }
}

for(const formElement of form){
    if(formElement.tagName==='INPUT' && formElement.hasAttribute('name')){
        formElement.addEventListener("blur",validateInput);                
    }
}


btnClear.addEventListener("click",clearForm);
form.addEventListener("submit",renderProgression);