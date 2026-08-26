// Chart.js visualizations for Budget & Transparency Metrics

let budgetChartInstance = null;
let gaugeChartInstance = null;

function initBudgetChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (budgetChartInstance) {
    budgetChartInstance.destroy();
  }

  const budgetData = dashboardData.budget;
  const labels = budgetData.categories.map(c => c.name);
  const dataValues = budgetData.categories.map(c => c.percentage);
  const bgColors = budgetData.categories.map(c => c.color);

  budgetChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: bgColors,
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 6,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          display: false // We render custom interactive legend matching design
        },
        tooltip: {
          rtl: true,
          textDirection: 'rtl',
          backgroundColor: '#0f172a',
          titleFont: { family: 'Tajawal', size: 13, weight: 'bold' },
          bodyFont: { family: 'Tajawal', size: 12 },
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: function(context) {
              const cat = budgetData.categories[context.dataIndex];
              return ` ${cat.name}: ${cat.percentage}% (${(cat.amount).toLocaleString('ar-SA')} ر.س)`;
            }
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 1200
      }
    }
  });
}

function initCircularGauge(canvasId, percentage = 90) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (gaugeChartInstance) {
    gaugeChartInstance.destroy();
  }

  gaugeChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [percentage, 100 - percentage],
        backgroundColor: ['#0d9488', '#f1f5f9'],
        borderWidth: 0,
        circumference: 360,
        rotation: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '78%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      animation: {
        duration: 1500
      }
    }
  });
}

window.updateBudgetChart = function() {
  if (budgetChartInstance) {
    budgetChartInstance.update();
  }
};
