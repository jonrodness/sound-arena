const { htmlEncode } = require('./sanitize')

describe('sanitizeHtml', function() {
    test('html sanitizes string', function() {
        expect(htmlEncode("hello")).toEqual("hello")
        expect(htmlEncode(`&<>"'/`)).toEqual(`&amp;&lt;&gt;&quot;&#x27;&#x2F;`)
        expect(htmlEncode(`h&<>"'/o`)).toEqual(`h&amp;&lt;&gt;&quot;&#x27;&#x2F;o`)
    })
})