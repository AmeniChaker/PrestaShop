/**
 * This script is based on scenarios described in this combination of the following tests link
 * [id="PS-32"][Name="Print the delivry slips of an order"]
 **/

const {AccessPageBO} = require('../../../selectors/BO/access_page');
const {OrderPage} = require('../../../selectors/BO/order');
const {CreateOrder} = require('../../../selectors/BO/order');
const {AddProductPage} = require('../../../selectors/BO/add_product_page');
const common_scenarios = require('../../common_scenarios/product');
const commonOrder = require('../../common_scenarios/order');
let promise = Promise.resolve();
global.orderInformation = [];
let productData = {
  name: 'P1',
  quantity: "10",
  price: '5',
  image_name: 'image_test.jpg',
  reference: 'test_1',
  type: 'combination',
  attribute: {
    1: {
      name: 'color',
      variation_quantity: '10'
    }
  }
};
scenario('Print the delivery slips', () => {
  scenario('Login in the Back Office', client => {
    test('should open the browser', () => client.open());
    test('should login successfully in the Back Office', () => client.signInBO(AccessPageBO));
  }, 'order');
  common_scenarios.createProduct(AddProductPage, productData);
  commonOrder.createOrderBO(OrderPage, CreateOrder, productData);
  scenario('Change the status', client => {
    test('should check status to be equal to "Awaiting check payment"', () => client.checkTextValue(OrderPage.order_status, 'Awaiting check payment'));
    test('should set order status to "Payment accepted"', () => client.updateStatus('Payment accepted'));
    test('should click on "UPDATE STATUS" button', () => client.waitForExistAndClick(OrderPage.update_status_button));
    test('should check that the status is "Payment accepted"', () => client.checkTextValue(OrderPage.order_status, 'Payment accepted'));
    test('should set order status to "Processing in progress"', () => client.updateStatus('Processing in progress'));
    test('should click on "UPDATE STATUS" button', () => client.waitForExistAndClick(OrderPage.update_status_button));
    test('should check that the status is "Processing in progress"', () => client.checkTextValue(OrderPage.order_status, 'Processing in progress'));
    test('should set order status to "Shipped"', () => client.updateStatus('Shipped'));
    test('should click on "UPDATE STATUS" button', () => client.waitForExistAndClick(OrderPage.update_status_button));
    test('should check that the status is "Shipped"', () => client.checkTextValue(OrderPage.order_status, 'Shipped'));
    test('should set order status to "Delivered"', () => client.updateStatus('Delivered'));
    test('should click on "Delivred" button', () => client.waitForExistAndClick(OrderPage.update_status_button));
    test('should check that the status is "Delivred"', () => client.checkTextValue(OrderPage.order_status, 'Delivered'));
  }, 'order');
  commonOrder.getDeliveryInformation(0);
  scenario('Verify all the information on the deliveries slips', client => {
    test('should click on "View delivery slip" button', () => client.waitForExistAndClick(OrderPage.view_delivery_slip));
    test('should click on "DOCUMENTS" subtab', () => client.waitForVisibleAndClick(OrderPage.document_submenu));
    test('should get the delivery slip information', () => {
      return promise
        .then(() => client.getTextInVar(OrderPage.date_delivery_slip, "date_delivery_slip"))
        .then(() => client.getNameInvoice(OrderPage.download_delivery_button))
    });
    test('should check the "delivery slip file name"', async () => {
      await client.checkFile(global.downloadsFolderPath, global.invoiceFileName + '.pdf', 4000);
      if (existingFile) {
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.invoiceFileName)
      }
    });
    test('should check that the "delivery slip customer" is : Johan DOE', async () => {
      await client.checkFile(global.downloadsFolderPath, global.invoiceFileName + '.pdf');
      if (existingFile) {
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, 'John DOE');
      }
    });
    test('should check that the "Billing & Delivery Address"', async () => {
      await client.checkFile(global.downloadsFolderPath, global.invoiceFileName + '.pdf');
      if (existingFile) {
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, 'My Company');
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, '16, Main street');
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, '75002 Paris');
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, 'France');
      }
    });
    test('should check that the "delivery slips information"', async () => {
      await client.checkFile(global.downloadsFolderPath, global.invoiceFileName + '.pdf');
      if (existingFile) {
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.invoiceFileName);
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab['date_delivery_slip']);
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.orderInformation[0].OrderRef);
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.orderInformation[0].invoiceDate);
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.orderInformation[0].method);
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.orderInformation[0].ProductRef);
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.orderInformation[0].ProductName);
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.orderInformation[0].ProductCombination);
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.orderInformation[0].ProductQuantity);
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.orderInformation[0].ProductTotal);
        await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.orderInformation[0].PaymentMethod);
      }
    });
    test('should delete the delivery slips file', async () => {
      await client.checkFile(global.downloadsFolderPath, global.invoiceFileName + '.pdf');
      if (existingFile) {
        await client.deleteFile(global.downloadsFolderPath, global.invoiceFileName, ".pdf", 2000);
      }
    });
  }, 'order');
}, 'order', true);
