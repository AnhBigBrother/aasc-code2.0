var MOD = 1e11;
// result = a + b
function add(result, a, b) {
    var rem = 0;
    var y = a[1] + b[1];
    if (y > MOD) {
        y %= MOD;
        rem = 1;
    }
    result[1] = y;
    // Don't worry, a[0] + b[0] never has more than 10^11 digits,
    // because fib100 has 21 digit, fib100[1] has at most 10^11 digits,
    // so a[0] + b[0] has at most 10^10 digits
    result[0] = a[0] + b[0] + rem;
}
// assign value of y to x
function assign(x, y) {
    x[0] = y[0];
    x[1] = y[1];
}
// n-th Fibonacci number
function fibonacci100() {
    var a = [0, 0];
    var b = [0, 0];
    var c = [0, 0];
    b[1] = 1; // 1st number a = 0, 2nd number b = 1
    for (var i = 3; i <= 100; i++) {
        add(c, a, b); // c = a + b
        assign(a, b); // a = b
        assign(b, c); // b = c
    }
    return c.join("");
}
console.time("time-taken");
var ans = fibonacci100();
console.timeEnd("time-taken");
console.log("100-th fibonacci number:", ans);
