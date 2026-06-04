// JavaScript cho Hóa đơn thanh toán

// Hằng số
const TAX_RATE = 0.1; // 10% VAT
const DISCOUNT_RATE = 0; // Tỷ lệ giảm giá

// Dữ liệu sản phẩm
let products = [
    { id: 1, name: 'Sản phẩm A', price: 50000, quantity: 2, unit: 'Cái' },
    { id: 2, name: 'Sản phẩm B', price: 75000, quantity: 3, unit: 'Cái' },
    { id: 3, name: 'Sản phẩm C', price: 100000, quantity: 1, unit: 'Bộ' },
    { id: 4, name: 'Dịch vụ hỗ trợ', price: 50000, quantity: 1, unit: 'Lần' }
];

/**
 * Định dạng số tiền theo định dạng Việt Nam
 * @param {number} amount - Số tiền cần định dạng
 * @returns {string} - Chuỗi tiền đã định dạng
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Tính thành tiền cho một sản phẩm
 * @param {number} price - Đơn giá
 * @param {number} quantity - Số lượng
 * @returns {number} - Thành tiền
 */
function calculateLineTotal(price, quantity) {
    return price * quantity;
}

/**
 * Tính tổng tiền hàng
 * @returns {number} - Tổng tiền hàng
 */
function calculateSubtotal() {
    return products.reduce((sum, product) => {
        return sum + calculateLineTotal(product.price, product.quantity);
    }, 0);
}

/**
 * Tính tiền giảm giá
 * @returns {number} - Tiền giảm giá
 */
function calculateDiscount() {
    const subtotal = calculateSubtotal();
    return subtotal * DISCOUNT_RATE;
}

/**
 * Tính tiền thuế VAT
 * @returns {number} - Tiền thuế VAT
 */
function calculateTax() {
    const subtotal = calculateSubtotal();
    const afterDiscount = subtotal - calculateDiscount();
    return afterDiscount * TAX_RATE;
}

/**
 * Tính tổng cộng
 * @returns {number} - Tổng cộng
 */
function calculateTotal() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
}

/**
 * Cập nhật bảng hóa đơn
 */
function updateInvoiceTable() {
    const tbody = document.querySelector('.invoice-table tbody');
    
    if (!tbody) return;

    // Xóa tất cả các hàng hiện tại
    tbody.innerHTML = '';

    // Thêm các hàng sản phẩm
    products.forEach((product, index) => {
        const lineTotal = calculateLineTotal(product.price, product.quantity);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td><input type="number" value="${product.quantity}" min="0" class="qty-input" data-id="${product.id}" style="width: 50px; text-align: center;"></td>
            <td>${product.unit}</td>
            <td>${formatCurrency(lineTotal)}</td>
        `;
        tbody.appendChild(row);
    });

    // Thêm sự kiện cho các input số lượng
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const newQuantity = parseInt(e.target.value) || 0;
            
            const product = products.find(p => p.id === productId);
            if (product) {
                product.quantity = newQuantity;
                updateInvoiceTable();
                updateSummary();
            }
        });
    });
}

/**
 * Cập nhật bảng tính tổng
 */
function updateSummary() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    const total = calculateTotal();

    // Cập nhật tóm tắt (nếu có)
    const summaryTable = document.querySelector('.summary-table');
    if (summaryTable) {
        summaryTable.innerHTML = `
            <tr>
                <td class="label">Tổng tiền hàng:</td>
                <td class="amount">${formatCurrency(subtotal)}</td>
            </tr>
            ${discount > 0 ? `
            <tr>
                <td class="label">Giảm giá (${DISCOUNT_RATE * 100}%):</td>
                <td class="amount">-${formatCurrency(discount)}</td>
            </tr>
            ` : ''}
            <tr>
                <td class="label">Thuế VAT (${TAX_RATE * 100}%):</td>
                <td class="amount">${formatCurrency(tax)}</td>
            </tr>
            <tr class="total-row">
                <td class="label"><strong>TỔNG CỘNG:</strong></td>
                <td class="amount"><strong>${formatCurrency(total)}</strong></td>
            </tr>
        `;
    }
}

/**
 * Thêm sản phẩm mới vào hóa đơn
 */
function addProduct() {
    const name = prompt('Nhập tên sản phẩm:');
    if (!name) return;

    const price = parseFloat(prompt('Nhập đơn giá:'));
    if (isNaN(price) || price < 0) {
        alert('Đơn giá không hợp lệ!');
        return;
    }

    const quantity = parseInt(prompt('Nhập số lượng:', '1'));
    if (isNaN(quantity) || quantity < 1) {
        alert('Số lượng không hợp lệ!');
        return;
    }

    const unit = prompt('Nhập đơn vị tính:', 'Cái');

    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    products.push({
        id: newId,
        name: name,
        price: price,
        quantity: quantity,
        unit: unit || 'Cái'
    });

    updateInvoiceTable();
    updateSummary();
}

/**
 * Xóa sản phẩm khỏi hóa đơn
 * @param {number} productId - ID sản phẩm
 */
function removeProduct(productId) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        products = products.filter(p => p.id !== productId);
        updateInvoiceTable();
        updateSummary();
    }
}

/**
 * In hóa đơn
 */
function printInvoice() {
    window.print();
}

/**
 * Xuất hóa đơn dưới dạng PDF (giả lập - thực tế cần thư viện)
 */
function exportPDF() {
    alert('Chức năng xuất PDF sẽ được triển khai trong tương lai!');
    // Có thể sử dụng thư viện như html2pdf, jsPDF, v.v.
}

/**
 * Khởi tạo ứng dụng khi trang tải xong
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hóa đơn ứng dụng đã khởi tạo');
    
    updateInvoiceTable();
    updateSummary();

    // Thêm nút chức năng nếu cần
    const actionsDiv = document.querySelector('.invoice-actions');
    if (actionsDiv) {
        actionsDiv.innerHTML = `
            <button onclick="addProduct()" class="btn btn-primary">➕ Thêm sản phẩm</button>
            <button onclick="printInvoice()" class="btn btn-secondary">🖨️ In hóa đơn</button>
            <button onclick="exportPDF()" class="btn btn-secondary">📥 Xuất PDF</button>
        `;
    }
});

// Xuất các hàm để sử dụng từ HTML
window.addProduct = addProduct;
window.removeProduct = removeProduct;
window.printInvoice = printInvoice;
window.exportPDF = exportPDF;
