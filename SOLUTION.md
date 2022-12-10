# Solution

## Description

We need make calculation of this string in FunC

```func
var payload = "123+2*(3+4/2-(1+2))*2+1"u;
```

To calculate payload string in TON we should lazily load this by using `~load_uint()` and `.preload_uint(8)`

So on the first iteration we can get `1` and `2` (ASCII decimal values)

On first filtering with O(N) complexity we should get from `[1, 2, 3]` to `123` number

On second filtering with O(N) we should make calculations (algorithm with two stacks)

To solve the task we need 2 stacks, so better if we have one lazy string stepper, with reverse building chars under the operator

Like `1 -> 2 -> 3 -> +` (ASCII decimal value is 43)

To get number we should go back under the `1` element:

`3 -> 2 -> 1`

`3*2^0 -> 2*2^1 -> 1*2^2` = `123`

## Pseudocode

On the `op` calculate make `while` loop with `count_of_iterations` of `payload` string length (for `1+2` it will be `3`)

Needed extending ASM function `TLEN`, to get length of tuples.

To extend find [here](https://ton.org/docs/learn/tvm-instructions/instructions#3-tuple-list-and-null-primitives) command.

We need `TLEN` and `LAST`, then we should write in `contracts/imports/stdlib.fc` compared with stack.
For `TLEN` it will be look like:

```func
forall X -> X tlen(tuple t) asm "TLEN";
```

And for `LAST` it will be look like:

```func
forall X -> X last(tuple t) asm "LAST";
```

```func
if (op == op::calculate) {
    int n1 = 0;

    int count_of_iterations = 5;

    int result = 0;

    var cacheBetweenOperators = empty_tuple();
    

    while (n1 < count_of_iterations) {
      int payload = in_msg_body~load_uint(8);
      var payloadPreload = -1;

      if (payload != 43) {
        cacheBetweenOperators~tpush(payload);
        ~dump(cacheBetweenOperators); ;; for the `payload` will be dump [1] -> [0] -> [2]
      }

      if (n1 < count_of_iterations - 1) {
        payloadPreload = in_msg_body.preload_uint(8);

         ;; 1+1
        if (payloadPreload == 43) { ;; +
          cacheBetweenOperators = empty_tuple();
          ~dump(cacheBetweenOperators);
        } 

        if (payloadPreload != 45) { ;; -

        }

        if (payloadPreload != 42) { ;; *

        }

        if (payloadPreload != 47) { ;; /

        }
      }

      n1 += 1;
    }
```

## Gas calculation

### Needed score

?

### Real score

Near `~3-4k` spent (with loops and conditions).
You can check full price gas of the smart contract by running `npm run test` command.

For the custom dict storage with one key it was `~3-4k` spend (without loops and conditions)  with not wrapped structe of keys (idk do we have that limitation).
I just maked one key storage with one cell inside.

```func
var dict = new_dict();

dict~udict_add?(256, 0, begin_cell().store_uint(0, 1).store_uint(0, 1).end_cell().begin_parse());
```
