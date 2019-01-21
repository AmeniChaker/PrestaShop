const {Menu} = require('../../../selectors/BO/menu.js');
const {AccessPageBO} = require('../../../selectors/BO/access_page');
const {AccessPageFO} = require('../../../selectors/FO/access_page');
const {CustomerSettings} = require('../../../selectors/BO/shopParameters/customer_settings');
const {OrderPage} = require('../../../selectors/BO/order');
const {AddProductPage} = require('../../../selectors/BO/add_product_page');
const {Taxes} = require('../../../selectors/BO/international/taxes');
const commonOrder = require('../../common_scenarios/order');
const commonProduct = require('../../common_scenarios/product');
let promise = Promise.resolve();
let dateFormat = require('dateformat');
let dateSystem = dateFormat(new Date(), 'mm/dd/yyyy');
global.orderInfo = [];
let productData = [
  {
    name: 'P1_New',
    quantity: '10',
    price: '7.00',
    tax_rule: '20%',
    description: '',
    image_name: 'image_test.jpg',
    reference: 'test_1',
    type: 'combination',
    attribute: {
      1: {
        name: 'color',
        variation_quantity: '10'
      }
    }
  }, {
    name: 'P2_New',
    quantity: '10',
    price: '9.00',
    tax_rule: '10%',
    description: '',
    image_name: 'image_test.jpg',
    reference: 'test_2',
    type: 'combination',
    attribute: {
      1: {
        name: 'color',
        variation_quantity: '10'
      }
    }
  },
  {
    name: 'P3_New',
    quantity: '10',
    price: '13.00',
    tax_rule: '5.5%',
    description: '',
    image_name: 'image_test.jpg',
    reference: 'test_3',
    type: 'combination',
    attribute: {
      1: {
        name: 'color',
        variation_quantity: '10'
      }
    }
  }
];

scenario('Print the invoice of an order', () => {
  scenario('Login in the Back Office', client => {
    test('should open the browser', () => client.open());
    test('should login successfully in the Back Office', () => client.signInBO(AccessPageBO));
  }, 'order');

  scenario('Change the Customer Group tax parameter', client => {
    test('should go to "Product settings" page', () => client.goToSubtabMenuPage(Menu.Configure.ShopParameters.shop_parameters_menu, Menu.Configure.ShopParameters.customer_settings_submenu));
    test('should click on "Group" tab', () => client.waitForExistAndClick(CustomerSettings.groups.group_button));
    test('should click on customer "Edit" button', () => client.waitForExistAndClick(CustomerSettings.groups.customer_edit_button));
    test('should select "Tax excluded" option for "Price display method"', () => client.waitAndSelectByValue(CustomerSettings.groups.price_display_method, "1"));
    test('should click on "Save" button', () => client.waitForExistAndClick(CustomerSettings.groups.save_button));
  }, 'order');

  scenario('Change the tax options', client => {
    test('should go to "Taxes" page', () => client.goToSubtabMenuPage(Menu.Improve.International.international_menu, Menu.Improve.International.taxes_submenu));
    test('should display tax in the shopping cart', () => client.waitForExistAndClick(Taxes.taxes.display_tax.replace('%D', 'on')));
    test('should click on "Save" button', () => client.waitForExistAndClick(Taxes.taxes.save_button));
  }, 'order');

  for (let i = 0; i <= 2; i++) {
    commonProduct.createProduct(AddProductPage, productData[i]);
  }

  scenario('Create order in the Front Office', () => {
    scenario('Connect to the Front Office', client => {
      test('should login successfully in the Front Office', () => client.signInFO(AccessPageFO));
    }, 'common_client');

    commonOrder.createOrderNewProductFO('connected', 'pub@prestashop.com', '123456789', productData);

    scenario('Logout from the Front Office', client => {
      test('should logout successfully from the Front Office', () => client.signOutFO(AccessPageFO));
    }, 'order');

  }, 'order', true);

  scenario('Check the created order in the Back Office', client => {
    scenario('Open the browser and connect to the Back Office', client => {
      test('should open the browser', () => client.open());
      test('should login successfully in the Back Office', () => client.signInBO(AccessPageBO));
    }, 'order');

    scenario('Change the status for "Payment Accepted', client => {
      test('should go to "Orders" page', () => client.goToSubtabMenuPage(Menu.Sell.Orders.orders_menu, Menu.Sell.Orders.orders_submenu));
      test('should search for the created order by reference', () => client.waitAndSetValue(OrderPage.search_by_reference_input, global.tab['reference']));
      test('should go to search order', () => client.waitForExistAndClick(OrderPage.search_order_button));
      test('should go to the order', () => client.scrollWaitForExistAndClick(OrderPage.view_order_button.replace('%NUMBER', 1), 150, 2000));
      test('should check that the status is "Awaiting bank wire payment"', () => client.checkTextValue(OrderPage.order_status, 'Awaiting bank wire payment'));
      test('should set order status to "Payment accepted"', () => client.updateStatus('Payment accepted'));
      test('should click on "UPDATE STATUS" button', () => client.waitForExistAndClick(OrderPage.update_status_button));
      test('should check that the status is "Payment accepted"', () => client.checkTextValue(OrderPage.order_status, 'Payment accepted'));
    }, 'order');

    scenario('Print invoice', client => {
      test('should click on "View Invoice" button', () => client.waitForExistAndClick(OrderPage.view_invoice));
      test('should click on "DOCUMENTS" subtab', () => client.waitForVisibleAndClick(OrderPage.document_submenu));
      test('should get the invoice information', () => {
        return promise
          .then(() => client.getTextInVar(OrderPage.date_invoice, "date_invoice"))
          .then(() => client.getNameInvoice(OrderPage.download_invoice_button))
      });
      test('should check the "invoice file name"', async () => {
        await client.checkFile(global.downloadsFolderPath, global.invoiceFileName + '.pdf', 1000);
        if (existingFile) {
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.invoiceFileName)
        }
      });
      test('should check that the "invoice customer" is : Johan DOE', async () => {
        await client.checkFile(global.downloadsFolderPath, global.invoiceFileName + '.pdf');
        if (existingFile) {
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, 'John DOE');
        }
      });
      test('should check that the "Delivery & Billing Address"', async () => {
        await client.checkFile(global.downloadsFolderPath, global.invoiceFileName + '.pdf');
        if (existingFile) {
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, 'My Company');
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, '16, Main street');
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, '75002 Paris');
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, 'France');
        }
      });
      test('should check that the "invoice information"', async () => {
        await client.checkFile(global.downloadsFolderPath, global.invoiceFileName + '.pdf');
        if (existingFile) {
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.invoiceFileName);
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, dateSystem);
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab['reference']);
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, dateSystem);
          for (let i = 0; i <= 2; i++) {
            await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, productData[i].reference);
            await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, productData[i].name);
            await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, productData[i].tax_rule.split('%')[0]);
            await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab["basic_price_" + i]);
            await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab["quantity_product_" + i]);
            await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab["total_product_" + i]);
            await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, productData[i].tax_rule.split('%')[0]);
            await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab["total_product_" + i]);
            await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, (Number(global.tab["total_product_" + i].split('€')[0]) * Number(productData[i].tax_rule.split('%')[0])) / 100);
          }
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab["total_price"]);
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab["shipping_price"]);
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab["total_tax"]);
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab["total_tax_excl"]);
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab["total_amount"]);
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab["payment_method"].split('%')[1]);
          await client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, global.tab['method'].split('\n')[0]);
        }
      });
      test('should delete the invoice file', async () => {
        await client.checkFile(global.downloadsFolderPath, global.invoiceFileName + '.pdf');
        if (existingFile) {
          await client.deleteFile(global.downloadsFolderPath, global.invoiceFileName, ".pdf", 2000);
        }
      });
    }, 'order');
  }, 'order');

  scenario('Change the Customer Group tax parameter', client => {
    test('should go to "Product settings" page', () => client.goToSubtabMenuPage(Menu.Configure.ShopParameters.shop_parameters_menu, Menu.Configure.ShopParameters.customer_settings_submenu));
    test('should click on "Group" tab', () => client.waitForExistAndClick(CustomerSettings.groups.group_button));
    test('should click on customer "Edit" button', () => client.waitForExistAndClick(CustomerSettings.groups.customer_edit_button));
    test('should select "Tax included" option for "Price display method"', () => client.waitAndSelectByValue(CustomerSettings.groups.price_display_method, "0"));
    test('should click on "Save" button', () => client.waitForExistAndClick(CustomerSettings.groups.save_button));
  }, 'order');

  scenario('Change the tax options', client => {
    test('should go to "Taxes" page', () => client.goToSubtabMenuPage(Menu.Improve.International.international_menu, Menu.Improve.International.taxes_submenu));
    test('should indisplay tax in the shopping cart', () => client.waitForExistAndClick(Taxes.taxes.display_tax.replace('%D', 'off')));
    test('should click on "Save" button', () => client.waitForExistAndClick(Taxes.taxes.save_button));
  }, 'order');
}, 'order', true);
