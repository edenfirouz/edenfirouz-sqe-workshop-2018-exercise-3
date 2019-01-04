import * as esprima from 'esprima';
import * as esgraph from 'esgraph';


const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{range:true});
};

let assDic, localDic, arguDic, tempDic;
let inIf, inWhile, inArg, toCalcArrayParam,saved ,inElseIF,test;
let input;
let colorOfConditions;
let nodesArray;
let union;
let links;
let indexOfLinks;
let newGraph;
let firstLet;
let num;
let indexOfConditions;

const sySub=(inputCode, code)=>{
    colorOfConditions=[]; union=[]; links=[]; colorOfConditions=[];nodesArray=[];
    toCalcArrayParam=false; inArg=false; saved=false; test=false;
    inIf=0; inWhile=0; inElseIF=0; indexOfLinks=0;
    input=inputSplit(inputCode);
    localDic={}; assDic={}; arguDic={}; tempDic={};
    let parsedCode=parseCode(code);
    let cfg=esgraph(parsedCode.body[0].body);
    let graph= esgraph.dot(cfg, {counter:0, source:code});
    recCreateDic(parsedCode.body);
    return careGraph(graph);
};
const letCare=(graphArray)=>{
    firstLet++;
    let parts = graphArray.split('let');
    parts[1] = parts[1].split(';')[0];
    if (firstLet == 1) {
        nodesArray.push(parts[0].substring(0, parts[0].indexOf(' [')));
        // nodes[nodes.length]=parts[0].substring(0, parts[0].indexOf(' ['));
        newGraph += parts[0] + ' (' + num + ') \\n ';
        num++;
    }
    newGraph += parts[1] + ' \\n';
};
const nodesCare=(graphArray)=>{
    if (isCondition(graphArray)) {
        let parts = graphArray.split('="');
        nodesArray.push(parts[0].substring(0, parts[0].indexOf(' [')));
        graphArray = parts[0] + '=" ' + '(' + num + ') \\n ' + parts[1];
        num++;
        newGraph += graphArray.substring(0, graphArray.length - 1);
        if(num-1==1) newGraph +=',color= green, style=filled, shape=diamond ] \n';
        else newGraph += ',color=' + colorOfConditions[indexOfConditions] + ', shape=diamond ] \n';
        indexOfConditions++;
    }else if (!(graphArray.includes('exit'))) {
        let parts = graphArray.split('="');
        nodesArray.push(parts[0].substring(0, parts[0].indexOf(' [')));
        graphArray = parts[0] + '=" ' + '(' + num + ') \\n ' + parts[1];
        num++;
        newGraph += graphArray.substring(0, graphArray.length - 1) + ', shape=box] \n';
    }
};
// const nodesCare=(graphArray)=>{
//     if (isCondition(graphArray)) {
//         subNodeCare(graphArray);
//         if(num-1==1) newGraph +=',color= green, style=filled, shape=diamond ] \n';
//         else newGraph += ',color=' + colorOfConditions[indexOfConditions] + ', shape=diamond ] \n';
//         indexOfConditions++;
//     }else if (!(graphArray.includes('exit'))) {
//         subNodeCare(graphArray);
//         newGraph += ', shape=box] \n';
//     }
// };
// const subNodeCare=(graphArray)=>{
//     let parts = graphArray.split('="');
//     nodesArray.push(parts[0].substring(0, parts[0].indexOf(' [')));
//     // nodes[nodes.length]=parts[0].substring(0, parts[0].indexOf(' ['));
//     graphArray = parts[0] + '=" ' + '(' + num + ') \\n ' + parts[1];
//     num++;
//     newGraph += graphArray.substring(0, graphArray.length - 1);
// };
const careGraph=(graph)=>{
    // nodesArray=[];
    let graphArray=graph.split('\n');
    newGraph=''; firstLet=0, num=1, indexOfConditions=0;
    for (let i = 1; i <graphArray.length ; i++) {
        if (graphArray[i].includes('let')) {
            while (graphArray[i].includes('let')) {
                letCare(graphArray[i]);
                i++;
            }
            newGraph += '" , color= green, style=filled, shape=box] \n';
            i--;
            firstLet = 0;
        // }else if(i==1){
        }else if(graphArray[i]!='') {
            subGraphCare(graphArray[i]);
        }
    }
    return newGraph=colorGraph(newGraph.split(' \n'));
};
const subGraphCare=(graphArray)=>{
    if (!(graphArray.includes('->')))
        nodesCare(graphArray);
    else {
        linksCare(graphArray);
    }
};
const linksCare=(graphArray)=>{
    let parts = graphArray.split(' -> ');
    if (union.length == 2 ){
        newGraph += union[0] + ' -> ' + union[1] + '[] \n';
        forLinks(union[0],union[1]);
        union = [];
    }
    if (nodesArray!=[]&& isExistNode(parts[1].split(' [')[0]) && isExistNode(parts[0])) {//!graphArray[i].includes('exception') &&
        union = [];
        forLinks(parts[0],parts[1]);
        newGraph += graphArray + ' \n';
    }
};
const forLinks=(part1,part2)=>{
    links[indexOfLinks]=new Array(2);
    links[indexOfLinks][0]=part1;
    links[indexOfLinks][1]=part2;
    indexOfLinks++;
};
const colorGraph=(newGraphArray)=>{
    let bool,parts;
    let nextNode=findNext(newGraphArray[0].split(' [label')[0],'');
    for (let i = 0; !newGraphArray[i].includes('->') ; i++) {
        if ( newGraphArray[i].split(' [label')[0] == nextNode){
            if (newGraphArray[i].includes('box')) {
                newGraphArray[i] = newGraphArray[i].substring(0, newGraphArray[i].length - 1) + ', color=green, style=filled]';
                nextNode = findNext(nextNode, '');
            } else {
                if (newGraphArray[i].includes('trueG')){ bool= 'true'; parts = newGraphArray[i].split('trueG');}
                else{ bool='false';parts = newGraphArray[i].split('falseG'); }
                newGraphArray[i] = parts[0] + 'green, style=filled' + parts[1];
                nextNode = findNext(nextNode, bool);
            }
        }
    }
    newGraphArray=final(newGraphArray, nextNode);
    return unionArray(newGraphArray);
};
const final=(newGraphArray, nextNode)=> {
    for (let i = 0; !newGraphArray[i].includes('->'); i++) {
        if (newGraphArray[i].split(' [label')[0] == nextNode && !(newGraphArray[i].includes('color'))) {
            newGraphArray[i] = newGraphArray[i].substring(0, newGraphArray[i].length - 1) + ', color=green, style=filled]';
        }
    }
    return newGraphArray;
};
const unionArray=(array)=>{
    let graphStr='';
    for (let i = 0; i <array.length-1 ; i++) {
        graphStr+=array[i];
        if(i!=array.length-2)
            graphStr+='\n';
    }
    return graphStr;
};
const findNext=(node, bool)=>{
    for (let i = 0; i <links.length ; i++) {
        if(node==links[i][0] && links[i][1].includes(bool))
            return links[i][1].split(' [')[0];
    }
};
const isCondition=(con)=>{
    let ops=['<','>','||','&&','==','!=','true','false'];
    for (let i = 0; i < ops.length; i++) {
        if (con.includes(ops[i]))
            return true;
    }
    return false;
};
const isExistNode=(line)=>{
    for (let i = 0; i < nodesArray.length; i++) {
        if (line == nodesArray[i]) {
            union.push(line);
            return true;
        }
    }
    return false;
};
const inputSplit=(code)=>{
    let ans;
    if (code.includes('[')) {
        let arrArg=code.substring(code.indexOf('['),code.indexOf(']')+1);
        while(arrArg.includes(',')){
            arrArg=arrArg.replace(',','@');
        }
        code=code.substring(0,code.indexOf('['))+arrArg+code.substring(code.indexOf(']')+1,code.length);
    }
    ans=code.split(',');
    for (let i = 0; i < ans.length ; i++) {
        while(ans[i].includes('@'))
            ans[i]=ans[i].replace('@',',');
    }
    return ans;
};
const funcDec=(code)=>{
    functionDeclaration(code);
    recCreateDic(code.body);
};
const recCreateDic=(code)=> {
    if ((code.body != 'undefined') && (code.type=='BlockStatement')) {
        recCreateDic(code.body);
    }
    else{
        for (let i = 0; i < code.length; i++) {
            checkType(code[i]);
        }
    }
};
const checkType=(code)=>{
    if (code.type == 'FunctionDeclaration') {
        funcDec(code);
        // funcDecCode=code;
        return;
    }
    else if(code.type=='VariableDeclaration'){
        variableDeclaration(code);
    }
    else
        statementType(code);
};
const saveAssDic=()=>{
    Object.keys(assDic).forEach(function (key) {
        tempDic[key]=assDic[key];
    });
    saved=true;
};

const statementType=(code)=>{
    if(code.type=='ExpressionStatement'){
        expressionStatement(code);
    }
    else if(code.type=='IfStatement'){
        beforeIfStatement();
        ifStatement(code);
    }
    else if(code.type=='ReturnStatement'){
        null;
    }
    else loopStatement(code);
};
const loopStatement=(code)=>{
    if(code.type=='WhileStatement'){
        color(valueF(code.test));
        assDic={};
        inWhile++;
        recCreateDic(code.body);
        inWhile--;
    }
    else return;
};
const assignmentExpression=(code)=> {
    let key, value;
    if(code.type=='UpdateExpression'){
        key=code.argument.name;
        value=code.argument.name+'+1';
    }
    else {
        if (code.left.type == 'MemberExpression') {
            key = code.left.object.name + '[' + valueF(code.left.property) + ']';
        }
        else key = code.left.name;
        value = valueF(code.right); //Value
    }
    if (isIn())
        assDic[key]=value;
    else localDic[key]=value;
};

const memberExpression=(code)=>{
    let object =code.object.name;
    let property=valueF(code.property);
    return valueDic(object + '[' + property + ']');
};
const beforeIfStatement=()=>{
    if (! isIn() || inElseIF>0) assDic={};
    else if(!saved) saveAssDic();
    if(inElseIF){
        saved=false;
        tempDic={};
    }
};
const ifStatement=(code)=> {
    test=true;
    let condition= valueF(code.test); //Condition
    test=false;
    color(condition);
    inIf++;
    recCreateDic(code.consequent);
    inIf--;
    alternateInIf(code);
};
const color=(condition)=>{
    condition=calcArrayParam(condition);
    if(isIn()) {
        Object.keys(assDic).forEach(function (key) {
            while(condition.includes(key))
                condition = condition.replace(key, assDic[key]);
        });
    }
    Object.keys(arguDic).forEach(function(key) {
        while(condition.includes(key))
            condition=condition.replace(key, arguDic[key]);
    });
    if(eval(condition))
        colorOfConditions.push('trueG');
    else
        colorOfConditions.push('falseG');

};
const calcArrayParam=(condition)=>{
    if (condition.includes('[')){
        let calc=condition.substring( condition.indexOf('[')+1 ,condition.indexOf(']'));
        toCalcArrayParam=true;
        let key=condition.substring(0,condition.indexOf('[')+1)+eval(calc)+']';
        key=valueDic(key);
        toCalcArrayParam=false;
        return key+condition.substring(condition.indexOf(']')+1,condition.length);
    }
    else return condition;
};
const valueDic=(key)=> {
    let valueAns = key;
    if (toCalcArrayParam )
        valueAns = arguDic[key];
    else valueAns=elseValueDic(key);
    return valueAns;
};

const elseValueDic=(key)=>{
    if (assDic[key] != null && isIn()) {
        return forElseValueDic(key);
    }
    else if(tempDic[key]!=null)
        return tempDic[key];
    else if (localDic[key] != null)
        return localDic[key];
    else return key;
};
const forElseValueDic=(key)=>{
    if (arguDic[key] != null && test)
        return key;
    else return assDic[key];
};

const isIn=()=>{
    if (inWhile>0 || inIf>0){
        return true;
    }
    else return false;
};

const alternateInIf=(code)=>{
    if(code.alternate!=null && code.alternate != 'undefined'){
        inIf++;
        if(!(code.alternate.alternate)) {
            assDic={};
        }
        inElseIF++;
        enterToArr(code.alternate);
        inElseIF--;
        inIf--;
        assDic={};
    }
};

const enterToArr=(code)=>{
    if (code.type!= 'BlockStatement'){
        let codeInArr=[];
        codeInArr[0]=code;
        assDic={};
        recCreateDic(codeInArr);
    }
    else
        recCreateDic(code);
};

const expressionStatement=(code)=> {
    assignmentExpression(code.expression);
};

const variableDeclaration=(code)=>{
    for (let j = 0; j < code.declarations.length; j++) {
        let key = code.declarations[j].id.name; //key
        if(code.declarations[j].init!=null){
            let value = valueF(code.declarations[j].init)+''; //Value
            if (value.includes('['))
                arrayToDic(key,value);
            else
                localDic[key]=value;
        }
        else{
            localDic[key]=key;
        }
    }
};

const arrayToDic=(key,value)=>{
    value=value.substring(1,value.length-1);
    let values=value.split(',');
    for (let i = 0; i <values.length ; i++) {
        if (inArg)
            arguDic[key+'['+i+']']=values[i].trim();
        else if (isIn())
            assDic[key+'['+i+']']=values[i].trim();
        else localDic[key+'['+i+']']=values[i].trim();
    }
};
const valueF=(code)=>{
    if (code.type=='Identifier'){
        return valueDic(code.name);
    }
    else if(code.type=='Literal'){
        return code.raw;
    }
    else return valueExp(code);
};
const valueExp=(code)=>{
    if(code.type=='UnaryExpression'){
        return code.operator+valueF(code.argument);
    }
    else if(code.type=='ArrayExpression'){
        return arrayExpression(code.elements);
    }
    else if(code.type=='MemberExpression'){
        return memberExpression(code);
    }
    else return binaryExpression(code);
};
const arrayExpression=(code)=>{
    let arr='[';
    for (let i = 0; i < code.length; i++) {
        if(i!=0)
            arr=arr+' , ';
        arr=arr+ valueF(code[i]);
    }
    return arr+']';
};
const binaryExpression=(code)=> {
    let operator= code.operator;
    let left=BExpression(code.left);
    let right=BExpression(code.right);
    return left+' '+operator+' '+right;
};
const BExpression=(code)=>{
    if (code.type=='BinaryExpression' ){
        if (code.operator=='+' || code.operator=='-')
            return binaryExpression(code);
        else return '('+binaryExpression(code)+')';
    }
    else if(code.type=='MemberExpression'){
        return memberExpression(code);
    }
    else return valueF(code);
};

const functionDeclaration=(code)=> {
    let key, value;
    if (code.params.length > 0) {
        inArg=true;
        for (let j = 0; j < code.params.length; j++) {
            value='';
            key = code.params[j].name; //Name
            value=input[j];
            if(value.includes('['))
                arrayToDic(key,value);
            else arguDic[key]= value;
        }
        inArg=false;
    }
};

export {sySub};
export {parseCode};

