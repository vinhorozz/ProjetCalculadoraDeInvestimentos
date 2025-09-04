import { Chart } from "chart.js/auto";

// ------------------ FUNÇÃO DE CRIAR GRADIENTES ------------------
function createGradientDoughnut(ctx, colorStart, colorMiddle, colorEnd) {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(0.45, colorMiddle);
    gradient.addColorStop(1., colorEnd);
    return gradient;
}

// ------------------ FUNÇÃO DE CRIAR O DOUGHNUT CHART ------------------
export function createDoughnutChart(ctx, investedAmount, returnAmount, fee,netValue, grossValue, currencyApplyMix) {
    const gradientInvested = createGradientDoughnut(ctx, "#28017a", "#5d8ef0", "#28017a");
    const gradientReturn = createGradientDoughnut(ctx,  "#1d823a", "#05f71d","#1d823a");
    const gradientFee = createGradientDoughnut(ctx,  "#540a26", "#e34222","#540a26");

    return new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Investido", "Retorno", "Imposto"],
            datasets: [{
                data: [investedAmount, returnAmount, fee],
                backgroundColor: [gradientInvested, gradientReturn, gradientFee],
                hoverOffset: 20,
                borderWidth: 0,
                borderColor: "#fff"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: {
                    left: 0,
                    right:window.innerWidth/10,
                    top:window.innerHeight/200,
                    bottom:window.innerHeight/200*20}},
            plugins: {
                legend: {
                    position: "left",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",             
                         padding:innerWidth>1300?innerWidth/130:innerWidth>900?innerWidth/100:innerWidth>600?innerWidth/100:innerWidth/100,

                         font: { size: innerHeight>800?innerHeight/80:innerHeight>640?innerHeight/60:innerHeight>440?innerHeight/60:innerHeight/80},


                        generateLabels: function (chart) {
                            const data = chart.data;                                                        
                            const labels = data.labels.map((label, i) => {
                                const value = data.datasets[0].data[i];
                                return {
                                    text: `${label}: R$ ${currencyApplyMix(value, true)}`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].backgroundColor[i],
                                    pointStyle: "circle",
                                    hidden: false
                                };
                            });
                            labels.push({
                                text: `Total Líquido: R$ ${currencyApplyMix(netValue, true)}`,                                
                                fillStyle: "#5d8ef0", // Sem cor na bolinha
                                strokeStyle: "#5d8ef0",
                                pointStyle: "",

                            }); labels.push({
                                text: `Total Bruto: R$ ${currencyApplyMix(grossValue, true)}`,                                
                                fillStyle: "indigo", // Sem cor na bolinha
                                strokeStyle: "indigo",
                                pointStyle: ""

                            });

                            return labels;
                        }
                    }
                }
            }
        }
    });
}

// // ------------------ FUNÇÃO DE CRIAR O PROGRESSION CHART ------------------
export function createProgressionChart(ctx, returnsArray, currencyApplyMix) {
    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: returnsArray.map(a => a.month),
            datasets: [
                {
                    label: "Total investido",
                    data: returnsArray.map(a => currencyApplyMix(a.investedAmount)),
                    backgroundColor: function (context) {
                        const { chart, parsed } = context;
                        const { ctx, chartArea, scales } = chart;
                        if (!chartArea) return null;

                        // Pega a altura máxima do gráfico e o valor da barra atual
                        const yAxis = scales.y;
                        const barTop = yAxis.getPixelForValue(parsed.y);
                        const barBottom = yAxis.getPixelForValue(0);
                        const gradient = ctx.createLinearGradient(
                            0, barBottom, // início no rodapé do gráfico
                            0, barTop     // fim no topo da barra
                        );

                        gradient.addColorStop(0, "#28017a");
                        gradient.addColorStop(0.5, "#5d8ef0");
                        gradient.addColorStop(1, "#28017a");

                        return gradient;
                    },
           
                },
                {
                    label: "Retorno do Investimento",
                    data: returnsArray.map(a => currencyApplyMix(a.totalAmount)),
                    backgroundColor: function (context) {
                        const { chart, parsed } = context;
                        const { ctx, chartArea, scales } = chart;
                        if (!chartArea) return null;

                        const yAxis = scales.y;
                        const barTop = yAxis.getPixelForValue(parsed.y);
                        const barBottom = yAxis.getPixelForValue(0);

                        const gradient = ctx.createLinearGradient(
                            0, barBottom,
                            0, barTop
                        );

                        gradient.addColorStop(0., "#05f71d");
                        gradient.addColorStop(0.5, "#0a6612");
                        gradient.addColorStop(1, "#05f71d");

                        return gradient;
                    },
               
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
                        callback: function (value) {
                            return "R$ " + value.toLocaleString("pt-BR");
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: "#333",
                        font: {
                            size: 14,
                            weight: "bold"
                        }
                    }
                }
            }
        }
    });
}
