const licenseNumbers = [
    {
        "state": "Alabama",
        "mask": "00000000",
        "length": 8,
        "min": 1
    },
    {
        "state": "Alaska",
        "mask": "0000000",
        "length": 7,
        "min": 1,
    },
    {
        "state": "Arizona",
        "mask": /^(?:[a-zA-Z]\d{0,8}|\d{0,9})$/,
        "length": 9,
        "min": 9
    },
    {
        "state": "Arkansas",
        "mask": /^\d{0,9}$/,
        "length": 9,
        "min": 4
    },
    {
        "state": "California",
        "mask": "a0000000",
        "length": 8,
        "min": 8
    },
    {
        "state": "Colorado",
        "mask": /^(?:[a-zA-Z]\d{0,6}|[a-zA-Z]{0,2}\d{0,5}|\d{0,9})$/,
        "length": 9,
        "min": 4
    },
    {
        "state": "Connecticut",
        "mask": "000000000",
        "length": 9,
        "min": 9
    },
    {
        "state": "Delaware",
        "mask": "0000000",
        "length": 8,
        "min": 1
    },
    {
        "state": "District of Columbia",
        "mask": "000000000",
        "length": 9,
        "min": 7
    },
    {
        "state": "Florida",
        "mask": "a00000000000",
        "length": 13,
        "min": 13
    },
    {
        "state": "Georgia",
        "mask": "000000000",
        "length": 9,
        "min": 7
    },
    {
        "state": "Hawaii",
        "mask": /^(?:[a-zA-Z]\d{0,8}|\d{0,9})$/,
        "length": 9,
        "min": 9
    },
    {
        "state": "Idaho",
        "mask": /^(?:[a-zA-Z]{0,2}\d{0,6}|\d{0,9})$/,
        "length": 9,
        "min": 9
    },
    {
        "state": "Illinois",
        "mask": "a000000000000",
        "length": 13,
        "min": 12
    },
    {
        "state": "Indiana",
        "mask": /^(?:[a-zA-Z]\d{0,9}|\d{0,9}|\d{0,10})$/,
        "length": 10,
        "min": 9
    },
    {
        "state": "Iowa",
        "mask": /^(?:\d{0,9}|\d{0,3}[a-zA-Z]{0,2}\d{0,4})$/,
        "length": 9,
        "min": 9
    },
    {
        "state": "Kansas",
        "mask": /^(?:[A-Za-z]\d{1}[A-Za-z]\d{1}[A-Za-z]|[a-zA-Z]\d{0,8}|\d{0,9})$/,
        "length": 9,
        "min": 5
    },
    {
        "state": "Kentucky",
        "mask": /^(?:[a-zA-Z]\d{0,8}|[a-zA-Z]\d{0,9}|\d{0,9})$/,
        "length": 10,
        "min": 9
    },
    {
        "state": "Louisiana",
        "mask": /^\d{0,9}$/,
        "length": 9,
        "min": 1
    },
    {
        "state": "Maine",
        "mask": /^(?:\d{0,7}|\d{0,7}[a-zA-Z]|\d{0,8})$/,
        "length": 8,
        "min": 7
    },
    {
        "state": "Maryland",
        "mask": "a000000000000",
        "length": 13,
        "min": 13
    },
    {
        "state": "Massachusetts",
        "mask": /^(?:[a-zA-Z]\d{0,8}|\d{0,9})$/,
        "length": 9,
        "min": 9
    },
    {
        "state": "Michigan",
        "mask": /^(?:[a-zA-Z]\d{0,10}|[a-zA-Z]\d{0,12})$/,
        "length": 13,
        "min":11
    },
    {
        "state": "Minnesota",
        "mask": "a000000000000",
        "length": 13,
        "min": 13
    },
    {
        "state": "Mississippi",
        "mask": "000000000",
        "length": 9,
        "min": 9
    },
    {
        "state": "Missouri",
        "mask": /^(?:[a-zA-Z]\d{0,9}|[a-zA-Z]\d{0,6}[R]{1}|\d{0,8}[a-zA-Z]{2}|\d{0,9}[a-zA-Z]{1}|\d{0,9})$/,
        "length": 10,
        "min": 8
    },
    {
        "state": "Montana",
        "mask": /^(?:[a-zA-Z]\d{0,8}|\d{0,14})$/,
        "length": 14,
        "min": 9
    },
    {
        "state": "Nebraska",
        "mask": /^(?:[a-zA-Z]\d{0,8})$/,
        "length": 9,
        "min": 9
    },
    {
        "state": "Nevada",
        "mask": /^(?:\d{0,12}|[X]{1}\d{0,8})$/,
        "length": 12,
        "min": 9
    },
    {
        "state": "New Hampshire",
        "mask": "00aaa00000",
        "length": 10,
        "min": 10
    },
    {
        "state": "New Jersey",
        "mask": "a00000000000000",
        "length": 8,
        "min": 15
    },
    {
        "state": "New Mexico",
        "mask": "000000000",
        "length": 9,
        "min": 8
    },
    {
        "state": "New York",
        "mask": /^(?:[a-zA-Z]\d{0,18}|\d{0,16}|[a-zA-Z]{0,8})$/,
        "length": 19,
        "min": 8
    },
    {
        "state": "North Carolina",
        "mask": /^\d{0,12}$/,
        "length": 12,
        "min": 1
    },
    {
        "state": "North Dakota",
        "mask": /^(?:[a-zA-Z]{0,3}\d{0,6}|\d{0,9})$/,
        "length": 9,
        "min":9
    },
    {
        "state": "Ohio",
        "mask": /^(?:[a-zA-Z]\d{0,8}|[a-zA-Z]{0,2}\d{0,7}|\d{0,8})$/,
        "length": 9,
        "min": 5
    },
    {
        "state": "Oklahoma",
        "mask": /^(?:[a-zA-Z]\d{0,9}|\d{0,9})$/,
        "length": 10,
        "min": 9
    },
    {
        "state": "Oregon",
        "mask": /^\d{0,9}$/,
        "length": 9,
        "min": 1
    },
    {
        "state": "Pennsylvania",
        "mask": "00000000",
        "length": 8,
        "min": 8
    },
    {
        "state": "Rhode Island",
        "mask": /^(?:\d{0,7}|[a-zA-Z]\d{0,6})$/,
        "length": 7,
        "min": 7
    },
    {
        "state": "South Carolina",
        "mask": /^\d{0,11}$/,
        "length": 11,
        "min": 5
    },
    {
        "state": "South Dakota",
        "mask": /^(?:\d{0,10}|\d{0,12})$/,
        "length": 12,
        "min": 6
    },
    {
        "state": "Tennessee",
        "mask": /^\d{0,9}$/,
        "length": 9,
        "min": 7
    },
    {
        "state": "Texas",
        "mask": /^\d{0,8}$/,
        "length": 8,
        "min": 7
    },
    {
        "state": "Utah",
        "mask": /^\d{0,10}$/,
        "length": 10,
        "min": 4
    },
    {
        "state": "Vermont",
        "mask": /^(?:\d{0,8}|\d{0,7}[a-zA-Z])$/,
        "length": 8,
        "min": 8
    },
    {
        "state": "Virginia",
        "mask": /^(?:[a-zA-Z]\d{0,11}|\d{0,9})$/,
        "length": 11,
        "min": 9
    },
    {
        "state": "Washington",
        "mask": /^(?:[a-zA]{0,7}\w{0,1}|[wdl]{0,1}\w{0,9})$/,
        "length": 12,
        "min": 8
    },
    {
        "state": "West Virginia",
        "mask": /^(?:\d{0,7}|[a-zA-Z]{0,2}\d{0,6})$/,
        "length": 8,
        "min": 7
    },
    {
        "state": "Wisconsin",
        "mask": "a0000000000000",
        "length": 14,
        "min": 14
    },
    {
        "state": "Wyoming",
        "mask": /^\d{0,10}$/,
        "length": 10,
        "min": 9
    }
];
export { licenseNumbers }