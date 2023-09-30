const axios = require("axios");
const fs = require("fs")

const TIMESTAMP_FILE = "latest/timestamp.json"
const CURRENCIES_FILE = "latest/currencies.json"

const available = [
    "eur","usd","jpy","bgn","czk","dkk","gbp","huf","pln","ron","sek","chf","isk","nok","hrk","rub","try","aud","brl","cad","cny","hkd","idr","ils","inr","krw","mxn","myr","nzd","php","sgd","thb","zar"
]

const currencies = [
    {id: "aed", flagCode: "ae", decimalPlaces: 2, symbol: " د.إ", format: "value د.إ", bills: [1, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ae"]},
    {id: "afn", flagCode: "af", decimalPlaces: 2, symbol: "؋", format: "value Afs", bills: [1, 2, 5, 10, 20, 50, 100, 500, 1000], countryIds: ["af"]},
    {id: "all", flagCode: "al", decimalPlaces: 2, symbol: "Lek", format: "value Lek", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["al"]},
    {id: "amd", flagCode: "am", decimalPlaces: 2, symbol: "AMD", format: "value AMD", bills: [100, 500, 1000, 5000, 10000, 20000, 50000, 100000], countryIds: ["am"]},
    {id: "ang", flagCode: "sx", decimalPlaces: 2, symbol: "ƒ", format: "value ƒ", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["cw", "sx"]},
    {id: "aoa", flagCode: "ao", decimalPlaces: 2, symbol: "AOA", format: "value AOA", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ao"]},
    {id: "ars", flagCode: "ar", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ar"]},
    {id: "aud", flagCode: "au", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["au", "cx", "ki", "nf", "nr", "tv", "cc", "hm"]},
    {id: "awg", flagCode: "aw", decimalPlaces: 2, symbol: "ƒ", format: "value ƒ", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["aw"]},
    {id: "azn", flagCode: "az", decimalPlaces: 2, symbol: "₼", format: "value ₼", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["az"]},
    {id: "bam", flagCode: "ba", decimalPlaces: 2, symbol: "KM", format: "value KM", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ba"]},
    {id: "bbd", flagCode: "bb", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bb"]},
    {id: "bdt", flagCode: "bd", decimalPlaces: 2, symbol: "BDT", format: "value BDT", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bd"]},
    {id: "bgn", flagCode: "bg", decimalPlaces: 2, symbol: "лв", format: "value лв", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bg"]},
    {id: "bhd", flagCode: "bh", decimalPlaces: 2, symbol: "BHD", format: "value BHD", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bh"]},
    {id: "bif", flagCode: "bi", decimalPlaces: 2, symbol: "BIF", format: "value BIF", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bi"]},
    {id: "bmd", flagCode: "bm", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bm"]},
    {id: "bnd", flagCode: "bn", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bn"]},
    {id: "bob", flagCode: "bo", decimalPlaces: 2, symbol: "$b", format: "value $b", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bo"]},
    {id: "brl", flagCode: "br", decimalPlaces: 2, symbol: "R$", format: "value R$", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["br"]},
    {id: "bsd", flagCode: "bs", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bs"]},
    {id: "btn", flagCode: "bt", decimalPlaces: 2, symbol: "BTN", format: "value BTN", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bt"]},
    {id: "bwp", flagCode: "bw", decimalPlaces: 2, symbol: "P", format: "value P", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bw"]},
    {id: "byn", flagCode: "by", decimalPlaces: 2, symbol: "Br", format: "value Br", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["by"]},
    {id: "bzd", flagCode: "bz", decimalPlaces: 2, symbol: "BZ$", format: "value BZ$", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bz"]},
    {id: "cad", flagCode: "ca", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ca"]},
    {id: "cdf", flagCode: "cd", decimalPlaces: 2, symbol: "CDF", format: "value CDF", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["cd"]},
    {id: "chf", flagCode: "ch", decimalPlaces: 2, symbol: "CHF", format: "value CHF", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ch", "li"]},
    {id: "clf", flagCode: "cl", decimalPlaces: 2, symbol: "CLF", format: "value CLF", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["cl"]},
    {id: "clp", flagCode: "cl", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["cl"]},
    {id: "cny", flagCode: "cn", decimalPlaces: 2, symbol: "¥", format: "value ¥", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["cn"]},
    {id: "cop", flagCode: "co", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["co"]},
    {id: "crc", flagCode: "cr", decimalPlaces: 2, symbol: "₡", format: "value ₡", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["cr"]},
    {id: "cuc", flagCode: "cu", decimalPlaces: 2, symbol: "CUC", format: "value CUC", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["cu"]},
    {id: "cup", flagCode: "cu", decimalPlaces: 2, symbol: "₱", format: "value ₱", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["cu"]},
    {id: "cve", flagCode: "cv", decimalPlaces: 2, symbol: "CVE", format: "value CVE", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["cv"]},
    {id: "czk", flagCode: "cz", decimalPlaces: 2, symbol: "Kč", format: "value Kč", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["cz"]},
    {id: "djf", flagCode: "dj", decimalPlaces: 2, symbol: "DJF", format: "value DJF", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["dj"]},
    {id: "dkk", flagCode: "dk", decimalPlaces: 2, symbol: "kr", format: "value kr", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["dk", "gl", "fo"]},
    {id: "dop", flagCode: "do", decimalPlaces: 2, symbol: "RD$", format: "value RD$", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["do"]},
    {id: "dzd", flagCode: "dz", decimalPlaces: 2, symbol: "DZD", format: "value DZD", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["dz"]},
    {id: "egp", flagCode: "eg", decimalPlaces: 2, symbol: "£", format: "value £", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["eg"]},
    {id: "ern", flagCode: "er", decimalPlaces: 2, symbol: "ERN", format: "value ERN", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["er"]},
    {id: "etb", flagCode: "et", decimalPlaces: 2, symbol: "ETB", format: "value ETB", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["et"]},
    {id: "eur", flagCode: "eu", decimalPlaces: 2, symbol: "€", format: "value €", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ad", "at", "ax", "be", "bl", "cy", "de", "ee", "es", "fi", "fr", "gf", "gp", "gr", "ie", "it", "lt", "lu", "lv", "mc", "me", "mf", "mq", "mt", "pm", "pt", "re", "si", "sk", "sm", "yt", "nl", "tf", "va"]},
    {id: "fjd", flagCode: "fj", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["fj"]},
    {id: "fkp", flagCode: "fk", decimalPlaces: 2, symbol: "£", format: "value £", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["fk"]},
    {id: "gbp", flagCode: "gb", decimalPlaces: 2, symbol: "£", format: "£ value", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["gg", "im", "je", "gb"]},
    {id: "gel", flagCode: "ge", decimalPlaces: 2, symbol: "GEL", format: "value GEL", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ge"]},
    {id: "ghs", flagCode: "gh", decimalPlaces: 2, symbol: "¢", format: "value ¢", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["gh"]},
    {id: "gip", flagCode: "gi", decimalPlaces: 2, symbol: "£", format: "value £", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["gi"]},
    {id: "gmd", flagCode: "gm", decimalPlaces: 2, symbol: "GMD", format: "value GMD", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["gm"]},
    {id: "gnf", flagCode: "gn", decimalPlaces: 2, symbol: "GNF", format: "value GNF", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["gn"]},
    {id: "gtq", flagCode: "gt", decimalPlaces: 2, symbol: "Q", format: "value Q", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["gt"]},
    {id: "gyd", flagCode: "gy", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["gy"]},
    {id: "hkd", flagCode: "hk", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["hk"]},
    {id: "hnl", flagCode: "hn", decimalPlaces: 2, symbol: "L", format: "value L", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["hn"]},
    {id: "hrk", flagCode: "hr", decimalPlaces: 2, symbol: "kn", format: "value kn", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["hr"]},
    {id: "htg", flagCode: "ht", decimalPlaces: 2, symbol: "HTG", format: "value HTG", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ht"]},
    {id: "huf", flagCode: "hu", decimalPlaces: 2, symbol: "Ft", format: "value Ft", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["hu"]},
    {id: "idr", flagCode: "id", decimalPlaces: 2, symbol: "Rp", format: "value Rp", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["id"]},
    {id: "ils", flagCode: "il", decimalPlaces: 2, symbol: "₪", format: "value ₪", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["il"]},
    {id: "inr", flagCode: "in", decimalPlaces: 2, symbol: "₹", format: "value ₹", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["in"]},
    {id: "iqd", flagCode: "iq", decimalPlaces: 2, symbol: "IQD", format: "value IQD", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["iq"]},
    {id: "irr", flagCode: "ir", decimalPlaces: 2, symbol: "﷼", format: "value ﷼", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ir"]},
    {id: "isk", flagCode: "is", decimalPlaces: 2, symbol: "kr", format: "value kr", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["is"]},
    {id: "jmd", flagCode: "jm", decimalPlaces: 2, symbol: "J$", format: "value J$", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["jm"]},
    {id: "jod", flagCode: "jo", decimalPlaces: 2, symbol: "JOD", format: "value JOD", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["jo"]},
    {id: "jpy", flagCode: "jp", decimalPlaces: 2, symbol: "¥", format: "value ¥", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["jp"]},
    {id: "kes", flagCode: "ke", decimalPlaces: 2, symbol: "KES", format: "value KES", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ke"]},
    {id: "kgs", flagCode: "kg", decimalPlaces: 2, symbol: "лв", format: "value лв", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["kg"]},
    {id: "khr", flagCode: "kh", decimalPlaces: 2, symbol: "៛", format: "value ៛", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["kh"]},
    {id: "kmf", flagCode: "km", decimalPlaces: 2, symbol: "KMF", format: "value KMF", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["km"]},
    {id: "kpw", flagCode: "kp", decimalPlaces: 2, symbol: "₩", format: "value ₩", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["kp"]},
    {id: "krw", flagCode: "kr", decimalPlaces: 2, symbol: "₩", format: "value ₩", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["kr"]},
    {id: "kwd", flagCode: "kw", decimalPlaces: 2, symbol: "KWD", format: "value KWD", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["kw"]},
    {id: "kyd", flagCode: "ky", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ky"]},
    {id: "kzt", flagCode: "kz", decimalPlaces: 2, symbol: "лв", format: "value лв", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["kz"]},
    {id: "lak", flagCode: "la", decimalPlaces: 2, symbol: "₭", format: "value ₭", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["la"]},
    {id: "lbp", flagCode: "lb", decimalPlaces: 2, symbol: "£", format: "value £", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["lb"]},
    {id: "lkr", flagCode: "lk", decimalPlaces: 2, symbol: "₨", format: "value ₨", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["lk"]},
    {id: "lrd", flagCode: "lr", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["lr"]},
    {id: "lsl", flagCode: "ls", decimalPlaces: 2, symbol: "LSL", format: "value LSL", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ls"]},
    {id: "lyd", flagCode: "ly", decimalPlaces: 2, symbol: "LYD", format: "value LYD", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ly"]},
    {id: "mad", flagCode: "eh", decimalPlaces: 2, symbol: "MAD", format: "value MAD", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["eh", "ma"]},
    {id: "mdl", flagCode: "md", decimalPlaces: 2, symbol: "MDL", format: "value MDL", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["md"]},
    {id: "mga", flagCode: "mg", decimalPlaces: 2, symbol: "MGA", format: "value MGA", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["mg"]},
    {id: "mkd", flagCode: "mk", decimalPlaces: 2, symbol: "ден", format: "value ден", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["mk"]},
    {id: "mmk", flagCode: "mm", decimalPlaces: 2, symbol: "MMK", format: "value MMK", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["mm"]},
    {id: "mnt", flagCode: "mn", decimalPlaces: 2, symbol: " د.إ", format: "value  د.إ", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["mn"]},
    {id: "mop", flagCode: "mo", decimalPlaces: 2, symbol: "MOP", format: "value MOP", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["mo"]},
    {id: "mru", flagCode: "mr", decimalPlaces: 2, symbol: "MRU", format: "value MRU", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["mr"]},
    {id: "mur", flagCode: "mu", decimalPlaces: 2, symbol: "₨", format: "value ₨", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["mu"]},
    {id: "mvr", flagCode: "mv", decimalPlaces: 2, symbol: "MVR", format: "value MVR", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["mv"]},
    {id: "mwk", flagCode: "mw", decimalPlaces: 2, symbol: "MWK", format: "value MWK", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["mw"]},
    {id: "mxn", flagCode: "mx", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["mx"]},
    {id: "myr", flagCode: "my", decimalPlaces: 2, symbol: "RM", format: "value RM", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["my"]},
    {id: "mzn", flagCode: "mz", decimalPlaces: 2, symbol: "MT", format: "value MT", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["mz"]},
    {id: "nad", flagCode: "na", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["na"]},
    {id: "ngn", flagCode: "ng", decimalPlaces: 2, symbol: "₦", format: "value ₦", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ng"]},
    {id: "nio", flagCode: "ni", decimalPlaces: 2, symbol: "C$", format: "value C$", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ni"]},
    {id: "nok", flagCode: "bv", decimalPlaces: 2, symbol: "kr", format: "value kr", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bv", "no", "sj"]},
    {id: "npr", flagCode: "np", decimalPlaces: 2, symbol: "₨", format: "value ₨", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["np"]},
    {id: "nzd", flagCode: "nu", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["nu", "nz", "pn", "tk", "ck"]},
    {id: "omr", flagCode: "om", decimalPlaces: 2, symbol: "﷼", format: "value ﷼", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["om"]},
    {id: "pab", flagCode: "pa", decimalPlaces: 2, symbol: "B/.", format: "value B/.", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["pa"]},
    {id: "pen", flagCode: "pe", decimalPlaces: 2, symbol: "S/.", format: "value S/.", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["pe"]},
    {id: "pgk", flagCode: "pg", decimalPlaces: 2, symbol: "PGK", format: "value PGK", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["pg"]},
    {id: "php", flagCode: "ph", decimalPlaces: 2, symbol: "₱", format: "value ₱", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ph"]},
    {id: "pkr", flagCode: "pk", decimalPlaces: 2, symbol: "₨", format: "value ₨", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["pk"]},
    {id: "pln", flagCode: "pl", decimalPlaces: 2, symbol: "zł", format: "value zł", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["pl"]},
    {id: "pyg", flagCode: "py", decimalPlaces: 2, symbol: "Gs", format: "value Gs", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["py"]},
    {id: "qar", flagCode: "qa", decimalPlaces: 2, symbol: "﷼", format: "value ﷼", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["qa"]},
    {id: "ron", flagCode: "ro", decimalPlaces: 2, symbol: "lei", format: "value lei", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ro"]},
    {id: "rsd", flagCode: "rs", decimalPlaces: 2, symbol: "Дин.", format: "value Дин.", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["rs"]},
    {id: "rub", flagCode: "ru", decimalPlaces: 2, symbol: "₽", format: "value ₽", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ru"]},
    {id: "rwf", flagCode: "rw", decimalPlaces: 2, symbol: "RWF", format: "value RWF", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["rw"]},
    {id: "sar", flagCode: "sa", decimalPlaces: 2, symbol: "﷼", format: "value ﷼", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["sa"]},
    {id: "sbd", flagCode: "sb", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["sb"]},
    {id: "scr", flagCode: "sc", decimalPlaces: 2, symbol: "₨", format: "value ₨", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["sc"]},
    {id: "sdg", flagCode: "sd", decimalPlaces: 2, symbol: "SDG", format: "value SDG", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["sd"]},
    {id: "sek", flagCode: "se", decimalPlaces: 2, symbol: "kr", format: "value kr", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["se"]},
    {id: "sgd", flagCode: "sg", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["sg"]},
    {id: "shp", flagCode: "sh", decimalPlaces: 2, symbol: "£", format: "value £", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["sh"]},
    {id: "sll", flagCode: "sl", decimalPlaces: 2, symbol: "SLL", format: "value SLL", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["sl"]},
    {id: "sos", flagCode: "so", decimalPlaces: 2, symbol: "S", format: "value S", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["so"]},
    {id: "srd", flagCode: "sr", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["sr"]},
    {id: "ssp", flagCode: "ss", decimalPlaces: 2, symbol: "SSP", format: "value SSP", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ss"]},
    {id: "stn", flagCode: "st", decimalPlaces: 2, symbol: "STN", format: "value STN", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["st"]},
    {id: "svc", flagCode: "sv", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["sv"]},
    {id: "syp", flagCode: "sy", decimalPlaces: 2, symbol: "£", format: "value £", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["sy"]},
    {id: "szl", flagCode: "sz", decimalPlaces: 2, symbol: "SZL", format: "value SZL", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["sz"]},
    {id: "thb", flagCode: "th", decimalPlaces: 2, symbol: "฿", format: "value ฿", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["th"]},
    {id: "tjs", flagCode: "tj", decimalPlaces: 2, symbol: "TJS", format: "value TJS", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["tj"]},
    {id: "tmt", flagCode: "tm", decimalPlaces: 2, symbol: "TMT", format: "value TMT", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["tm"]},
    {id: "tnd", flagCode: "tn", decimalPlaces: 2, symbol: "TND", format: "value TND", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["tn"]},
    {id: "top", flagCode: "to", decimalPlaces: 2, symbol: "TOP", format: "value TOP", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["to"]},
    {id: "try", flagCode: "tr", decimalPlaces: 2, symbol: "₺", format: "value ₺", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["tr"]},
    {id: "ttd", flagCode: "tt", decimalPlaces: 2, symbol: "TT$", format: "value TT$", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["tt"]},
    {id: "twd", flagCode: "tw", decimalPlaces: 2, symbol: "NT$", format: "value NT$", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["tw"]},
    {id: "tzs", flagCode: "tz", decimalPlaces: 2, symbol: "TZS", format: "value TZS", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["tz"]},
    {id: "uah", flagCode: "ua", decimalPlaces: 2, symbol: "₴", format: "value ₴", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ua"]},
    {id: "ugx", flagCode: "ug", decimalPlaces: 2, symbol: "UGX", format: "value UGX", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ug"]},
    {id: "usd", flagCode: "us", decimalPlaces: 2, symbol: "$", format: "$ value", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["as", "bq", "ec", "fm", "gu", "pr", "pw", "tl", "us", "vg", "vi", "io", "mh", "mp", "tc", "um"]},
    {id: "uyu", flagCode: "uy", decimalPlaces: 2, symbol: "$U", format: "value $U", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["uy"]},
    {id: "uzs", flagCode: "uz", decimalPlaces: 2, symbol: "лв", format: "value лв", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["uz"]},
    {id: "ves", flagCode: "ve", decimalPlaces: 2, symbol: "VES", format: "value VES", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ve"]},
    {id: "vnd", flagCode: "vn", decimalPlaces: 2, symbol: "₫", format: "value ₫", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["vn"]},
    {id: "vuv", flagCode: "vu", decimalPlaces: 2, symbol: "VUV", format: "value VUV", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["vu"]},
    {id: "wst", flagCode: "ws", decimalPlaces: 2, symbol: "WST", format: "value WST", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ws"]},
    {id: "xaf", flagCode: "cm", decimalPlaces: 2, symbol: "XAF", format: "value XAF", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["cm", "ga", "gq", "td", "cg", "cf"]},
    {id: "xcd", flagCode: "ag", decimalPlaces: 2, symbol: "$", format: "value $", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ag", "ai", "dm", "gd", "kn", "lc", "ms", "vc"]},
    {id: "xof", flagCode: "bf", decimalPlaces: 2, symbol: "XOF", format: "value XOF", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["bf", "bj", "ci", "gw", "ml", "sn", "tg", "ne"]},
    {id: "xpf", flagCode: "nc", decimalPlaces: 2, symbol: "XPF", format: "value XPF", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["nc", "pf", "wf"]},
    {id: "yer", flagCode: "ye", decimalPlaces: 2, symbol: "﷼", format: "value ﷼", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["ye"]},
    {id: "zar", flagCode: "za", decimalPlaces: 2, symbol: "R", format: "value R", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["za"]},
    {id: "zmw", flagCode: "zm", decimalPlaces: 2, symbol: "ZMW", format: "value ZMW", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["zm"]},
    {id: "zwl", flagCode: "zw", decimalPlaces: 2, symbol: "ZWL", format: "value ZWL", bills: [1, 2, 5, 10, 20, 50, 100, 200, 500], countryIds: ["zw"]},
    ]

async function fetchRates() {

    let rates = {}
    let promises = []
    let date = Date.now()
    let apiKey = process.env.KEY1

    console.log(process.env)
    console.log("API KEY: " + apiKey)

    for (let i = 0; i < currencies.length; i++) {
        let base = currencies[i].id

        if (!available.includes(base)) {
            continue
        }

        let url = "https://api.freecurrencyapi.com/v1/latest?base_currency=" + base.toUpperCase() + "&apikey=" + apiKey
        
        await new Promise(resolve => setTimeout(resolve, 8000))

        let promise = axios.get(url)
        promises.push(promise)
        promise.then((response) => {
            console.log(response.data)
            rates[base] = {
                "date" : date
            }

            for (let c in response.data.data) {
                rates[base][c.toLowerCase()] = response.data.data[c]
            }
        })
    }

    await Promise.all(promises)
    return rates
}

function ratesAreFromToday(now) {
    try {
        if (!fs.existsSync(TIMESTAMP_FILE)) {
            return false
        }
        let lastFetch = new Date(fs.readFileSync(TIMESTAMP_FILE))
        
        return now.getDate() == lastFetch.getDate() &&
               now.getMonth() == lastFetch.getMonth() &&
               now.getFullYear() == lastFetch.getFullYear()

    } catch {
        console.log("Error in dates check")
        return false
    }
}

async function saveTimestamp(now) {
    let file = fs.openSync(TIMESTAMP_FILE, "w")
    fs.writeSync(file, now.toJSON())
    fs.closeSync(file)
}

async function saveCurrencies() {
    let file = fs.openSync(CURRENCIES_FILE, "w")
    fs.writeSync(file, currencies.filter((c) => available.includes(c.id)))
    fs.closeSync(file)
}


async function saveRates(rates) {
    let file = fs.openSync("latest/rates.json", "w")
    fs.writeSync(file, JSON.stringify(rates))
    fs.closeSync(file)
}

async function main() {
    const now = new Date()
    if (ratesAreFromToday(now)) {
        console.log("Rates already fetched for today - Skip fetching")
        return
    }
    
    saveCurrencies()

    console.log("Fetching rates for today")

    let rates = await fetchRates()
    saveRates(rates)

    saveTimestamp(now)
}

main()