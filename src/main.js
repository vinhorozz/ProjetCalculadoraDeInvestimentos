import { Chart} from "chart.js/auto";
import { generateReturnsArray } from "./investmentGoals.js";
import { createTable } from "./table.js";
import{cleanTables}from"./table.js";


const form=document.getElementById("formInvestment");
const btnClear=document.getElementById("clearForm");
const shareAmountChart=document.getElementById("shareAmountChart");
const growthAmountChart=document.getElementById("growthAmountChart");
let doughnutChart={};
let progressionChart={};

const columnsArray=[
    {columnLabel: "Mês", accessor: "month"},
    {columnLabel: "Total Investido", accessor: "investedAmount",format:(a)=>currencyApply(a,true)},
    {columnLabel: "Rendimento Mensal", accessor: "interestReturns",format:(a)=>currencyApply(a,true)},
    {columnLabel: "Rendimento Total", accessor: "totalInterestReturns",format:(a)=>currencyApply(a,true)},
    {columnLabel: "Quantia Total", accessor: "totalAmount",format:(a)=>currencyApply(a,true)}    
]

function currencyApply(value,currency=false){    
   return !currency ? value.toFixed(2):value.toLocaleString("pt-BR",{style:"currency", currency:"BRL"})
}

function renderProgression(e) {
    e.preventDefault();
    
    if(document.querySelector(".error")){        
        return;
    }
    resetCharts();
    
    const startingAmount=Number(document.getElementById("startingAmount").value.replace(",","."));
    const additionalIncomes=Number(document.getElementById("additionalIncomes").value.replace(",","."));    
    const period=Number(document.getElementById("period").value);  
    const evaluatePeriod=document.getElementById("evaluatePeriod").value;    
    const interestRates=Number(document.getElementById("interestRates").value.replace(",","."));
    const ratePeriod=document.getElementById("ratePeriod").value;    
    const fees=Number(document.getElementById("fees").value.replace(",","."));
    const returnsArray= generateReturnsArray(startingAmount,additionalIncomes,period,evaluatePeriod,interestRates,ratePeriod,fees);
    const finalInvestmentObject=(returnsArray[returnsArray.length -1]);
    const investedAmount=currencyApply(finalInvestmentObject.investedAmount);
    const returnAmount=currencyApply(finalInvestmentObject.totalInterestReturns*(1-fees/100));
    const fee=currencyApply(finalInvestmentObject.totalInterestReturns*(fees/100));
    

//  doughnutChart=   new Chart(
//         shareAmountChart,
//         {
//         type: 'doughnut',
//         data: {labels: ["Investido","Retorno","Imposto"],
//             datasets: [{
//             // label: 'My First Dataset',
//             data: [investedAmount,returnAmount,fee],
//             backgroundColor: ['blue','green',"red" ],            
//             hoverOffset: 10,
//             borderWidth: 0}]
//             },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false, // 🔥 permite ao gráfico usar toda a div
//             layout: {
//                 padding: 20 // 🔥 adiciona espaço extra para não cortar
//             }
// }            
//         })

// progressionChart =new Chart(growthAmountChart, {
//     type: 'bar',
//     data: {
//         labels: returnsArray.map(a => a.month),
//         datasets: [
//             {
//                 label: "Total investido",
//                 data: returnsArray.map(a => currencyApply(a.investedAmount)),
//                 backgroundColor: 'blue'
//             },
//             {
//                 label: "Retorno do Investimento",
//                 data:  returnsArray.map(a => currencyApply(a.totalAmount)),
//                 backgroundColor: 'green'
//             },
//         ]
//     },
//     options: {
//         responsive: true,
//         scales: {
//             x: {
//                 stacked: true
//             },
//             y: {
//                 beginAtZero: true,
//                 ticks: {
//                     callback: function(value) {
//                         return 'R$ ' + value.toLocaleString('pt-BR');
//                     }
//                 }
//             }
//         }
//     }
// });
createTable(columnsArray, returnsArray,'results-table');

}

function isObjectEmpty(obj) {
   return Object.keys(obj).length===0; 
}

function resetCharts() {
    if (!isObjectEmpty(doughnutChart) && !isObjectEmpty(progressionChart)){
        doughnutChart.destroy();   
        progressionChart.destroy();
    }
}

function clearForm() { 
    form["startingAmount"].value="";
    form["additionalIncomes"].value="";
    form["period"].value="";
    form["interestRates"].value="";
    form["fees"].value="";
        
    resetCharts();
    cleanTables();
    //Função deve ser ajustada para não criar  tabela dentra de tabela (limpar os dados)

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