import $ from 'jquery';
import {sySub} from './code-analyzer';
import * as viz from 'viz.js';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let inputCode = $('#inputToCode').val();
        let graph= sySub(inputCode,codeToParse);
        let view=viz('digraph{'+graph+'}');

        document.getElementById('parsedCode').innerHTML=view;
    });
});
