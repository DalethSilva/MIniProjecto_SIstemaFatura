let itemCounter = 0;

function addInvoiceItem() {
    itemCounter++;
    const newItemRow = `
    <tr id="itemRow${itemCounter}">
        <td>
            <input type="number" class="form-control productId" placeholder="ID do Produto" required oninput="fetchProductDetails(${itemCounter})">
        </td>
        <td><input type="text" class="form-control productDescription" placeholder="Descrição" disabled></td>
        <td><input type="number" class="form-control quantity" placeholder="Quantidade" required oninput="updateTotalAmount()"></td>
        <td><input type="number" class="form-control unitPrice" placeholder="Preço Unitário" disabled></td>
        <td><input type="number" class="form-control iva" placeholder="IVA(%)" required oninput="updateTotalAmount()"></td>
        <td><input type="text" class="form-control totalItemPrice" disabled readonly></td>
        <td><button type="button" class="btn btn-danger" onclick="removeInvoiceItem(${itemCounter})">Remover</button></td>
    </tr>`;
    $("#invoiceItems").append(newItemRow);
}

function fetchProductDetails(rowId) {
    const productId = $(`#itemRow${rowId} .productId`).val();
    console.log(`Fetching details for product ID: ${productId}`); // Adiciona log para depuração
    if (productId) {
        $.ajax({
            url: `get_product_details.php?id=${productId}`,
            type: 'GET',
            success: function (response) {
                const product = JSON.parse(response);
                if (product) {
                    $(`#itemRow${rowId} .productDescription`).val(product.descricao);
                    $(`#itemRow${rowId} .unitPrice`).val(product.preco);
                    updateTotalAmount();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("error", textStatus, errorThrown);
            }
        });
    }
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
        const IVA = parseFloat($(this).find(".iva").val()) / 100 || 0;
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
        const description = $(this).find(".productDescription").val();
        const quantity = $(this).find(".quantity").val();
        const unitPrice = $(this).find(".unitPrice").val();
        const totalItemPrice = $(this).find(".totalItemPrice").val();

        items.push({
            product_id: productId,
            descricao: description,
            quantidade: quantity,
            preco_unitario: unitPrice,
            total: totalItemPrice,
        });
    });

    console.log({
        clienteNome: customerName,
        data: invoiceDate,
        itens: items,
        total: totalAmount
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
            console.error("error", textStatus, errorThrown);
        }
    });
});
