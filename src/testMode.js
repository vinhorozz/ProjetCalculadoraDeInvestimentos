

    

const toggleSwitch=document.getElementById("toggleSwitch");
const startingAmount=document.getElementById("startingAmount");
const additionalIncomes=document.getElementById("additionalIncomes");
const period=document.getElementById("period");
const interestRates=document.getElementById("interestRates");
const fees=document.getElementById("fees");

toggleSwitch.addEventListener("change",(e)=>{
     if (e.target.checked) {
        startingAmount.value="1000"
        additionalIncomes.value="1000"
        period.value="10"
        interestRates.value="1"
        fees.value="15"
       }
    }
)


