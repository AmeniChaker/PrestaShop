module.exports = Object.assign(
  {
    Google: {
      username_input: '#identifierId',
      identifier_next_button: '#identifierNext',
      password_input: '//input[@type="password" and @name="password"]',
      password_next_button: '#passwordNext',
      more_button: '(//span[text()="More"])[1]',
      spam_button: '//span/a[contains(text(), "Spam")]',
      mail_subject: '//div[@class="y6"]//span[@class="bog"]/b[text()="%subject"]',
      gmail_link: '//*[@id="gbw"]/div/div/div[1]/div[1]/a',
      signin_button: 'body > nav > div > a.gmail-nav__nav-link.gmail-nav__nav-link__sign-in',
    }
  }
);