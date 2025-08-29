const isNonEmptyArray=(arrayElement)=>{
    return Array.isArray(arrayElement) && arrayElement.length>0;

}

export const createTable=(columnsArray,dataArray, tableId)=>{
    if(!isNonEmptyArray(columnsArray)|| !isNonEmptyArray(dataArray) || !tableId){
        throw new Error("Para a correta execução, precisaremos de um array com as colunas, outro com as informações da linhas e também o 'id' do elemento 'tabela' selecionado");

    }
    const tableElement=document.getElementById(tableId);
 
    if (!tableElement || tableElement.nodeName !=="TABLE") {
        throw new Error("'Id' informado não corresponde a nenhum elemento table");                
    }
    createTableHeader(tableElement,columnsArray);
    createTableBody(tableElement,dataArray,columnsArray);
}
// --------------------------------------------------------------------------------------------------------
function createTableHeader(tableReference,columnsArray) { //Função deve ser ajustada para não criar cabeçalho dentro de tabela qua já está na página(limpar os dados)
    const tableHeaderElement=tableReference.querySelector("thead");    
    if(!tableHeaderElement){        
        const tableHeaderElement=document.createElement('thead');
        tableReference.appendChild(tableHeaderElement);

    const headerRow=document.createElement("tr");//Ao inserirmos nosvamente é preciso validar se já existe e abortar o processo
    ['bg-blue-900','text-slate-200','sticky','top-0'].forEach((cssClass)=>headerRow.classList.add(cssClass));

    for(const tableColumnObject of columnsArray){
        const headerElement=/*html*/`<th class='text-center'>${tableColumnObject.columnLabel}</th>`
        headerRow.innerHTML+=headerElement;
    }

    tableHeaderElement.appendChild(headerRow);
    }
}
// --------------------------------------------------------------------------------------------------------
function createTableBody(tableReference,tableItems, columnsArray) { //Função deve ser ajustada para não criar um nova tabela dentro de tabela qua já está na página(limpar os dados)
    let tableBodyElement=tableReference.querySelector("tbody");

    if (!tableBodyElement) {
        tableBodyElement=document.createElement('tbody');
        tableReference.appendChild(tableBodyElement);                        
    }
    tableBodyElement.replaceChildren();
    
    for(const[itemIndex,tableItem] of tableItems.entries()){//criar as linhas da tabela        
        const tableRow=document.createElement('tr');        

        if(itemIndex %2==0){
           tableRow.classList.add('bg-blue-200')}; //colorir alternadamente as linhas

        for (const tableColumn of columnsArray) {
            const formatFn=tableColumn.format ??(info=>info)//a função anônima repete o valor            
            tableRow.innerHTML+=/*html*/`<td class="text-center">${formatFn(tableItem[tableColumn.accessor])}</td>` //célula da tabela//valor criado dinâmicamente
        }
        tableBodyElement.appendChild(tableRow);    
    }

    }

// --------------------------------------------------------------------------------------------------------
function cleantables(){
    
}