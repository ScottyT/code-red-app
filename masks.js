export const cardMasks = {
    mask: [
        {
            mask: '0000 000000 00000',
            regex: '^3[47]\\d{0,13}',
            cardtype: 'american-express',
            startsWith: 2
        },
        {
            mask: '0000 0000 0000 0000',
            regex: '^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}',
            cardtype: 'mastercard'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: '^4\\d{0,15}',
            cardtype: 'visa'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: '^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}',
            cardtype: 'discover'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: '^(?:35\\d{0,2})\\d{0,12}',
            cardtype: 'jcb'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: '^(?:5[0678]\\d{0,2}|6304|67\\d{0,2})\\d{0,12}',
            cardtype: 'maestro'
        },
        {
            mask: '0000 0000 0000 0000',
            cardtype: 'Unknown'
        }
    ],
    dispatch: function(appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "");
        for (let i = 0; i < dynamicMasked.compiledMasks.length; i++) {
            const re = new RegExp(dynamicMasked.compiledMasks[i].regex);
            if (number.match(re) != null) {
              return dynamicMasked.compiledMasks[i];
            }
          }
    }
};

export const cvvMasks = {
    mask: [
        {
            mask: '0000',
            cardtype: 'american-express',
            regex: '^\\d{4}$',
        },
        {
            mask: '000',
            cardtype: 'Unknown',
            regex: '^\\d{3}$',
        }
    ]
}