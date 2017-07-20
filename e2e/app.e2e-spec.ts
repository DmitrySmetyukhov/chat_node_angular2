import { FullChatPage } from './app.po';

describe('full-chat App', () => {
  let page: FullChatPage;

  beforeEach(() => {
    page = new FullChatPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
