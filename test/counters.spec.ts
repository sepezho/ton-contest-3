import chai, { expect } from "chai";
import chaiBN from "chai-bn";
import BN from "bn.js";
chai.use(chaiBN(BN));

import { Cell } from "ton";
import { SmartContract } from "ton-contract-executor";
import * as main from "../contracts/main";
import { internalMessage, randomAddress } from "./helpers";

import { hex } from "../build/main.compiled.json";

describe("Calculator on TON Blockchain Test", () => {
  let contract: SmartContract;

  beforeEach(async () => {
    contract = await SmartContract.fromCell(
      Cell.fromBoc(hex)[0] as any, // code cell from build output
      main.data({
        ownerAddress: randomAddress("owner"),
        number: 0,
      }) as any,
      {
        debug: true,
      }
    );
  });

  it("should not drop", async () => {
    // increment
    let math =
      "1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1"; // 44
    //
    math = "2*(4-100)";
    console.log(math.length);
    const sendIncrement = await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner"),
        body: main.calculate({
          // payload: math,
          // payload: "2*(4-100)", // -192 done
          // payload: "3*5+9/3", // 18 done
          // payload: "100-20*(4*6/3)", // -60 done
          // payload: "(135+75)/(14*5)", // 3 done
          // payload: "120-60/5*5", // 60 done
          // payload: "330/(65-50)", // 22 done
          // payload: "3*6+24/4", // 24 done
          // payload: "(4-7)*(5+3)", // -24 done
          // payload: "128-6*8/16", // 125 done
          // payload: "((10+3)-3*4)", // 1 done
          // payload: "(15/4)+(4/3)", // 4 done
          payload: "100-(2)*(5)",
          // payload: "((1))+((2))-((3+9))*(((4)))/(5)", // -8 done
          // payload: "-5*((-6-2)*(0-3)-(-8-2))", // -170  --- failed
          // payload: "1*(-2-4*7+18)", // 0 -- failed
          // payload: "-(((((-5-1)+1)+1)+1)+1)", // 2  -- failed
        }),
      }) as any
    );

    console.log(`\n---------------\n`);
    console.log(
      sendIncrement.logs
        .split(`\n`)
        .filter((e) => e.includes("#DEBUG#") || e.includes("error"))
        .map((e) => (e.includes("#DEBUG") ? e.split("#DEBUG")[1] : e.split("error")[1]))
        .join(`\n`)
    );
    // console.log(sendIncrement.result);
    // console.log(sendIncrement.actionList[0].message.body);
    console.log(sendIncrement.gas_consumed);
    console.log(`\n---------------\n`);
    console.log(math.length);
  });
});

// //12+231+*+
// // 102+231+*+

// /**
//  * Postfix notation math evaluator
//  * See: http://en.wikipedia.org/wiki/Reverse_Polish_notation
//  *
//  * See also prefix notation example:
//  * https://github.com/DmitrySoshnikov/Essentials-of-interpretation/blob/master/src/notes/note-1.js
//  *
//  * by Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
//  * MIT Style License
//  */

// /**
//  * postfixEval
//  * @param {String} string
//  *
//  * Evaluates a simple math expression
//  * in the postfix notation.
//  *
//  * Example:
//  *   2 3 +       => 5
//  *   2 3 + 5 *   => 25
//  */
// function postfixEval(string) {
//   var stack = [];
//   var ch; // current char

//   for (var k = 0, length = string.length; k < length; k++) {
//     ch = string[k];

//     // if it's a value, push it onto the stack
//     if (/\d/.test(ch)) stack.push(ch);
//     // else if it's an operator
//     else if (ch in operators) {
//       var b = +stack.pop();
//       var a = +stack.pop();

//       var value = operators[ch](a, b);
//       stack.push(value);
//     }

//     // else we just skip whitespaces
//   }

//   if (stack.length > 1) throw "ParseError: " + string + ", stack: " + stack;

//   return stack[0];
// }

// // operators
// var operators = {
//   "+": function (a, b) {
//     return a + b;
//   },
//   "-": function (a, b) {
//     return a - b;
//   },
//   "*": function (a, b) {
//     return a * b;
//   },
//   "/": function (a, b) {
//     return a / b;
//   },
// };

// // tests

// console.log(postfixEval("2 3 +")); // 5
// console.log(postfixEval("2 3 + 5 *")); // 25

// import chai, { expect } from "chai";
// import chaiBN from "chai-bn";
// import BN from "bn.js";
// // chai.use(chaiBN(BN));

// // import { Cell } from "ton";
// // import { SmartContract } from "ton-contract-executor";
// // import * as main from "../contracts/main";
// // import { internalMessage, randomAddress } from "./helpers";

// // import { hex } from "../build/main.compiled.json";

// // describe("Calculator on TON Blockchain Test", () => {
// //   let contract: SmartContract;

// //   beforeEach(async () => {
// //     contract = await SmartContract.fromCell(
// //       Cell.fromBoc(hex)[0] as any, // code cell from build output
// //       main.data({
// //         ownerAddress: randomAddress("owner"),
// //         number: 0,
// //       }) as any,
// //       {
// //         debug: true,
// //       }
// //     );
// //   });

// //   it("should not drop", async () => {
// //     // increment

// //     const sendIncrement = await contract.sendInternalMessage(
// //       internalMessage({
// //         from: randomAddress("notowner"),
// //         body: main.calculate({
// //           payload: "(1+2)+(2*(3+1))",
// //           // payload: "((10+3)-3*4)/5",
// //           // payload: "((1))+((2))-((3+9))*(((4)))/(5)",
// //           // payloadLength: payload.length,
// //         }),
// //       }) as any
// //     );

// //     console.log(
// //       sendIncrement.logs
// //         .split(`\n`)
// //         .filter((e) => e.includes("#DEBUG#") || e.includes("error"))
// //         .map((e) => (e.includes("#DEBUG") ? e.split("#DEBUG")[1] : e.split("error")[1]))
// //         .join(`\n`)
// //     );

// //     // function convertToPostfix(infix: string) {
// //     //   var output = "";
// //     //   var stack = [];
// //     //   for (var i = 0; i < infix.length; i++) {
// //     //     var ch = infix.charAt(i);
// //     //     if (ch == "+"  ch == "-"  ch == "*" || ch == "/") {
// //     //       while (stack.length != 0 && stack[stack.length - 1] != "(" && getPrecedence(ch) <= getPrecedence(stack[stack.length - 1])) {
// //     //         output += stack.pop();
// //     //       }
// //     //       stack.push(ch);
// //     //     } else if (ch == "(") {
// //     //       stack.push(ch);
// //     //     } else if (ch == ")") {
// //     //       while (stack.length != 0 && stack[stack.length - 1] != "(") {
// //     //         output += stack.pop();
// //     //       }
// //     //       stack.pop();
// //     //     } else {
// //     //       output += ch;
// //     //     }
// //     //   }
// //     //   while (stack.length != 0) {
// //     //     output += stack.pop();
// //     //   }
// //     //   return output;
// //     // }

// //     // function getPrecedence(ch: string) {
// //     //   if (ch == "+" || ch == "-") {
// //     //     return 1;
// //     //   } else if (ch == "*" || ch == "/") {
// //     //     return 2;
// //     //   } else {
// //     //     return 0;
// //     //   }
// //     // }

// //     function postfixEval(string: string) {
// //       var stack = [];
// //       var ch; // current char

// //       for (var k = 0, length = string.length; k < length; k++) {
// //         ch = string[k];

// //         // if it's a value, push it onto the stack
// //         if (/\d/.test(ch)) stack.push(ch);
// //         // else if it's an operator
// //         else if (ch in operators) {
// //           var b = +stack.pop();
// //           // @ts-ignore
// //           var a = +stack.pop();

// //           // @ts-ignore
// //           var value = operators[ch](a, b);
// //           stack.push(value);
// //         }

// //         // else we just skip whitespaces
// //       }

// //       if (stack.length > 1) throw "ParseError: " + string + ", stack: " + stack;

// //       return stack[0];
// //     }

// //     // // operators
// //     // var operators = {
// //     //   "+": function (a: number, b: number) {
// //     //     return a + b;
// //     //   },
// //     //   "-": function (a: number, b: number) {
// //     //     return a - b;
// //     //   },
// //     //   "*": function (a: number, b: number) {
// //     //     return a * b;
// //     //   },
// //     //   "/": function (a: number, b: number) {
// //     //     return a / b;
// //     //   },
// //     // };

// //     // const infixToPostfix = convertToPostfix("(1+2)+(2*(3+1))");
// //     // console.log(infixToPostfix);
// //     console.log(postfixEval(""));

// //     console.log(`\n---------------\n`);
// //     console.log(sendIncrement.gas_consumed);
// //     // console.log(sendIncrement.logs);
// //     console.log(
// //       sendIncrement.logs
// //         .split(`\n`)
// //         .filter((e) => e.includes("#DEBUG#") || e.includes("error"))
// //         .map((e) => (e.includes("#DEBUG") ? e.split("#DEBUG")[1] : e.split("error")[1]))
// //         .join(`\n`)
// //     );
// //     console.log(`\n---------------\n`);
// //   });
// // });

// // // //12+231+*+
// // // // 12+231+*+

// // // /**
// // //  * Postfix notation math evaluator
// // //  * See: http://en.wikipedia.org/wiki/Reverse_Polish_notation
// // //  *
// // //  * See also prefix notation example:
// // //  * https://github.com/DmitrySoshnikov/Essentials-of-interpretation/blob/master/src/notes/note-1.js
// // //  *
// // //  * by Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
// // //  * MIT Style License
// // //  */

// // // /**
// // //  * postfixEval
// // //  * @param {String} string
// // //  *
// // //  * Evaluates a simple math expression
// // //  * in the postfix notation.
// // //  *
// // //  * Example:
// // //  *   2 3 +       => 5
// // //  *   2 3 + 5 *   => 25
// // //  */
// // // function postfixEval(string) {
// // //   var stack = [];
// // //   var ch; // current char

// // //   for (var k = 0, length = string.length; k < length; k++) {
// // //     ch = string[k];

// // //     // if it's a value, push it onto the stack
// // //     if (/\d/.test(ch)) stack.push(ch);
// // //     // else if it's an operator
// // //     else if (ch in operators) {
// // //       var b = +stack.pop();
// // //       var a = +stack.pop();

// // //       var value = operators[ch](a, b);
// // //       stack.push(value);
// // //     }

// // //     // else we just skip whitespaces
// // //   }

// // //   if (stack.length > 1) throw "ParseError: " + string + ", stack: " + stack;

// // //   return stack[0];
// // // }

// // // // operators
// // // var operators = {
// // //   "+": function (a, b) {
// // //     return a + b;
// // //   },
// // //   "-": function (a, b) {
// // //     return a - b;
// // //   },
// // //   "*": function (a, b) {
// // //     return a * b;
// // //   },
// // //   "/": function (a, b) {
// // //     return a / b;
// // //   },
// // // };

// // // // tests

// // // console.log(postfixEval("2 3 +")); // 5
// // // console.log(postfixEval("2 3 + 5 *")); // 25

// [ 45 45 42 45]
// [-5 -6 - 2 - 0 -3 - * -8 - 2 - - * -]

// (  45   42 45  43 42)
// (0 -2  4 7   18  )
// 2D313233343539
