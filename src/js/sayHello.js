function sayHello(str)
{
  if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
  {
    const args = [
      `%c %c %c ${str} `,
      'background: #1b5e20; line-height: 26px;',
      'background: #1b5e20; line-height: 26px;',
      'color: #fefefe; background: #2e7d32; line-height: 26px;',
    ];

    window.console.log.apply(console, args);
  }
  else if (window.console)
  {
    window.console.log(str);
  }

  window.console.log(`https://github.com/Profesor08`);
  window.console.log(`https://t.me/profesor08`);
  window.console.log(`online7890@gmail.com`);
}

sayHello("Author - ✰ Profesor08 ✰");