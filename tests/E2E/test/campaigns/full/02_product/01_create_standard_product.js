const {AddProductPage} = require('../../../selectors/BO/add_product_page.js');
const {AccessPageBO} = require('../../../selectors/BO/access_page.js');
const {AccessPageFO} = require('../../../selectors/FO/access_page.js');
const {SearchProductPage} = require('../../../selectors/FO/search_product_page.js');
const {productPage} = require('../../../selectors/FO/product_page.js');
const {CheckoutOrderPage} = require('../../../selectors/FO/order_page.js');
const {accountPage} = require('../../../selectors/FO/add_account_page.js');
const {ProductSettings} = require('../../../selectors/BO/shopParameters/product_settings.js');
const {ShopParameters} = require('../../../selectors/BO/shopParameters/shop_parameters.js');
const {Localization} = require('../../../selectors/BO/international/localization.js');
const {InternationalPage} = require('../../../selectors/BO/international/index.js');
const {Menu} = require('../../../selectors/BO/menu.js');
const {Google} = require('../../../selectors/External/google.js');
const {Customer} = require('../../../selectors/BO/customers/customer');
const {BO} = require('../../../selectors/BO/customers/index');
const {OnBoarding} = require('../../../selectors/BO/onboarding');
let common = require('../../../common.webdriverio');
const product = require('../../common_scenarios/product');
let data = require('./../../../datas/product-data');

let promise = Promise.resolve();
let productData = {
  name: 'ProductToDuplicate',
  quantity: "10",
  price: '5',
  image_name: '1.png',
  reference: 'test'
};

let shipping = {
  carrier: 5,
  carrier_tax: 0.2,
  additional_cost: 2,
  handling_charge: 2
};
let google = {
  url: 'https://www.google.com/',
  login: 'prestotests@gmail.com',
  password: 'presto_tests',
  name: 'presto',
  lastname: 'test'
};
scenario('Create Standard Product in the Back Office', () => {
  scenario('Login in the Back Office', client => {
    test('should open browser', () => client.open());
    test('should login successfully in the Back Office', () => client.signInBO(AccessPageBO));
    test('should check and click on "Stop the OnBoarding" button', () => {
      return promise
        .then(() => client.isVisible(OnBoarding.stop_button))
        .then(() => client.stopOnBoarding(OnBoarding.stop_button));
    });
    test('should go to "Catalog" page', () => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.products_submenu));
    test('should click on "NEW PRODUCT"', () => client.waitForExistAndClick(AddProductPage.new_product_button));
  }, 'onboarding');

  scenario('Fill "Basic settings" form', client => {
   test('should check the "product name" placeholder', () => client.checkAttributeValue(AddProductPage.product_name_input, 'placeholder', 'Enter your product name'));
    test('should check the "product name" is empty', () => client.checkAttributeValue(AddProductPage.product_name_input, 'value', ''));
    test('should set the "product name" input', () => client.waitAndSetValue(AddProductPage.product_name_input, data.standard.name + date_time));

    //////////////////////////// ajouté par ameni

    test('should verify if the default type of product is "Standard Product"', () => client.isSelected(AddProductPage.product_type_option.replace('%POS', 1)));

    test('should select the "French" language from the list', () => client.waitAndSelectByValue(AddProductPage.product_language, 'fr'));
    test('should check that the "Product name" input exists', () => client.isExisting(AddProductPage.product_name_fr_input, 1000));
    test('should select the "English" language from the list', () => client.waitAndSelectByValue(AddProductPage.product_language, 'en'));
    test('should check that the "Product name" exists in English language', () => client.isExisting(AddProductPage.product_name_input, 1000));
    scenario('Check that "Product list" button works successfully', client => {
      test('should open the "Quick navigation" sidebar', () => client.waitForExistAndClick(AddProductPage.product_list_button));
      test('should check that the "Quick navigation" sidebar is opened', () => client.isExisting(AddProductPage.right_sidebar, 1000)); //Quick navigation sidebar
      test('should close the "Quick navigation" sidebar', () => client.waitForExistAndClick(AddProductPage.product_list_button));
    }, 'product/product');

    scenario('Check that "Help" button works successfully', client => {
      test('should open the "Help" sidebar', () => client.waitForExistAndClick(AddProductPage.help_button));
      test('should check that the "Help" sidebar is opened', () => client.isExisting(AddProductPage.right_sidebar, 1000)); //Help sidebar
      test('should close the "Help" sidebar', () => client.waitForExistAndClick(AddProductPage.help_button));
    }, 'product/product');

    ///////////////////////////////////Suppression le produit
   /* scenario('Delete the first product from the list in the Back Office', client => {
      test('should go to "Catalog" page', () => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.products_submenu));
      test('should click on "Dropdown > Delete" button', () => {
        return promise
          .then(() => client.getTextInVar(ProductList.product_name.replace('%ID', 1), 'deletedProductName'))
          .then(() => client.waitForExistAndClick(ProductList.dropdown_button.replace('%POS', 1)))
          .then(() => client.waitForVisibleAndClick(ProductList.action_delete_button.replace('%POS', 1)))
          .then(() => client.waitForVisibleAndClick(ProductList.delete_now_modal_button));
      });
      test('should check that the first product is well deleted', () => {
        return promise
          .then(() => client.searchProductByName(tab['deletedProductName']))
          .then(() => client.checkTextValue(ProductList.search_no_results, 'There is no result for this search. Update your filters to view other products.'))
          .then(() => client.waitForExistAndClick(AddProductPage.catalog_reset_filter));
      });
    }, 'product/check_product');

*/
/*    scenario('Testing "Online" button', client => {
      test('should set the product "Offline"', () => client.waitForExistAndClick(AddProductPage.product_online_toggle));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should click on "Preview" button', () => client.waitForExistAndClick(AddProductPage.preview_buttons));
      test('should switch to the Preview page in the Front Office', () => client.switchWindow(2));
      test('should check the offline warning message', () => client.checkTextValue(productPage.offline_warning_message, "This product is not visible to your customers.", "contain"));
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should set the product "Online"', () => client.waitForExistAndClick(AddProductPage.product_online_toggle));
      test('should click on "Preview" button', () => client.waitForExistAndClick(AddProductPage.preview_buttons));
      test('should switch to the Preview page in the Front Office', () => client.switchWindow(3));
      test('should check the warning offline message does not appear', () => client.isNotExisting(productPage.offline_warning_message));
    }, 'product/product');*/

    scenario('Create and duplicate new product in the Back Office', client => {
      test('should go to "Products" page', () => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.products_submenu));
      test('should click on "New Product" button', () => {
        return promise
          .then(() => client.waitForExistAndClick(AddProductPage.new_product_button))
          .then(() => client.waitForSymfonyToolbar(AddProductPage, 2000))
      });
      test('should set the "Name" input', () => client.waitAndSetValue(AddProductPage.product_name_input, productData["name"] + date_time));
      test('should set the "Reference" input', () => client.waitAndSetValue(AddProductPage.product_reference, productData["reference"]));
      test('should set the "Quantity" input', () => client.waitAndSetValue(AddProductPage.quantity_shortcut_input, productData["quantity"]));
      test('should set the "Price" input', () => client.setPrice(AddProductPage.priceTE_shortcut, productData["price"]));
      test('should upload the first product picture', () => client.uploadPicture(productData["image_name"], AddProductPage.picture));


      scenario('Save and duplicate the created product with "ALT + SHIFT + D"', client => {
        test('should click on "ALT + SHIFT + D" button', () => {
          return promise
            .then(() =>  client.keys(["Alt", "Shift", "D"]));
        });
      }, 'product/product');
    }, 'product/product');

    ////////////////////////////////////suite hatem
    /*test('should upload the first product picture', () => client.uploadPicture('t_shirt_gris.jpg', AddProductPage.picture));
      test('should set the "Reference" input', () => client.waitAndSetValue(AddProductPage.product_reference_input, 'grayshirt'));
      test('should set the "Quantity" input', () => client.waitAndSetValue(AddProductPage.quantity_shortcut_input, "100"));
      test('should set the "Tax exclude" price input', () => client.setPrice(AddProductPage.priceTE_shortcut, '10'));
      test('should check that the "Tax include" is equal to "12"', () => client.checkAttributeValue(AddProductPage.priceTTC_shortcut, 'value', '12'));
      test('should set the "Tax include" price input', () => client.setPrice(AddProductPage.priceTTC_shortcut, '9'));
      test('should check that the "Tax exclude" is equal to "7.5"', () => client.checkAttributeValue(AddProductPage.priceTE_shortcut, 'value', '7.5'));
      test('should click on "Tax rule" select', () => client.waitForExistAndClick(AddProductPage.tax_rule_select));
      test('should choose a "Tax rule 10%" from the dropdown list', () => client.waitForExistAndClick(AddProductPage.tax_rule_option.replace('%I', 3)));
      test('should check that the "Tax include" is equal to "8.25"', () => client.checkAttributeValue(AddProductPage.priceTTC_shortcut, 'value', '8.25'));
      test('should click on "Quantities" link', () => client.scrollWaitForExistAndClick(AddProductPage.quantities_link));
      test('should check that the "Quantities" tab is well opened', () => client.isExisting(AddProductPage.product_quantity_input));
      test('should click on "Basic settings" tab', () => client.scrollWaitForExistAndClick(AddProductPage.basic_settings_tab));
      test('should click on "Pricing" link', () => client.scrollWaitForExistAndClick(AddProductPage.pricing_link));
      test('should check that the "Pricing" tab is well opened', () => client.isExisting(AddProductPage.pricing_wholesale));
  */
    /*test('should click on "Basic settings" tab', () => client.scrollWaitForExistAndClick(AddProductPage.basic_settings_tab));
    test('should set the "Summary" text', () => client.setEditorText(AddProductPage.summary_textarea, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."));
    test('should set the "Summary" text to bold', () => client.setEditorFontText(AddProductPage.summary_textarea, 0, 26, 'strong'));
    test('should set the "Summary" text to italic', () => client.setEditorFontText(AddProductPage.summary_textarea, 2, 29, 'em'));
    test('should set the "Summary" text to underline', () => client.setEditorFontText(AddProductPage.summary_textarea, 5, 67, 'underline'));
    product.checkTinyMceButtons(client, 11);
    test('should click on "Description" tab', () => client.waitForExistAndClick(AddProductPage.tab_description));
    product.checkTinyMceButtons(client, 51);
    test('should set the "Description" text', () => client.setEditorText(AddProductPage.description_textarea, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."));
    test('should switch the product online', () => {
      return promise
        .then(() => client.isVisible(AddProductPage.symfony_toolbar, 3000))
        .then(() => {
          if (global.isVisible) {
            client.waitForExistAndClick(AddProductPage.symfony_toolbar)
          }
        })
        .then(() => client.waitForExistAndClick(AddProductPage.product_online_toggle, 2000));
    });
    test('should click on "Preview" button', () => client.waitForExistAndClick(AddProductPage.preview_buttons));
    test('should go to the Front Office', () => client.switchWindow(1));
    test('should click on the "Preview" link', () => client.waitForExistAndClick(AddProductPage.preview_link, 2000));
    test('should check that the "Description" contains "Bold" text', () => client.isExisting(productPage.product_summary_bold_text, 5000));
    test('should check that the "Description" contains "Italic" text', () => client.isExisting(productPage.product_summary_italic_text));
    test('should check that the "Description" contains "Underline" text', () => client.isExisting(productPage.product_summary_underline_text));
    test('should go back to the Back Office', () => client.switchWindow(0));
    product.addProductFeature(client, "Frame Size", 0, "40x60cm");
    product.addProductFeature(client, "Frame Size", 1, "80x120cm");
    product.addProductFeature(client, "Compositions", 2, '', "azerty", "custom_value");
    product.addProductFeature(client, "Paper Type", 3, '', "plop", "custom_value");
    test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
    test('should go to the Front Office', () => client.switchWindow(1));
    test('should click on "Product Details" tab', () => client.waitForExistAndClick(productPage.product_tab_list.replace('%I', 2), 5000));
    test('should check that the "Compositions" feature does exist', () => client.isExisting(productPage.product_features.replace('%F', 'Compositions'), 1000));
    test('should check that the value of "Compositions" feature does exist', () => client.isExisting(productPage.product_features.replace('%F', 'azerty')));
    test('should check that the "Paper Type" feature does exist', () => client.isExisting(productPage.product_features.replace('%F', 'Paper Type')));
    test('should check that the value of "Paper Type" feature does exist', () => client.isExisting(productPage.product_features.replace('%F', 'plop')));
    test('should check that the "Frame Size" feature does exist', () => client.isExisting(productPage.product_features.replace('%F', 'Frame Size')));
    test('should check that the first value of "Frame Size" feature does exist', () => client.isExisting(productPage.product_features.replace('%F', '40x60cm')));
    test('should check that the second value of "Frame Size" feature does exist', () => client.isExisting(productPage.product_features.replace('%F', '80x120cm')));
    test('should go back to the Back Office', () => client.switchWindow(0));
    test('should click on "Delete" icon of the second feature', () => client.waitForExistAndClick(AddProductPage.delete_feature_icon.replace('%POS', 2)));
    test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
    test('should click on "Delete" icon of the third feature', () => client.waitForVisibleAndClick(AddProductPage.delete_feature_icon.replace('%POS', 2), 3000));
    test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
    test('should click on "ADD A BRAND" button', () => client.waitForExistAndClick(AddProductPage.add_brand_button, 2000));
    test('should select brand', () => {
      return promise
        .then(() => client.waitForExistAndClick(AddProductPage.product_brand_select))
        .then(() => client.waitForVisibleAndClick(AddProductPage.product_brand_select_option));
    });
    test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
    test('should go to the Front Office', () => client.switchWindow(1));
    test('should click on "Product Details" tab', () => client.waitForExistAndClick(productPage.product_tab_list.replace('%I', 2), 5000));
    test('should check that the "Graphic Corner" of the picture brand does exist', () => client.isExisting(productPage.manufacturer_picture.replace('%ALT', 'Graphic Corner'), 1000));
    test('should go back to the Back Office', () => client.switchWindow(0));
    test('should click on "Delete" icon of the brand', () => client.scrollWaitForExistAndClick(AddProductPage.delete_brand_icon, 50, 2000));
    test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes'), 3000));
    /!** The default UI component of Tree category is Expand
     * test('should click on "Expand" button', () => client.waitForExistAndClick(AddProductPage.category_expand_button, 2000));
     **!/
    test('should click on "Create a category" button', () => client.scrollWaitForExistAndClick(AddProductPage.create_category_button, 150, 2000));
    test('should set the "New category name" input', () => client.waitAndSetValue(AddProductPage.product_category_name_input, "test"));
    test('should choose "Clothes" as Parent of the category from the dropdown list', () => {
      return promise
        .then(() => client.scrollWaitForExistAndClick(AddProductPage.parent_category_select))
        .then(() => client.waitForVisibleAndClick(AddProductPage.parent_category_option.replace('%N', "Clothes")));
    });
    test('should click on "Create" button', () => client.scrollWaitForExistAndClick(AddProductPage.category_save_button));
    /!** The default UI component of Tree category is Expand
     * test('should click on "Expand" button', () => client.waitForExistAndClick(AddProductPage.category_expand_button, 2000));
     **!/
    test('should check that the "Category" is well created', () => client.isExisting(AddProductPage.category_checkbox.replace('%S', 'test'), 4000));
    test('should click on "Delete" icon of the created category', () => client.waitForExistAndClick(AddProductPage.delete_category_icon.replace('%I', 2)));
    test('should check that the "Product" is well dissociated with the created category', () => client.isExisting(AddProductPage.category_checkbox.replace('%S', 'test'), 4000));
    test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
    test('should click on "Add related product" button', () => client.waitForExistAndClick(AddProductPage.add_related_product_btn));
    test('should search and add a related product', () => {
      return promise
        .then(() => client.waitAndSetValue(AddProductPage.search_add_related_product_input, 'mug'))
        .then(() => client.waitForVisibleAndClick(AddProductPage.related_product_item))
    });
    test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
    test('should go to the Front Office', () => client.switchWindow(1));
    test('should check that the related product does exist', () => client.isExisting(productPage.related_product.replace('%S', 'mug'), 1000));
    test('should go back to the Back Office', () => client.switchWindow(0));
    test('should click on "Delete" icon of the related product', () => client.scrollWaitForExistAndClick(AddProductPage.delete_related_product_icon, 50, 2000));
    test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
    test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
    test('should go to the Front Office', () => client.switchWindow(1));
    test('should check that the related product does not exist', () => client.isNotExisting(productPage.related_product.replace('%S', 'mug'), 1000));
    test('should go back to the Back Office', () => client.switchWindow(0));
  */
  }, 'product/product');

  /*  scenario('Fill "Quantities" form', client => {
      test('should click on "Quantities" tab', () => client.scrollWaitForExistAndClick(AddProductPage.product_quantities_tab, 50));
      test('should set the "label when in stock" input', () => client.waitAndSetValue(AddProductPage.label_in_stock_input, 'tshirt in stock'));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      test('should check that the label of the product availability is well displayed', () => client.checkTextValue(productPage.product_availability, 'tshirt in stock', 'contain'));
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should set the "Quantity" input', () => client.waitAndSetValue(AddProductPage.product_quantity_input, '0', 2000));
      test('should set the "Label when out of stock (and back order allowed)" input', () => client.waitAndSetValue(AddProductPage.label_out_stock_input, 'tshirt out of stock but orderable'));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      scenario('Allow the order of products out of stock', client => {
        test('should close the "Catalog" menu', () => client.waitForExistAndClick(Menu.Sell.Catalog.catalog_menu, 3000));
        test('should go to "Product settings" page', () => client.clickAndOpenOnNewWindow(Menu.Configure.ShopParameters.shop_parameters_menu, Menu.Configure.ShopParameters.product_settings_submenu, 2));
        test('should switch "Allow ordering of out-of-stock products" to "Yes"', () => client.scrollWaitForExistAndClick(ProductSettings.allowOrderOutOfStock_button.replace('%I', '1')));
        test('should click on "Save" button', () => {
          return promise
            .then(() => client.isVisible(AddProductPage.symfony_toolbar, 3000))
            .then(() => {
              if (global.isVisible) {
                client.waitForExistAndClick(AddProductPage.symfony_toolbar)
              }
            })
            .then(() => client.scrollWaitForExistAndClick(ProductSettings.save_button.replace('%POS', '3')));
        });
        test('should verify the appearance of the green validation', () => client.checkTextValue(ShopParameters.success_box, "Update successful"));
      }, 'common_client');
      scenario('Check the label when the product out of stock', client => {
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the label does exist when the product out of stock', () => client.checkTextValue(productPage.product_availability, 'tshirt out of stock but orderable', 'contain'));
        test('should go back to the Back Office', () => client.switchWindow(0));
      }, 'common_client');
      scenario('Check the behavior when out of stock', client => {
        test('should set the "label when in stock" input', () => client.waitAndSetValue(AddProductPage.label_in_stock_input, ''));
        test('should set the "Label when out of stock (and back order allowed)" input', () => client.waitAndSetValue(AddProductPage.label_out_stock_input, ''));
        test('should click on "Deny orders" radio button', () => client.waitForExistAndClick(AddProductPage.availability_preferences_radio_button.replace('%I', '0')));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the label exists when the behavior is "Deny orders"', () => client.checkTextValue(productPage.product_availability, 'There are not enough products in stock', 'contain'));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Allow orders" radio button', () => client.waitForExistAndClick(AddProductPage.availability_preferences_radio_button.replace('%I', '1')));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the label does not exist when the behavior is "Allow orders"', () => client.checkTextValue(productPage.product_availability, ''));
        test('should go back to the Back Office', () => client.switchWindow(0));
      }, 'common_client');
      scenario('Check the "Minimum quantity for sale"', client => {
        test('should set the "Minimum quantity for sale" input', () => client.waitAndSetValue(AddProductPage.minimum_quantity_sale_input, '3'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the label of "Minimum quantity" contains "3"', () => client.checkTextValue(productPage.product_minimal_quantity, '3', 'contain'));
        test('should check that the "Minimum quantity" is equal or greater to "3"', () => client.checkAttributeValue(productPage.product_quantity_input, 'value', parseInt('3'), 'least'));
        test('should change quantity to "2" using the keyboard and push "Enter"', () => {
          return promise
            .then(() => client.waitAndSetValue(productPage.product_quantity_input, '2'))
            .then(() => client.keys('\uE007'))
            .then(() => client.pause(1000));
        });
        test('should check that the "Minimum quantity" is equal or greater to "3"', () => client.checkAttributeValue(productPage.product_quantity_input, 'value', parseInt('3'), 'least'));
        test('should go back to the Back Office', () => client.switchWindow(0));
      }, 'common_client');
      scenario('Check the "Availability date"', client => {
        test('should set the "Availability date" input', () => client.waitAndSetValue(AddProductPage.availability_date_input, common.getCustomDate(30)));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should click on "Product Details" tab', () => client.waitForExistAndClick(productPage.product_tab_list.replace('%I', 2), 5000));
        test('should check that the "Availability date" is equal to "' + common.getCustomDate(30) + '"', () => {
          return promise
            .then(() => client.scrollTo(productPage.product_availability_date))
            .then(() => client.checkTextValue(productPage.product_availability_date, common.getCustomDate(30), 'equal', 2000));
        });
        test('should go back to the Back Office', () => client.switchWindow(0));
      }, 'common_client');
      scenario('Check the "Stock Alerts"', client => {
        test('should set the "Quantity" input', () => client.waitAndSetValue(AddProductPage.product_quantity_input, '100', 2000));
        test('should set the "Minimum quantity for sale" input', () => client.waitAndSetValue(AddProductPage.minimum_quantity_sale_input, '1'));
        test('should click on "Send me an email when the quantity is below or equals this level" checkbox', () => client.waitForExistAndClick(AddProductPage.low_stock_level_checkbox));
        test('should set the "Low stock level" input', () => client.waitAndSetValue(AddProductPage.low_stock_level_input, '90'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      }, 'common_client');
    }, 'common_client');*/
  /*  scenario('Fill "Shipping" form', client => {
      test('should click on "Shipping" tab', () => client.scrollWaitForExistAndClick(AddProductPage.product_shipping_tab, 50));
      test('should set "Width" input', () => client.waitAndSetValue(AddProductPage.shipping_width, '10'));
      test('should set "Height" input', () => client.waitAndSetValue(AddProductPage.shipping_height, '10'));
      test('should set "Depth" input', () => client.waitAndSetValue(AddProductPage.shipping_depth, '5'));
      test('should set "Weight" input', () => client.waitAndSetValue(AddProductPage.shipping_weight, '1'));
      test('should click on "None" radio button', () => client.waitForExistAndClick(AddProductPage.delivery_time_radio_button.replace('%I', 0)));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      test('should check that the delivery time does not exist', () => client.isNotExisting(productPage.delivery_information_span));
      test('should go to the "Product settings" page', () => client.switchWindow(2));
      test('should set "Delivery time of in-stock products" input', () => client.waitAndSetValue(ProductSettings.delivery_time_in_stock_input, 'Delivered within 2 days'));
      test('should click on "Save" button', () => {
        return promise
          .then(() => client.isVisible(AddProductPage.symfony_toolbar, 3000))
          .then(() => {
            if (global.isVisible) {
              client.waitForExistAndClick(AddProductPage.symfony_toolbar)
            }
          })
          .then(() => client.scrollWaitForExistAndClick(ProductSettings.save_button.replace('%POS', '3')));
      });
      test('should verify the appearance of the green validation', () => client.checkTextValue(ShopParameters.success_box, "Update successful"));
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should click on "Default delivery time" radio button', () => client.waitForExistAndClick(AddProductPage.delivery_time_radio_button.replace('%I', 1)));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      test('should check that the delivery time is well displayed', () => client.checkTextValue(productPage.delivery_information_span, "Delivered within 2 days"));
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should check the first carrier checkbox button', () => {
        return promise
          .then(() => client.scrollWaitForExistAndClick(AddProductPage.shipping_available_carriers.replace('%I', 0)))
          .then(() => client.getTextInVar(AddProductPage.shipping_available_carriers.replace('%I', 0) + '/..', 'carrier_name'));
      });
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      test('should click on "ADD TO CART" button', () => client.waitForExistAndClick(CheckoutOrderPage.add_to_cart_button));
      test('should click on "Proceed to checkout" modal button', () => client.waitForVisibleAndClick(CheckoutOrderPage.proceed_to_checkout_modal_button));
      test('should click on "Proceed to checkout" button', () => client.waitForExistAndClick(CheckoutOrderPage.proceed_to_checkout_button));
      scenario('Login with existing customer and confirm address', client => {
        test('should click on "Sign in" tab', () => client.waitForExistAndClick(accountPage.sign_tab));
        test('should set the "Email" input', () => client.waitAndSetValue(accountPage.signin_email_input, 'pub@prestashop.com'));
        test('should set the "Password" input', () => client.waitAndSetValue(accountPage.signin_password_input, '123456789'));
        test('should click on "CONTINUE" button', () => client.waitForExistAndClick(accountPage.continue_button));
        test('should click on confirm address button', () => client.waitForExistAndClick(CheckoutOrderPage.checkout_step2_continue_button));
      }, 'common_client');
      scenario('Check "SHIPPING METHOD"', client => {
        test('should check that the product have a selected carrier', () => client.checkTextValue(CheckoutOrderPage.carrier_name.replace('%I', 1), tab['carrier_name'].split(' (')[0], 'contain'));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should uncheck the first carrier and check the second carrier checkbox button', () => {
          return promise
            .then(() => client.scrollWaitForExistAndClick(AddProductPage.shipping_available_carriers.replace('%I', 0)))
            .then(() => client.scrollWaitForExistAndClick(AddProductPage.shipping_available_carriers.replace('%I', 1)))
            .then(() => client.getTextInVar(AddProductPage.shipping_available_carriers.replace('%I', 1) + '/..', 'carrier_name'));
        });
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the product have a selected carrier', () => client.checkTextValue(CheckoutOrderPage.carrier_name.replace('%I', 2), tab['carrier_name'][0].split(' (')[0], 'contain', 3000));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should uncheck the second carrier checkbox button', () => client.scrollWaitForExistAndClick(AddProductPage.shipping_available_carriers.replace('%I', 1)));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the price of first carrier is equal to "Free"', () => client.checkTextValue(CheckoutOrderPage.carrier_price.replace('%I', 1), 'Free'));
        test('should check that the price of second carrier is not equal to "Free"', () => {
          return promise
            .then(() => client.checkTextValue(CheckoutOrderPage.carrier_price.replace('%I', 2), 'Free', 'notequal'))
            .then(() => client.getTextInVar(CheckoutOrderPage.carrier_price.replace('%I', 2), 'carrier_price'));
        });
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should set the additional shipping costs input', () => client.waitAndSetValue(AddProductPage.shipping_fees, 2));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        /!**
         * Example: shipping_price = (((shipping.carrier + shipping.additional_cost) * shipping.carrier_tax) + (shipping.carrier + shipping.additional_cost) + (shipping.handling_charge * shipping.carrier_tax) + shipping.handling_charge))
         *!/
        test('should check that the price of second carrier is well displayed', () => client.checkTextValue(CheckoutOrderPage.carrier_price.replace('%I', 2), (((shipping.carrier + shipping.additional_cost) * shipping.carrier_tax) + (shipping.carrier + shipping.additional_cost) + (shipping.handling_charge * shipping.carrier_tax) + shipping.handling_charge).toString(), 'contain'));
        test('should go back to the Back Office', () => client.switchWindow(0));
      }, 'common_client');
      scenario('Create a "Currency"', client => {
        test('should close the "Catalog" menu', () => client.waitForExistAndClick(Menu.Sell.Catalog.catalog_menu));
        test('should go to "Localization" page', () => client.clickAndOpenOnNewWindow(Menu.Improve.International.international_menu, Menu.Improve.International.localization_submenu, 3));
        test('should click on "Currencies" tab', () => client.waitForExistAndClick(Menu.Improve.International.currencies_tab, 3000));
        test('should click on "Add new currency" button', () => client.waitForExistAndClick(Localization.Currency.add_new_currency_button));
        test('should click on "Status" button', () => client.waitForExistAndClick(Localization.Currency.status_button));
        test('should click on "Save" button', () => client.waitForExistAndClick(Localization.Currency.save_button));
        test('should verify the appearance of the green validation', () => client.checkTextValue(InternationalPage.success_panel, "×\nSuccessful creation."));
        test('should go back to the Catalog page', () => client.switchWindow(0));
      }, 'common_client');
      scenario('Fill "Pricing" form', client => {
        test('should click on "Pricing" tab', () => client.scrollWaitForExistAndClick(AddProductPage.product_pricing_tab, 50, 2000));
        test('should set the "Price (tax incl.)" input', () => client.waitAndSetValue(AddProductPage.product_pricing_ttc_input, '8.5'));
        test('should check that the "Price (tax excl.)" is equal to "7.727273"', () => client.checkAttributeValue(AddProductPage.product_pricing_ht_input, 'value', '7.727273'));
        test('should set the "Price (tax incl.)" input', () => client.waitAndSetValue(AddProductPage.product_pricing_ttc_input, '9,5'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should check that the "Price (tax incl.)" is equal to "9.5"', () => client.checkAttributeValue(AddProductPage.product_pricing_ttc_input, 'value', '9.5'));
        test('should check that the "Price (tax excl.)" is equal to "8.636364"', () => client.checkAttributeValue(AddProductPage.product_pricing_ht_input, 'value', '8.636364'));
        test('should set the "Price (tax excl.)" input', () => client.waitAndSetValue(AddProductPage.product_pricing_ht_input, '7,5'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should check that the "Price (tax incl.)" is equal to "8.25"', () => client.checkAttributeValue(AddProductPage.product_pricing_ttc_input, 'value', '8.25'));
        test('should check that the "Price (tax excl.)" is equal to "7.5"', () => client.checkAttributeValue(AddProductPage.product_pricing_ht_input, 'value', '7.5'));
        test('should set the "Tax rule" to "5.5%"', () => {
          return promise
            .then(() => client.waitForExistAndClick(AddProductPage.pricing_tax_rule_select))
            .then(() => client.waitForExistAndClick(AddProductPage.pricing_tax_rule_option.replace('%T', '5.5%')));
        });
        test('should check that the "Price (tax incl.)" is equal to "7.9125"', () => client.checkAttributeValue(AddProductPage.product_pricing_ttc_input, 'value', '7.9125'));
        test('should set the "Tax rule" to "20%"', () => {
          return promise
            .then(() => client.waitForExistAndClick(AddProductPage.pricing_tax_rule_select))
            .then(() => client.waitForExistAndClick(AddProductPage.pricing_tax_rule_option.replace('%T', '20%')));
        });
        test('should check that the "Price (tax incl.)" is equal to "9"', () => client.checkAttributeValue(AddProductPage.product_pricing_ttc_input, 'value', '9'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should check that the "Manage tax rules" link will open in a new tab', () => client.checkAttributeValue(AddProductPage.pricing_manage_tax_rules_link, 'target', '_blank'));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should go to the "Home" page', () => client.waitForExistAndClick(AccessPageFO.logo_home_page));
        test('should set the shop language to "English"', () => client.changeLanguage());
        test('should click on "CART" button', () => client.waitForExistAndClick(AccessPageFO.shopping_cart_button));
        test('should click on "Product name" link', () => client.waitForExistAndClick(CheckoutOrderPage.product_name_link));
        test('should check that the "Product price" is equal to "€9.00"', () => client.checkTextValue(productPage.product_price, '€9.00'));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should set the "Price per unit (tax excl.)" input', () => client.waitAndSetValue(AddProductPage.unit_price, '1'));
        test('should set the "Unit" input', () => client.waitAndSetValue(AddProductPage.unity, 'per kg'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the "Product unit price" is equal to "(€1.20 per kg)"', () => client.checkTextValue(productPage.product_unit_price, '(€1.20 per kg)'));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Display the "On sale!" flag on the product page, and on product listings." checkbox', () => client.waitForExistAndClick(AddProductPage.on_sale_checkbox));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the product on sale flag does exist', () => client.isExisting(productPage.product_on_sale_flag));
        test('should click on "Home" button', () => client.waitForExistAndClick(productPage.home_button));
        test('should search for the product', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, 'TG' + date_time));
        test('should check that the product on sale flag does exist', () => client.isExisting(productPage.product_on_sale_flag));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should set the "Price (tax excl.)" input', () => client.waitAndSetValue(AddProductPage.pricing_wholesale, '3'));
        test('should click on "Add a specific price" button', () => client.waitForExistAndClick(AddProductPage.pricing_add_specific_price_button));
        test('should set the "Apply a discount of" input', () => client.waitAndSetValue(AddProductPage.specific_price_discount_input, '10', 2000));
        test('should click on "Apply" button', () => client.waitForExistAndClick(AddProductPage.specific_price_save_button));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should search for the product', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, 'TG' + date_time));
        test('should set the shop language to "English"', () => client.changeLanguage());
        test('should go to the product page', () => client.waitForExistAndClick(SearchProductPage.product_result_name));
        test('should check that the product price is equal to "€0.00"', () => client.checkTextValue(productPage.product_price, '€0.00'));
        test('should verify that the discount is equal to "SAVE €9.00"', () => client.checkTextValue(CheckoutOrderPage.product_discount_details, 'SAVE €9.00'));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Delete" icon from the specific price table', () => client.waitForExistAndClick(AddProductPage.specific_price_delete_icon, 2000));
        test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
        test('should click on "Add a specific price" button', () => client.waitForExistAndClick(AddProductPage.pricing_add_specific_price_button, 2000));
        test('should set the "Apply a discount of" input', () => client.waitAndSetValue(AddProductPage.specific_price_discount_input, '3', 2000));
        test('should click on "Apply" button', () => client.waitForExistAndClick(AddProductPage.specific_price_save_button));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForVisibleAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the product price is equal to "€6.00"', () => client.checkTextValue(productPage.product_price, '€6.00'));
        test('should verify that the discount is equal to "SAVE €3.00"', () => client.checkTextValue(CheckoutOrderPage.product_discount_details, 'SAVE €3.00'));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Delete" icon from the specific price table', () => client.waitForExistAndClick(AddProductPage.specific_price_delete_icon, 2000));
        test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
        test('should click on "Add a specific price" button', () => client.waitForExistAndClick(AddProductPage.pricing_add_specific_price_button, 2000));
        test('should set the "Apply a discount of" input', () => client.waitAndSetValue(AddProductPage.specific_price_discount_input, '3', 2000));
        test('should choose the "Tax excluded" from the specific price tax', () => client.waitAndSelectByValue(AddProductPage.specific_price_reduction_tax_select, '0'));
        test('should click on "Apply" button', () => client.waitForExistAndClick(AddProductPage.specific_price_save_button));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the product price is equal to "€5.40"', () => client.checkTextValue(productPage.product_price, '€5.40', 'equal', 3000));
        test('should verify that the discount is equal to "SAVE €3.60"', () => client.checkTextValue(CheckoutOrderPage.product_discount_details, 'SAVE €3.60'));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Delete" icon from the specific price table', () => client.waitForExistAndClick(AddProductPage.specific_price_delete_icon, 2000));
        test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
        test('should click on "Add a specific price" button', () => client.waitForExistAndClick(AddProductPage.pricing_add_specific_price_button, 2000));
        test('should set the "Starting at" input', () => client.waitAndSetValue(AddProductPage.specific_price_starting_at_input, '2', 2000));
        test('should set the "Apply a discount of" input', () => client.waitAndSetValue(AddProductPage.specific_price_discount_input, '5'));
        test('should choose the "Percentage" from the specific price type', () => client.waitAndSelectByValue(AddProductPage.specific_price_reduction_type_select, 'percentage'));
        test('should click on "Apply" button', () => client.waitForExistAndClick(AddProductPage.specific_price_save_button));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the "Quantity" is equal to "2"', () => client.checkTextValue(productPage.product_discounts_table.replace('%R', 1).replace('%D', 1), '2'));
        test('should check that the "Discount" is equal to "5%"', () => client.checkTextValue(productPage.product_discounts_table.replace('%R', 1).replace('%D', 2), '5%'));
        test('should check that the "You Save" is equal to "Up to €0.90"', () => client.checkTextValue(productPage.product_discounts_table.replace('%R', 1).replace('%D', 3), 'Up to €0.90'));
        test('should change quantity to "2" using the keyboard', () => {
          return promise
            .then(() => client.waitAndSetValue(productPage.product_quantity_input, '2', 2000))
            .then(() => client.pause(1000))
            .then(() => client.waitAndSetValue(productPage.product_quantity_input, '2', 2000));
        });
        test('should check that the product price is equal to "€8.55"', () => client.checkTextValue(productPage.product_price, '€8.55', 'equal', 4000));
        test('should verify that the discount is equal to "SAVE 5%"', () => client.checkTextValue(CheckoutOrderPage.product_discount_details, 'SAVE 5%'));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Delete" icon from the specific price table', () => client.waitForExistAndClick(AddProductPage.specific_price_delete_icon, 2000));
        test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
        test('should click on "Add a specific price" button', () => client.waitForExistAndClick(AddProductPage.pricing_add_specific_price_button, 2000));
        test('should set the "Date available from" input', () => client.waitAndSetValue(AddProductPage.specific_price_available_from_input, common.getCustomDate(-1), 2000));
        test('should set the "Date to" input', () => client.waitAndSetValue(AddProductPage.specific_price_to_input, common.getCustomDate(1)));
        test('should set the "Apply a discount of" input', () => client.waitAndSetValue(AddProductPage.specific_price_discount_input, '10'));
        test('should choose the "Percentage" from the specific price type', () => client.waitAndSelectByValue(AddProductPage.specific_price_reduction_type_select, 'percentage'));
        test('should click on "Apply" button', () => client.waitForExistAndClick(AddProductPage.specific_price_save_button));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the product price is equal to "€8.10"', () => client.checkTextValue(productPage.product_price, '€8.10'));
        test('should verify that the discount is equal to "SAVE 10%"', () => client.checkTextValue(CheckoutOrderPage.product_discount_details, 'SAVE 10%'));
        test('should set the "Machine time" date', () => {
          return promise
            .then(() => client.setMachineDate(-2))
            .then(() => client.refresh());
        });
        test('should verify that the discount does not exist', () => client.isNotExisting(CheckoutOrderPage.product_discount_details, 7000));
        test('should go back to the Back Office', () => {
          return promise
            .then(() => client.switchWindow(0))
            .then(() => client.setMachineDate(2));
        });
        test('should click on "Delete" icon from the specific price table', () => client.waitForExistAndClick(AddProductPage.specific_price_delete_icon, 2000));
        test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
        test('should click on "Add a specific price" button', () => client.waitForExistAndClick(AddProductPage.pricing_add_specific_price_button, 2000));
        test('should set the "Customer" input', () => {
          return promise
            .then(() => client.waitAndSetValue(AddProductPage.specific_price_customer_input, 'pub@prestashop.com', 2000))
            .then(() => client.waitForVisibleAndClick(AddProductPage.specific_price_customer_option));
        });
        test('should click on "Leave initial price" checkbox', () => client.scrollWaitForExistAndClick(AddProductPage.specific_price_leave_initial_price_input, 50));
        test('should set the "Product price (tax excl.)" input', () => client.waitAndSetValue(AddProductPage.specific_price_impact_on_price_input, '6.5', 2000));
        test('should set the "Apply a discount of" input', () => client.waitAndSetValue(AddProductPage.specific_price_discount_input, '10'));
        test('should choose the "Percentage" from the specific price type', () => client.waitAndSelectByValue(AddProductPage.specific_price_reduction_type_select, 'percentage'));
        test('should click on "Apply" button', () => client.waitForExistAndClick(AddProductPage.specific_price_save_button));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the product price is equal to "€7.02"', () => client.checkTextValue(productPage.product_price, '€7.02'));
        test('should verify that the discount is equal to "SAVE 10%"', () => client.checkTextValue(CheckoutOrderPage.product_discount_details, 'SAVE 10%'));
        test('should check that the connected "Customer" is equal to "John DOE"', () => client.checkTextValue(AccessPageFO.customer_name, 'John DOE'));
        test('should click on "Sign out" button', () => client.waitForExistAndClick(AccessPageFO.sign_out_button));
        test('should check that the product price is equal to "€9.00"', () => client.checkTextValue(productPage.product_price, '€9.00', 'equal', 2000));
        test('should verify that the discount does not exist', () => client.isNotExisting(CheckoutOrderPage.product_discount_details));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Delete" icon from the specific price table', () => client.waitForExistAndClick(AddProductPage.specific_price_delete_icon, 2000));
        test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
        test('should click on "Add a specific price" button', () => client.waitForExistAndClick(AddProductPage.pricing_add_specific_price_button, 2000));
        test('should click on "Currency" select', () => {
          return promise
            .then(() => client.waitForExistAndClick(AddProductPage.specific_price_for_currency_select, 2000))
            .then(() => client.waitForVisibleAndClick(AddProductPage.specific_price_for_currency_option.replace('%C', 'Euro')));
        });
        test('should set the "Apply a discount of" input', () => client.waitAndSetValue(AddProductPage.specific_price_discount_input, '10'));
        test('should choose the "Percentage" from the specific price type', () => client.waitAndSelectByValue(AddProductPage.specific_price_reduction_type_select, 'percentage'));
        test('should click on "Apply" button', () => client.waitForExistAndClick(AddProductPage.specific_price_save_button));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should click on "Currency" select and choose "USD $" from the dropdown list', () => {
          return promise
            .then(() => client.waitForExistAndClick(AccessPageFO.currency_select))
            .then(() => client.waitForVisibleAndClick(AccessPageFO.curreny_option.replace('%S', 'US Dollar')));
        });
        test('should check that the product price is equal to "$9.00"', () => client.checkTextValue(productPage.product_price, '$9.00'));
        test('should verify that the discount does not exist', () => client.isNotExisting(CheckoutOrderPage.product_discount_details));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Delete" icon from the specific price table', () => client.waitForExistAndClick(AddProductPage.specific_price_delete_icon, 2000));
        test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
        test('should click on "Add a specific price" button', () => client.waitForExistAndClick(AddProductPage.pricing_add_specific_price_button, 2000));
        test('should click on "Country" select and choose "France" from the dropdown list', () => {
          return promise
            .then(() => client.waitForExistAndClick(AddProductPage.specific_price_for_country_select))
            .then(() => client.waitAndSetValue(AddProductPage.specific_price_for_country_search_input, "France"))
            .then(() => client.waitForVisibleAndClick(AddProductPage.specific_price_for_country_option.replace('%C', 'France')));
        });
        test('should set the "Apply a discount of" input', () => client.waitAndSetValue(AddProductPage.specific_price_discount_input, '5'));
        test('should choose the "Percentage" from the specific price type', () => client.waitAndSelectByValue(AddProductPage.specific_price_reduction_type_select, 'percentage'));
        test('should click on "Apply" button', () => client.waitForExistAndClick(AddProductPage.specific_price_save_button));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should set the shop language to "English"', () => client.changeLanguage());
        test('should click on "Currency" select and choose "EUR €" from the dropdown list', () => {
          return promise
            .then(() => client.waitForExistAndClick(AccessPageFO.currency_select))
            .then(() => client.waitForVisibleAndClick(AccessPageFO.curreny_option.replace('%S', 'Euro')));
        });
        test('should check that the product price is equal to "€8.55"', () => client.checkTextValue(productPage.product_price, '€8.55', 'equal', 2000));
        test('should verify that the discount is equal to "SAVE 5%"', () => client.checkTextValue(CheckoutOrderPage.product_discount_details, 'SAVE 5%'));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Delete" icon from the specific price table', () => client.waitForExistAndClick(AddProductPage.specific_price_delete_icon, 2000));
        test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
        test('should click on "Add a specific price" button', () => client.waitForExistAndClick(AddProductPage.pricing_add_specific_price_button, 2000));
        test('should click on "Group" select and choose "Client" from the dropdown list', () => {
          return promise
            .then(() => client.waitForExistAndClick(AddProductPage.specific_price_for_group_select))
            .then(() => client.waitForVisibleAndClick(AddProductPage.specific_price_for_group_option.replace('%C', 'Customer')));
        });
        test('should set the "Apply a discount of" input', () => client.waitAndSetValue(AddProductPage.specific_price_discount_input, '5'));
        test('should choose the "Percentage" from the specific price type', () => client.waitAndSelectByValue(AddProductPage.specific_price_reduction_type_select, 'percentage'));
        test('should click on "Apply" button', () => client.waitForExistAndClick(AddProductPage.specific_price_save_button));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the product price is equal to "€9.00"', () => client.checkTextValue(productPage.product_price, '€9.00'));
        test('should verify that the discount does not exist', () => client.isNotExisting(CheckoutOrderPage.product_discount_details));
        test('should login successfully in the Front Office', () => client.signInFO(AccessPageFO));
        test('should set the shop language to "English"', () => client.changeLanguage());
        test('should search for the product', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, 'TG' + date_time));
        test('should go to the product page', () => client.waitForExistAndClick(SearchProductPage.product_result_name));
        test('should check that the product price is equal to "€8.55"', () => client.checkTextValue(productPage.product_price, '€8.55', 'equal', 2000));
        test('should verify that the discount is equal to "SAVE 5%"', () => client.checkTextValue(CheckoutOrderPage.product_discount_details, 'SAVE 5%'));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Delete" icon from the specific price table', () => client.waitForExistAndClick(AddProductPage.specific_price_delete_icon, 2000));
        test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 3000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      }, 'common_client');
      scenario('Fill "SEO" form', client => {
        test('should click on "SEO" tab', () => client.scrollWaitForExistAndClick(AddProductPage.product_SEO_tab));
        test('should set the "Meta title"', () => client.waitAndSetValue(AddProductPage.SEO_meta_title, 'super tshirt gray'));
        test('should set the "Meta description"', () => client.waitAndSetValue(AddProductPage.SEO_meta_description, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'));
        test('should set the "Friendly URL"', () => client.waitAndSetValue(AddProductPage.SEO_friendly_url, 'super-tshirt-gray'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      }, 'common_client');
      scenario('Fill "Options" form', client => {
        test('should click on "Options"', () => client.scrollWaitForExistAndClick(AddProductPage.product_options_tab));
        test('should click on "Web only (not sold in your retail store)" checkbox', () => client.waitForExistAndClick(AddProductPage.options_online_only));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForVisibleAndClick(AddProductPage.close_validation_button, 3000));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the product online only flag does not exist', () => client.isNotExisting(productPage.product_online_only_flag, 2000));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Web only (not sold in your retail store)" checkbox', () => client.waitForExistAndClick(AddProductPage.options_online_only, 2000));
        test('should click on "Available for order" checkbox', () => client.waitForExistAndClick(AddProductPage.options_available_for_order_checkbox));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the product online only flag does exist', () => client.isExisting(productPage.product_online_only_flag, 2000));
        test('should check that the product price well displayed', () => client.isExisting(productPage.product_price));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Show price" checkbox', () => client.waitForExistAndClick(AddProductPage.options_show_price_checkbox, 2000));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should check that the product price does not exist', () => client.isNotExisting(productPage.product_price));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Show price" checkbox', () => client.waitForExistAndClick(AddProductPage.options_show_price_checkbox, 2000));
        test('should click on "Available for order" checkbox', () => client.waitForExistAndClick(AddProductPage.options_available_for_order_checkbox));
        test('should choose the "Catalog only" from the visibility list', () => client.waitAndSelectByValue(AddProductPage.options_visibility, 'catalog'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should go to the "Home" page', () => client.waitForExistAndClick(AccessPageFO.logo_home_page));
        test('should click on "SEE ALL PRODUCTS" link', () => client.scrollWaitForExistAndClick(productPage.see_all_products));
        test('should go to next page', () => {
          return promise
            .then(() => client.isVisible(productPage.pagination_next))
            .then(() => client.clickNextOrPrevious(productPage.pagination_next));
        });
        test('should check that the product is well displayed', () => client.isExisting(productPage.product_image.replace('%S', 'tg' + date_time)));
        test('should go to the "Home" page', () => client.waitForExistAndClick(AccessPageFO.logo_home_page));
        test('should search for the product', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, 'TG' + date_time));
        test('should check that the product does not exist', () => client.isNotExisting(SearchProductPage.product_result_name));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should choose the "Search" from the visibility list', () => client.waitAndSelectByValue(AddProductPage.options_visibility, 'search'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should go to the "Home" page', () => client.waitForExistAndClick(AccessPageFO.logo_home_page));
        test('should click on "SEE ALL PRODUCTS" link', () => client.scrollWaitForExistAndClick(productPage.see_all_products));
        test('should go to next page', () => {
          return promise
            .then(() => client.isVisible(productPage.pagination_next))
            .then(() => client.clickNextOrPrevious(productPage.pagination_next));
        });
        test('should check that the product does not exist', () => client.isNotExisting(productPage.product_image.replace('%S', 'tshirt-gray')));
        test('should search for the product', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, 'TG' + date_time));
        test('should check that the product is well displayed', () => client.isExisting(SearchProductPage.product_result_name));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should choose the "Nowhere" from the visibility list', () => client.waitAndSelectByValue(AddProductPage.options_visibility, 'none'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should go to the "Home" page', () => client.waitForExistAndClick(AccessPageFO.logo_home_page));
        test('should click on "SEE ALL PRODUCTS" link', () => client.scrollWaitForExistAndClick(productPage.see_all_products));
        test('should go to next page', () => {
          return promise
            .then(() => client.isVisible(productPage.pagination_next))
            .then(() => client.clickNextOrPrevious(productPage.pagination_next));
        });
        test('should check that the product does not exist', () => client.isNotExisting(productPage.product_image.replace('%S', 'tshirt-gray')));
        test('should search for the product', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, 'TG' + date_time));
        test('should check that the product does not exist', () => client.isNotExisting(SearchProductPage.product_result_name));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should choose the "Everywhere" from the visibility list', () => client.waitAndSelectByValue(AddProductPage.options_visibility, 'both'));
        test('should click on "Display condition on product page" checkbox', () => client.waitForExistAndClick(AddProductPage.options_show_condition_checkbox));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should go to the "Home" page', () => client.waitForExistAndClick(AccessPageFO.logo_home_page));
        test('should search for the product', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, 'TG' + date_time));
        test('should go to the product page', () => client.waitForExistAndClick(SearchProductPage.product_result_name));
        test('should set the shop language to "English"', () => client.changeLanguage());
        test('should click on "Product Details" tab', () => client.waitForExistAndClick(productPage.product_tab_list.replace('%I', 2), 5000));
        test('should check that the "Product condition" is equal to "New product"', () => {
          return promise
            .then(() => client.scrollTo(productPage.product_condition))
            .then(() => client.checkTextValue(productPage.product_condition, 'New product', 'equal', 2000));
        });
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should choose the "Used" from the condition list', () => client.waitAndSelectByValue(AddProductPage.options_condition_select, 'used'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should click on "Product Details" tab', () => client.waitForExistAndClick(productPage.product_tab_list.replace('%I', 2), 5000));
        test('should check that the "Product condition" is equal to "Used"', () => {
          return promise
            .then(() => client.scrollTo(productPage.product_condition))
            .then(() => client.checkTextValue(productPage.product_condition, 'Used', 'equal', 2000));
        });
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Display condition on product page" checkbox', () => client.waitForExistAndClick(AddProductPage.options_show_condition_checkbox));
        test('should set the "ISBN" input', () => client.waitAndSetValue(AddProductPage.options_isbn, '123456789'));
        test('should set the "EAN-13" input', () => client.waitAndSetValue(AddProductPage.options_ean13, '1234567891'));
        test('should set the "UPC" input', () => client.waitAndSetValue(AddProductPage.options_upc, '1234567891'));
        test('should click on "ADD A CUSTOMIZAITION FIELD" button', () => client.scrollWaitForExistAndClick(AddProductPage.options_add_customization_field_button, 50));
        test('should set the customization field "Label" input', () => client.waitAndSetValue(AddProductPage.options_first_custom_field_label, 'test'));
        test('should select the customization field "Type" Text', () => client.waitAndSelectByValue(AddProductPage.options_first_custom_field_type, '1'));
        test('should click on "Required" checkbox', () => client.waitForExistAndClick(AddProductPage.options_first_custom_field_require));
        test('should click on "ADD A CUSTOMIZAITION" button', () => client.scrollWaitForExistAndClick(AddProductPage.options_add_customization_field_button, 50));
        test('should set the second customization field "Label" input', () => client.waitAndSetValue(AddProductPage.options_second_custom_field_label, 'test'));
        test('should select the customization field "Type" File', () => client.waitAndSelectByValue(AddProductPage.options_second_custom_field_type, '0'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should click on the "Preview" link', () => client.waitForExistAndClick(AddProductPage.preview_link, 2000));
        test('should set the "Product message" textarea', () => client.waitAndSetValue(productPage.product_customization_message, 'plop'));
        test('should click on "Save customization" button', () => client.waitForExistAndClick(productPage.save_customization_button));
        test('should click on "ADD TO CART" button', () => client.waitForExistAndClick(CheckoutOrderPage.add_to_cart_button));
        test('should click on "Proceed to checkout" modal button', () => client.waitForVisibleAndClick(CheckoutOrderPage.proceed_to_checkout_modal_button));
        test('should click on "Product customization" link', () => client.waitForExistAndClick(CheckoutOrderPage.product_customization_link.replace('%I', 1)));
        test('should check that the "Product customization" label is equal to "test"', () => client.checkTextValue(CheckoutOrderPage.product_customization_modal.replace('%I', 1).replace('%R', 1), 'test', 'equal', 2000));
        test('should check that the "Product customization" value is equal to "plop"', () => client.checkTextValue(CheckoutOrderPage.product_customization_modal.replace('%I', 1).replace('%R', 2), 'plop'));
        test('should close the "Product customization" modal', () => client.waitForVisibleAndClick(CheckoutOrderPage.product_customization_close_modal_button.replace('%I', 1)));
        test('should click on "Product name" link', () => client.waitForExistAndClick(CheckoutOrderPage.product_name_link, 2000));
        test('should set the "Product message" textarea', () => client.waitAndSetValue(productPage.product_customization_message, 'plopplop'));
        test('should upload a file for product customization', () => client.uploadPicture('t_shirt_gris.jpg', productPage.product_customization_file, 'file11'));
        test('should click on "Save customization" button', () => client.waitForExistAndClick(productPage.save_customization_button));
        test('should click on "ADD TO CART" button', () => client.waitForExistAndClick(CheckoutOrderPage.add_to_cart_button));
        test('should click on "Proceed to checkout" modal button', () => client.waitForVisibleAndClick(CheckoutOrderPage.proceed_to_checkout_modal_button));
        test('should click on "Product customization" link', () => client.waitForExistAndClick(CheckoutOrderPage.product_customization_link.replace('%I', 2)));
        test('should check that the "Product customization" label is equal to "test"', () => client.checkTextValue(CheckoutOrderPage.product_customization_modal.replace('%I', 2).replace('%R', 1), 'test', 'equal', 2000));
        test('should check that the "Product customization" image does exist', () => client.isVisible(CheckoutOrderPage.product_customization_modal_image));
        test('should check that the "Product customization" label is equal to "test"', () => client.checkTextValue(CheckoutOrderPage.product_customization_modal.replace('%I', 3).replace('%R', 1), 'test'));
        test('should check that the "Product customization" value is equal to "plop"', () => client.checkTextValue(CheckoutOrderPage.product_customization_modal.replace('%I', 3).replace('%R', 2), 'plopplop'));
        test('should close the "Product customization" modal', () => client.waitForVisibleAndClick(CheckoutOrderPage.product_customization_close_modal_button.replace('%I', 2)));
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "ATTACH A NEW FILE"', () => client.scrollWaitForExistAndClick(AddProductPage.options_add_new_file_button, 50, 2000));
        test('should add a file', () => client.addFile(AddProductPage.options_select_file, 'image_test.jpg'), 50);
        test('should set the file "Title"', () => client.waitAndSetValue(AddProductPage.options_file_name, 'title'));
        test('should set the file "Description" ', () => client.waitAndSetValue(AddProductPage.options_file_description, 'description'));
        test('should add the previous added file', () => client.scrollWaitForExistAndClick(AddProductPage.options_file_add_button, 50));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 5000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
        test('should go to the Front Office', () => client.switchWindow(1));
        test('should click on "Delete" icon of the first item', () => client.waitForExistAndClick(productPage.delete_shopping_cart_item, 2000));
        test('should click on "Delete" icon of the second item', () => client.waitForExistAndClick(productPage.delete_shopping_cart_item, 2000));
        test('should search for the product', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, 'TG' + date_time));
        test('should go to the product page', () => client.waitForExistAndClick(SearchProductPage.product_result_name));
        test('should click on "Attachments" tab', () => client.waitForExistAndClick(productPage.product_tab_list.replace('%I', 3), 2000));
        test('should check that the "Attachment title" is equal to "title"', () => {
          return promise
            .then(() => client.scrollTo(productPage.attachment_title))
            .then(() => client.checkTextValue(productPage.attachment_title, 'title', 'equal', 2000));
        });
        test('should check that the "Attachment description" is equal to "description"', () => {
          return promise
            .then(() => client.scrollTo(productPage.attachment_description))
            .then(() => client.checkTextValue(productPage.attachment_description, 'description', 'equal', 2000));
        });
        test('should click on "Sign out" button', () => client.waitForExistAndClick(AccessPageFO.sign_out_button));
        test('should set the "Product message" textarea', () => client.waitAndSetValue(productPage.product_customization_message, 'plop'));
        test('should click on "Save customization" button', () => client.waitForExistAndClick(productPage.save_customization_button));
        test('should click on "ADD TO CART" button', () => client.waitForExistAndClick(CheckoutOrderPage.add_to_cart_button, 3000));
        test('should click on "Proceed to checkout" modal button', () => client.waitForVisibleAndClick(CheckoutOrderPage.proceed_to_checkout_modal_button));
        test('should set the "Quantity" input', () => client.waitAndSetValue(CheckoutOrderPage.quantity_input.replace('%NUMBER', 1), '20', 2000));
        test('should click on "Proceed to checkout" button', () => client.waitForExistAndClick(CheckoutOrderPage.proceed_to_checkout_button));

        scenario('Create new account', client => {
          test('should set the "First name" input', () => client.waitAndSetValue(accountPage.firstname_input, google.name));
          test('should set the "Last name" input', () => client.waitAndSetValue(accountPage.lastname_input, google.lastname));
          test('should set the "Email" input', () => client.waitAndSetValue(accountPage.new_email_input, google.login));
          test('should set the "Password" input', () => client.waitAndSetValue(accountPage.new_password_input, google.password));
          test('should click on "CONTINUE" button', () => client.waitForExistAndClick(accountPage.new_customer_btn));
        }, 'common_client');
        scenario('Create new address', client => {
          test('should set the "Company" input', () => client.waitAndSetValue(accountPage.company_input, 'Prestashop'));
          test('should set the "Address" input', () => client.waitAndSetValue(accountPage.adr_address, '12 Amsterdam street'));
          test('should set the "Zip/Postal Code" input', () => client.waitAndSetValue(accountPage.adr_postcode, '75009'));
          test('should set the "City" input', () => client.waitAndSetValue(accountPage.adr_city, 'Paris'));
          test('should click on "CONTINUE" button', () => client.scrollWaitForExistAndClick(accountPage.new_address_btn));
        }, 'common_client');
        scenario('Choose "SHIPPING METHOD"', client => {
          test('should click on "CONTINUE" button', () => client.waitForExistAndClick(CheckoutOrderPage.checkout_step3_continue_button));
        }, 'common_client');
        scenario('Choose "PAYMENT" method', client => {
          test('should set the payment type "Payment by bank wire"', () => client.waitForExistAndClick(CheckoutOrderPage.checkout_step4_payment_radio));
          test('should set "the condition to approve"', () => client.waitForExistAndClick(CheckoutOrderPage.condition_check_box));
          test('should click on order with an obligation to pay button', () => client.waitForExistAndClick(CheckoutOrderPage.confirmation_order_button));
        }, 'common_client');
      }, 'product/product');
      scenario('Delete the customization field', client => {
        test('should go back to the Back Office', () => client.switchWindow(0));
        test('should click on "Delete" icon of the first customization field', () => {
          return promise
            .then(() => client.scrollTo(AddProductPage.options_add_customization_field_button))
            .then(() => client.waitForExistAndClick(AddProductPage.delete_customization_field_icon, 2000));
        });
        test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
        test('should click on "Delete" icon of the second customization field', () => client.waitForExistAndClick(AddProductPage.delete_customization_field_icon, 2000));
        test('should click on "Yes" modal button', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 5000));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      }, "common_client");
      scenario('Disable the order of products out of stock', client => {
        test('should go to "Product settings" page', () => client.switchWindow(2));
        test('should switch "Allow ordering of out-of-stock products" to "No"', () => client.scrollWaitForExistAndClick(ProductSettings.allowOrderOutOfStock_button.replace('%I', '0')));
        test('should set "Delivery time of in-stock products" input', () => client.waitAndSetValue(ProductSettings.delivery_time_in_stock_input, ''));
        test('should click on "Save" button', () => {
          return promise
            .then(() => client.isVisible(AddProductPage.symfony_toolbar, 3000))
            .then(() => {
              if (global.isVisible) {
                client.waitForExistAndClick(AddProductPage.symfony_toolbar)
              }
            })
            .then(() => client.scrollWaitForExistAndClick(ProductSettings.save_button.replace('%POS', '3')));
        });
        test('should verify the appearance of the green validation', () => client.checkTextValue(ShopParameters.success_box, "Update successful"));
      }, "common_client");
      scenario('Delete the created "Currency"', client => {
        test('should go to "Currencies" page', () => client.switchWindow(3));
        test('should search for the created currency', () => client.searchByValue(Localization.Currency.iso_code_filter_input, Localization.Currency.search_button, 'USD'));
        test('should click on "Dropdown toggle" button', () => client.waitForExistAndClick(Localization.Currency.dropdown_toggle_button));
        test('should click on "Delete" action', () => client.waitForExistAndClick(Localization.Currency.delete_button));
        test('should accept the currently displayed alert dialog', () => client.alertAccept());
        test('should verify the appearance of the green validation', () => client.checkTextValue(InternationalPage.success_panel, "×\nSuccessful deletion."));
        test('should go back to the Catalog page', () => client.switchWindow(0));
      }, 'common_client');
      scenario('Delete customer', client => {
        test('should go to the "Customers" page', () => client.goToSubtabMenuPage(Menu.Sell.Customers.customers_menu, Menu.Sell.Customers.customers_submenu));
        test('should search for the customer email in the "Customers list"', () => {
          return promise
            .then(() => client.isVisible(Customer.customer_filter_by_email_input))
            .then(() => client.search(Customer.customer_filter_by_email_input, google.login));
        });
        test('should click on "Delete" button', () => {
          return promise
            .then(() => client.waitForExistAndClick(Customer.dropdown_toggle))
            .then(() => client.waitForExistAndClick(Customer.delete_button, 1000));
        });
        test('should accept the currently displayed alert dialog', () => client.alertAccept());
        test('should choose the option that allows customers to register again with the same email address', () => client.waitForExistAndClick(Customer.delete_first_option));
        test('should click on "Delete" button', () => client.waitForExistAndClick(Customer.delete_confirmation_button));
        test('should verify the appearance of the green validation', () => client.checkTextValue(BO.success_panel, '×\nSuccessful deletion.'));
      }, 'customer');
      scenario('Check the email reception', client => {
        test('should open Gmail on a new window', () => {
          return promise
            .then(() => client.openURLOnNewWindow(google.url))
            .then(() => client.waitForExistAndClick(Google.gmail_link))
            .then(() => client.waitForExistAndClick(Google.signin_button));
        });
        test('should login successfully on "Google" account', () => {
          return promise
            .then(() => client.waitAndSetValue(Google.username_input, google.login))
            .then(() => client.waitForExistAndClick(Google.identifier_next_button))
            .then(() => client.waitAndSetValue(Google.password_input, google.password, 3000))
            .then(() => client.waitForExistAndClick(Google.password_next_button));
        });
        test('should check the email reception', () => {
          return promise
            .then(() => client.waitForExistAndClick(Google.more_button))
            .then(() => client.waitForExistAndClick(Google.spam_button))
            .then(() => client.waitForExist(Google.mail_subject.replace("%subject", 'Product out of stock'), 200000));
        });
      }, "common_client");
    }, 'common_client');*/
}, 'product/product', false);