/**
 * This script should be moved to the campaign full when this issues will be fixed
 * https://github.com/PrestaShop/PrestaShop/issues/9826 && https://github.com/PrestaShop/PrestaShop/issues/9775
 **/
const {AddProductPage} = require('../../../selectors/BO/add_product_page');
const {AccessPageBO} = require('../../../selectors/BO/access_page');
const {Menu} = require('../../../selectors/BO/menu.js');
const {productPage} = require('../../../selectors/FO/product_page');
const {CheckoutOrderPage} = require('../../../selectors/FO/order_page');
const combination = require('../../common_scenarios/combination');
const common_scenarios = require('../../common_scenarios/product');
let data = require('./../../../datas/product-data');
const commonAttribute = require('../../common_scenarios/attribute');
var common = require('../../../common.webdriverio');
let promise = Promise.resolve();
global.productVariations = [];
let quantityDecimal = '20,5';
let productData = {
  name: 'prodCombination',
  quantity: "10",
  price: '5',
  picture_1: '1.png',
  picture_2: 'image_test.jpg',
  reference: 'product_combination',
  type: 'combination',
  variations: [{
    available_date: common.getCustomDate(30),
    ref: "variation_1",
    ean13: "1313131313131",
    isbn: "121212121212",
    upc: "012345678901",
    wholesale: "5",
    priceTI: "15",
    weight: "2",
    unity: "10",
    minimal_quantity: "1",
    quantity: "20"
  }]
}
let attributeData = {
  name: 'attribute',
  public_name: 'attribute',
  type: 'radio',
  values: {
    1: {
      value: '10'
    },
    2: {
      value: '20'
    },
    3: {
      value: '30'
    }
  }
};

scenario('Create product with combination in the Back Office', client => {
  test('should open browser', () => client.open());
  test('should log in successfully in BO', () => client.signInBO(AccessPageBO));
  test('should go to "Catalog" page', () => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.products_submenu));
  test('should click on "NEW PRODUCT" button', () => client.waitForExistAndClick(AddProductPage.new_product_button));
  test('should set the "product name" input', () => client.waitAndSetValue(AddProductPage.product_name_input, productData.name + date_time));
  test('should upload the first product picture', () => client.uploadPicture(productData.picture_1, AddProductPage.picture));
  test('should upload the second product picture', () => client.uploadPicture(productData.picture_2, AddProductPage.picture));

  scenario('Fill "Combinations" form', client => {
    test('should check that the "Combinations" exist', () => client.isExisting(AddProductPage.product_combinations.replace('%I', 2), 2000));
    test('should click on "Product with combinations" radio button', () => client.scrollWaitForExistAndClick(AddProductPage.product_combinations.replace('%I', 2), 2000));
    test('should click on "Combinations" tab', () => client.scrollWaitForExistAndClick(AddProductPage.product_combinations_tab, 50));
    test('should choose the "Size : S"', () => {
      return promise
        .then(() => client.waitAndSetValue(AddProductPage.variations_input, "Size : S"))
        .then(() => client.waitForExistAndClick(AddProductPage.variations_select))
    });
    test('should check that the attribute value is well checked in the right menu', () => client.checkCheckboxStatus(AddProductPage.combination_size_input.replace('%ID', 1), true));
    test('should deselect the attribute "Size : S"', () => client.waitForExistAndClick(AddProductPage.close_combination));
    test('should verify if the "Size S" is unchecked in the right menu', () => client.checkCheckboxStatus(AddProductPage.combination_size_input.replace('%ID', 1), false));
    test('should choose the "Size : All"', () => {
      return promise
        .then(() => client.waitAndSetValue(AddProductPage.variations_input, "Size : All"))
        .then(() => client.waitForExistAndClick(AddProductPage.variations_select))
    });
    /**
     * This test is based on the bug described in this ticket
     * http://forge.prestashop.com/browse/BOOM-5849
     **/
    test('should check that the all values of attribute "Size" is well checked in the right menu', () => {
      return promise
        .then(() => client.checkCheckboxStatus(AddProductPage.combination_size_input.replace('%ID', 1), true))
        .then(() => client.checkCheckboxStatus(AddProductPage.combination_size_input.replace('%ID', 2), true))
        .then(() => client.checkCheckboxStatus(AddProductPage.combination_size_input.replace('%ID', 3), true))
        .then(() => client.checkCheckboxStatus(AddProductPage.combination_size_input.replace('%ID', 4), true));
    });
    test('should deselect the attribute "Size : All"', () => client.waitForExistAndClick(AddProductPage.close_combination));
    test('should choose attribute size "S" and color "Green" in the right menu', () => client.createCombination(AddProductPage.combination_size_s, AddProductPage.combination_color_green));
    test('should choose attribute size "M" and color "Beige" in the right menu', () => client.createCombination(AddProductPage.combination_size_m, AddProductPage.combination_color_beige));
    test('should check that attributes in the bar', () => {
      return promise
        .then(() => client.waitForExist(AddProductPage.combination_attribute_span.replace('%Att', "Size : S")))
        .then(() => client.waitForExist(AddProductPage.combination_attribute_span.replace('%Att', "Size : M")))
        .then(() => client.waitForExist(AddProductPage.combination_attribute_span.replace('%Att', "Color : Beige")))
        .then(() => client.waitForExist(AddProductPage.combination_attribute_span.replace('%Att', "Color : Green")));
    });
    test('should click on "Generate" button', () => client.scrollWaitForExistAndClick(AddProductPage.variations_generate));
    /**
     * This test is based on the bug described in this ticket
     * http://forge.prestashop.com/browse/BOOM-4202
     **/
    test('should check the appearance of the generated combinations table ', () => client.waitForExist(AddProductPage.combination_table));
    test('should check the appearance of the combination name', () => client.waitForExist(AddProductPage.combination_name));
    test('should check the appearance of the combination impact on price', () => client.waitForExist(AddProductPage.combination_price_input));
    test('should check the appearance of the combination final price', () => client.waitForExist(AddProductPage.combination_final_price));
    test('should check the appearance of the combination quantity', () => client.waitForExist(AddProductPage.combination_quantity_input));
    /**** END ****/
    test('should verify the appearance of the green validation', () => client.checkTextValue(AddProductPage.validation_msg, 'Settings updated.'));
    test('should click on "SAVE" button', () => {
      return promise
        .then(() => client.pause(3000))
        .then(() => client.waitForSymfonyToolbar(AddProductPage, 2000))
        .then(() => client.waitForExistAndClick(AddProductPage.product_online_toggle))
        .then(() => client.waitForExistAndClick(AddProductPage.save_product_button))
        .then(() => client.waitForExistAndClick(AddProductPage.close_validation_button));
    })
    test('should click on "Preview" button', () => {
      return promise
        .then(() => client.waitForSymfonyToolbar(AddProductPage, 2000))
        .then(() => client.waitForExistAndClick(AddProductPage.preview_buttons));
    });
    test('should switch to the Front Office', () => client.switchWindow(1));
    common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
    test('should set the product size to "S"', () => client.waitAndSelectByAttribute(productPage.product_size, 'title', "S", 1000));
    test('should check that the product color is equal to "Green"', () => client.checkTextValue(productPage.product_color, 'Green', 'contain'));
    test('should set the product size to "M"', () => client.waitAndSelectByAttribute(productPage.product_size, 'title', 'M', 1000));
    test('should check that the product color is equal to "Beige"', () => client.checkTextValue(productPage.product_color, 'Beige', 'contain'));
    test('should go to the Back Office', () => client.closeWindow(0));
    /**
     * This test is based on the bug described in this ticket
     * http://forge.prestashop.com/browse/BOOM-3704
     **/
    test('should Verify if the default "impact on price" is equal to 0', () => {
      return promise
        .then(() => client.windowSize(1680, 1024))
        .then(() => client.showElement("td.attribute-price", 0))
        .then(() => client.getCombinationData(1))
        .then(() => client.checkAttributeValue(AddProductPage.combination_impact_price_input.replace('%NUMBER', global.combinationId), 'value', '0.000000'));
    });
    test('should set a positive "Impcat on price" input to "20" for first combination', () => client.waitAndSetValue(AddProductPage.combination_impact_price_input.replace('%NUMBER', global.combinationId), 20));
    test('should set a negative "Impcat on price" input to "-20" for first combination', () => client.waitAndSetValue(AddProductPage.combination_impact_price_input.replace('%NUMBER', global.combinationId), -20));
    test('should set a decimal "Impcat on price" input with "." for first combination', () => client.waitAndSetValue(AddProductPage.combination_impact_price_input.replace('%NUMBER', global.combinationId), 2.5));
    test('should set a decimal "Impcat on price" input with "," for first combination', () => client.waitAndSetValue(AddProductPage.combination_impact_price_input.replace('%NUMBER', global.combinationId), '2,5'));
    test('should click on "Basic settings" tab', () => client.scrollWaitForExistAndClick(AddProductPage.basic_settings_tab, 50));
    test('should set the "Tax exclude" price', () => {
      return promise
        .then(() => client.scrollTo(AddProductPage.priceTE_shortcut, 50))
        .then(() => client.waitAndSetValue(AddProductPage.priceTE_shortcut, data.common.priceTE))
        .then(() => client.getAttributeInVar(AddProductPage.priceTTC_shortcut, 'value', 'priceTI'));
    });
    test('should click on "Combinations" tab', () => client.scrollWaitForExistAndClick(AddProductPage.product_combinations_tab, 50));
    test('should check that the final price is equal to "' + Number(Number(data.common.priceTE) + Number(2.5)) + ' €"', () => {
        return promise
          .then(() => client.showElement("td.attribute-finalprice", 0))
          .then(() => client.checkTextValue(AddProductPage.combination_final_price_span.replace('%NUMBER', global.combinationId), Number(data.common.priceTE) + 2.5))
          .then(() => client.getCombinationData(2));
      });
    /**** END ****/
    /**
     * This test is based on the bug described in this ticket
     * http://forge.prestashop.com/browse/BOOM-3825
     **/
    test('should set the "Impact on price" to "25"', () => client.waitAndSetValue(AddProductPage.combination_impact_price_input.replace('%NUMBER', global.combinationId), '25'));
    test('should check that the final price is equal to "35 €"', () => {
      return promise
        .then(() => client.waitForExistAndClick(AddProductPage.combination_final_price_span.replace('%NUMBER', global.combinationId), 2000))
        .then(() => client.checkTextValue(AddProductPage.combination_final_price_span.replace('%NUMBER', global.combinationId), "35.000000", 'equal', 3000))
    });
    test('should edit the first combination and check that the final price is equal to "' + Number(Number(data.common.priceTE) + 25) + ' €"', () => {
      return promise
        .then(() => client.goToEditCombination())
        .then(() => client.checkAttributeValue(AddProductPage.combination_final_retail_price.replace('%NUMBER', global.combinationId), 'data-price', Number(data.common.priceTE) + 25, 'contain'))
        .then(() => client.getAttributeInVar(AddProductPage.combination_priceTI.replace('%NUMBER', global.combinationId), "value", 'impact_price_TI'));
    });
    test('should go back to combination list', () => client.backToProduct());
    test('should click on "Preview" button', () => client.waitForExistAndClick(AddProductPage.preview_buttons));
    test('should switch to the Front Office', () => client.switchWindow(1));
    common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
    test('should check that the "Price tax included"', () => client.checkTextValue(CheckoutOrderPage.product_current_price, Number(global.tab['priceTI']) + Number(global.tab['impact_price_TI']), 'contain'));
    test('should go to the Back Office', () => client.closeWindow(0));
    test('should click on "Edit" first combination', () => {
      return promise
        .then(() => client.getCombinationData(1))
        .then(() => client.goToEditCombination());
    });
    test('should Verify if the default "quantity" is equal to 0', () => client.checkAttributeValue(AddProductPage.combination_quantity.replace('%NUMBER', global.combinationId), 'value', '0'));
    test('should set a positive "quantity" input for first combination', () => client.waitAndSetValue(AddProductPage.combination_quantity.replace('%NUMBER', global.combinationId), productData.variations[0].quantity));
    test('should set a negative "quantity" input for first combination', () => client.waitAndSetValue(AddProductPage.combination_quantity.replace('%NUMBER', global.combinationId), productData.variations[0].quantity * (-1)));
    test('should set a "quantity" input with "," for first combination', () => client.waitAndSetValue(AddProductPage.combination_quantity.replace('%NUMBER', global.combinationId), quantityDecimal));
    test('should go back to combination list', () => client.backToProduct());
    test('should click on "SAVE" button', () => {
      return promise
        .then(() => client.pause(1000))
        .then(() => client.windowSize(1280, 1024))
        .then(() => client.waitForExistAndClick(AddProductPage.save_product_button))
        .then(() => client.waitForExistAndClick(AddProductPage.close_validation_button))
        .then(() => client.refresh());
    });
    test('should check that the "Quantity" is equal to "' + quantityDecimal.split(',')[0] + '"', () => client.checkAttributeValue(AddProductPage.combination_attribute_quantity.replace('%NUMBER', global.combinationId), 'value', quantityDecimal.split(',')[0]));
    /**
     * This test is based on the bug described in this ticket
     * http://forge.prestashop.com/browse/BOOM-4827
     **/
    test('should check that the first combination is the default one', () => client.isSelected(AddProductPage.combination_default_button.replace('%NUMBER', combinationId)));
    test('should click on "Edit" second combination', () => {
      return promise
        .then(() => client.getCombinationData(2, 100))
        .then(() => client.goToEditCombination());
    });
    test('should click on "Set as default combination" button', () => client.scrollWaitForExistAndClick(AddProductPage.default_combination.replace('%NUMBER', combinationId)));
    test('should go back to combination list', () => client.backToProduct());
    test('should check that the second combination is the default one', () => client.isSelected(AddProductPage.combination_default_button.replace('%NUMBER', combinationId)));
    test('should change the second combination is the default  with radio button', () => client.waitForExistAndClick(AddProductPage.combination_default_button.replace('%NUMBER', combinationId)));
    test('should get the combination name', () => {
      return promise
        .then(() => client.getTextInVar(AddProductPage.combination_name.replace('%NUMBER', combinationId), 'combination_name'))
        .then(() => client.getAttributeInVar(AddProductPage.combination_color_green, 'for', 'attributeColor'));
    })
    test('should click on "Preview" button', () => {
      return promise
        .then(() => client.waitForSymfonyToolbar(AddProductPage, 2000))
        .then(() => client.waitForExistAndClick(AddProductPage.preview_buttons));
    });
    test('should switch to the Front Office', () => client.switchWindow(1));
    common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
    test('should verify that the product color for default combination is checked', () => client.checkCheckboxStatus(productPage.product_color_input.replace('%V', global.tab['attributeColor'].split('-')[1]), true))
    test('should check that size for default combination is well selected', () => client.isSelected(productPage.product_size_option.replace('%T', 'M')));
    test('should go to the Back Office', () => client.closeWindow(0));
    test('should get the first combination ID', () => client.getCombinationData(1));
    test('should click on the "delete" icon', () => client.waitForExistAndClick(AddProductPage.combination_delete.replace('%NUMBER', global.combinationId)));
    test('should verify the appearance of the warning modal', () => client.checkTextValue(AddProductPage.confirmation_modal_content, 'Are you sure to delete this?', 'equal', 3000));
    test('should click on "Yes" button from the modal', () => client.waitForExistAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
    test('should verify the appearance of the green validation', () => client.checkTextValue(AddProductPage.validation_msg, 'Successful deletion'));
    test('should check that the first combination is well deleted', () => client.waitForExist(AddProductPage.combination_name.replace('%NUMBER', global.combinationId)));
    test('should click on "Preview" button', () => {
      return promise
        .then(() => client.waitForSymfonyToolbar(AddProductPage, 2000))
        .then(() => client.waitForExistAndClick(AddProductPage.preview_buttons));
    });
    test('should switch to the Front Office', () => client.switchWindow(1));
    common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
    test('should set the product size to "S"', () => client.waitAndSelectByAttribute(productPage.product_size, 'title', "S", 1000));
    test('should click on "Size" select', () => client.waitForExistAndClick(productPage.product_size));
    test('should verify that the combination does not exist in FO', () => {
      return promise
        .then(() => client.waitAndSelectByAttribute(productPage.product_size, 'title', "S", 1000))
        .then(() => client.checkTextValue(productPage.product_color, 'Green', 'notequal'));
    });
  }, 'product/create_combinations');

  scenario('Edit the first and second combination in the Back Office', client => {
    test('should go to the Back Office', () => client.closeWindow(0));
    test('should get the first combination ID', () => client.getCombinationData(1));
    test('should click on "Edit" for first combination', () => {
      return promise
        .then(() => client.getCombinationData(1))
        .then(() => client.goToEditCombination());
    });
    test('should set the "Quantity" input', () => client.waitAndSetValue(AddProductPage.combination_quantity.replace('%NUMBER', global.combinationId), productData.variations[0].quantity));
    test('should set the "Availability date"', () => client.waitAndSetValue(AddProductPage.combination_available_date.replace('%NUMBER', global.combinationId), productData.variations[0].available_date));
    test('should set the "Min. quantity for sale" input', () => client.waitAndSetValue(AddProductPage.combination_min_quantity.replace('%NUMBER', global.combinationId), productData.variations[0].minimal_quantity));
    test('should set the "Reference" input', () => client.waitAndSetValue(AddProductPage.combination_reference.replace('%NUMBER', global.combinationId), productData.variations[0].ref));
    test('should set the "Low stock level" input', () => client.waitAndSetValue(AddProductPage.combination_low_stock.replace('%NUMBER', combinationId), productData.variations[0].minimal_quantity));
    test('should click on "Send me an email when the quantity is below or equals this level" button', () => client.waitForExistAndClick(AddProductPage.combination_email_checkbox.replace('%NUMBER', combinationId)));
    test('should check that default "Price and impact" is equal to "0"', () => {
      return promise
        .then(() => client.checkAttributeValue(AddProductPage.combination_whole_sale.replace('%NUMBER', combinationId), 'value', "0.000000"))
        .then(() => client.checkAttributeValue(AddProductPage.combination_priceTI.replace('%NUMBER', combinationId), 'value', "0"))
        .then(() => client.checkAttributeValue(AddProductPage.combination_attribute_unity.replace('%NUMBER', combinationId), 'value', "0.000000"))
        .then(() => client.checkAttributeValue(AddProductPage.combination_attribute_weight.replace('%NUMBER', combinationId), 'value', "0"))
    });
    test('should set a negative value for "Cost price" input', () => {
      return promise
        .then(() => client.waitAndSetValue(AddProductPage.combination_whole_sale.replace('%NUMBER', combinationId), "-20"))
        .then(() => client.waitForExistAndClick(AddProductPage.save_product_button))
        .then(() => client.checkTextValue(AccessPageBO.success_alert, 'Unable to update settings.'));
    });
    test('should set a negative value for "Price and impact" input', () => {
      return promise
        .then(() => client.waitAndSetValue(AddProductPage.combination_priceTI.replace('%NUMBER', combinationId), "-20"))
        .then(() => client.waitAndSetValue(AddProductPage.combination_attribute_unity.replace('%NUMBER', combinationId), "-10"))
        .then(() => client.waitAndSetValue(AddProductPage.combination_attribute_weight.replace('%NUMBER', combinationId), "-10"));
    });
    test('should set a decimal value for "Price and impact" input', () => {
      return promise
        .then(() => client.waitAndSetValue(AddProductPage.combination_whole_sale.replace('%NUMBER', combinationId), "10.5"))
        .then(() => client.waitAndSetValue(AddProductPage.combination_priceTI.replace('%NUMBER', combinationId), "20.5"))
        .then(() => client.waitAndSetValue(AddProductPage.combination_attribute_unity.replace('%NUMBER', combinationId), "10.5"))
        .then(() => client.waitAndSetValue(AddProductPage.combination_attribute_weight.replace('%NUMBER', combinationId), "10.5"));
    });
    test('should set the "EAN-13" and "UPC barcode" with alphabetical values', () => {
      return promise
        .then(() => client.waitAndSetValue(AddProductPage.combination_attribute_ean13.replace('%NUMBER', global.combinationId), 'ean-13'))
        .then(() => client.waitAndSetValue(AddProductPage.combination_attribute_upc.replace('%NUMBER', global.combinationId), 'upc'))
        .then(() => client.waitForExistAndClick(AddProductPage.save_product_button))
        .then(() => client.checkTextValue(AddProductPage.combination_valid.replace('%NUMBER', global.combinationId).replace('%V', 1), 'This value is not valid.'))
        .then(() => client.checkTextValue(AddProductPage.combination_valid.replace('%NUMBER', global.combinationId).replace('%V', 2), 'This value is not valid.'));
    });
    test('should set a "Specific references" input', () => {
      return promise
        .then(() => client.waitAndSetValue(AddProductPage.combination_attribute_isbn.replace('%NUMBER', global.combinationId), productData.variations[0].isbn))
        .then(() => client.waitAndSetValue(AddProductPage.combination_attribute_ean13.replace('%NUMBER', global.combinationId), productData.variations[0].ean13))
        .then(() => client.waitAndSetValue(AddProductPage.combination_attribute_upc.replace('%NUMBER', global.combinationId), productData.variations[0].upc));
    });
    test('should click on "Preview" button', () => {
      return promise
        .then(() => client.waitForSymfonyToolbar(AddProductPage, 2000))
        .then(() => client.waitForExistAndClick(AddProductPage.preview_buttons));
    });
    test('should switch to the Front Office', () => client.switchWindow(1));
    common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
    test('should check that the "Ean13" reference does exist', () => client.isExisting(productPage.spacific_references.replace('%F', 'ean13')));
    test('should check that the "Ean13" value does exist', () => client.isExisting(productPage.spacific_references.replace('%F', productData.variations[0].ean13)));
    test('should check that the "Isbn" reference does exist', () => client.isExisting(productPage.spacific_references.replace('%F', 'isbn')));
    test('should check that the "Isbn" value does exist', () => client.isExisting(productPage.spacific_references.replace('%F', productData.variations[0].isbn)));
    test('should check that the "Upc" reference does exist', () => client.isExisting(productPage.spacific_references.replace('%F', 'upc')));
    test('should check that the "Upc" value does exist', () => client.isExisting(productPage.spacific_references.replace('%F', productData.variations[0].upc)));
    test('should go to the Back Office', () => client.closeWindow(0));
    test('should choose the second image', () => {
      return promise
        .then(() => client.scrollWaitForExistAndClick(AddProductPage.image_combination_src.replace('%ID', global.combinationId).replace('%POS', 2)))
        .then(() => client.getAttributeInVar(AddProductPage.image_combination_src.replace('%ID', global.combinationId).replace('%POS', 2), 'title', 'title_image'))
    })
    test('should get value the first image not selected', () => client.getAttributeInVar(AddProductPage.combination_image_checkbox.replace('%NUMBER', global.combinationId).replace('%POS', 1), 'value', 'value_image_not_selected'));
    test('should go back to combination list', () => client.backToProduct());
    /**
     * This test is based on the bug described in this ticket
     * http://forge.prestashop.com/browse/BOOM-4469
     **/
    test('should check that combination\'s picture is well updated (BOOM-4469)', () => client.checkAttributeValue(AddProductPage.combination_attribute_image.replace('%NUMBER', combinationId), 'src', global.tab['title_image'], 'contain'));
    test('should click on "Preview" button', () => {
      return promise
        .then(() => client.waitForSymfonyToolbar(AddProductPage, 2000))
        .then(() => client.waitForExistAndClick(AddProductPage.preview_buttons));
    });
    test('should switch to the Front Office', () => client.switchWindow(1));
    common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
    test('should check the second image is not Exist in FO', () => client.isNotExisting(productPage.product_combination_image.replace('%NUMBER', global.combinationId).replace('%V', global.tab['value_image_not_selected'])));
  }, 'product/create_combinations');

  scenario('Do not select images for second combination "Size - S, Color - Beige" ', client => {
    test('should go to the Back Office', () => client.closeWindow(0));
    test('should get the second combination ID', () => client.getCombinationData(2));
    test('should click on "Edit" for second combination', () => {
      return promise
        .then(() => client.getCombinationData(2))
        .then(() => client.goToEditCombination());
    });
    test('should get the combination name', () => {
      return promise
        .then(() => client.getAttributeInVar(AddProductPage.combination_color_beige, 'for', 'attributeColor'));
    })
    test('should get value for images', () => {
      return promise
        .then(() => client.getAttributeInVar(AddProductPage.combination_image_checkbox.replace('%NUMBER', global.combinationId).replace('%POS', 1), 'value', 'value_first_image'))
        .then(() => client.getAttributeInVar(AddProductPage.combination_image_checkbox.replace('%NUMBER', global.combinationId).replace('%POS', 1), 'value', 'value_second_image'));
    })
    test('should click on "Preview" button', () => {
      return promise
        .then(() => client.waitForSymfonyToolbar(AddProductPage, 2000))
        .then(() => client.waitForExistAndClick(AddProductPage.preview_buttons));
    });
    test('should switch to the Front Office', () => client.switchWindow(1));
    common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
    test('should click on color "Beige"', () => client.waitForExistAndClick(productPage.product_color_input.replace('%V', global.tab['attributeColor'].split('-')[1])))
    test('should check there image is Exist in FO', () => {
      return promise
        .then(() => client.pause(2000))
        .then(() => client.isExisting(productPage.product_combination_image.replace('%V', global.tab['value_first_image'])))
        .then(() => client.isExisting(productPage.product_combination_image.replace('%V', global.tab['value_second_image'])));
    })
  }, 'product/create_combinations');

  scenario('select multiple images for second combination "Size - S, Color - Beige" ', client => {
    test('should go to the Back Office', () => client.closeWindow(0));
    test('should go back to combination list', () => client.backToProduct());
    test('should get the second combination ID', () => client.getCombinationData(2));
    test('should click on "Edit" for second combination', () => {
      return promise
        .then(() => client.getCombinationData(2))
        .then(() => client.goToEditCombination());
    });
    test('should choose the first and second image', () => {
      return promise
        .then(() => client.pause(1000))
        .then(() => client.scrollWaitForExistAndClick(AddProductPage.image_combination_src.replace('%ID', global.combinationId).replace('%POS', 1)))
        .then(() => client.getAttributeInVar(AddProductPage.image_combination_src.replace('%ID', global.combinationId).replace('%POS', 1), 'title', 'title_first_image'))
        .then(() => client.scrollWaitForExistAndClick(AddProductPage.image_combination_src.replace('%ID', global.combinationId).replace('%POS', 2)))
        .then(() => client.getAttributeInVar(AddProductPage.image_combination_src.replace('%ID', global.combinationId).replace('%POS', 2), 'title', 'title_second_image'))
    })
    test('should go back to combination list', () => client.backToProduct());
    test('should verify that default picture  is well checked', () => client.checkAttributeValue(AddProductPage.combination_attribute_image.replace('%NUMBER', combinationId), 'src', global.tab['title_first_image'], 'contain'));
  }, 'product/create_combinations');

  scenario('Delete Combinations with "Bulk actions"', client => {
    test('should select all the generated variations', () => client.waitForVisibleAndClick(AddProductPage.var_selected));
    test('should verify that the table for bulk actions displayed', () => client.isVisible(AddProductPage.bulk_actions_bloc, 2000));
    test('should get the number for combination selected', () => client.checkTextValue(AddProductPage.combination_total_number, "0", 'notequal'));
    test('should deselect all the generated variations', () => client.waitForVisibleAndClick(AddProductPage.var_selected));
    test('should verify that the table for bulk actions is not displayed', () => client.checkIsNotVisible(AddProductPage.bulk_actions_bloc, 2000));
    test('should "Edit" first combination in "Bulk actions"', () => {
      return promise
        .then(() => client.getCombinationData(1))
        .then(() => client.goToEditCombination())
        .then(() => client.editCombination(1))
        .then(() => client.backToProduct());
    });
    test('should select all the generated variations', () => client.waitForVisibleAndClick(AddProductPage.var_selected, 3000));
    test('should click on the "Delete Combinations" button', () => {
      return promise
        .then(() => client.pause(3000))
        .then(() => client.waitForExistAndClick(AddProductPage.delete_combinations_button));
    })
    test('should verify the appearance of the warning modal', () => client.checkTextValue(AddProductPage.confirmation_modal_content, 'Are you sure to delete this?', 'equal', 3000));
    test('should click on "Yes" button from the modal', () => client.waitForExistAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
    test('should verify the appearance of the green validation', () => client.checkTextValue(AddProductPage.validation_msg, 'Successful deletion'));
  }, 'product/create_combinations');

  commonAttribute.createAttribute(attributeData);

  scenario('check the attribute in Product Page', client => {
    test('should go to "Catalog" page', () => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.products_submenu));
    test('should click on "NEW PRODUCT" button', () => client.waitForExistAndClick(AddProductPage.new_product_button));
    test('should set the "product name" input', () => client.waitAndSetValue(AddProductPage.product_name_input, productData.name + date_time));
    test('should upload the first product picture', () => client.uploadPicture(productData.picture_1, AddProductPage.picture));
    test('should upload the second product picture', () => client.uploadPicture(productData.picture_2, AddProductPage.picture));
    test('should select the "Product with combination" option', () => client.waitForExistAndClick(AddProductPage.product_combinations.replace('%I', 2)));
    test('should click on "Combinations" tab', () => client.scrollWaitForExistAndClick(AddProductPage.product_combinations_tab, 50));
    test('should check the attribute', () => client.scrollWaitForExistAndClick(AddProductPage.attribute_group_name.replace('%NAME', attributeData.name + date_time), 150, 3000));
  }, 'product/create_combinations');
}, 'product/create_combinations');
