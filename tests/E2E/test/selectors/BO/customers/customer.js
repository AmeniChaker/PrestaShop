module.exports = {
  Customer: {
    customer_menu: '//*[@id="subtab-AdminParentCustomer"]/a',
    customers_subtab: '//*[@id="subtab-AdminCustomers"]/a',
    new_customer_button: '//*[@id="page-header-desc-customer-new_customer"]',
    social_title_button: '//*[@id="gender_1"]',
    first_name_input: '//*[@id="firstname"]',
    last_name_input: '//*[@id="lastname"]',
    email_address_input: '//*[@id="email"]',
    password_input: '//*[@id="passwd"]',
    days_select: '//*[@id="fieldset_0"]//select[@name="days"]',
    month_select: '//*[@id="fieldset_0"]//select[@name="months"]',
    years_select: '//*[@id="fieldset_0"]//select[@name="years"]',
    save_button: '//*[@id="customer_form_submit_btn"]',
    customer_filter_by_email_input: '//*[@id="form-customer"]//input[@name="customerFilter_email"]',
    email_address_value: '//*[@id="form-customer"]//td[%ID]',
    reset_button: '//*[@id="table-customer"]//button[@name="submitResetcustomer"]',
    edit_button: '//*[@id="form-customer"]//a[@title="Edit"]',
    dropdown_toggle: '//*[@id="form-customer"]//button[@data-toggle="dropdown"]',
    delete_button: '//*[@id="form-customer"]//a[@title="Delete"]',
    view_button: '//*[@id="form-customer"]//a[@title="View"]',
    delete_first_option: '//*[@id="deleteMode_real"]',
    delete_second_option: '//*[@id="deleteMode_deleted"]',
    delete_confirmation_button: '//*[@id="content"]//input[@value="Delete"]',
    select_customer: '//*[@id="form-customer"]//input[@name="customerBox[]"]',
    bulk_actions_button: '//*[@id="bulk_action_menu_customer"]',
    bulk_actions_delete_button: '//*[@id="form-customer"]//div[contains(@class,"bulk-actions")]//a[contains(@onclick,"submitBulkdeletecustomer")]',
    empty_list_icon: '//*[@id="table-customer"]//div[contains(@class,"list-empty-msg")]',
    customer_link: '//*[@id="table-address"]//td[contains(text(),"%ID")]',
    Partner_offers: '//*[@id="fieldset_0"]//label[contains(@for,"optin_on")]',
    valid_orders: '//*[@id="container-customer"]//div[2]/div[2]/div/div[1]/span',
    total_amount: '//*[@id="container-customer"]/div[1]/div[1]/div[2]/div[2]/div/div[1]',

  }
};