class HtmlParser {
    constructor() {
        this.errors = [];
        //string to parse
        this.str = str;
        //parsed object string
        this.parsedString = "[";
        //parsed object
        this.parsedDomObject;
        // single tag list
        this.excludeTags = ['script', 'link', 'title', 'meta', 'base', 'html', 'head'];
        this.singleTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    }

    isColsingTag = function (tag) {
        var closingTag = (tag + "").indexOf("</");
        if (closingTag == -1) {
            return false;
        }
        else {
            return true;
        }
    }


    parse = function () {
        var pattern = /<[^>]*>/g;
        var doctypePatt = /<![^>]*>/gi;
        var tagName = "";
        var comma = "";
        var matchedTags = this.str.match(pattern);
        for (var i = 0; i < matchedTags.length; i++) {
            if (this.isColsingTag(matchedTags[i])) {
                if ((matchedTags[i + 1] && this.isColsingTag(matchedTags[i + 1])) || matchedTags[i + 1] == undefined) {
                    comma = "";
                }
                else {
                    comma = ",";
                }
                tagName = matchedTags[i].toString().match(/[a-z,A-Z,0-9]+/).toString();

                if (!this.skipTag(tagName) && !doctypePatt.test(matchedTags[i]))
                    this.parsedString += "]}" + comma;
            }
            else {
                tagName = matchedTags[i].toString().match(/[a-z,A-Z,0-9]+/).toString();
                var attrList = this.getAttributes(matchedTags[i].toString());
                if (this.isSelfClosingTag(tagName)) {
                    if ((matchedTags[i + 1] && this.isColsingTag(matchedTags[i + 1])) || matchedTags[i + 1] == undefined) {
                        comma = "";
                    }
                    else {
                        comma = ",";
                    }
                    if (!this.skipTag(tagName) && !doctypePatt.test(matchedTags[i]))
                        this.parsedString += '{ "name": "' + tagName + '", "attributes": ' + attrList + ', "children": []}' + comma;
                }
                else if (this.isComment(matchedTags[i])) {
                    if ((matchedTags[i + 1] && this.isColsingTag(matchedTags[i + 1])) || matchedTags[i + 1] == undefined) {
                        comma = "";
                    }
                    else {
                        comma = ",";
                    }
                    if (!this.skipTag(tagName) && !doctypePatt.test(matchedTags[i]))
                        this.parsedString += '{ "name": "comment", "value": "' + matchedTags[i].substring(4, matchedTags[i].length - 3) + '"}' + comma;
                } else {
                    if (!this.skipTag(tagName) && !doctypePatt.test(matchedTags[i]))
                        this.parsedString += '{ "name": "' + tagName + '", "attributes": ' + attrList + ', "children": [';
                }
            }
        }
        this.parsedString += ']';
        try {
            this.parsedDomObject = JSON.parse(this.parsedString);
        } catch (err) {
            this.errors.push("html structure is not valid");
        }


        return this.parsedDomObject;
    }

    getAttributes = function(tag){
        var attrpatt = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;
        var attrList = tag.match(attrpatt);
        var tempArr = [];
        if(attrList){
            for(i in attrList){
                var attr = attrList[i].split('=')[0];
                var values = attrList[i].split('=')[1];
                if(attr == 'id' || attr == 'title' || attr == 'type'){
                    var to = {};
                    to.name = attr;
                    to.values = values.replace(/['"]+/g, '');
                    tempArr.push(to);
                }else if(attr == 'class'){
                    var to = {};
                    var valuesArr = values.split(' ');
                    to.name = attr;
                    to.values = [];
                    for(j in valuesArr){
                        if(valuesArr[j].trim().length > 0){
                            to.values.push(valuesArr[j].replace(/['"]+/g, ''));
                        }
                    }
                    tempArr.push(to);
                }
            }
        }

        if(tempArr.length){
            return JSON.stringify(tempArr);
        }
        else {
            return false;
        }
    }

    skipTag = function(tagName){
        return this.excludeTags.indexOf(tagName) > -1 ? true : false;
    }

    isSelfClosingTag = function(tagName){
        var selfClosingTag = false;
        for(i=0; i<this.singleTags.length; i++){
            if(tagName == this.singleTags[i])
            {
                selfClosingTag = true;
                break;
            }
        }
        return selfClosingTag;
    }

    isComment = function(tagName){
        var regex = /<!--[^\-\->]*-->/g;
        return regex.test(tagName);
    }
}