// 100th fibonacci number is too big (21 digits), so I split the number into 2 part,
// each part has at most 10^11 digits (because JavaScript MAX_SAFE_INTEGER = 9007199254740991 > 10^11).
// answer : BigNum = [x, y]
// The real answer is x * 10^12 + y
type BigNum = [number, number];

const MOD = 1e11;

// result = a + b | time-complexity: O(1)
function add(result: BigNum, a: BigNum, b: BigNum) {
  let rem = 0;

  let y = a[1] + b[1];
  if (y > MOD) {
    y %= MOD;
    rem = 1;
  }

  result[1] = y;

  // Don't worry, a[0] + b[0] never has more than 10^11 digits,
  // because fib100 has 21 digit, fib100[1] has at most 10^11 digits,
  // so a[0] + b[0] <= fib100[0] has at most 10^10 digits
  result[0] = a[0] + b[0] + rem;
}

// assign value of y to x | time-complexity: O(1)
function assign(x: BigNum, y: BigNum) {
  x[0] = y[0];
  x[1] = y[1];
}

function fibonacci100() {
  const a: BigNum = [0, 0];
  const b: BigNum = [0, 0];
  const c: BigNum = [0, 0];

  b[1] = 1; // 1st number a = 0, 2nd number b = 1

  for (let i = 3; i <= 100; i++) {
    add(c, a, b); // c = a + b
    assign(a, b); // a = b
    assign(b, c); // b = c
  }

  return c.join("");
}

console.time("time-taken");
const ans = fibonacci100();
console.timeEnd("time-taken");

console.log("100-th fibonacci number:", ans);

// Complexity:
// Time complexity: O(100)
// Space complexity: O(1)
