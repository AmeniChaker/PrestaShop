const {AccessPageBO} = require('../../../selectors/BO/access_page');
const {AccessPageFO} = require('../../../selectors/FO/access_page');
const {productPage} = require('../../../selectors/FO/product_page');
const {CheckoutOrderPage, CustomerAccount} = require('../../../selectors/FO/order_page');
const {HomePage} = require('../../../selectors/FO/home_page');
const {OnBoarding} = require('../../../selectors/BO/onboarding');
const {Localization} = require('../../../selectors/BO/international/localization');
const {OrderPage} = require('../../../selectors/BO/order');
const {CreateOrder} = require('../../../selectors/BO/order');
const orderScenarios = require('../../common_scenarios/order');
const common_scenarios = require('../../common_scenarios/product');
const welcomeScenarios = require('../../common_scenarios/welcome');
const common_scenarios_address = require('../../common_scenarios/address');
const common_scenarios_customer = require('../../common_scenarios/customer');
const discount_scenarios = require('../../common_scenarios/discount');
const commonCurrency = require('../../common_scenarios/currency');
const {AddProductPage} = require('../../../selectors/BO/add_product_page');
let dateFormat = require('dateformat');
let promise = Promise.resolve();
let dateSyst = dateFormat(new Date(), 'mm/dd/yyyy');
let productData = [{
  name: 'P_New',
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
}, {
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
}];
let customerData = {
  first_name: 'Test',
  last_name: 'Test',
  email_address: 'test@prestashop.com',
  password: '123456789',
  birthday: {
    day: '18',
    month: '12',
    year: '1991'
  }
};
let addressData = {
  email_address: 'test@prestashop.com',
  id_number: '123456789',
  address_alias: 'Ma super address',
  first_name: 'Test',
  last_name: 'Test',
  company: 'prestashop',
  vat_number: '0123456789',
  address: '12 rue d\'amsterdam',
  second_address: 'RDC',
  ZIP: '75009',
  city: 'Paris',
  country: 'France',
  home_phone: '0123456789',
  other: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
};
let cartRuleData = [
  {
    name: 'Cart_rule',
    customer_email: date_time + customerData.email_address,
    minimum_amount: 0,
    type: 'percent',
    reduction: 50
  }, {
    name: 'Cart_rule_order',
    customer_email: date_time + customerData.email_address,
    minimum_amount: 0,
    type: 'percent',
    reduction: 20,
    highlight: 'on',
    partial_use: 'off',
    free_shipping: 'off'
  }];
firstCurrencyData = {
  name: 'GBP',
  exchangeRate: '0.86'
};

scenario('Create order in the Back Office', () => {
  scenario('Login in the Back Office', client => {
    test('should open the browser', () => client.open());
    test('should login successfully in the Back Office', () => client.signInBO(AccessPageBO));
  }, 'order');
  welcomeScenarios.findAndCloseWelcomeModal();
  scenario('Create Customer With adresses & carts & orders', client => {
    common_scenarios_customer.createCustomer(customerData);
    common_scenarios_address.createCustomerAddress(addressData);
    common_scenarios.createProduct(AddProductPage, productData[0]);
    orderScenarios.createOrderBO(OrderPage, CreateOrder, productData[0], date_time + customerData.email_address);
    scenario('Add product to cart  in the Front Office', client => {
      test('should go to the Front Office', () => {
        return promise
          .then(() => client.waitForExistAndClick(AccessPageBO.shopname))
          .then(() => client.switchWindow(1));
      });
      test('should set the shop language to "English"', () => client.changeLanguage());
      test('should click on "sign in" button', () => client.waitForExistAndClick(AccessPageFO.sign_in_button));
      test('should set the "Email" input', () => client.waitAndSetValue(AccessPageFO.login_input, date_time + customerData.email_address));
      test('should set the "Password" input', () => client.waitAndSetValue(AccessPageFO.password_inputFO, customerData.password));
      test('should click on "SIGN IN" button', () => client.waitForExistAndClick(AccessPageFO.login_button));
      test('should click on shop logo', () => client.waitForExistAndClick(AccessPageFO.logo_home_page));
      test('should search for a product by name', () => {
        return promise
          .then(() => client.waitAndSetValue(HomePage.search_input, productData[0].name + date_time))
          .then(() => client.waitForExistAndClick(HomePage.search_icon))
          .then(() => client.waitForExistAndClick(productPage.productLink.replace('%PRODUCTNAME', productData[0].name + date_time)));
      });
      test('should select product "size M" ', () => client.waitAndSelectByValue(productPage.first_product_size, '2'));
      test('should set the product "quantity"', () => {
        return promise
          .then(() => client.waitAndSetValue(productPage.first_product_quantity, "4"))
          .then(() => client.getTextInVar(CheckoutOrderPage.product_current_price, "first_basic_price"));
      });
      test('should click on "ADD TO CART" button  ', () => client.waitForExistAndClick(CheckoutOrderPage.add_to_cart_button));
      test('should click on "PROCEED TO CHECKOUT" button 1', () => client.waitForVisibleAndClick(CheckoutOrderPage.proceed_to_checkout_modal_button));
      test('should set the quantity to "4" using the keyboard', () => client.waitAndSetValue(CheckoutOrderPage.quantity_input.replace('%NUMBER', 1), '4'));
      test('should click on "PROCEED TO CHECKOUT" button 2', () => client.waitForExistAndClick(CheckoutOrderPage.proceed_to_checkout_button));
      test('should go to the Back Office', () => client.switchWindow(0));
    }, 'customer');
  }, 'order');
  common_scenarios.createProduct(AddProductPage, productData[1]);
  discount_scenarios.createCartRule(cartRuleData[0], 'code_0001');
  scenario('Click on "Stop the OnBoarding" button', client => {
    test('should check and click on "Stop the OnBoarding" button', () => {
      return promise
        .then(() => client.isVisible(OnBoarding.stop_button))
        .then(() => client.stopOnBoarding(OnBoarding.stop_button))
        .then(() => client.pause(1000));
    });
  }, 'onboarding');
  commonCurrency.accessToCurrencies();
  commonCurrency.createCurrency('×\nSuccessful creation.', firstCurrencyData, false, true, true);
  commonCurrency.checkCurrencyByIsoCode(firstCurrencyData);
  scenario('Enable currency', client => {
    test('should click on "Enable icon"', () => client.waitForExistAndClick(Localization.Currencies.check_icon.replace('%ID', 1)
      .replace('%ICON', "icon-remove")));
  }, 'common_client');
  orderScenarios.createOrderWithCustomerBO(OrderPage, CreateOrder, productData[0], productData[1], date_time + customerData.email_address, cartRuleData[1]);
  scenario('Check the created order in the Back Office', client => {
    test('should check status to be equal to "Awaiting check payment"', () => client.checkTextValue(OrderPage.order_status, 'Awaiting check payment'));
    test('should check that the "order message" is equal to "Order message test"', () => client.checkTextValue(OrderPage.message_order, 'Order message test', 'contain', 4000));
    test('should check "customer information" ', () => {
      return promise
        .then(() => client.checkTextValue(OrderPage.customer_name, 'Test Test', "contain", 4000))
        .then(() => client.checkTextValue(OrderPage.customer_email, date_time + customerData.email_address))
        .then(() => client.checkTextValue(OrderPage.customer_created, dateSyst, 'contain'))
        .then(() => client.checkTextValue(OrderPage.valid_order_placed, '0', 'contain'))
        .then(() => client.checkTextValue(OrderPage.total_registration, '0.00', 'contain'));
    });
    test('should check "Shipping Address"', () => client.checkTextValue(OrderPage.shipping_address, 'New New', "contain"));
    test('should click on "Invoice Address" subtab', () => client.waitForVisibleAndClick(OrderPage.tab_invoice, 1000));
    test('should check "shipping" ', () => {
      return promise
        .then(() => client.checkTextValue(OrderPage.date_shipping, dateSyst, 'contain'))
        .then(() => client.checkTextValue(OrderPage.carrier, 'carrier', 'contain'))
        .then(() => client.checkTextValue(OrderPage.weight_shipping, '0.00', 'contain'))
        .then(() => client.checkTextValue(OrderPage.shipping_cost, '€8.40'))
    });
    test('should check "payment" ', () => {
      return promise
        .then(() => client.checkTextValue(OrderPage.payment_method, '', 'contain'))
    });
    test('should check that the "quantity" is  equal to "4"', () => client.checkTextValue(OrderPage.order_quantity.replace("%NUMBER", 1), '4'));
    test('should check "products" ', () => {
      return promise
        .then(() => client.checkTextValue(OrderPage.product_Url, ('Beige', productData.name, productData.reference, 'M'), 'contain'))
        .then(() => client.checkTextValue(OrderPage.order_quantity.replace("%NUMBER", 1), '4'))
        .then(() => client.checkTextValue(OrderPage.stock_product.replace("%NUMBER", 1), '6'))
        .then(() => client.getTextInVar(OrderPage.total_order, "total_orders"));
    });
  }, 'order');
  scenario('Check the created order in the Front Office', client => {
    scenario('Login in the Front Office', client => {
      test('should go to the Front Office', () => {
        return promise
          .then(() => client.waitForExistAndClick(AccessPageBO.shopname))
          .then(() => client.switchWindow(2));
      });
    }, 'common_client');
    scenario('Display a list of orders', client => {
      test('should go to the customer account', () => client.waitForExistAndClick(CheckoutOrderPage.customer_name));
      test('should display a list of orders', () => {
        return promise
          .then(() => client.waitForExistAndClick(CustomerAccount.order_history_button))
          .then(() => client.checkList(CustomerAccount.details_buttons))
      });
      test('should click on the "Details" button', () => client.waitForExistAndClick(CustomerAccount.details_button.replace("%NUMBER", 1)));
    }, 'common_client');
    scenario('Order detail page', client => {
      test('should check that is the order details page', () => client.checkTextValue(CustomerAccount.order_details_words, "Order details"));
      test('should display order infos', () => client.waitForVisible(CustomerAccount.order_infos_block));
      test('should display order statuses', () => client.waitForVisible(CustomerAccount.order_status_block));
      test('should display invoice address', () => client.waitForVisible(CustomerAccount.invoice_address_block));
      test('should display order products', () => client.waitForVisible(CustomerAccount.order_products_block));
      test('should display the return button', () => client.waitForVisible(CustomerAccount.order_products_block));
      test('should display a form to add a message', () => client.waitForVisible(CustomerAccount.add_message_block));
      test('should go to the Back Office', () => client.switchWindow(0));
    }, 'common_client');
  }, 'common_client');
  commonCurrency.accessToCurrencies();
  commonCurrency.checkCurrencyByIsoCode(firstCurrencyData);
  commonCurrency.deleteCurrency(true, '×\nSuccessful deletion.');
}, 'order', true);
