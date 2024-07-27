function showDetail(name, amount) {
    document.getElementById('detail-title').textContent = name;
    document.getElementById('detail-content').innerHTML = `<p>${name}: ${amount}</p>`;
    document.getElementById('detail-view').style.display = 'block';
}

function showStockDetail(name, amount) {
    document.getElementById('detail-title').textContent = name;
    document.getElementById('detail-content').innerHTML = `
        <p>Stock: ${name}</p>
        <p>Value: ${amount}</p>
        <p>Profit: $5000</p>
        <p>Change: 25%</p>
        <p>Price: $250</p>
        <p>Quantity: 100</p>
        <div class="d-flex justify-content-between mt-3">
            <p>Avg Cost: $200</p>
            <p>Total Paid: $20000</p>
        </div>`;
    document.getElementById('detail-view').style.display = 'block';
}

function hideDetail() {
    document.getElementById('detail-view').style.display = 'none';
}
