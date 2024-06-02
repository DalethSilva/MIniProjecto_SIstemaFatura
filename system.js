let itemCounter = 0;

function addInvoiceItem() {
    itemCounter++;
    const newItemRow = `
    <tr id="itemRow${itemCounter}">
        <td><input type="number" class="form-control productId" placeholder="ID do Produto" required></td>
        <td><input type="text" class="form-control" placeholder="Insira a descrição" required></td>
        <td><input type="number" class="form-control quantity" placeholder="Insira a quantidade" required></td>
        <td><input type="number" class="form-control unitPrice" placeholder="Insira o preço da unidade" required></td>
        <td><span class="form-control IVA">7%</span></td>
        <td><input type="text" class="form-control totalItemPrice" disabled readonly></td>
        <td><button type="button" class="btn btn-danger" onclick="removeInvoiceItem(${itemCounter})">Remover</button></td>
    </tr>`;
    $("#invoiceItems").append(newItemRow);
    updateTotalAmount();
}

function removeInvoiceItem(itemId) {
    $(`#itemRow${itemId}`).remove();
    updateTotalAmount();
}

function updateTotalAmount() {
    let totalAmount = 0;
    $("tr[id^='itemRow']").each(function () {
        const quantity = parseFloat($(this).find(".quantity").val()) || 0;
        const unitPrice = parseFloat($(this).find(".unitPrice").val()) || 0;
        const IVA = 0.07;
        const totalItemPrice = (quantity * unitPrice) * (1 + IVA);
        $(this).find(".totalItemPrice").val(totalItemPrice.toFixed(2));
        totalAmount += totalItemPrice;
    });
    $("#totalAmount").val(totalAmount.toFixed(2));
}

$(document).ready(function () {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    $("#invoiceDate").val(formattedDate);
});

$("#invoiceForm").submit(function (event) {
    event.preventDefault();
    updateTotalAmount();

    const customerName = $("#customerName").val();
    const invoiceDate = $("#invoiceDate").val();
    const totalAmount = $("#totalAmount").val();
    const items = [];

    $("tr[id^='itemRow']").each(function () {
        const productId = $(this).find(".productId").val();
        const description = $(this).find("td:eq(1) input").val();
        const quantity = $(this).find("td:eq(2) input").val();
        const unitPrice = $(this).find("td:eq(3) input").val();
        const totalItemPrice = $(this).find("td:eq(5) input").val();

        items.push({
            product_id: productId,
            descricao: description,
            quantidade: quantity,
            preco_unitario: unitPrice,
            total: totalItemPrice,
        });
    });

    $.ajax({
        url: 'save_invoice.php',
        type: 'POST',
        data: {
            clienteNome: customerName,
            data: invoiceDate,
            itens: JSON.stringify(items),
            total: totalAmount
        },
        success: function (response) {
            alert(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(textStatus, errorThrown);
        }
    });
});

function printInvoice() {
    const customerName = $("#customerName").val();
    const invoiceDate = $("#invoiceDate").val();
    const items = [];

    $("tr[id^='itemRow']").each(function () {
        const productId = $(this).find(".productId").val();
        const description = $(this).find("td:eq(1) input").val();
        const quantity = $(this).find("td:eq(2) input").val();
        const unitPrice = $(this).find("td:eq(3) input").val();
        const IVA = 0.07;
        const totalItemPrice = $(this).find("td:eq(5) input").val();

        items.push({
            product_id: productId,
            description: description,
            quantity: quantity,
            unitPrice: unitPrice,
            IVA: IVA,
            totalItemPrice: totalItemPrice,
        });
    });

    const totalAmount = $("#totalAmount").val();

    const invoiceContent = `
    <html>
    <head>
        <title>Recibo de Fatura</title>
        <style>
            body { 
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: #d6d5da;
            }
            h1 {
                color: #007bff;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
            }
            .total {
                font-weight: bold;
            }
            .invoice-header, .invoice-footer {
                text-align: center;
            }
            .invoice-body {
                margin-top: 20px;
            }
            .invoice-details, .customer-details, .item-details {
                width: 100%;
                margin-bottom: 20px;
            }
            .item-details th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <div class="invoice-header">
            <h2>Recibo de Fatura</h2>
            <p>Emitente: Empresa Campos da Silva Ltda</p>
            <p>NIF: 123456789</p>
            <p>Endereço: Rua Amilcar Cabral, Nº 23, Luanda, Angola</p>
        </div>
        <div class="invoice-body">
            <div class="invoice-details">
                <p><strong>Data: </strong> ${invoiceDate}</p>
                <p>Nº da Fatura: 2024/0001</p>
            </div>
            <div class="customer-details">
                <p><strong>Nome do(a) cliente: </strong> ${customerName}</p>
                <p>NIF: 987654321</p>
                <p>Endereço: Avenida Deolinda Rodrigues, Nº 45, Luanda, Angola</p>
            </div>
            <div class="item-details">
                <table>
                    <thead>
                        <tr>
                            <th>ID do Produto</th>
                            <th>Descrição</th>
                            <th>Quantidade</th>
                            <th>Preço Unitário</th>
                            <th>IVA</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td>${item.product_id}</td>
                                <td>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td>${item.unitPrice}</td>
                                <td>${(item.unitPrice * item.quantity * item.IVA).toFixed(2)}</td>
                                <td>${item.totalItemPrice}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        <div class="invoice-footer">
            <p><strong>Total a pagar: </strong> ${totalAmount}</p>
            <p>Condições de Pagamento: 30 dias</p>
            <p>Obrigatório apresentar esta fatura no ato do pagamento.</p>
        </div>
    </body>
    </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.print();
}

function showAvailableProducts() {
    $.ajax({
        url: 'get_products.php',
        type: 'GET',
        success: function (response) {
            const products = JSON.parse(response);
            let productsHtml = '';
            products.forEach(product => {
                productsHtml += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.descricao}</td>
                    <td>${product.quantidade}</td>
                    <td>${product.preco}</td>
                </tr>`;
            });
            $("#productsTable").html(productsHtml);
            $("#productsList").show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(textStatus, errorThrown);
        }
    });
}





