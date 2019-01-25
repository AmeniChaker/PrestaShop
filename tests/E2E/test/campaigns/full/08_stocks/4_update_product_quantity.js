const {AccessPageBO} = require('../../../selectors/BO/access_page');
const {Stock} = require('../../../selectors/BO/catalogpage/stocksubmenu/stock');
const {Movement} = require('../../../selectors/BO/catalogpage/stocksubmenu/movements');
const {AddProductPage} = require('../../../selectors/BO/add_product_page');
const stock_common_scenarios = require('../../common_scenarios/stock');
const commonProduct = require('../../common_scenarios/product');
const {Menu} = require('../../../selectors/BO/menu.js');
let promise = Promise.resolve();
let dateFormat = require('dateformat');
let dateSystem = dateFormat(new Date(), 'yyyy-mm-dd');
let productData = [{
  name: 'FirstProduct',
  reference: 'firstProduct',
  quantity: "5",
  price: '5',
  image_name: 'image_test.jpg'
}, {
  name: 'SecondProduct',
  reference: 'secondProduct',
  quantity: "5",
  price: '5',
  image_name: 'image_test.jpg'
}, {
  name: 'ThirdProduct',
  reference: 'thirdProduct',
  quantity: "5",
  price: '5',
  image_name: 'image_test.jpg'
}];
scenario('Update quantity of a product', () => {
  scenario('Login in the Back Office', client => {
    test('should open the browser', () => client.open());
    test('should login successfully in the Back Office', () => client.signInBO(AccessPageBO));
  }, 'stocks');

  for (let i = 0; i < 3; i++) {
    commonProduct.createProduct(AddProductPage, productData[i]);
  }

  scenario('Increase the quantity for one product using the arrow down button and save by the "Check" sign', client => {
    test('should go to "Stocks" page', () => {
      return promise
        .then(() => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.stocks_submenu))
        .then(() => client.isVisible(Stock.sort_product_icon, 2000))
        .then(() => {
          if (global.isVisible) {
            client.waitForVisibleAndClick(Stock.sort_product_icon);
          }
        })
        .then(() => client.pause(1000))
    });
    stock_common_scenarios.changeStockProductQuantity(client, Stock, 1, 5, 'checkBtn');
    test('should check the "Physical" and "Availble" column changed', () => {
      return promise
        .then(() => client.checkTextValue(Stock.physical_column.replace('%ID', 1), global.tab["productQuantity"], 'notequal'))
        .then(() => client.checkTextValue(Stock.available_column.replace('%ID', 1), global.tab["productQuantity"], 'notequal'));
    });
    stock_common_scenarios.checkMovementHistory(client, Menu, Movement, 1, "5", "+", "Employee Edition", productData[2].reference, dateSystem, productData[2].name + date_time);

  }, 'stocks');

  scenario('Decrease the quantity for one product using the arrow down and save by the "Apply new quantity" button', client => {
    test('should go to "Stocks" page', () => {
      return promise
        .then(() => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.stocks_submenu))
        .then(() => client.isVisible(Stock.sort_product_icon, 2000))
        .then(() => {
          if (global.isVisible) {
            client.waitForVisibleAndClick(Stock.sort_product_icon);
          }
        })
        .then(() => client.pause(5000))
    });
    stock_common_scenarios.changeStockProductQuantity(client, Stock, 1, 5, 'checkBtn', "");
    test('should click on "Apply new quantity" button', () => client.waitForExistAndClick(Stock.group_apply_button));
    test('should check the "Physical" and "Availble" column changed', () => {
      return promise
        .then(() => client.checkTextValue(Stock.physical_column.replace('%ID', 1), global.tab["productQuantity"], 'notequal'))
        .then(() => client.checkTextValue(Stock.available_column.replace('%ID', 1), global.tab["productQuantity"], 'notequal'));
    });
    test('should check the success panel', () => {
      return promise
        .then(() => client.waitForVisible(Stock.success_hidden_panel))
        .then(() => client.checkTextValue(Stock.success_hidden_panel, 'Stock successfully updated', 'contain'));
    });
    stock_common_scenarios.checkMovementHistory(client, Menu, Movement, 1, "5", "-", "Employee Edition", productData[2].reference, dateSystem, productData[2].name + date_time, true);
  }, 'stocks');

  scenario('Change the quantity for one product entering the value in the field and save by the "Check" sign', client => {
    test('should go to "Stocks" page', () => {
      return promise
        .then(() => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.stocks_submenu))
        .then(() => client.isVisible(Stock.sort_product_icon, 2000))
        .then(() => {
          if (global.isVisible) {
            client.waitForVisibleAndClick(Stock.sort_product_icon);
          }
        })
        .then(() => client.pause(1000))
    });
    test('should set the "Quantity" of the first product to 15', () => client.modifyProductQuantity(Stock, 1, 15));
    test('should click on "Check" button', () => client.waitForExistAndClick(Stock.save_product_quantity_button));
    test('should check the success panel', () => {
      return promise
        .then(() => client.waitForVisible(Stock.success_hidden_panel))
        .then(() => client.checkTextValue(Stock.success_hidden_panel, 'Stock successfully updated', 'contain'));
    });
    test('should check the "Physical" and "Availble" column changed', () => {
      return promise
        .then(() => client.checkTextValue(Stock.physical_column.replace('%ID', 1), global.tab["productQuantity"], 'notequal'))
        .then(() => client.checkTextValue(Stock.available_column.replace('%ID', 1), global.tab["productQuantity"], 'notequal'));
    });
    stock_common_scenarios.checkMovementHistory(client, Menu, Movement, 1, "15", "+", "Employee Edition", productData[2].reference, dateSystem, productData[2].name + date_time, true);
  }, 'stocks');

  scenario('Enter a negative quantity with keyboard for one product in the field and save by the "Check" sign', client => {
    test('should go to "Stocks" page', () => {
      return promise
        .then(() => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.stocks_submenu))
        .then(() => client.isVisible(Stock.sort_product_icon, 2000))
        .then(() => {
          if (global.isVisible) {
            client.waitForVisibleAndClick(Stock.sort_product_icon);
          }
        })
        .then(() => client.pause(1000))
    });
    stock_common_scenarios.changeStockQuantityWithKeyboard(client, Stock, 1, 5, 'checkBtn', "down");
    test('should check the "Physical" and "Availble" column changed', () => {
      return promise
        .then(() => client.checkTextValue(Stock.physical_column.replace('%ID', 1), global.tab["productQuantity"], 'notequal'))
        .then(() => client.checkTextValue(Stock.available_column.replace('%ID', 1), global.tab["productQuantity"], 'notequal'));
    });
    stock_common_scenarios.checkMovementHistory(client, Menu, Movement, 1, "5", "-", "Employee Edition", productData[2].reference, dateSystem, productData[2].name + date_time, true);
  }, 'stocks');

  scenario('Enter a negative quantity with the arrow down for one product ', client => {
    test('should go to "Stocks" page', () => {
      return promise
        .then(() => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.stocks_submenu))
        .then(() => client.isVisible(Stock.sort_product_icon, 2000))
        .then(() => {
          if (global.isVisible) {
            client.waitForVisibleAndClick(Stock.sort_product_icon);
          }
        })
        .then(() => client.pause(1000))
    });
    stock_common_scenarios.changeStockProductQuantity(client, Stock, 1, 5, 'checkBtn', "remove");
    test('should check the "Physical" and "Availble" column changed', () => {
      return promise
        .then(() => client.checkTextValue(Stock.physical_column.replace('%ID', 1), global.tab["productQuantity"], 'notequal'))
        .then(() => client.checkTextValue(Stock.available_column.replace('%ID', 1), global.tab["productQuantity"], 'notequal'));
    });
    stock_common_scenarios.checkMovementHistory(client, Menu, Movement, 1, "5", "-", "Employee Edition", productData[2].reference, dateSystem, productData[2].name + date_time, true);
  }, 'stocks');

  scenario('Enter a decimal quantity with "." for one product in the field and save by the "Check" sign', client => {
    test('should go to "Stocks" page', () => {
      return promise
        .then(() => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.stocks_submenu))
        .then(() => client.isVisible(Stock.sort_product_icon, 2000))
        .then(() => {
          if (global.isVisible) {
            client.waitForVisibleAndClick(Stock.sort_product_icon);
          }
        })
        .then(() => client.pause(1000))
    });
    test('should set the "Quantity" of the first product to 10.5', () => client.modifyProductQuantity(Stock, 1, 10.5));
    test('should click on "Check" button', () => client.waitForExistAndClick(Stock.save_product_quantity_button));
    /**
     * This scenario is based on the bug described in this ticket
     * https://github.com/PrestaShop/PrestaShop/issues/9616
     **/
    test('should check the error message', () => client.checkElementValidation(Stock.edit_quantity_input, 'Veuillez saisir une valeur valide.'));

    test('should check the "Physical" and "Availble" column unchanged', () => {
      return promise
        .then(() => client.checkStockColumn(Stock.physical_column.replace('%ID', 1), global.tab["productQuantity"]))
        .then(() => client.checkStockColumn(Stock.available_column.replace('%ID', 1), global.tab["productQuantity"]));
    });
  }, 'stocks');

  scenario('Enter a decimal quantity with "," for one product in the field  and save by the "Check" sign', client => {
    test('should go to "Stocks" page', () => {
      return promise
        .then(() => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.stocks_submenu))
        .then(() => client.isVisible(Stock.sort_product_icon, 2000))
        .then(() => {
          if (global.isVisible) {
            client.waitForVisibleAndClick(Stock.sort_product_icon);
          }
        })
        .then(() => client.pause(1000))
    });
    test('should set the "Quantity" of the first product to 10,5', () => client.modifyProductQuantity(Stock, 1, '10,5', true));
    test('should click on "Check" button', () => client.waitForExistAndClick(Stock.save_product_quantity_button));

    /**
     * This scenario is based on the bug described in this ticket
     * https://github.com/PrestaShop/PrestaShop/issues/9616
     **/
    test('should check the error message', () => client.checkElementValidation(Stock.edit_quantity_input, 'Veuillez saisir une valeur valide.'));
    test('should check the "Physical" and "Availble" column unchanged', () => {
      return promise
        .then(() => client.checkStockColumn(Stock.physical_column.replace('%ID', 1), global.tab["productQuantity"]))
        .then(() => client.checkStockColumn(Stock.available_column.replace('%ID', 1), global.tab["productQuantity"]));
    });
  }, 'stocks');

  scenario('Enter a decimal quantity with "." for one product in the field and save by the "Apply new quantity" button', client => {
    test('should go to "Stocks" page', () => {
      return promise
        .then(() => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.stocks_submenu))
        .then(() => client.isVisible(Stock.sort_product_icon, 2000))
        .then(() => {
          if (global.isVisible) {
            client.waitForVisibleAndClick(Stock.sort_product_icon);
          }
        })
        .then(() => client.pause(1000))
    });
    test('should set the "Quantity" of the first product to 10.5', () => client.modifyProductQuantity(Stock, 1, 10.5));

    test('should click on "Apply new quantity" button', () => client.waitForExistAndClick(Stock.group_apply_button));

    /**
     * This scenario is based on the bug described in this ticket
     * https://github.com/PrestaShop/PrestaShop/issues/9616
     **/
    test('should check the error message', () => client.checkElementValidation(Stock.edit_quantity_input, 'Veuillez saisir une valeur valide.'));

    test('should check the "Physical" and "Availble" column unchanged', () => {
      return promise
        .then(() => client.checkTextValue(Stock.physical_column.replace('%ID', 1), global.tab["productQuantity"]))
        .then(() => client.checkTextValue(Stock.available_column.replace('%ID', 1), global.tab["productQuantity"]));
    });
  }, 'stocks');

  scenario('Enter a decimal quantity with "," for one product in the field and save by the "Apply new quantity" button', client => {
    test('should go to "Stocks" page', () => {
      return promise
        .then(() => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.stocks_submenu))
        .then(() => client.isVisible(Stock.sort_product_icon, 2000))
        .then(() => {
          if (global.isVisible) {
            client.waitForVisibleAndClick(Stock.sort_product_icon);
          }
        })
        .then(() => client.pause(1000))
    });
    test('should set the "Quantity" of the first product to 10,5', () => client.modifyProductQuantity(Stock, 1, '10,5', true));

    test('should click on "Apply new quantity" button', () => client.waitForExistAndClick(Stock.group_apply_button));
    /**
     * This scenario is based on the bug described in this ticket
     * https://github.com/PrestaShop/PrestaShop/issues/9616
     **/
    test('should check the error message', () => client.checkElementValidation(Stock.edit_quantity_input, 'Veuillez saisir une valeur valide.'));
    test('should check the "Physical" and "Availble" column unchanged', () => {
      return promise
        .then(() => client.checkTextValue(Stock.physical_column.replace('%ID', 1), global.tab["productQuantity"]))
        .then(() => client.checkTextValue(Stock.available_column.replace('%ID', 1), global.tab["productQuantity"]));
    });
  }, 'stocks');

  scenario('Change the quanity for several lines  and save by the "Apply new quantity" button', client => {
    test('should go to "Stocks" page', () => {
      return promise
        .then(() => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.stocks_submenu))
        .then(() => client.isVisible(Stock.sort_product_icon, 2000))
        .then(() => {
          if (global.isVisible) {
            client.waitForVisibleAndClick(Stock.sort_product_icon);
          }
        })
        .then(() => client.pause(1000))
    });
    for (let i = 1; i <= 3; i++) {
      stock_common_scenarios.changeStockProductQuantity(client, Stock, i, 5);
    }

    test('should click on "Apply new quantity" button', () => client.waitForExistAndClick(Stock.group_apply_button));
    test('should check the success panel', () => {
      return promise
        .then(() => client.waitForVisible(Stock.success_hidden_panel))
        .then(() => client.checkTextValue(Stock.success_hidden_panel, 'Stock successfully updated', 'contain'));
    });

    test('should check the "Physical" and "Availble" column changed', () => {
      for (let i = 1; i <= 3; i++) {
        return promise
          .then(() => client.checkTextValue(Stock.physical_column.replace('%ID', i), global.tab["productQuantity"], 'notequal'))
          .then(() => client.checkTextValue(Stock.available_column.replace('%ID', i), global.tab["productQuantity"], 'notequal'));
      }
    });
    stock_common_scenarios.checkMovementHistory(client, Menu, Movement, 1, "5", "+", "Employee Edition", productData[2].reference, dateSystem, productData[2].name + date_time, true);
    stock_common_scenarios.checkMovementHistory(client, Menu, Movement, 2, "5", "+", "Employee Edition", productData[1].reference, dateSystem, productData[1].name + date_time, true);
    stock_common_scenarios.checkMovementHistory(client, Menu, Movement, 3, "5", "+", "Employee Edition", productData[0].reference, dateSystem, productData[0].name + date_time, true);
  }, 'stocks');

  scenario('Change the quanity for several lines with keyboard and click on the "check" sign', client => {
    test('should go to "Stocks" page', () => {
      return promise
        .then(() => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.stocks_submenu))
        .then(() => client.isVisible(Stock.sort_product_icon, 2000))
        .then(() => {
          if (global.isVisible) {
            client.waitForVisibleAndClick(Stock.sort_product_icon);
          }
        })
        .then(() => client.pause(1000))
    });
    for (let i = 1; i <= 3; i++) {
      stock_common_scenarios.changeStockQuantityWithKeyboard(client, Stock, i, 5, 'checkBtn', "down");
    }
    test('should check the "Physical" and "Availble" column changed', () => {
      return promise
        .then(() => client.checkTextValue(Stock.physical_column.replace('%ID', 1), global.tab["productQuantity"], 'notequal'))
        .then(() => client.checkTextValue(Stock.available_column.replace('%ID', 1), global.tab["productQuantity"], 'notequal'));
    });
    stock_common_scenarios.checkMovementHistory(client, Menu, Movement, 1, "5", "+", "Employee Edition", productData[2].reference, dateSystem, productData[2].name + date_time, true);
    stock_common_scenarios.checkMovementHistory(client, Menu, Movement, 2, "5", "+", "Employee Edition", productData[1].reference, dateSystem, productData[1].name + date_time, true);
    stock_common_scenarios.checkMovementHistory(client, Menu, Movement, 3, "5", "+", "Employee Edition", productData[0].reference, dateSystem, productData[0].name + date_time, true);
  }, 'stocks');
}, 'stocks', false);
