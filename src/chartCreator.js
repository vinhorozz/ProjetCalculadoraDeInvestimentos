import { Chart } from "chart.js/auto";

// ------------------ FUNÇÃO DE CRIAR GRADIENTES ------------------
function createGradient(ctx, colorStart, colorMiddle, colorEnd) {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(0.45, colorMiddle);
    gradient.addColorStop(0.95, colorEnd);
    return gradient;
}

// ------------------ FUNÇÃO DE CRIAR O DOUGHNUT CHART ------------------
export function createDoughnutChart(ctx, investedAmount, returnAmount, fee, currencyApplyMix) {
    const gradientInvested = createGradient(ctx, "#28017a", "#5d8ef0", "#28017a");
    const gradientReturn = createGradient(ctx, "#05f71d", "#043813", "#05f71d");
    const gradientFee = createGradient(ctx, "#e34222", "#540a26", "#e34222");

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
            layout: { padding: 20 },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 15,
                        font: { size: 14 },
                        generateLabels: function (chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => {
                                const value = data.datasets[0].data[i];
                                return {
                                    text: `${label}: R$ ${currencyApplyMix(value, true)}`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].backgroundColor[i],
                                    pointStyle: "circle",
                                    hidden: false
                                };
                            });
                        }
                    }
                }
            }
        }
    });
}

// ------------------ FUNÇÃO DE CRIAR O PROGRESSION CHART ------------------
export function createProgressionChart(ctx, returnsArray, currencyApplyMix) {
    const gradientInvestedBar = createGradient(ctx, "#28017a", "#5d8ef0", "#28017a");
    const gradientReturnBar = createGradient(ctx, "#05f71d", "#043813", "#05f71d");

    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: returnsArray.map(a => a.month),
            datasets: [
                {
                    label: "Total investido",
                    data: returnsArray.map(a => currencyApplyMix(a.investedAmount)),
                    backgroundColor: gradientInvestedBar
                },
                {
                    label: "Retorno do Investimento",
                    data: returnsArray.map(a => currencyApplyMix(a.totalAmount)),
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
                        callback: function (value) {
                            return "R$ " + value.toLocaleString("pt-BR");
                        }
                    }
                }
            }
        }
    });
}
