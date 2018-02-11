'use strict';

describe('list page', function () {
  var username = element(by.id('username'));
  var password = element(by.id('password'));
  var login = element(by.css('#login-link a'));
  var wineList = element.all(by.repeater('data in vm.wines'));

  beforeAll(function () {
    browser.get('/');

    login.click();
    username.sendKeys('admin');
    password.sendKeys('admin');
    element(by.id('login-button')).click();

  });

  it('should load list', function () {
    element(by.css('a[href="#/app/list"]')).click();
    expect(wineList.count()).toEqual(4);
  });

  it('should delete wine', function () {
    wineList.then(function (wines) {
      browser.actions()
        .mouseDown(wines[0])
        .mouseMove({ x: -50, y: 0 })
        .mouseUp()
        .perform();
      var EC = protractor.ExpectedConditions;
      var delBtn = wines[0].element(by.css('ion-option-button.ion-trash-b'));
      browser.wait(EC.elementToBeClickable(delBtn), 5000);
      delBtn.click();
    });
    var okButton = element(by.css('.popup-buttons .button-positive'));
    okButton.click();
    expect(wineList.count()).toEqual(3);
  });
});
