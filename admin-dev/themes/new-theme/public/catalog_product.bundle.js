/******/!function(e){function i(r){if(t[r])return t[r].exports;var c=t[r]={i:r,l:!1,exports:{}};return e[r].call(c.exports,c,c.exports,i),c.l=!0,c.exports}// webpackBootstrap
/******/
var t={};i.m=e,i.c=t,i.i=function(e){return e},i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,i){return Object.prototype.hasOwnProperty.call(e,i)},i.p="",i(i.s=427)}({193:function(e,i,t){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var r=t(254);(0,window.$)(function(){new r.a})},254:function(e,i,t){"use strict";function r(e,i){if(!(e instanceof i))throw new TypeError("Cannot call a class as a function")}var c=function(){function e(e,i){for(var t=0;t<i.length;t++){var r=i[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(i,t,r){return t&&e(i.prototype,t),r&&e(i,r),i}}(),o=window.$,a=function(){function e(){r(this,e),this.prefixCreateForm="form_step2_specific_price_",this.prefixEditForm="form_modal_",this.editModalIsOpen=!1,this.$createPriceFormDefaultValues=new Object,this.storePriceFormDefaultValues(),this.loadAndDisplayExistingSpecificPricesList(),this.configureAddPriceFormBehavior(),this.configureEditPriceModalBehavior(),this.configureDeletePriceButtonsBehavior(),this.configureMultipleModalsBehavior()}return c(e,[{key:"loadAndDisplayExistingSpecificPricesList",value:function(){var e=this,i=o("#js-specific-price-list"),t=i.data("listingUrl").replace(/list\/\d+/,"list/"+this.getProductId());o.ajax({type:"GET",url:t}).done(function(t){var r=i.find("tbody");r.find("tr").remove(),t.length>0?i.removeClass("hide"):i.addClass("hide");var c=e.renderSpecificPricesListingAsHtml(t);r.append(c)})}},{key:"renderSpecificPricesListingAsHtml",value:function(e){var i="",t=this;return o.each(e,function(e,r){var c=o("#js-specific-price-list").attr("data-action-delete").replace(/delete\/\d+/,"delete/"+r.id_specific_price),a=t.renderSpecificPriceRow(r,c);i+=a}),i}},{key:"renderSpecificPriceRow",value:function(e,i){var t=e.id_specific_price;return"<tr><td>"+e.rule_name+"</td><td>"+e.attributes_name+"</td><td>"+e.currency+"</td><td>"+e.country+"</td><td>"+e.group+"</td><td>"+e.customer+"</td><td>"+e.fixed_price+"</td><td>"+e.impact+"</td><td>"+e.period+"</td><td>"+e.from_quantity+"</td><td>"+(e.can_delete?'<a href="'+i+'" class="js-delete delete btn tooltip-link delete pl-0 pr-0"><i class="material-icons">delete</i></a>':"")+"</td><td>"+(e.can_edit?'<a href="#" data-specific-price-id="'+t+'" class="js-edit edit btn tooltip-link delete pl-0 pr-0"><i class="material-icons">edit</i></a>':"")+"</td></tr>"}},{key:"configureAddPriceFormBehavior",value:function(){var e=this,i=this.getPrefixSelector(!0);o("#specific_price_form .js-cancel").click(function(){e.resetCreatePriceFormDefaultValues(),o("#specific_price_form").collapse("hide")}),o("#specific_price_form .js-save").on("click",function(){return e.submitCreatePriceForm()}),o("#js-open-create-specific-price-form").on("click",function(){return e.loadAndFillOptionsForSelectCombinationInput(!0)}),o(i+"leave_bprice").on("click",function(){return e.enableSpecificPriceFieldIfEligible(!0)}),o(i+"sp_reduction_type").on("change",function(){return e.enableSpecificPriceTaxFieldIfEligible(!0)})}},{key:"configureEditPriceFormInsideModalBehavior",value:function(){var e=this,i=this.getPrefixSelector(!1);o("#form_modal_cancel").click(function(){return e.closeEditPriceModalAndRemoveForm()}),o("#form_modal_close").click(function(){return e.closeEditPriceModalAndRemoveForm()}),o("#form_modal_save").click(function(){return e.submitEditPriceForm()}),this.loadAndFillOptionsForSelectCombinationInput(!1),o(i+"leave_bprice").on("click",function(){return e.enableSpecificPriceFieldIfEligible(!1)}),o(i+"sp_reduction_type").on("change",function(){return e.enableSpecificPriceTaxFieldIfEligible(!1)}),this.reinitializeDatePickers(),this.initializeLeaveBPriceField(!1),this.enableSpecificPriceTaxFieldIfEligible(!1)}},{key:"reinitializeDatePickers",value:function(){o(".datepicker input").datetimepicker({format:"YYYY-MM-DD"})}},{key:"initializeLeaveBPriceField",value:function(e){var i=this.getPrefixSelector(e);""!=o(i+"sp_price").val()&&(o(i+"sp_price").prop("disabled",!1),o(i+"leave_bprice").prop("checked",!1))}},{key:"configureEditPriceModalBehavior",value:function(){var e=this;o(document).on("click","#js-specific-price-list .js-edit",function(i){i.preventDefault();var t=o(i.currentTarget).data("specificPriceId");e.openEditPriceModalAndLoadForm(t)})}},{key:"configureDeletePriceButtonsBehavior",value:function(){var e=this;o(document).on("click","#js-specific-price-list .js-delete",function(i){i.preventDefault(),e.deleteSpecificPrice(i.currentTarget)})}},{key:"configureMultipleModalsBehavior",value:function(){var e=this;o(".modal").on("hidden.bs.modal",function(){e.editModalIsOpen&&o("body").addClass("modal-open")})}},{key:"submitCreatePriceForm",value:function(){var e=this,i=o("#specific_price_form").attr("data-action"),t=o("#specific_price_form input, #specific_price_form select, #form_id_product").serialize();o("#specific_price_form .js-save").attr("disabled","disabled"),o.ajax({type:"POST",url:i,data:t}).done(function(i){showSuccessMessage(translate_javascripts["Form update success"]),e.resetCreatePriceFormDefaultValues(),o("#specific_price_form").collapse("hide"),e.loadAndDisplayExistingSpecificPricesList(),o("#specific_price_form .js-save").removeAttr("disabled")}).fail(function(e){showErrorMessage(e.responseJSON),o("#specific_price_form .js-save").removeAttr("disabled")})}},{key:"submitEditPriceForm",value:function(){var e=this,i=o("#edit-specific-price-modal-form").attr("data-action"),t=o("#edit-specific-price-modal-form").data("specificPriceId"),r=i.replace(/update\/\d+/,"update/"+t),c=o("#edit-specific-price-modal-form input, #edit-specific-price-modal-form select, #form_id_product").serialize();o("#edit-specific-price-modal-form .js-save").attr("disabled","disabled"),o.ajax({type:"POST",url:r,data:c}).done(function(i){showSuccessMessage(translate_javascripts["Form update success"]),e.closeEditPriceModalAndRemoveForm(),e.loadAndDisplayExistingSpecificPricesList(),o("#edit-specific-price-modal-form .js-save").removeAttr("disabled")}).fail(function(e){showErrorMessage(e.responseJSON),o("#edit-specific-price-modal-form .js-save").removeAttr("disabled")})}},{key:"deleteSpecificPrice",value:function(e){var i=this;modalConfirmation.create(translate_javascripts["This will delete the specific price. Do you wish to proceed?"],null,{onContinue:function(){var t=o(e).attr("href");o(e).attr("disabled","disabled"),o.ajax({type:"GET",url:t}).done(function(t){i.loadAndDisplayExistingSpecificPricesList(),showSuccessMessage(t),o(e).removeAttr("disabled")}).fail(function(i){showErrorMessage(i.responseJSON),o(e).removeAttr("disabled")})}}).show()}},{key:"storePriceFormDefaultValues",value:function(){var e=this.$createPriceFormDefaultValues;o("#specific_price_form").find("select,input").each(function(i,t){e[o(t).attr("id")]=o(t).val()}),o("#specific_price_form").find("input:checkbox").each(function(i,t){e[o(t).attr("id")]=o(t).prop("checked")}),this.$createPriceFormDefaultValues=e}},{key:"loadAndFillOptionsForSelectCombinationInput",value:function(e){var i=this.getPrefixSelector(e),t=o(i+"sp_id_product_attribute"),r=t.attr("data-action").replace(/product-combinations\/\d+/,"product-combinations/"+this.getProductId());o.ajax({type:"GET",url:r}).done(function(e){t.find("option:gt(0)").remove(),o.each(e,function(e,i){t.append('<option value="'+i.id+'">'+i.name+"</option>")}),"0"!=t.data("selectedAttribute")&&t.val(t.data("selectedAttribute")).trigger("change")})}},{key:"enableSpecificPriceTaxFieldIfEligible",value:function(e){var i=this.getPrefixSelector(e);"percentage"===o(i+"sp_reduction_type").val()?o(i+"sp_reduction_tax").hide():o(i+"sp_reduction_tax").show()}},{key:"resetCreatePriceFormDefaultValues",value:function(){var e=this.$createPriceFormDefaultValues;o("#specific_price_form").find("input").each(function(i,t){o(t).val(e[o(t).attr("id")])}),o("#specific_price_form").find("select").each(function(i,t){o(t).val(e[o(t).attr("id")]).change()}),o("#specific_price_form").find("input:checkbox").each(function(e,i){o(i).prop("checked",!0)})}},{key:"enableSpecificPriceFieldIfEligible",value:function(e){var i=this.getPrefixSelector(e);o(i+"sp_price").prop("disabled",o(i+"leave_bprice").is(":checked")).val("")}},{key:"openEditPriceModalAndLoadForm",value:function(e){var i=this,t=o("#js-specific-price-list").data("actionEdit").replace(/form\/\d+/,"form/"+e);o("#edit-specific-price-modal").modal("show"),this.editModalIsOpen=!0,o.ajax({type:"GET",url:t}).done(function(t){i.insertEditSpecificPriceFormIntoModal(t),o("#edit-specific-price-modal-form").data("specificPriceId",e),i.configureEditPriceFormInsideModalBehavior()}).fail(function(e){showErrorMessage(e.responseJSON)})}},{key:"closeEditPriceModalAndRemoveForm",value:function(){o("#edit-specific-price-modal").modal("hide"),this.editModalIsOpen=!1,o("#edit-specific-price-modal-form").empty()}},{key:"insertEditSpecificPriceFormIntoModal",value:function(e){var i=o("#edit-specific-price-modal-form");i.empty(),i.append(e)}},{key:"getProductId",value:function(){return o("#form_id_product").val()}},{key:"getPrefixSelector",value:function(e){return 1==e?"#"+this.prefixCreateForm:"#"+this.prefixEditForm}}]),e}();i.a=a},427:function(e,i,t){e.exports=t(193)}});