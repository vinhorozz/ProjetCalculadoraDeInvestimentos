import { Chart} from "chart.js/auto";
import { generateReturnsArray } from "./investmentGoals.js";
import { createTable } from "./table.js";
import{cleanTables}from"./table.js";

const form=document.getElementById("formInvestment");
const btnClear=document.getElementById("clearForm");
const shareAmountChart=document.getElementById("shareAmountChart");
const growthAmountChart=document.getElementById("growthAmountChart");
const mainElement=document.getElementById("main");
const carouselElement=document.getElementById("carousel");
const btnPreview=document.getElementById("slide-arrow-preview");
const btnNext=document.getElementById("slide-arrow-next");

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

    carouselElement.scrollLeft-=mainElement.clientWidth;
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
   
//--------------------------------------------------------------------------------------------------
// Selecionar os contextos dos dois gráficos
const ctxDoughnut = shareAmountChart.getContext("2d");
const ctxBar = growthAmountChart.getContext("2d");

// Função para criar gradientes lineares mais escuros e visíveis
function createGradient(ctx, colorStart, colorMiddle, colorEnd) {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0., colorStart);
    gradient.addColorStop(.45, colorMiddle); 
    gradient.addColorStop(0.95, colorEnd);
    return gradient;
}

// 🔹 Gradientes mais escuros e perceptíveis  
const gradientInvested = createGradient(ctxDoughnut,  "#28017a", "#5d8ef0","#28017a"); // Azul forte
const gradientReturn   = createGradient(ctxDoughnut, "#05f71d", "#043813", "#05f71d"); // Verde escuro
const gradientFee      = createGradient(ctxDoughnut, "#e34222", "#540a26", "#e34222"); // Vermelho intenso

// ------------------------ DOUGHNUT CHART ------------------------
doughnutChart = new Chart(shareAmountChart, {
    type: 'doughnut',
    data: {
        labels: ["Investido", "Retorno", "Imposto"],
        datasets: [{
            data: [investedAmount, returnAmount, fee],
            backgroundColor: [gradientInvested, gradientReturn, gradientFee],
            hoverOffset: 20,
            borderWidth: 0,
            borderColor: "#fff" // 🔹 Contraste visual melhorado
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 20 },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 15,
                    font: { size: 14 },
                    generateLabels: function(chart) {
                        const data = chart.data;
                        return data.labels.map((label, i) => {
                            const value = data.datasets[0].data[i];
                            return {
                                text: `${label}: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                strokeStyle: data.datasets[0].backgroundColor[i],
                                pointStyle: 'circle',
                                hidden: false
                            };
                        });
                    }
                }
            }
        }
    }
});

// ------------------------ PROGRESSION CHART ------------------------
const gradientInvestedBar = createGradient(ctxBar,  "#28017a","#5d8ef0", "#28017a"); // Azul forte
const gradientReturnBar   = createGradient(ctxBar, "#05f71d","#043813", "#05f71d"); // Verde escuro

progressionChart = new Chart(growthAmountChart, {
    type: 'bar',
    data: {
        labels: returnsArray.map(a => a.month),
        datasets: [
            {
                label: "Total investido",
                data: returnsArray.map(a => currencyApply(a.investedAmount)),
                backgroundColor: gradientInvestedBar
            },
            {
                label: "Retorno do Investimento",
                data: returnsArray.map(a => currencyApply(a.totalAmount)),
                backgroundColor: gradientReturnBar
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: { stacked: true },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return 'R$ ' + value.toLocaleString('pt-BR');
                    }
                }
            }
        }
    }
});

//----------------------------------------------------------------------------------------------------
createTable(columnsArray, returnsArray,'results-table');
mainElement.classList.remove("hidden");
btnNext.classList.remove("hidden");
btnPreview.classList.add("hidden");
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
    
    mainElement.classList.add("hidden");

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



    btnNext.addEventListener("click",()=>{
        carouselElement.scrollLeft+=mainElement.clientWidth
        btnPreview.classList.remove("hidden");
        btnNext.classList.add("hidden");
    });

    btnPreview.addEventListener("click",()=>{
        carouselElement.scrollLeft-=mainElement.clientWidth
        btnNext.classList.remove("hidden");
        btnPreview.classList.add("hidden");
        });

btnClear.addEventListener("click",clearForm);
form.addEventListener("submit",renderProgression);