
import { generateReturnsArray } from "./investmentGoals.js";
import { createTable } from "./table.js";
import {cleanTables}from"./table.js";
import { fillInthenBlanks } from "./testMode.js";
import { createDoughnutChart, createProgressionChart } from "./chartCreator.js";


const toggleSwitch=document.getElementById("toggleSwitch");
const aside=document.getElementsByTagName('aside');
const form=document.getElementById("formInvestment");
const btnCalculate=document.getElementById("calculate_returns")
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
    {columnLabel: "Total Investido", accessor: "investedAmount",format:(a)=>currencyApplyTable(a)},
    {columnLabel: "Rendimento Mensal", accessor: "interestReturns",format:(a)=>currencyApplyTable(a)},
    {columnLabel: "Rendimento Total", accessor: "totalInterestReturns",format:(a)=>currencyApplyTable(a)},
    {columnLabel: "Total Bruto", accessor: "totalAmount",format:(a)=>currencyApplyTable(a)}    
]

function currencyApplyTable(value,table=false) {
    return value.toLocaleString("pt-BR",{style:"currency", currency:"BRL"})    
}

function currencyApplyMix(value,chart=false){   
    return !chart? value.toFixed(2):(()=>{
        let [integer,decimal]=value.split(".")
        return  (`${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${decimal}`)         
    })()
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
    const investedAmount=currencyApplyMix(finalInvestmentObject.investedAmount);
    const returnAmount=currencyApplyMix(finalInvestmentObject.totalInterestReturns*(1-fees/100));
    const fee=currencyApplyMix(finalInvestmentObject.totalInterestReturns*(fees/100));
    const ctxDoughnut = shareAmountChart.getContext("2d");
    const ctxBar = growthAmountChart.getContext("2d");
    const netValue=String((Number(investedAmount)+Number(returnAmount)).toFixed(2));
    const grossValue =String((Number(investedAmount) +finalInvestmentObject.totalInterestReturns).toFixed(2));

    doughnutChart = createDoughnutChart(ctxDoughnut, investedAmount, returnAmount, fee,netValue, grossValue, currencyApplyMix);
    progressionChart = createProgressionChart(ctxBar, returnsArray, currencyApplyMix);

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
    carouselElement.scrollTop-=mainElement.clientWidth
    carouselElement.scrollLeft-=mainElement.clientWidth
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
    if(formElement.tagName==='INPUT' && formElement.hasAttribute('name')&& formElement.hasAttribute('required')){
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
toggleSwitch.addEventListener("change",fillInthenBlanks);

let resizeTimeOut;

window.addEventListener("resize",()=>{
    if(!mainElement.classList.contains("hidden")){
    clearTimeout(resizeTimeOut);
    setTimeout(()=>{renderProgression(new Event("submit")),3000})
    }


    const infoBlocks= form.querySelectorAll('div[name="infoBlock"]');
    infoBlocks.forEach(info => {
        if(window.innerHeight<600){
        info.classList.remove("h-[5.5rem]")
        const inputs=info.querySelectorAll('input');
            for (const input of inputs) {
                input.classList.remove('h-10');
                input.classList.add('h-6');
                input.style.fontSize="10px";

            const labels=info.querySelector('label')
                    labels.style.fontSize='10px';
            
            const selectors=form.querySelectorAll("select");
                for(const select of selectors){
                        select.style.fontSize="10px"
                }
            
            const options=info.querySelectorAll('option');               
                for(const opt of options){
                opt.style.fontSize="10px";}
            }
               btnClear.style.fontSize="10px";
               btnCalculate.style.fontSize="10px";               
               btnCalculate.classList.remove("h-10")
               btnCalculate.classList.add("h-6", "mt-4")
               btnClear.classList.remove("h-10")
               btnClear.classList.add("h-6", )
    }else{
    
    }
});

})

