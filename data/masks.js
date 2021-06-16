export const cardMasks = {
    mask: [
        {
            mask: '0000 000000 00000',
            regex: '^3[47]\\d{0,13}',
            cardtype: 'american-express',
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
        console.log(dynamicMasked)
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
};
export const zipCodeMask = {
    mask: /^\d{1,5}$/
};
export const driversLicenseMask = {
    mask: [
        {
            "state": "Alabama",
            "mask": "0000000"
        },
        {
            "state": "Alaska",
            "mask": "0000000"
        },
        {
            "state": "Arizona",
            "mask": /^(?:[a-zA-Z]\d{0,8}|\d{0,9})$/
        },
        {
            "state": "California",
            "mask": "a0000000"
        },
        {
            "state": "Colorado",
            "mask": /^(?:[a-zA-Z]\d{0,6}|[a-zA-Z]{0,2}\d{2,5}|\d{0,9})$/
        },
        {
            "state": "Connecticut",
            "mask": "000000000"
        },
        {
            "state": "Delaware",
            "mask": "0000000"
        },
        {
            "state": "District of Columbia",
            "mask": "000000000"
        },
        {
            "state": "Florida",
            "mask": "a00-000-00-000-0"
        },
        {
            "state": "Georgia",
            "mask": "000000000"
        },
        {
            "state": "Hawaii",
            "mask": /^(?:[a-zA-Z]\d{0,8}|\d{0,9})$/
        },
        {
            "state": "Idaho",
            "mask": /^(?:[a-zA-Z]{0,2}\d{0,6}|\d{0,9})$/
        },
        {
            "state": "Illinois",
            "mask": "a000000000000"
        },
        {
            "state": "Indiana",
            "mask": /^(?:[a-zA-Z]\d{0,9}|\d{0,9}|\d{0,10})$/
        },
        {
            "state": "Iowa",
            "mask": /^(?:\d{0,9}|\d{0,3}[a-zA-Z]{0,2}\d{0,4})$/
        },
        {
            "state": "Kansas",
            "mask": "a00-00-0000"
        },
        {
            "state": "Kentucky",
            "mask": "a00-000-000"
        },
        {
            "state": "Louisiana",
            "mask": "000000000"
        },
        {
            "state": "Maine",
            "mask": /^(?:\d{0,7}|\d{0,7}[a-zA-Z]|\d{0,8})$/
        },
        {
            "state": "Maryland",
            "mask": "a000000000000"
        },
        {
            "state": "Massachusetts",
            "mask": /^(?:[a-zA-Z]\d{0,8}|\d{0,9})$/
        },
        {
            "state": "Michigan",
            "mask": /^(?:[a-zA-Z]\d{0,10}|[a-zA-Z]\d{0,12})$/
        },
        {
            "state": "Minnesota",
            "mask": "a000000000000"
        },
        {
            "state": "Mississippi",
            "mask": "000000000"
        },
        {
            "state": "Missouri",
            "mask": /^(?:[a-zA-Z]\d{0,9}|[a-zA-Z]\d{0,6}[R]{1}|\d{0,8}[a-zA-Z]{2}|\d{0,9}[a-zA-Z]{1}|\d{0,9})$/
        },
        {
            "state": "Montana",
            "mask": /^(?:[a-zA-Z]\d{0,8}|\d{0,14})$/
        },
        {
            "state": "Nebraska",
            "mask": /^(?:[a-zA-Z]\d{0,8})$/
        },
        {
            "state": "Nevada",
            "mask": /^(?:\d{0,12}|[X]{1}\d{0,8})$/
        },
        {
            "state": "New Hampshire",
            "mask": "00aaa00000"
        },
        {
            "state": "New Jersey",
            "mask": "a00000000000000"
        },
        {
            "state": "New Mexico",
            "mask": "000000000"
        },
        {
            "state": "New York",
            "mask": /^(?:[a-zA-Z]\d{0,18}|\d{0,16}|[a-zA-Z]{0,8})$/
        },
        {
            "state": "North Carolina",
            "mask": "000000000000"
        },
        {
            "state": "North Dakota",
            "mask": /^(?:[a-zA-Z]{0,3}\d{0,6}|\d{0,9})$/
        },
        {
            "state": "Ohio",
            "mask": /^(?:[a-zA-Z]\d{0,8}|[a-zA-Z]{0,2}\d{0,7}|\d{0,8})$/
        },
        {
            "state": "Oklahoma",
            "mask": /^(?:[a-zA-Z]\d{0,9}|\d{0,9})$/
        },
        {
            "state": "Oregon",
            "mask": "000000000"
        },
        {
            "state": "Pennsylvania",
            "mask": "00000000",
            "regex": "^(?:\\d{8})$"
        },
    ],
    /* dispatch: function(appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "");
        console.log(dynamicMasked)
        for (let i = 0; i < dynamicMasked.compiledMasks.length; i++) {
            const re = new RegExp(dynamicMasked.compiledMasks[i].regex);
            if (number.match(re) != null) {
              return dynamicMasked.compiledMasks[i];
            }
        }
    } */
};