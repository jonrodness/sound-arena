const { htmlAttributeEncode } = require('./encode')

describe('sanitizeHtml', function() {
    test('html sanitizes string', function() {
        expect(htmlAttributeEncode("hello")).toEqual("hello")
        expect(htmlAttributeEncode(`&<>"'/`)).toEqual(`&amp;&lt;&gt;&quot;&#x27;&#x2F;`)
        expect(htmlAttributeEncode(`h&<>"'/o`)).toEqual(`h&amp;&lt;&gt;&quot;&#x27;&#x2F;o`)
    })
})