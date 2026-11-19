const {test} = require('node:test');
const assert = require('node:assert/strict');
const {submitEnquiry, enquiryEmail} = require('../intake-form.js');
const payload = {name:'Test visitor',email:'test@example.com',company:'Example & Co',services:'Technical content, Onboarding',message:'A guide for our new developer API.',website:'https://example.com',budget:'To discuss',timeline:'Next month'};

test('only confirms a submission when the delivery service accepts it', async () => {
  for (const success of [true, 'true']) {
    let request;
    await submitEnquiry('https://example.invalid/intake', payload, async (url, options) => {
      request = {url, options}; return {ok:true, json:async () => ({success})};
    });
    assert.equal(request.url, 'https://example.invalid/intake');
    assert.deepEqual(JSON.parse(request.options.body), payload);
    assert.equal(request.options.method, 'POST');
  }
});

test('rejects provider refusal, HTTP failure, invalid JSON, and offline requests', async () => {
  const responses = [
    async () => ({ok:true,json:async () => ({success:false})}),
    async () => ({ok:true,json:async () => ({success:'false'})}),
    async () => ({ok:false,json:async () => ({success:true})}),
    async () => ({ok:true,json:async () => {throw new Error('Invalid JSON');}}),
    async () => {throw new Error('Offline');}
  ];
  for (const fetcher of responses) await assert.rejects(submitEnquiry('https://example.invalid/intake', payload, fetcher));
});

test('email fallback preserves contact details and selected services with safe encoding', () => {
  const url = new URL(enquiryEmail(payload));
  assert.equal(url.pathname, 'edakturk19@gmail.com');
  assert.equal(url.searchParams.get('subject'), 'Project enquiry: Example & Co');
  for (const value of Object.values(payload)) assert.ok(url.searchParams.get('body').includes(value));
});
