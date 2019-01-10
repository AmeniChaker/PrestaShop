const {productPage} = require('../../selectors/FO/product_page');
const {CheckoutOrderPage} = require('../../selectors/FO/order_page');
const {accountPage} = require('../../selectors/FO/add_account_page');
const {OrderPage} = require('../../selectors/BO/order');
const {Menu} = require('../../selectors/BO/menu.js');
const {ShoppingCart} = require('../../selectors/BO/order');
const {DiscountSubMenu} = require('../../selectors/BO/catalogpage/discount_submenu');
const {Addresses} = require('../../selectors/BO/customers/addresses');

const {CreditSlip} = require('../../selectors/BO/order');
const {ProductList} = require('../../selectors/BO/add_product_page');
const {AddProductPage} = require('../../selectors/BO/add_product_page');
const {MerchandiseReturns} = require('../../selectors/BO/Merchandise_returns');
const {Customer} = require('../../selectors/BO/customers/customer');
const {BO} = require('../../selectors/BO/customers/index');

let dateFormat = require('dateformat');
let data = require('../../datas/customer_and_address_data');
let promise = Promise.resolve();
global.orderInformation = [];

let customerData = {
  first_name: 'new',
  last_name: 'new',
  email_address: 'new' + global.adminEmail,
  password: '123456789',
  birthday: {
    day: '18',
    month: '12',
    year: '1991'
  }
};

module.exports = {
  createOrderFO: function (authentication = "connected", login = 'pub@prestashop.com', password = '123456789') {
    scenario('Create order in the Front Office', client => {
      test('should set the language of shop to "English"', () => client.changeLanguage());
      test('should go to the first product page', () => client.waitForExistAndClick(productPage.first_product, 2000));
      test('should select product "size M" ', () => client.waitAndSelectByValue(productPage.first_product_size, '2'));
      test('should select product "color Black"', () => client.waitForExistAndClick(productPage.first_product_color));
      test('should set the product "quantity"', () => {
        return promise
          .then(() => client.waitAndSetValue(productPage.first_product_quantity, "4"))
          .then(() => client.getTextInVar(CheckoutOrderPage.product_current_price, "first_basic_price"));
      });
      test('should click on "Add to cart" button  ', () => client.waitForExistAndClick(CheckoutOrderPage.add_to_cart_button, 3000));
      test('should click on proceed to checkout button 1', () => client.waitForVisibleAndClick(CheckoutOrderPage.proceed_to_checkout_modal_button));
      /**
       * This scenario is based on the bug described in this ticket
       * https://github.com/PrestaShop/PrestaShop/issues/9841
       **/
      test('should set the quantity to "4" using the keyboard', () => client.waitAndSetValue(CheckoutOrderPage.quantity_input.replace('%NUMBER', 1), '4'));
      test('should click on proceed to checkout button 2', () => client.waitForExistAndClick(CheckoutOrderPage.proceed_to_checkout_button));

      if (authentication === "create_account" || authentication === "guest") {
        scenario('Create new account', client => {
          test('should choose a "Social title"', () => client.waitForExistAndClick(accountPage.gender_radio_button));
          test('should set the "First name" input', () => client.waitAndSetValue(accountPage.firstname_input, data.customer.firstname));
          test('should set the "Last name" input', () => client.waitAndSetValue(accountPage.lastname_input, data.customer.lastname));
          if (authentication === "create_account") {
            test('should set the "Email" input', () => client.waitAndSetValue(accountPage.new_email_input, data.customer.email.replace("%ID", date_time)));
            test('should set the "Password" input', () => client.waitAndSetValue(accountPage.password_account_input, data.customer.password));
          } else {
            test('should set the "Email" input', () => client.waitAndSetValue(accountPage.new_email_input, data.customer.email.replace("%ID", '_guest' + date_time)));
          }
          test('should click on "CONTINUE" button', () => client.waitForExistAndClick(accountPage.new_customer_btn));
        }, 'common_client');

        scenario('Create new address', client => {
          test('should set the "Address" input', () => client.waitAndSetValue(accountPage.adr_address, data.address.address));
          test('should set the "Zip/Postal Code" input', () => client.waitAndSetValue(accountPage.adr_postcode, data.address.postalCode));
          test('should set the "City" input', () => client.waitAndSetValue(accountPage.adr_city, data.address.city));
          test('should click on "CONTINUE" button', () => client.scrollWaitForExistAndClick(accountPage.new_address_btn));
        }, 'common_client');
      }

      if (authentication === "connect") {
        scenario('Login with existing customer', client => {
          test('should click on "Sign in"', () => client.waitForExistAndClick(accountPage.sign_tab));
          test('should set the "Email" input', () => client.waitAndSetValue(accountPage.signin_email_input, login));
          test('should set the "Password" input', () => client.waitAndSetValue(accountPage.signin_password_input, password));
          test('should click on "CONTINUE" button', () => client.waitForExistAndClick(accountPage.continue_button));
        }, 'common_client');
      }

      if (login !== 'pub@prestashop.com') {
        scenario('Add new address', client => {
          test('should set the "company" input', () => client.waitAndSetValue(CheckoutOrderPage.company_input, 'prestashop'));
          test('should set "VAT number" input', () => client.waitAndSetValue(CheckoutOrderPage.vat_number_input, '0123456789'));
          test('should set "Address" input', () => client.waitAndSetValue(CheckoutOrderPage.address_input, '12 rue d\'amsterdam'));
          test('should set "Second address" input', () => client.waitAndSetValue(CheckoutOrderPage.address_second_input, 'RDC'));
          test('should set "Postal code" input', () => client.waitAndSetValue(CheckoutOrderPage.zip_code_input, '75009'));
          test('should set "City" input', () => client.waitAndSetValue(CheckoutOrderPage.city_input, 'Paris'));
          test('should set "Pays" input', () => client.waitAndSelectByVisibleText(CheckoutOrderPage.country_input, 'France'));
          test('should set "Home phone" input', () => client.waitAndSetValue(CheckoutOrderPage.phone_input, '0123456789'));
          test('should click on "Use this address for invoice too', () => client.waitForExistAndClick(CheckoutOrderPage.use_address_for_facturation_input));
          test('should click on "CONTINUE', () => client.waitForExistAndClick(accountPage.new_address_btn));

          scenario('Add Invoice Address', client => {
            test('should set the "company" input', () => client.waitAndSetValue(CheckoutOrderPage.invoice_company_input, 'prestashop'));
            test('should set "VAT number" input', () => client.waitAndSetValue(CheckoutOrderPage.invoice_vat_number_input, '0123456789'));
            test('should set "Address" input', () => client.waitAndSetValue(CheckoutOrderPage.invoice_address_input, '12 rue d\'amsterdam'));
            test('should set "Second address" input', () => client.waitAndSetValue(CheckoutOrderPage.invoice_address_second_input, 'RDC'));
            test('should set "Postal code" input', () => client.waitAndSetValue(CheckoutOrderPage.invoice_zip_code_input, '75009'));
            test('should set "City" input', () => client.waitAndSetValue(CheckoutOrderPage.invoice_city_input, 'Paris'));
            test('should set "Pays" input', () => client.waitAndSelectByVisibleText(CheckoutOrderPage.invoice_country_input, 'France'));
            test('should set "Home phone" input', () => client.waitAndSetValue(CheckoutOrderPage.invoice_phone_input, '0123456789'));
            test('should click on "CONTINUE" button', () => client.waitForExistAndClick(accountPage.new_address_btn));
          }, 'order');

        }, 'common_client');
      }

      if (authentication === "connected" || authentication === "connect") {
        if (login === 'pub@prestashop.com') {
          scenario('Choose the personal and delivery address ', client => {
            test('should click on confirm address button', () => client.waitForExistAndClick(CheckoutOrderPage.checkout_step2_continue_button));
          }, 'common_client');
        }
      }

      scenario('Choose "SHIPPING METHOD"', client => {
        test('should choose shipping method my carrier', () => client.waitForExistAndClick(CheckoutOrderPage.shipping_method_option, 2000));
        test('should create message', () => client.waitAndSetValue(CheckoutOrderPage.message_textarea, 'Order message test', 1000));
        test('should click on "confirm delivery" button', () => client.waitForExistAndClick(CheckoutOrderPage.checkout_step3_continue_button));
      }, 'common_client');

      scenario('Choose "PAYMENT" method', client => {
        test('should set the payment type "Payment by bank wire"', () => client.waitForExistAndClick(CheckoutOrderPage.checkout_step4_payment_radio));
        test('should set "the condition to approve"', () => client.waitForExistAndClick(CheckoutOrderPage.condition_check_box));
        test('should click on order with an obligation to pay button', () => client.waitForExistAndClick(CheckoutOrderPage.confirmation_order_button));
        test('should check the order confirmation', () => {
          return promise
            .then(() => client.checkTextValue(CheckoutOrderPage.confirmation_order_message, 'YOUR ORDER IS CONFIRMED', "contain"))
            .then(() => client.getTextInVar(CheckoutOrderPage.order_product, "product"))
            .then(() => client.getTextInVar(CheckoutOrderPage.order_basic_price, "basic_price"))
            .then(() => client.getTextInVar(CheckoutOrderPage.order_total_price, "total_price"))
            .then(() => client.getTextInVar(CheckoutOrderPage.order_reference, "reference", true))
            .then(() => client.getTextInVar(CheckoutOrderPage.shipping_method, "method", true))
            .then(() => client.getTextInVar(CheckoutOrderPage.order_shipping_prince_value, "shipping_price"))
        });
        /**
         * This scenario is based on the bug described in this ticket
         * http://forge.prestashop.com/browse/BOOM-3886
         */
        test('should check that the basic price is equal to "22,94 €" (BOOM-3886)', () => client.checkTextValue(CheckoutOrderPage.order_basic_price, global.tab["first_basic_price"]));
        /**** END ****/
      }, 'common_client');
    }, 'common_client');
  },

  createOrderWithCustomerBO: function (OrderPage, CreateOrder, productData_0, productData_1, customer = 'john doe', cartRuleData1) {
    scenario('Create order in the Back Office', client => {
      test('should go to "Orders" page', () => client.goToSubtabMenuPage(Menu.Sell.Orders.orders_menu, Menu.Sell.Orders.orders_submenu));
      test('should click on "Add new order" button', () => client.waitForExistAndClick(CreateOrder.new_order_button, 1000));
      test('should click on "Add new customer" button', () => {
        return promise
          .then(() => client.waitForExistAndClick(CreateOrder.new_customer_button, 1000))
          .then(() => client.goToFrame(1));
      });
      test('should choose the "Social title" radio', () => client.waitForExistAndClick(Customer.social_title_button, 1000));
      test('should set the "First name" input', () => client.waitAndSetValue(Customer.first_name_input, customerData.first_name));
      test('should set the "Last name" input', () => client.waitAndSetValue(Customer.last_name_input, customerData.last_name));
      test('should set the "Email" input', () => client.waitAndSetValue(Customer.email_address_input, date_time + customerData.email_address));
      test('should set the "Password" input', () => client.waitAndSetValue(Customer.password_input, customerData.password));
      test('should set the customer "Birthday"', () => {
        return promise
          .then(() => client.waitAndSelectByValue(Customer.days_select, customerData.birthday.day))
          .then(() => client.waitAndSelectByValue(Customer.month_select, customerData.birthday.month))
          .then(() => client.waitAndSelectByValue(Customer.years_select, customerData.birthday.year));
      });
      test('should activate "Partner offers" option ', () => client.waitForExistAndClick(Customer.Partner_offers));
      test('should click on "Save" button', () => client.waitForExistAndClick(Customer.save_button));
      test('should display details of the customer', () => {
        return promise
          .then(() => client.waitForExistAndClick(CreateOrder.detail_customer_button, 1000))
          .then(() => client.pause(1000));
      });
      test('should close details of the customer', () => client.waitForExistAndClick(CreateOrder.close_detail, 1000));
      test('should search for a customer', () => {
        return promise
          .then(() => client.waitAndSetValue(CreateOrder.customer_search_input, customer))
          .then(() => client.pause(1000));
      });
      test('should choose the customer', () => client.waitForExistAndClick(CreateOrder.choose_customer_button));
      test('should display details of the cart', () => {
        return promise
          .then(() => client.waitForExistAndClick(CreateOrder.detail_cart, 1000))
          .then(() => client.goToFrame(1))
          .then(() => client.pause(3000));
      });
      test('should check the "Unit Price"', () => client.checkTextValue(ShoppingCart.product_unit_price.replace('%NUMBER', 1), '€6.00'));
      test('should check the "Quantity "', () => client.checkTextValue(ShoppingCart.quantity_product.replace('%NUMBER', 1), '4', 'equal'));
      test('should check the "Stock" of product', () => client.checkTextValue(ShoppingCart.stock_product.replace('%NUMBER', 1), '6'));
      test('should check the "Total" of product', () => client.checkTextValue(ShoppingCart.total_product.replace('%NUMBER', 1), '€24.00'));
      test('should check the "Total Cart Summary"', () => client.checkTextValue(ShoppingCart.total_cart_summary.replace('%NUMBER', 1), '€24.00'));
      test('should close details of the cart', () => {
        return promise
          .then(() => client.closeFrame())
          .then(() => client.waitForExistAndClick(CreateOrder.close_detaill_cart, 1000));
      });
      test('should click on "Add to cart" button', () => client.waitForExistAndClick(CreateOrder.use_cart, 1000));
      test('should click on "Orders"', () => client.waitForExistAndClick(CreateOrder.orders_tab));
      test('should display details of the orders', () => {
        return promise
          .then(() => client.waitForExistAndClick(CreateOrder.detail_orders, 1000))
          .then(() => client.goToFrame(1))
          .then(() => client.pause(3000));
      });
      test('should check that the customer name is "Test Test"', () => client.checkTextValue(OrderPage.customer_name, 'Test Test', 'contain'));
      test('should status be equal to "Awaiting bank wire payment"', () => client.checkTextValue(OrderPage.order_status, 'Awaiting check payment'));
      test('should check the shipping price', () => client.checkTextValue(OrderPage.shipping_cost, global.tab['price'], 'contain'));
      test('should check the product name', () => client.checkTextValue(OrderPage.product_name.replace("%NUMBER", 1), productData_0['name'], 'contain'));
      test('should check the order message', () => client.checkTextValue(OrderPage.message_order, 'Order message test'));
      test('should check the total price', () => client.checkTextValue(OrderPage.total_order_price, global.tab["total_tax"], 'contain'));
      test('should close details of the order', () => {
        return promise
          .then(() => client.closeFrame())
          .then(() => client.waitForExistAndClick(CreateOrder.close_detail, 1000));
      });
      test('should use the orders', () => client.waitForExistAndClick(CreateOrder.use_orders, 1000));
      test('should click on "remove" icon of the product ', () => client.waitForExistAndClick(CreateOrder.delete_product, 1000));
      test('should search for a product by name', () => client.waitAndSetValue(CreateOrder.product_search_input, productData_1.name + global.date_time));
      test('should set the product combination', () => client.waitAndSelectByValue(CreateOrder.product_combination, global.combinationId));
      test('should set the product "Quantity" input', () => client.waitAndSetValue(CreateOrder.quantity_input.replace('%NUMBER', 1), '4'));
      test('should click on "Add to cart" button', () => client.scrollWaitForExistAndClick(CreateOrder.add_to_cart_button));
      test('should click on "Increase" icon of the product', () => client.waitForExistAndClick(CreateOrder.increaseqty_product));
      test('should click on "Decrease" icon of the product', () => client.waitForExistAndClick(CreateOrder.decreaseqty_product));
      test('should get the basic product price', () => client.getTextInVar(CreateOrder.basic_price_value, 'basic_price'));
      test('should get the  price for product', () => {
        return promise
          .then(() => client.getTextInVar(CreateOrder.price_product, 'price_product'))
          .then(() => client.pause(2000));
      });
      test('should set the currency 2', () => {
        return promise
          .then(() => client.waitAndSelectByValue(CreateOrder.currency, '2'))
          .then(() => client.pause(2000));
      });
      test('should set the currency 1', () => {
        return promise
          .then(() => client.waitAndSelectByValue(CreateOrder.currency, '1'))
          .then(() => client.pause(2000));
      });
      test('should set the language "Français" ', () => client.waitAndSelectByValue(CreateOrder.language, '2'));
      test('should search for a voucher by name', () => {
        return promise
          .then(() => client.waitAndSetValue(CreateOrder.voucher, global.tab["code_0001"]))
          .then(() => client.pause(2000))
          .then(() => client.keys('ArrowDown'))
          .then(() => client.waitForExistAndClick(DiscountSubMenu.cartRules.first_result_option,));
      });
      test('should click on "Delete"  of the voucher', () => client.waitForExistAndClick(CreateOrder.delete_voucher));
      test('should click on "Add new voucher" button', () => {
        return promise
          .then(() => client.waitForExistAndClick(CreateOrder.new_voucher_button, 1000))
          .then(() => client.goToFrame(1))
          .then(() => client.pause(3000));
      });
      test('should set the "Name" input', () => client.waitAndSetValue(DiscountSubMenu.cartRules.name_input, cartRuleData1.name));
      test('should click on "Generate" button', () => {
        return promise
          .then(() => client.waitForExistAndClick(DiscountSubMenu.cartRules.generate_button))
          .then(() => client.getAttributeInVar(DiscountSubMenu.cartRules.code_input, 'value', 'code_0002'));
      });
      test('should switch the "Highlight" to "Yes"', () => client.waitForExistAndClick(DiscountSubMenu.cartRules.highlight_button.replace('%S', cartRuleData1.highlight)));
      test('should switch the "Partial use" to "No"', () => client.waitForExistAndClick(DiscountSubMenu.cartRules.partial_use_button.replace('%S', cartRuleData1.partial_use)));
      test('should click on "CONDITIONS" tab', () => client.waitForExistAndClick(DiscountSubMenu.cartRules.conditions_tab));
      test('should set the "Minimum amount" input', () => client.waitAndSetValue(DiscountSubMenu.cartRules.minimum_amount_input, cartRuleData1.minimum_amount));
      test('should click on "ACTIONS" tab', () => client.waitForExistAndClick(DiscountSubMenu.cartRules.actions_tab));
      test('should switch the "Free shipping" to "No"', () => client.waitForExistAndClick(DiscountSubMenu.cartRules.free_shipping_button.replace('%S', cartRuleData1.free_shipping)));
      test('should click on "' + cartRuleData1.type + '" radio', () => client.waitForExistAndClick(DiscountSubMenu.cartRules.apply_discount_radio.replace("%T", cartRuleData1.type), 2000));
      test('should set the "reduction" ' + cartRuleData1.type + ' value', () => client.waitAndSetValue(DiscountSubMenu.cartRules.reduction_input.replace("%T", cartRuleData1.type), cartRuleData1.reduction, 2000));
      test('should click on "Save" button', () => client.waitForExistAndClick(DiscountSubMenu.cartRules.save_button));
      test('should click on "Edit" of delivery adreses', () => {
        return promise
          .then(() => client.waitForExistAndClick(CreateOrder.edit_delivery_adress, 2000))
          .then(() => client.goToFrame(1))
          .then(() => client.pause(1000));
      });
      test('should set the "First Name" ', () => client.waitAndSetValue(Addresses.first_name_input, 'Testttttt', 2000));
      test('should set the "Last Name" ', () => client.waitAndSetValue(Addresses.last_name_input, 'Testttttt', 2000));
      test('should set the "Company" ', () => client.waitAndSetValue(Addresses.company, 'Prestaaa', 2000));
      test('should click on "Save" button', () => client.waitForExistAndClick(Addresses.save_button));
      test('should check the "Name " for Delivery addresses', () => client.checkTextValue(CreateOrder.detail_adresses, 'Testttttt Testttttt', 'contain', 2000));
      test('should click on "Add a new address" button', () => {
        return promise
          .then(() => client.waitForExistAndClick(CreateOrder.new_address_button, 1000))
          .then(() => client.goToFrame(1))
          .then(() => client.pause(3000));
      });
      test('should set "Address alias" input', () => client.waitAndSetValue(Addresses.address_alias_input, 'Address xxx ' + global.date_time));
      test('should set the "First Name" ', () => client.waitAndSetValue(Addresses.first_name_input, 'New', 2000));
      test('should set the "Last Name" ', () => client.waitAndSetValue(Addresses.last_name_input, 'New', 2000));
      test('should set "Address" input', () => client.waitAndSetValue(Addresses.address_input, "12 rue test " + date_time));
      test('should set "Postal code" input', () => client.waitAndSetValue(Addresses.zip_code_input, '75009'));
      test('should set "City" input', () => client.waitAndSetValue(Addresses.city_input, 'Paris'));
      test('should set "Pays" input', () => client.waitAndSelectByVisibleText(Addresses.country_input, 'France'));
      test('should click on "Save" button', () => client.scrollWaitForExistAndClick(Addresses.save_button, 50));
      test('should set the delivery address ', () => client.waitAndSelectByVisibleText(CreateOrder.delivery_address, 'Address xxx ' + global.date_time));
      test('should set the invoice address ', () => client.waitAndSelectByVisibleText(CreateOrder.invoice_address, 'Address xxx ' + global.date_time));
      test('should set the delivery option', () => {
        return promise
          .then(() => client.waitAndSelectByValue(CreateOrder.delivery_option, '2,'))
          .then(() => client.pause(1000));
      });
      test('should check the shipping price', () => client.checkTextValue(CreateOrder.shipping_price, '0', 'notequal'));
      test('should check "Total shipping"', () => client.checkTextValue(CreateOrder.total_shipping, '0', 'notequal'));
      test('should switch the "Free shipping" to "Yes"', () => {
        return promise
          .then(() => client.waitForExistAndClick(CreateOrder.free_shipping_button.replace('%S', '')))
          .then(() => client.pause(1000));
      });
      test('should check the shipping is free', () => client.checkTextValue(CreateOrder.total_shipping, '0', 'equal'));
      test('should switch the "Free shipping" to "No"', () => {
        return promise
          .then(() => client.waitForExistAndClick(CreateOrder.free_shipping_button.replace('%S', '_off')))
          .then(() => client.pause(2000));
      });
      test('should check the shipping have a price ', () => client.checkTextValue(CreateOrder.total_shipping, '0', 'notequal'));
      test('should add an order message ', () => client.addOrderMessage('Order message test'));
      test('should check "Total products" ', () => client.checkTextValue(CreateOrder.total_products, global.tab["price_product"]));
      test('should check "Total vouchers (Tax excl.)" ', () => client.checkTextValue(CreateOrder.total_vouchers, '0', 'notequal'));
      test('should check "Total shipping (Tax excl.)" ', () => client.checkTextValue(CreateOrder.total_shipping, '0', 'notequal'));
      test('should check "Total taxes" ', () => client.checkTextValue(CreateOrder.total_taxes, '0', 'notequal'));
      test('should check "Total (Tax excl.)" ', () => client.checkTextValue(CreateOrder.total_tax_excl, '0', 'notequal'));
      test('should check "Total (Tax incl.)" ', () => client.checkTextValue(CreateOrder.total_tax_incl, '0', 'notequal'));
      test('should set the payment type ', () => client.waitAndSelectByValue(CreateOrder.payment, 'ps_checkpayment'));
      test('should set the order status ', () => client.waitAndSelectByValue(OrderPage.order_state_select, '1'));
      test('should click on "Create the order" button', () => client.waitForExistAndClick(CreateOrder.create_order_button));
    }, 'order');
  },
  createOrderBO: function (OrderPage, CreateOrder, productData, customer = 'john doe') {
    scenario('Create order in the Back Office', client => {
      test('should go to "Orders" page', () => client.goToSubtabMenuPage(Menu.Sell.Orders.orders_menu, Menu.Sell.Orders.orders_submenu));
      test('should click on "Add new order" button', () => client.waitForExistAndClick(CreateOrder.new_order_button, 1000));
      test('should search for a customer', () => client.waitAndSetValue(CreateOrder.customer_search_input, customer));
      test('should choose the customer', () => client.waitForExistAndClick(CreateOrder.choose_customer_button));
      test('should search for a product by name', () => client.waitAndSetValue(CreateOrder.product_search_input, productData.name + global.date_time));
      test('should set the product combination', () => client.waitAndSelectByValue(CreateOrder.product_combination, global.combinationId));
      test('should set the product quantity', () => client.waitAndSetValue(CreateOrder.quantity_input.replace('%NUMBER', 1), '4'));
      test('should click on "Add to cart" button', () => client.scrollWaitForExistAndClick(CreateOrder.add_to_cart_button));
      test('should get the basic product price', () => client.getTextInVar(CreateOrder.basic_price_value, global.basic_price));
      test('should set the delivery option ', () => {
        return promise
          .then(() => client.waitAndSelectByValue(CreateOrder.delivery_option, '2,'))
          .then(() => client.pause(1000));
      });
      test('should get the  shipping price', () => client.getTextInVar(CreateOrder.shipping_price, 'price'));
      test('should get the total with taxes', () => client.getTextInVar(CreateOrder.total_with_tax, 'total_tax'));
      test('should add an order message ', () => client.addOrderMessage('Order message test'));
      test('should set the payment type ', () => client.waitAndSelectByValue(CreateOrder.payment, 'ps_checkpayment'));
      test('should set the order status ', () => client.waitAndSelectByValue(OrderPage.order_state_select, '1'));
      test('should click on "Create the order"', () => client.waitForExistAndClick(CreateOrder.create_order_button));
    }, 'order');
  },
  checkOrderInBO: function (clientType = "client") {
    scenario('Check the created order information in the Back Office', client => {
      test('should go to "Orders" page', () => client.goToSubtabMenuPage(Menu.Sell.Orders.orders_menu, Menu.Sell.Orders.orders_submenu));
      test('should search for the created order by reference', () => client.waitAndSetValue(OrderPage.search_by_reference_input, global.tab['reference']));
      test('should go to search order', () => client.waitForExistAndClick(OrderPage.search_order_button));
      test('should go to the order', () => client.scrollWaitForExistAndClick(OrderPage.view_order_button.replace('%NUMBER', 1), 150, 2000));
      test('should check that the customer name is "John DOE"', () => client.checkTextValue(OrderPage.customer_name, 'John DOE', 'contain'));
      if (clientType === "guest") {
        test('should check that the order has been placed by a guest', () => client.isExisting(OrderPage.transform_guest_customer_button));
      }
      test('should status be equal to "Awaiting bank wire payment"', () => client.checkTextValue(OrderPage.order_status, 'Awaiting bank wire payment'));
      test('should check the shipping price', () => client.checkTextValue(OrderPage.shipping_cost, global.tab['shipping_price']));
      test('should check the product name', () => client.checkTextValue(OrderPage.product_name.replace("%NUMBER", 1), global.tab['product']));
      test('should check the order message', () => client.checkTextValue(OrderPage.message_order, 'Order message test'));
      test('should check the total price', () => client.checkTextValue(OrderPage.total_price, global.tab["total_price"]));
      test('should check basic product price', () => {
        return promise
          .then(() => client.scrollWaitForExistAndClick(OrderPage.edit_product_button))
          .then(() => client.checkAttributeValue(OrderPage.product_basic_price.replace("%NUMBER", 1), 'value', global.tab["basic_price"].replace('€', '')))
      });
      test('should check shipping method', () => client.checkTextValue(OrderPage.shipping_method, global.tab["method"].split('\n')[0], 'contain'));
    }, "order");
  },

  getShoppingCartsInfo: async function (client) {
    let idColumn;
    await client.isVisible(ShoppingCart.checkbox_input);
    if (isVisible) {
      idColumn = 2;
    } else {
      idColumn = 1;
    }
    for (let i = 1; i <= global.shoppingCartsNumber; i++) {
      await client.getTextInVar(ShoppingCart.id.replace('%NUMBER', i).replace('%COL', idColumn), "id");
      await client.getTextInVar(ShoppingCart.order_id.replace('%NUMBER', i).replace('%COL', idColumn + 1), "order_id");
      await client.getTextInVar(ShoppingCart.customer.replace('%NUMBER', i).replace('%COL', idColumn + 2), "customer");
      await client.getTextInVar(ShoppingCart.total.replace('%NUMBER', i).replace('%COL', idColumn + 3), "total");
      await client.getTextInVar(ShoppingCart.carrier.replace('%NUMBER', i).replace('%COL', idColumn + 4), "carrier");
      await client.getTextInVar(ShoppingCart.date.replace('%NUMBER', i).replace('%COL', idColumn + 5), "date");
      await client.getTextInVar(ShoppingCart.customer_online.replace('%NUMBER', i).replace('%COL', idColumn + 6), "customer_online");
      await parseInt(global.tab["order_id"]) ? global.tab["order_id"] = parseInt(global.tab["order_id"]) : global.tab["order_id"] = '"' + global.tab["order_id"] + '"';
      await global.tab["carrier"] === '--' ? global.tab["carrier"] = '' : global.tab["carrier"] = '"' + global.tab["carrier"] + '"';
      await global.tab["customer_online"] === 'Yes' ? global.tab["customer_online"] = 1 : global.tab["customer_online"] = 0;
      global.tab["date"] = await dateFormat(global.tab["date"], "yyyy-mm-dd HH:MM:ss");
      await global.orders.push(parseInt(global.tab["id"]) + ';' + global.tab["order_id"] + ';' + '"' + global.tab["customer"] + '"' + ';' + global.tab["total"] + ';' + global.tab["carrier"] + ';' + '"' + global.tab["date"] + '"' + ';' + global.tab["customer_online"]);
    }
  },
  checkExportedFile: async function (client) {
    await client.downloadCart(ShoppingCart.export_carts_button);
    await client.checkFile(global.downloadsFolderPath, global.exportCartFileName);
    await client.readFile(global.downloadsFolderPath, global.exportCartFileName, 1000);
    await client.checkExportedFileInfo(1000);
    await client.waitForExistAndClick(ShoppingCart.reset_button);
  },
  initCheckout: function (client) {
    test('should add some product to cart"', () => {
      return promise
        .then(() => client.waitForExistAndClick(productPage.cloths_category))
        .then(() => client.waitForExistAndClick(productPage.second_product_clothes_category))
        .then(() => client.waitForExistAndClick(CheckoutOrderPage.add_to_cart_button))
        .then(() => client.waitForVisible(CheckoutOrderPage.blockcart_modal))
        .then(() => client.waitForVisibleAndClick(CheckoutOrderPage.proceed_to_checkout_modal_button))
        .then(() => client.waitForExistAndClick(CheckoutOrderPage.proceed_to_checkout_button));
    });
  },
  creditSlip: function (refundedValue, i) {
    scenario('Generate a credit slip', client => {
      test('should go to the orders list', () => client.goToSubtabMenuPage(Menu.Sell.Orders.orders_menu, Menu.Sell.Orders.orders_submenu));
      test('should go to the created order', () => client.waitForExistAndClick(OrderPage.order_view_button.replace('%ORDERNumber', 1)));
      test('should change order state to "Payment accepted"', () => client.changeOrderState(OrderPage, 'Payment accepted'));
      test('should click on "Partial refund" button', () => client.waitForExistAndClick(OrderPage.partial_refund));
      test('should set the "quantity refund" to "2"', () => client.waitAndSetValue(OrderPage.quantity_refund, refundedValue));
      test('should click on "Re-stock products" CheckBox', () => client.waitForExistAndClick(OrderPage.re_stock_product));
      test('should click on "Partial refund" button', () => client.waitForExistAndClick(OrderPage.refund_products_button));
      test('should check the success message', () => client.checkTextValue(OrderPage.success_msg, 'partial refund was successfully created.', 'contain'));
      test('should get all order information', () => {
        return promise
          .then(() => client.getTextInVar(OrderPage.order_id, "orderID"))
          .then(() => client.getTextInVar(OrderPage.order_date, "invoiceDate"))
          .then(() => client.getTextInVar(OrderPage.order_ref, "orderRef"))
          .then(() => {
            client.getTextInVar(OrderPage.product_information, "productRef").then(() => {
              global.tab['productRef'] = global.tab['productRef'].split('\n')[1];
              global.tab['productRef'] = global.tab['productRef'].substring(18);
            })
          })
          .then(() => client.pause(2000))
          .then(() => {
            client.getTextInVar(OrderPage.product_information, "productCombination").then(() => {
              global.tab['productCombination'] = global.tab['productCombination'].split('\n')[0];
              global.tab['productCombination'] = global.tab['productCombination'].split(':')[1];
            })
          })
          .then(() => client.pause(2000))
          .then(() => client.getTextInVar(OrderPage.product_quantity, "productQuantity"))
          .then(() => {
            client.getTextInVar(OrderPage.product_name_tab, "productName").then(() => {
              global.tab['productName'] = global.tab['productName'].substring(0, 25);
            })
          })
          .then(() => client.getTextInVar(OrderPage.product_unit_price_tax_included, "unitPrice"))
          .then(() => global.tab['unitPrice'] = global.tab['unitPrice'].substr(1, global.tab['unitPrice'].length))
          .then(() => client.getTextInVar(OrderPage.product_total, "productTotal"))
          .then(() => client.waitForExistAndClick(OrderPage.edit_product_button))
          .then(() => client.getAttributeInVar(OrderPage.product_unit_price, "value", "taxExcl"))
          .then(() => client.pause(2000))
          .then(() => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.products_submenu))
          .then(() => client.searchByValue(AddProductPage.catalogue_filter_by_name_input, AddProductPage.catalogue_submit_filter_button, global.tab['productName']))
          .then(() => client.waitForExistAndClick(ProductList.edit_button))
          .then(() => client.getAttributeInVar(AddProductPage.tax_rule, "title", 'taxRate'))
          .then(() => global.tab['taxRate'] = global.tab['taxRate'].substr(18, 2))
          .then(() => {
            global.orderInformation[i] = {
              "orderID": global.tab['orderID'].replace("#", ''),
              "invoiceDate": global.tab['invoiceDate'],
              "productRef": global.tab['productRef'],
              "productCombination": global.tab['productCombination'],
              "productQuantity": global.tab['productQuantity'],
              "productName": global.tab['productName'],
              "unitPrice": global.tab['unitPrice'],
              "orderRef": global.tab['orderRef'],
              "productTotal": global.tab['productTotal'],
              "taxExcl": global.tab['taxExcl'],
              "taxRate": global.tab['taxRate']
            }
          });
      });
      test('should go to the orders list', () => client.goToSubtabMenuPage(Menu.Sell.Orders.orders_menu, Menu.Sell.Orders.orders_submenu));
      test('should go to the created order', () => client.waitForExistAndClick(OrderPage.order_view_button.replace('%ORDERNumber', 1)));
      test('should click on "DOCUMENTS" subtab', () => client.scrollWaitForExistAndClick(OrderPage.document_submenu));
      test('should get the credit slip name', () => client.getCreditSlipDocumentName(OrderPage.credit_slip_document_name));
      test('should go to "Credit slip" page', () => client.goToSubtabMenuPage(Menu.Sell.Orders.orders_menu, Menu.Sell.Orders.credit_slips_submenu));
      test('should click on "Download credit slip" button', () => {
        return promise
          .then(() => client.waitForVisibleAndClick(CreditSlip.download_btn.replace('%ID', global.tab['orderID'].replace("#", ''))))
          .then(() => client.pause(8000));
      });
    }, 'order');
  },
  checkCreditSlip: function (refundedValue, i) {
    scenario('Check the credit slip information', client => {
      test('should check the "Billing Address" ', () => {
        return promise
          .then(() => client.checkDocument(global.downloadsFolderPath, global.creditSlip, 'My Company'))
          .then(() => client.checkDocument(global.downloadsFolderPath, global.creditSlip, '16, Main street'))
          .then(() => client.checkDocument(global.downloadsFolderPath, global.creditSlip, '75002 Paris'))
          .then(() => client.checkDocument(global.downloadsFolderPath, global.creditSlip, 'France'));
      });
      test('should check the "Name & Last name" ', () => client.checkDocument(global.downloadsFolderPath, global.creditSlip, global.tab['accountName']));
      test('should check the "Invoice date Reference"', () => client.checkDocument(global.downloadsFolderPath, global.creditSlip, global.orderInformation[i].invoiceDate));
      test('should check the "Invoice order Reference"', () => client.checkDocument(global.downloadsFolderPath, global.creditSlip, global.orderInformation[i].orderRef));
      test('should check the "Product combination" ', () => client.checkDocument(global.downloadsFolderPath, global.creditSlip, global.orderInformation[i].productCombination));
      test('should check the "Product quantity" ', () => client.checkDocument(global.downloadsFolderPath, global.creditSlip, global.orderInformation[i].productQuantity));
      test('should check the "Product name" ', () => client.checkDocument(global.downloadsFolderPath, global.creditSlip, global.orderInformation[i].productName));
      test('should check the "Unit Price" ', () => client.checkDocument(global.downloadsFolderPath, global.creditSlip, global.orderInformation[i].unitPrice));
      test('should check the "Price" ', () => client.checkDocument(global.downloadsFolderPath, global.creditSlip, parseInt(global.orderInformation[i].unitPrice * refundedValue)));
      test('should check the "Product total" ', () => client.checkDocument(global.downloadsFolderPath, global.creditSlip, global.orderInformation[i].productTotal));
      test('should check the "Total Tax" ', () => client.checkDocument(global.downloadsFolderPath, global.creditSlip, Math.round(global.orderInformation[i].taxExcl * refundedValue * global.orderInformation[i].taxRate) / 100));
      test('should check the "Tax Rate" ', () => client.checkDocument(global.downloadsFolderPath, global.creditSlip, parseInt((global.orderInformation[i].taxRate)).toFixed(3)));
      test('should check the "Tax detail" ', () => {
        return promise
          .then(() => client.checkDocument(global.downloadsFolderPath, global.creditSlip, 'Products'))
      });
    }, 'order');
  },
  enableMerchandise: function () {
    scenario('Enable Merchandise Returns', client => {
      test('should go to "Merchandise Returns" page', () => client.goToSubtabMenuPage(Menu.Sell.CustomerService.customer_service_menu, Menu.Sell.CustomerService.merchandise_returns_submenu));
      test('should enable "Merchandise Returns"', () => client.waitForExistAndClick(MerchandiseReturns.enableReturns));
      test('should click on "Save" button', () => client.waitForExistAndClick(MerchandiseReturns.save_button));
      test('should check the success message', () => client.checkTextValue(MerchandiseReturns.success_msg, 'The settings have been successfully updated.', 'contain'));
    }, 'order');
  },
  checkOrderInvoice: function (client, i) {
    test('should check the Customer name of the ' + i + ' product', () => client.checkDocument(global.downloadsFolderPath, 'invoices', 'John DOE'));
    test('should check the "Delivery Address " of the product n°' + i, () => {
      return promise
        .then(() => client.checkDocument(global.downloadsFolderPath, 'invoices', 'My Company'))
        .then(() => client.checkDocument(global.downloadsFolderPath, 'invoices', '16, Main street'))
        .then(() => client.checkDocument(global.downloadsFolderPath, 'invoices', '75002 Paris'))
        .then(() => client.checkDocument(global.downloadsFolderPath, 'invoices', 'France'));
    });
    test('should check the "invoice Date" of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].invoiceDate));
    test('should check the "Order Reference" of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].OrderRef));
    test('should check the "Product Reference"of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].ProductRef));
    test('should check the "Product Combination" of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].ProductCombination));
    test('should check the "Product Quantity" of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].ProductQuantity));
    test('should check the "Total Price" of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].TotalPrice));
    test('should check the "Unit Price" of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].ProductUnitPrice));
    test('should check the "Tax Rate" of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].ProductTaxRate));
    test('should check the "Total Product" of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].TotalProduct));
    test('should check the "Shipping Cost" of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].ShippingCost));
    test('should check the "Total" of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].Total));
    test('should check the "Total Tax" of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].TotalTax));
    test('should check the "Carrier" name of the product n°' + i, () => client.checkDocument(global.downloadsFolderPath, 'invoices', global.orderInfo[i - 1].Carrier));
  },
  updateStatus: function (status) {
    scenario('Change the order state to "' + status + '"', client => {
      test('should go to "Orders" page', () => client.goToSubtabMenuPage(Menu.Sell.Orders.orders_menu, Menu.Sell.Orders.orders_submenu));
      test('should go to the created order', () => client.waitForExistAndClick(OrderPage.order_view_button.replace('%ORDERNumber', 1)));
      test('should change order state to "' + status + '"', () => client.updateStatus(status));
      test('should click on "Update state" button', () => client.waitForExistAndClick(OrderPage.update_status_button));
      test('should check that the status was updated', () => client.waitForVisible(OrderPage.status.replace('%STATUS', status)));
    }, 'order');
  },
  getDeliveryInformation: function (index) {
    scenario('Get all the order information', client => {
      test('should get all order information', () => {
        return promise
          .then(() => client.getTextInVar(OrderPage.order_id, "OrderID"))
          .then(() => client.getTextInVar(OrderPage.order_date, "invoiceDate"))
          .then(() => client.getTextInVar(OrderPage.order_ref, "OrderRef"))
          .then(() => {
            client.getTextInVar(OrderPage.product_information, "ProductRef").then(() => {
              global.tab['ProductRef'] = global.tab['ProductRef'].split('\n')[1];
              global.tab['ProductRef'] = global.tab['ProductRef'].substring(18);
            })
          })
          .then(() => client.pause(2000))
          .then(() => {
            client.getTextInVar(OrderPage.product_information, "ProductCombination").then(() => {
              global.tab['ProductCombination'] = global.tab['ProductCombination'].split('\n')[0];
              global.tab['ProductCombination'] = global.tab['ProductCombination'].split(':')[1];
            })
          })
          .then(() => client.pause(2000))
          .then(() => client.getTextInVar(OrderPage.product_quantity, "ProductQuantity"))
          .then(() => {
            client.getTextInVar(OrderPage.product_name_tab, "ProductName").then(() => {
              global.tab['ProductName'] = global.tab['ProductName'].substring(0, 25);
            })
          })
          .then(() => client.getTextInVar(OrderPage.product_total_price, "ProductTotal"))
          .then(() => {
            global.orderInformation[index] = {
              "OrderId": global.tab['OrderID'].replace("#", ''),
              "invoiceDate": global.tab['invoiceDate'],
              "OrderRef": global.tab['OrderRef'],
              "ProductRef": global.tab['ProductRef'],
              "ProductCombination": global.tab['ProductCombination'],
              "ProductQuantity": global.tab['ProductQuantity'],
              "ProductName": global.tab['ProductName'],
              "ProductTotal": global.tab['ProductTotal']
            }
          });
      });
    }, 'order');
  },
  disableMerchandise: function () {
    scenario('Disable Merchandise Returns', client => {
      test('should go to "Merchandise Returns" page', () => client.goToSubtabMenuPage(Menu.Sell.CustomerService.customer_service_menu, Menu.Sell.CustomerService.merchandise_returns_submenu));
      test('should disable "Merchandise Returns"', () => client.waitForExistAndClick(MerchandiseReturns.disableReturns));
      test('should click on "Save" button', () => client.waitForExistAndClick(MerchandiseReturns.save_button));
      test('should check the success message', () => client.checkTextValue(MerchandiseReturns.success_msg, 'The settings have been successfully updated.', 'contain'));
    }, 'order');
  },
};
