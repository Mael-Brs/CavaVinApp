'use strict';

describe('list page', function() {
  const username = element(by.id('username'));
  const password = element(by.id('password'));
  const login = element(by.css('#login-link a'));
  const wineList = element.all(by.repeater('data in vm.wines'));

  beforeAll(function() {
    browser.get('/');
    login.click();
    username.sendKeys('admin');
    password.sendKeys('admin');
    element(by.id('login-button')).click();
  });

  it('should load list', function() {
    element(by.css('a[href="#/app/list"]')).click();
    expect(wineList.count()).toEqual(4);
  });

  it('should delete wine', function() {
    wineList.then(function(wines) {
      switchAndClickBtn(wines, 'ion-option-button.ion-trash-b');
    });
    element(by.css('.popup-buttons .button-positive')).click();
    expect(wineList.count()).toEqual(3);
  });

  it('should pin wine', function() {
    wineList.then(function(wines) {
      switchAndClickBtn(wines, 'ion-option-button.icon.ion-minus');
    });
    const okButton = element(by.css('.popup-buttons .button-positive'));
    okButton.click();
    okButton.click();
    expect(wineList.count()).toEqual(2);

    //Check pinned list
    browser.get('#/app/pinnedList');
    expect(wineList.count()).toEqual(1);
  });
});

function switchAndClickBtn(wines, btnClass) {
  browser.actions()
    .mouseDown(wines[0])
    .mouseMove({ x: -50, y: 0 })
    .mouseUp()
    .perform();
  const EC = protractor.ExpectedConditions;
  const btn = wines[0].element(by.css(btnClass));
  browser.wait(EC.elementToBeClickable(btn), 3000);
  btn.click();
}
