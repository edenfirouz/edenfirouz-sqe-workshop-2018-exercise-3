import assert from 'assert';
import {sySub} from '../src/js/code-analyzer';

describe('The javascript create CFG graph of ',() => {
    it('function with complex if-else statement and color the path', () => {
        assert.equal(
            sySub('1,2,3','function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '    } else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '    } else {\n' +
                '        c = c + z + 5;\n' +
                '    }\n' +
                '    \n' +
                '    return c;\n' +
                '}\n'),
            'n1 [label=" (1) \\n  a = x + 1 \\n b = a + y \\n c = 0 \\n" , color= green, style=filled, shape=box]\n' +
            'n4 [label=" (2) \\n b < z",color=green, style=filled, shape=diamond ]\n' +
            'n5 [label=" (3) \\n c = c + 5", shape=box]\n' +
            'n6 [label=" (4) \\n return c;", shape=box, color=green, style=filled]\n' +
            'n7 [label=" (5) \\n b < z * 2",color=green, style=filled, shape=diamond ]\n' +
            'n8 [label=" (6) \\n c = c + x + 5", shape=box, color=green, style=filled]\n' +
            'n9 [label=" (7) \\n c = c + z + 5", shape=box]\n' +
            'n1 -> n4[]\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n7 [label="false"]\n' +
            'n5 -> n6 []\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n9 [label="false"]\n' +
            'n8 -> n6 []\n' +
            'n9 -> n6 []');
    });
    it('function with while statement', () => {
        assert.equal(
            sySub('1,2,3','function foo(x, y, z){\n' +
                '   let a = x + 1;\n' +
                '   let b = a + y;\n' +
                '   let c = 0;\n' +
                '   \n' +
                '   while (a < z) {\n' +
                '       c = a + b;\n' +
                '       z = c * 2;\n' +
                '       a++;\n' +
                '   }\n' +
                '   \n' +
                '   return z;\n' +
                '}\n'),
            'n1 [label=" (1) \\n  a = x + 1 \\n b = a + y \\n c = 0 \\n" , color= green, style=filled, shape=box]\n' +
            'n4 [label=" (2) \\n a < z",color=green, style=filled, shape=diamond ]\n' +
            'n5 [label=" (3) \\n c = a + b", shape=box, color=green, style=filled]\n' +
            'n6 [label=" (4) \\n z = c * 2", shape=box, color=green, style=filled]\n' +
            'n7 [label=" (5) \\n a++", shape=box, color=green, style=filled]\n' +
            'n8 [label=" (6) \\n return z;", shape=box]\n' +
            'n1 -> n4[]\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n8 [label="false"]\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n4 []');
    });
    it('function with Unary Expression', () => {
        assert.equal(
            sySub('\'hello\', 2,1','function foo(x, y, z){\n' +
                '    while( true) {\n' +
                '        y=1;\n' +
                '        if( x == \'hello\' ){\n' +
                '           y=y+1;\n' +
                '\t\tif(y>2){\n' +
                '\t\t\ty=-1;\n' +
                '\t\t}\n' +
                '        }\n' +
                '        else{\n' +
                '           x=1;\n' +
                '        }\n' +
                '        c = y;\n' +
                '        z = c * 2;\n' +
                '    }\n' +
                '    \n' +
                '    return z;\n' +
                '}; \n'),
            'n1 [label=" (1) \\n true",color= green, style=filled, shape=diamond ]\n' +
            'n2 [label=" (2) \\n y=1", shape=box, color=green, style=filled]\n' +
            'n3 [label=" (3) \\n x == \'hello\'",color=green, style=filled, shape=diamond ]\n' +
            'n4 [label=" (4) \\n y=y+1", shape=box, color=green, style=filled]\n' +
            'n5 [label=" (5) \\n y>2",color=green, style=filled, shape=diamond ]\n' +
            'n6 [label=" (6) \\n y=-1", shape=box]\n' +
            'n7 [label=" (7) \\n c = y", shape=box, color=green, style=filled]\n' +
            'n8 [label=" (8) \\n z = c * 2", shape=box, color=green, style=filled]\n' +
            'n9 [label=" (9) \\n x=1", shape=box]\n' +
            'n11 [label=" (10) \\n return z;", shape=box]\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n11 [label="false"]\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 [label="true"]\n' +
            'n3 -> n9 [label="false"]\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 [label="true"]\n' +
            'n5 -> n7 [label="false"]\n' +
            'n6 -> n7 []\n' +
            'n7 -> n8 []\n' +
            'n8 -> n1 []\n' +
            'n9 -> n7 []');
    });
    it('function with non arguments', () => {
        assert.equal(
            sySub('','function foo(){\n' +
                '  let x = 1;\n' +
                '  let y = 2;\n' +
                '  let z = 3;\n' +
                '    while( true ) {\n' +
                '        let arr= [\'hello\', 5 , true];\n' +
                '        if( arr[0] == \'hello\' ){\n' +
                '           arr[1]=arr[1]+1;\n' +
                '\t\tif(y>2){\n' +
                '\t\t\tx=arr[1];\n' +
                '\t\t}\n' +
                '        }\n' +
                '        else{\n' +
                '           x=arr[1];\n' +
                '        }\n' +
                '        z = x * 2;\n' +
                '    }\n' +
                '    \n' +
                '    return z;\n' +
                '};'),
            'n1 [label=" (1) \\n  x = 1 \\n y = 2 \\n z = 3 \\n" , color= green, style=filled, shape=box]\n' +
            'n4 [label=" (2) \\n true",color=green, style=filled, shape=diamond ]\n' +
            'n5 [label=" (3) \\n  arr= [\'hello\', 5 , true] \\n" , color= green, style=filled, shape=box, color=green, style=filled]\n' +
            'n6 [label=" (4) \\n arr[0] == \'hello\'",color=green, style=filled, shape=diamond ]\n' +
            'n7 [label=" (5) \\n arr[1]=arr[1]+1", shape=box, color=green, style=filled]\n' +
            'n8 [label=" (6) \\n y>2",color=green, style=filled, shape=diamond ]\n' +
            'n9 [label=" (7) \\n x=arr[1]", shape=box]\n' +
            'n10 [label=" (8) \\n z = x * 2", shape=box, color=green, style=filled]\n' +
            'n11 [label=" (9) \\n x=arr[1]", shape=box]\n' +
            'n13 [label=" (10) \\n return z;", shape=box]\n' +
            'n1 -> n4[]\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n13 [label="false"]\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 [label="true"]\n' +
            'n6 -> n11 [label="false"]\n' +
            'n7 -> n8 []\n' +
            'n8 -> n9 [label="true"]\n' +
            'n8 -> n10 [label="false"]\n' +
            'n9 -> n10 []\n' +
            'n10 -> n4 []\n' +
            'n11 -> n10 []');
    });
    it('function with un-initial declaration', () => {
        assert.equal(
            sySub('[1, 2 , 3]','function foo(a){\n' +
                '   let x;\n' +
                '   if (a[0]==0){\n' +
                '         x=a[0]+1;\n' +
                '   }\n' +
                '   else if ( a[1]==2 ){\n' +
                '     x=5;\n' +
                '   }\n' +
                '   else {\n' +
                '     x=a[2];\n' +
                '   }\n' +
                '   return x;\n' +
                '};\n'),
            'n1 [label=" (1) \\n  x \\n" , color= green, style=filled, shape=box]\n' +
            'n2 [label=" (2) \\n a[0]==0",color=green, style=filled, shape=diamond ]\n' +
            'n3 [label=" (3) \\n x=a[0]+1", shape=box]\n' +
            'n4 [label=" (4) \\n return x;", shape=box, color=green, style=filled]\n' +
            'n5 [label=" (5) \\n a[1]==2",color=green, style=filled, shape=diamond ]\n' +
            'n6 [label=" (6) \\n x=5", shape=box, color=green, style=filled]\n' +
            'n7 [label=" (7) \\n x=a[2]", shape=box]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 [label="true"]\n' +
            'n2 -> n5 [label="false"]\n' +
            'n3 -> n4 []\n' +
            'n5 -> n6 [label="true"]\n' +
            'n5 -> n7 [label="false"]\n' +
            'n6 -> n4 []\n' +
            'n7 -> n4 []');
    });
    // it('is substitute function with computation in array place', () => {
    //     assert.equal(
    //         sySub('','let a=[5, 1 , true];\n' +
    //             'function foo(){\n' +
    //             '   let x=0;\n' +
    //             '   if (a[x]==1){\n' +
    //             '         return a[1]+x;\n' +
    //             '   }\n' +
    //             '   if ( a[2] ){\n' +
    //             '     return true;\n' +
    //             '   }\n' +
    //             '};\n'),
    //         'function foo(){\n' +
    //         '</a><a style="background-color:indianred;">   if (5 == 1){</a><a>\n' +
    //         '         return 1 + 0;\n' +
    //         '   }\n' +
    //         '</a><a style="background-color:lightgreen;">   if ( true ){</a><a>\n' +
    //         '     return true;\n' +
    //         '   }\n' +
    //         '};\n');
    // });
    it('complex function with if-else', () => {
        assert.equal(
            sySub('1,2,3','function foo(x, y, z){\n' +
                '\tlet a = x + 1;\n' +
                '\tlet b = a + y;\n' +
                '\tlet c = 0;\n' +
                '\tif (b < z) {\n' +
                '\t\tif(b<2){\n' +
                '\t\t\tc = c + 5;\n' +
                '\t\t}\n' +
                '\t\telse{\n' +
                '\t\t\tc=0;\n' +
                '\t\t}\n' +
                '\t}\n' +
                '\telse if ( 1 * (z * 2) > b) {\n' +
                '\t\tif(b>x){\n' +
                '\t\t\tc = c + x + 5;\n' +
                '\t\t}\n' +
                '\t\telse{\n' +
                '\t\t\tc=0;\n' +
                '\t\t}\n' +
                '\t}\n' +
                '\telse {\n' +
                '\t\tc = c + z + 5;\n' +
                '\t}\n' +
                '\treturn x + y + z + c;\n' +
                '\n' +
                '};'),
            'n1 [label=" (1) \\n  a = x + 1 \\n b = a + y \\n c = 0 \\n" , color= green, style=filled, shape=box]\n' +
            'n4 [label=" (2) \\n b < z",color=green, style=filled, shape=diamond ]\n' +
            'n5 [label=" (3) \\n b<2",color=falseG, shape=diamond ]\n' +
            'n6 [label=" (4) \\n c = c + 5", shape=box]\n' +
            'n7 [label=" (5) \\n return x + y + z + c;", shape=box, color=green, style=filled]\n' +
            'n8 [label=" (6) \\n c=0", shape=box]\n' +
            'n9 [label=" (7) \\n 1 * (z * 2) > b",color=green, style=filled, shape=diamond ]\n' +
            'n10 [label=" (8) \\n b>x",color=green, style=filled, shape=diamond ]\n' +
            'n11 [label=" (9) \\n c = c + x + 5", shape=box, color=green, style=filled]\n' +
            'n12 [label=" (10) \\n c=0", shape=box]\n' +
            'n13 [label=" (11) \\n c = c + z + 5", shape=box]\n' +
            'n1 -> n4[]\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n9 [label="false"]\n' +
            'n5 -> n6 [label="true"]\n' +
            'n5 -> n8 [label="false"]\n' +
            'n6 -> n7 []\n' +
            'n8 -> n7 []\n' +
            'n9 -> n10 [label="true"]\n' +
            'n9 -> n13 [label="false"]\n' +
            'n10 -> n11 [label="true"]\n' +
            'n10 -> n12 [label="false"]\n' +
            'n11 -> n7 []\n' +
            'n12 -> n7 []\n' +
            'n13 -> n7 []');
    });
    it('is substitute function with while statement and if statement', () => {
        assert.equal(
            sySub('1,2,3','function foo(x, y, z){\n' +
                '   let a = x + 1;\n' +
                '   let b = a + y;\n' +
                '   let c = 0;\n' +
                '   if(b < z) {\n' +
                '       c = a + b;\n' +
                '       z = c * 2;\n' +
                '       b++;\n' +
                '   }\n' +
                '   while (a < z) {\n' +
                '       c = a + b;\n' +
                '       z = c * 2;\n' +
                '       a++;\n' +
                '   }\n' +
                '\n' +
                '   \n' +
                '   return z;\n' +
                '}\n'),
            'n1 [label=" (1) \\n  a = x + 1 \\n b = a + y \\n c = 0 \\n" , color= green, style=filled, shape=box]\n' +
            'n4 [label=" (2) \\n b < z",color=green, style=filled, shape=diamond ]\n' +
            'n5 [label=" (3) \\n c = a + b", shape=box]\n' +
            'n6 [label=" (4) \\n z = c * 2", shape=box]\n' +
            'n7 [label=" (5) \\n b++", shape=box]\n' +
            'n8 [label=" (6) \\n a < z",color=green, style=filled, shape=diamond ]\n' +
            'n9 [label=" (7) \\n c = a + b", shape=box, color=green, style=filled]\n' +
            'n10 [label=" (8) \\n z = c * 2", shape=box, color=green, style=filled]\n' +
            'n11 [label=" (9) \\n a++", shape=box, color=green, style=filled]\n' +
            'n12 [label=" (10) \\n return z;", shape=box]\n' +
            'n1 -> n4[]\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n8 [label="false"]\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n8 []\n' +
            'n8 -> n9 [label="true"]\n' +
            'n8 -> n12 [label="false"]\n' +
            'n9 -> n10 []\n' +
            'n10 -> n11 []\n' +
            'n11 -> n8 []');
    });
    it('function with assignment in the start', () => {
        assert.equal(
            sySub('[1,2,3]','function foo(a){\n' +
                '   let x;\n' +
                '   x=1000;\n' +
                '   if (a[0]==0){\n' +
                '         x=a[0]+1;\n' +
                '   }\n' +
                '   else if ( a[1]==2 ){\n' +
                '     x=5;\n' +
                '   }\n' +
                '   else {\n' +
                '     x=a[2];\n' +
                '   }\n' +
                '   return x;\n' +
                '};\n'),
            'n1 [label=" (1) \\n  x \\n" , color= green, style=filled, shape=box]\n' +
            'n2 [label=" (2) \\n x=1000", shape=box, color=green, style=filled]\n' +
            'n3 [label=" (3) \\n a[0]==0",color=green, style=filled, shape=diamond ]\n' +
            'n4 [label=" (4) \\n x=a[0]+1", shape=box]\n' +
            'n5 [label=" (5) \\n return x;", shape=box, color=green, style=filled]\n' +
            'n6 [label=" (6) \\n a[1]==2",color=green, style=filled, shape=diamond ]\n' +
            'n7 [label=" (7) \\n x=5", shape=box, color=green, style=filled]\n' +
            'n8 [label=" (8) \\n x=a[2]", shape=box]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 [label="true"]\n' +
            'n3 -> n6 [label="false"]\n' +
            'n4 -> n5 []\n' +
            'n6 -> n7 [label="true"]\n' +
            'n6 -> n8 [label="false"]\n' +
            'n7 -> n5 []\n' +
            'n8 -> n5 []');
    });
    it('function with array input argument', () => {
        assert.equal(
            sySub('\'hello\',1,1,[\'hello\', 3 , true]',
                'function foo(x, y, z, arr){\n' +
                '    while( arr[2]==true ) {\n' +
                '        if( arr[0] == \'hello\' ){\n' +
                '           y=arr[1]+1;\n' +
                '\t\tif(y>2){\n' +
                '\t\t\tx=3;\n' +
                '\t\t}\n' +
                '        }\n' +
                '        else{\n' +
                '           x=x+\' bye\';\n' +
                '        }\n' +
                '        c = arr[1];\n' +
                '        z = c * 2;\n' +
                '    }\n' +
                '    \t\n' +
                '    return z;\n' +
                '};\n'),
            'n1 [label=" (1) \\n arr[2]==true",color= green, style=filled, shape=diamond ]\n' +
            'n2 [label=" (2) \\n arr[0] == \'hello\'",color=green, style=filled, shape=diamond ]\n' +
            'n3 [label=" (3) \\n y=arr[1]+1", shape=box, color=green, style=filled]\n' +
            'n4 [label=" (4) \\n y>2",color=green, style=filled, shape=diamond ]\n' +
            'n5 [label=" (5) \\n x=3", shape=box, color=green, style=filled]\n' +
            'n6 [label=" (6) \\n c = arr[1]", shape=box, color=green, style=filled]\n' +
            'n7 [label=" (7) \\n z = c * 2", shape=box, color=green, style=filled]\n' +
            'n8 [label=" (8) \\n x=x+\' bye\'", shape=box]\n' +
            'n9 [label=" (9) \\n return z;", shape=box]\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n9 [label="false"]\n' +
            'n2 -> n3 [label="true"]\n' +
            'n2 -> n8 [label="false"]\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n6 [label="false"]\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n1 []\n' +
            'n8 -> n6 []');
    });

    it('function with local array expression', () => {
        assert.equal(
            sySub('1,2,3','function foo(x, y, z){\n' +
                '\tlet arr= [1, 5 , true];\n' +
                '\twhile( arr[2]==true ) {\n' +
                '\t\tif( arr[0] == 1 ){\n' +
                '\t\t\tarr[1]=arr[1]+1;\n' +
                '\t\t\tif(y>2){\n' +
                '\t\t\t\tx=arr[1];\n' +
                '\t\t\t}\n' +
                '\t\t}\n' +
                '\t\telse{\n' +
                '\t\t\tx=arr[1];\n' +
                '\t\t}\n' +
                '\t\tz = x * 2;\n' +
                '\t} \n' +
                '\treturn z;\n' +
                '};'),
            'n1 [label=" (1) \\n  arr= [1, 5 , true] \\n" , color= green, style=filled, shape=box]\n' +
            'n2 [label=" (2) \\n arr[2]==true",color=green, style=filled, shape=diamond ]\n' +
            'n3 [label=" (3) \\n arr[0] == 1",color=green, style=filled, shape=diamond ]\n' +
            'n4 [label=" (4) \\n arr[1]=arr[1]+1", shape=box, color=green, style=filled]\n' +
            'n5 [label=" (5) \\n y>2",color=green, style=filled, shape=diamond ]\n' +
            'n6 [label=" (6) \\n x=arr[1]", shape=box]\n' +
            'n7 [label=" (7) \\n z = x * 2", shape=box, color=green, style=filled]\n' +
            'n8 [label=" (8) \\n x=arr[1]", shape=box]\n' +
            'n9 [label=" (9) \\n return z;", shape=box]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 [label="true"]\n' +
            'n2 -> n9 [label="false"]\n' +
            'n3 -> n4 [label="true"]\n' +
            'n3 -> n8 [label="false"]\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 [label="true"]\n' +
            'n5 -> n7 [label="false"]\n' +
            'n6 -> n7 []\n' +
            'n7 -> n2 []\n' +
            'n8 -> n7 []');
    });
});