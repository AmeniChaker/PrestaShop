const {AddProductPage} = require('../../../selectors/BO/add_product_page.js');
const {AccessPageBO} = require('../../../selectors/BO/access_page.js');
const {ProductSettings} = require('../../../selectors/BO/shopParameters/product_settings.js');
const {Menu} = require('../../../selectors/BO/menu.js');
const {AccessPageFO} = require('../../../selectors/FO/access_page.js');
const {SearchProductPage} = require('../../../selectors/FO/search_product_page.js');
const {productPage} = require('../../../selectors/FO/product_page.js');
const {CheckoutOrderPage} = require('../../../selectors/FO/order_page.js');
const common_scenarios = require('../../common_scenarios/product');
const commonManufacturers = require('../../common_scenarios/suppliers');
let promise = Promise.resolve();
let supplierData = {
  name: 'First Supplier',
  description: 'description',
  address: 'address',
  city: 'city',
  picture: 'image_test.jpg',
  metaTitle: 'meta title',
  metaDescription: 'meta description',
};

let productData = {
  name: 'PO',
  quantity: "10",
  price: '5',
  picture_1: '1.png',
  picture_2: 'image_test.jpg',
  reference: 'product_options',
}
scenario('Create product with options in the Back Office', client => {
  scenario('Login in the Back Office', client => {
    test('should open browser', () => client.open());
    test('should log in successfully in BO', () => client.signInBO(AccessPageBO));
  }, 'product/product');

  scenario('Get the pagination Products per page value', client => {
    test('should go to "Shop Parameters - Product Settings" page', () => {
      return promise
        .then(() => client.waitForExistAndClick(Menu.Sell.Catalog.catalog_menu))
        .then(() => client.pause(1000))
        .then(() => client.goToSubtabMenuPage(Menu.Configure.ShopParameters.shop_parameters_menu, Menu.Configure.ShopParameters.product_settings_submenu));
    });
    test('should get the pagination Products per page value', () => client.getAttributeInVar(ProductSettings.Pagination.products_per_page_input, "value", "pagination"));
  }, 'product/product');

  commonManufacturers.createSupplier(supplierData);

  scenario('Create product with options in the Back Office', client => {
    test('should go to "Catalog" page', () => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.products_submenu));
    test('should click on "NEW PRODUCT" button', () => client.waitForExistAndClick(AddProductPage.new_product_button));
    test('should set the "product name" input', () => client.waitAndSetValue(AddProductPage.product_name_input, productData.name + date_time));
    test('should upload the first product picture', () => client.uploadPicture(productData.picture_1, AddProductPage.picture));
    test('should set the "Quantity" of product', () => client.waitAndSetValue(AddProductPage.quantity_shortcut_input, productData.quantity));
    test('should click on "SAVE" button', () => {
      return promise
        .then(() => client.waitForSymfonyToolbar(AddProductPage, 2000))
        .then(() => client.waitForExistAndClick(AddProductPage.product_online_toggle))
        .then(() => client.waitForExistAndClick(AddProductPage.save_product_button))
    });
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
    scenario('Fill "Options" form', client => {
      test('should click on "Options" tab', () => client.scrollWaitForExistAndClick(AddProductPage.product_options_tab));
      test('should verify that the default visibility is "Everywhere"', () => client.isSelected(AddProductPage.options_visibility_option.replace('%O', 'both')));
      test('should click on "Preview" button', () => {
        return promise
          .then(() => client.waitForSymfonyToolbar(AddProductPage, 2000))
          .then(() => client.waitForExistAndClick(AddProductPage.preview_buttons));
      });
      test('should switch to the Front Office', () => client.switchWindow(1));
      common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
      test('should go to the "Home" page', () => client.waitForExistAndClick(AccessPageFO.logo_home_page));
      test('should click on "SEE ALL PRODUCTS" link', () => client.scrollWaitForExistAndClick(productPage.see_all_products));
      test('should get the number for pagination', () => {
        return promise
          .then(() => client.getTextInVar(productPage.products_number, 'productNumber'))
          .then(() => global.pagination = Number(Math.ceil(Number(global.tab['productNumber'].split(' ')[2]) / Number(global.tab['pagination']))))
      });
      test('should check that the product is well displayed', () => {
        return promise
          .then(() => client.clickPageNext(productPage.pagination_number_link.replace('%NUM', Math.ceil(Number(global.pagination))), 1000))
          .then(() => client.isExisting(productPage.product_image.replace('%S', (productData.name).toLowerCase() + date_time), 1000))
      });
      test('should search for the product', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, productData.name + date_time));
      test('should check that the product is well displayed', () => client.isExisting(SearchProductPage.product_result_name));
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should choose the "Search" from the visibility list', () => client.waitAndSelectByValue(AddProductPage.options_visibility, 'search'));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      test('should go to the "Home" page', () => client.waitForExistAndClick(AccessPageFO.logo_home_page));
      test('should click on "SEE ALL PRODUCTS" link', () => client.scrollWaitForExistAndClick(productPage.see_all_products));
      test('should check that the product does not exist', () => client.isNotExisting(productPage.product_image.replace('%S', productData.name + date_time)));
      test('should search for the product', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, productData.name + date_time));
      test('should check that the product is well displayed', () => {
        return promise
          .then(() => client.isExisting(SearchProductPage.product_result_name))
          .then(() => client.waitForExistAndClick(productPage.first_product_all));
      })
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should set the "product name" to "PA' + date_time + '"', () => client.waitAndSetValue(AddProductPage.product_name_input, 'PA' + date_time));
      test('should click on "Basic settings" tab', () => client.scrollWaitForExistAndClick(AddProductPage.basic_settings_tab));
      test('should set the category to "Clothes"', () => {
        return promise
          .then(() => client.scrollWaitForExistAndClick(AddProductPage.category_checkbox.replace('%CATEGORY', 'Clothes')))
          .then(() => client.scrollWaitForExistAndClick(AddProductPage.category_radio_button.replace('%CATEGORY', 'Clothes')));
      });
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
      test('should check that the second name for product is well displayed', () => client.checkTextValue(AccessPageFO.product_name_title, 'PA' + date_time));
      test('should check that the category "Clothes" is well displayed', () => client.isExisting(AccessPageFO.page_category.replace('%CATEGORY', 'Clothes')));
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should click on "Options" tab', () => client.scrollWaitForExistAndClick(AddProductPage.product_options_tab));
      test('should choose the "Catalog only" from the visibility list', () => client.waitAndSelectByValue(AddProductPage.options_visibility, 'catalog'));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      test('should go to the "Home" page', () => client.waitForExistAndClick(AccessPageFO.logo_home_page));
      test('should click on "SEE ALL PRODUCTS" link', () => client.scrollWaitForExistAndClick(productPage.see_all_products));
      test('should check that the product is well displayed', () => {
        return promise
          .then(() => client.clickPageNext(productPage.pagination_number_link.replace('%NUM', Math.ceil(Number(global.pagination))), 1000))
          .then(() => client.isExisting(productPage.product_image.replace('%S', (productData.name).toLowerCase() + date_time), 1000))
      });
      test('should go to the "Home" page', () => client.waitForExistAndClick(AccessPageFO.logo_home_page));
      test('should search for the product', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, productData.name + date_time));
      test('should check that the product does not exist', () => client.isNotExisting(SearchProductPage.product_result_name));
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should choose the "Nowhere" from the visibility list', () => client.waitAndSelectByValue(AddProductPage.options_visibility, 'none'));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      test('should go to the "Home" page', () => client.waitForExistAndClick(AccessPageFO.logo_home_page));
      test('should click on "SEE ALL PRODUCTS" link', () => client.scrollWaitForExistAndClick(productPage.see_all_products));
      test('should check that the product is well displayed', () => {
        return promise
          .then(() => client.clickPageNext(productPage.pagination_number_link.replace('%NUM', Math.ceil(Number(global.pagination))), 1000))
          .then(() => client.isNotExisting(productPage.product_image.replace('%S', 'pa' + date_time), 1000))
      });
      test('should search for the product', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, 'PA' + date_time));
      test('should check that the product does not exist', () => client.isNotExisting(SearchProductPage.product_result_name));
      test('should go back to the Back Office', () => client.closeWindow(0));
      test('should check that the product in FO with "URL"', () => {
        return promise
          .then(() => client.waitForExistAndClick(AddProductPage.preview_buttons))
          .then(() => client.switchWindow(1))
          .then(() => common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name));
      });
      test('should check that the product "PA' + date_time + '" does exist', () => client.checkTextValue(AccessPageFO.product_name_title, 'PA' + date_time));
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should verify that "Available for order" is checked', () => client.checkCheckboxStatus(AddProductPage.options_available_for_order_checkbox, true))
      test('should click on "Available for order" checkbox', () => client.waitForExistAndClick(AddProductPage.options_available_for_order_checkbox));
      test('should verify that "Web only (not sold in your retail store)" is unchecked', () => client.checkCheckboxStatus(AddProductPage.options_online_only, false))
      test('Should check that the "show price" does exist', () => client.isExisting(AddProductPage.options_show_price_checkbox));
      test('should click on "Show price" checkbox', () => client.waitForExistAndClick(AddProductPage.options_show_price_checkbox, 1000));
      test('should verify that "Display condition on product page" is unchecked', () => client.checkCheckboxStatus(AddProductPage.options_show_condition_checkbox, false));
      test('should click on "Display condition on product page" checkbox', () => client.waitForExistAndClick(AddProductPage.options_show_condition_checkbox));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      test('should check that the product price does not exist', () => client.isNotExisting(productPage.product_price));
      test('should check that the "ADD TO CART" button is disabled', () => client.checkAttributeValue(CheckoutOrderPage.add_to_cart_button, 'disabled', '', 'contain'));
      test('should check that the product online only flag does not exist', () => client.isNotExisting(productPage.product_online_only_flag, 1000));
      test('should click on "Product Details" tab', () => client.waitForExistAndClick(productPage.product_tab_list.replace('%I', 1), 1000));
      test('should check that the "Product condition" is equal to "New product"', async () => {
        await client.scrollTo(productPage.product_condition);
        await client.checkTextValue(productPage.product_condition, 'New product', 'equal', 1000);
      });
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should click on "Show price" checkbox', () => client.waitForExistAndClick(AddProductPage.options_show_price_checkbox, 1000));
      test('should click on "Available for order" checkbox', () => client.waitForExistAndClick(AddProductPage.options_available_for_order_checkbox));
      test('should click on "Web only (not sold in your retail store)" checkbox', () => client.waitForExistAndClick(AddProductPage.options_online_only));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
      test('should check that the product online only flag does exist', async () => {
        await client.refresh();
        await client.isExisting(productPage.product_online_only_flag, 2000);
      });
      /**
       * This test is based on the bug described in this ticket
       * http://forge.prestashop.com/browse/BOOM-3364
       **/
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should click on "Web only (not sold in your retail store)" checkbox', () => client.waitForExistAndClick(AddProductPage.options_online_only, 2000));
      test('should set "Tags" with ","', () => client.waitAndSetValue(AddProductPage.tag_input, 'First Tag, Second Tag, '));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      test('should search with "First Tag"', () => client.searchByValue(SearchProductPage.search_input, SearchProductPage.search_button, 'First Tag'));
      test('should check that the product is well displayed', () => client.isExisting(SearchProductPage.product_result_name));
      test('should go back to the Back Office', () => client.closeWindow(0));
      test('should choose the "Used" from the condition list', () => client.waitAndSelectByValue(AddProductPage.options_condition_select, 'used', 1000));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => {
        return promise
          .then(() => client.waitForExistAndClick(AddProductPage.preview_buttons))
          .then(() => client.switchWindow(1))
          .then(() => common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name));
      });
      test('should click on "Product Details" tab', () => client.waitForExistAndClick(productPage.product_tab_list.replace('%I', 1), 1000));
      test('should check that the "Product condition" is equal to "Used"', async () => {
        await client.scrollTo(productPage.product_condition);
        await client.checkTextValue(productPage.product_condition, 'Used', 'equal', 2000);
      });
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should choose the "Refurbished" from the condition list', () => client.waitAndSelectByValue(AddProductPage.options_condition_select, 'refurbished', 1000));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
      test('should click on "Product Details" tab', () => client.waitForExistAndClick(productPage.product_tab_list.replace('%I', 1), 1000));
      test('should check that the "Product condition" is equal to "Refurbished"', async () => {
        await client.scrollTo(productPage.product_condition);
        await client.checkTextValue(productPage.product_condition, 'Refurbished', 'equal', 2000);
      });
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should click on "ADD A CUSTOMIZAITION FIELD" button', () => client.scrollWaitForExistAndClick(AddProductPage.options_add_customization_field_button, 50));
      test('should check that the "Delete" icon does exist', () => client.isExisting(AddProductPage.delete_customization_field_icon));
      test('should check that the "Required" checkbox does exist', () => client.isExisting(AddProductPage.options_first_custom_field_require));
      test('should set the customization field "Label" input', () => client.waitAndSetValue(AddProductPage.options_custom_field_label.replace('%R', 0), 'text not required'));
      test('should select the customization field "Type" Text', () => client.waitAndSelectByValue(AddProductPage.options_custom_field_type.replace('%R', 0), '1'));
      test('should click on "ADD A CUSTOMIZAITION" button', () => client.scrollWaitForExistAndClick(AddProductPage.options_add_customization_field_button, 50));
      test('should set the second customization field "Label" input', () => client.waitAndSetValue(AddProductPage.options_custom_field_label.replace('%R', 1), 'text required'));
      test('should select the customization field "Type" Text', () => client.waitAndSelectByValue(AddProductPage.options_custom_field_type.replace('%R', 1), '1'));
      test('should click on "Required" checkbox', () => client.waitForExistAndClick(AddProductPage.options_custom_field_require.replace('%R', 1)));
      test('should click on "ADD A CUSTOMIZAITION" button', () => client.scrollWaitForExistAndClick(AddProductPage.options_add_customization_field_button, 50));
      test('should set the third customization field "Label" input', () => client.waitAndSetValue(AddProductPage.options_custom_field_label.replace('%R', 2), 'File not required'));
      test('should select the customization field "Type" File', () => client.waitAndSelectByValue(AddProductPage.options_custom_field_type.replace('%R', 2), '0'));
      test('should click on "ADD A CUSTOMIZAITION" button', () => client.scrollWaitForExistAndClick(AddProductPage.options_add_customization_field_button, 50));
      test('should set the fourth customization field "Label" input', () => client.waitAndSetValue(AddProductPage.options_custom_field_label.replace('%R', 3), 'File required'));
      test('should select the customization field "Type" File', () => client.waitAndSelectByValue(AddProductPage.options_custom_field_type.replace('%R', 3), '0'));
      test('should click on "Required" checkbox', () => client.waitForExistAndClick(AddProductPage.options_custom_field_require.replace('%R', 3)));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
      test('should click on "Save customization" button', () => client.waitForExistAndClick(productPage.save_customization_button));
      test('should check that the "Product message" textarea is required', () => client.checkElementValidation(productPage.product_customization_message.replace('%I', 2), 'Veuillez renseigner ce champ.', 'contain'));
      test('should set the "Product message" textarea', () => client.waitAndSetValue(productPage.product_customization_message.replace('%I', 2), 'plop'));
      test('should upload a file for product customization', () => client.uploadPicture('image_test.jpg', productPage.product_customization_file.replace('%I', 2), 'file11'));
      test('should click on "Save customization" button', () => client.waitForExistAndClick(productPage.save_customization_button));
      test('should click on "ADD TO CART" button', () => client.waitForExistAndClick(CheckoutOrderPage.add_to_cart_button));
      test('should click on "Proceed to checkout" modal button', () => client.waitForVisibleAndClick(CheckoutOrderPage.proceed_to_checkout_modal_button));
      test('should click on "Product customization" link', () => client.waitForExistAndClick(CheckoutOrderPage.product_customization_link.replace('%I', 1)));
      test('should check that the "Product customization" label is equal to "text required"', () => client.checkTextValue(CheckoutOrderPage.product_customization_modal.replace('%I', 2).replace('%R', 1), 'text required', 'equal', 2000));
      test('should check that the "Product customization" value is equal to "plop"', () => client.checkTextValue(CheckoutOrderPage.product_customization_modal.replace('%I', 2).replace('%R', 2), 'plop'));
      test('should check that the "Product customization" image does exist', () => client.isVisible(CheckoutOrderPage.product_customization_modal_image));
      test('should close the "Product customization" modal', () => client.waitForVisibleAndClick(CheckoutOrderPage.product_customization_close_modal_button.replace('%I', 1)));
      test('should click on "Product name" link', () => client.waitForExistAndClick(CheckoutOrderPage.product_name_link, 2000));
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should check that the "attach a new file" is displayed', () => client.isExisting(AddProductPage.attached_file_table));
      test('should click on "ATTACH A NEW FILE"', () => client.scrollWaitForExistAndClick(AddProductPage.options_add_new_file_button, 50, 2000));
      test('should add a file', () => client.addFile(AddProductPage.options_select_file, 'image_test.jpg'), 50);
      test('should set the file "Title"', () => client.waitAndSetValue(AddProductPage.options_file_name, 'title'));
      test('should set the file "Description" ', () => client.waitAndSetValue(AddProductPage.options_file_description, 'description'));
      test('should add the previous added file', () => client.scrollWaitForExistAndClick(AddProductPage.options_file_add_button, 50));
      test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button, 5000));
      test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      test('should go to the Front Office', () => client.switchWindow(1));
      test('should click on "Attachments" tab', () => client.waitForExistAndClick(productPage.product_tab_list.replace('%I', 2)));
      test('should check that the "Attachment title" is equal to "title"', async () => {
        await client.scrollTo(productPage.attachment_title);
        await client.checkTextValue(productPage.attachment_title, 'title', 'equal', 2000);
      });
      test('should check that the "Attachment description" is equal to "description"', async () => {
        await client.scrollTo(productPage.attachment_description);
        await client.checkTextValue(productPage.attachment_description, 'description', 'equal');
      });
      test('should go back to the Back Office', () => client.switchWindow(0));
      test('should check that the "Suppliers" table is displayed', () => client.isExisting(AddProductPage.suppliers_table));
      scenario('Add the supplier to the product', client => {
        test('should click the supplier "' + supplierData.name + global.date_time + '" checkbox', () => {
          return promise
            .then(() => client.scrollWaitForExistAndClick(AddProductPage.suppliers_checkbox.replace('%FileName', supplierData.name + global.date_time), 150, 1000))
            .then(() => client.getAttributeInVar(AddProductPage.suppliers_checkbox.replace('%FileName', supplierData.name + global.date_time), 'value', 'supplierValue'));
        });
        test('should check that The supplier is well associated in the product', () => client.checkTextValue(AddProductPage.suppliers_title, supplierData.name + global.date_time));
        test('should click the default supplier "' + supplierData.name + global.date_time + '" radio button', () => client.waitForExistAndClick(AddProductPage.suppliers_radio_button.replace('%FileName', supplierData.name + global.date_time)));
        test('should set the "Supplier reference" input', () => client.waitAndSetValue(AddProductPage.supllier_reference_input.replace('%V', global.tab['supplierValue']), 'Ref. Supplier'));
        test('should set the "Price(tax excl.)" input', () => client.waitAndSetValue(AddProductPage.supllier_price_input.replace('%V', global.tab['supplierValue']), '20'));
        test('should set the "Currency" select to "Euro"', () => client.waitAndSelectByValue(AddProductPage.supllier_curerrency_select.replace('%V', global.tab['supplierValue']), '1'));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
      }, 'product/product');
    }, 'product/product');
  }, 'product/product');
}, 'product/product', false);
